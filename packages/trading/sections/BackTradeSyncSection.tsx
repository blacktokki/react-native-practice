import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button } from 'react-native';
import { load_stock_json, ModelToCandle, sleep, STORAGE_KEY, ddFormat } from '../utils';
import { CompanyResponse } from '../types';
import { Candle } from '../components/chart/CandleType';
import hloc from '../components/indices/hloc';
import volume from '../components/indices/volume';
import ii from '../components/indices/ii';
import mfi from '../components/indices/mfi';
import bolmfiii from '../components/indices/bolmfiii';

const MAX_LOAD_STOCK = 100
const MAX_RELOAD_STOCK = 100
export const backTradeContext = {
    reload_stock:0,
    sync_lock:0,
}

type Result = {
  stock:any,
  candle:Candle<any>,
  signal:'buy'|'sell'
}
type ResultGroup = {
  stocks:Result[],
  trades:string[]
  currentStocks?:any,
  cash?:number,
  earn?:number,
}
export type BackTradeRow = [string, ResultGroup]
export type BackTradeResult = {
  result?:BackTradeRow[]
  condition?:any
  title?:string
}

async function backTrade(data_all:any[], setter:(data_all:any[])=>void, resultSetter:(result:BackTradeResult)=>void, show_log:number, context:typeof backTradeContext){
  let condition:any|undefined = undefined;
  try{
    condition = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY['condition']) as string)
  }
  catch(e){
    console.log(e)
  }
  console.log(condition)
  if (condition && context.sync_lock == 0){
    context.sync_lock = 1
    context.reload_stock = 0
    let current_load_stock = 0
    const preResult:(Result & {
      dateStr:string,
    })[] = []
    const startDate:Date = condition.filter?.startDate || new Date(2016, 0, 1)
    data_all.forEach((item)=>{item['traded'] = false})
    let new_data_all: any[] = data_all.map((item)=>item)
    setter(new_data_all)
    resultSetter({})
    for (const [i, d] of data_all.entries()){
      let full_code = d['full_code']
      context.reload_stock += 1
      while (context.sync_lock==2)
        await sleep(1000)
      while (current_load_stock >= MAX_LOAD_STOCK || context.reload_stock>=MAX_RELOAD_STOCK){
          await sleep(100)
          if (context.reload_stock == MAX_RELOAD_STOCK){
              console.log('reload!!!!')
              new_data_all = data_all.map((item)=>item)  // array.slice(0)
              setter(new_data_all)
          }
          else{
            context.reload_stock += 1
            console.log(current_load_stock, '/', MAX_LOAD_STOCK)
          }
      }
      current_load_stock += 1
      load_stock_json(full_code, {
        start_date:new Date(2016, 0, 1), end_date:new Date(2016, 0, 1), log_datetime:0, isSimple:1
      }).then(async(j2:CompanyResponse)=>{
          while(context.reload_stock > MAX_RELOAD_STOCK)
            await sleep(50)
          const candles:Candle<any>[] = j2.output.map(ModelToCandle).reverse()
          j2.output.splice(0, j2.output.length)
          candles.forEach((candle, index, array)=>{
            if (index > 0)
              candle.prev = array[index - 1]
            if (index < array.length-1){
              const change = array[index +1].open/candle.close
              if (Math.abs(1- change)>0.3)
                candle.willChange = change 
            }
            candle.extra = {}
            if (condition.config?.hloc)hloc.setData(candle, condition.config.hloc)
            if (condition.config?.volume)volume.setData(candle, condition.config.volume)
            if (condition.config?.mfi)mfi.setData(candle, condition.config.mfi)
            if (condition.config?.ii)ii.setData(candle, condition.config.ii)
            if (condition.config?.bolmfiii)bolmfiii.setData(candle, condition.config.bolmfiii)
          })
          data_all[i]['traded'] = true
          if(show_log)
            console.log(i, d['codeName'])
          candles.forEach((candle, index)=>{
            if (candle.prev?.extra.bolmfiii.hold != candle.extra.bolmfiii.hold && new Date(candle.date).valueOf() >= startDate.valueOf()){
              if(candle.prev)
                candle.prev.prev = undefined
              preResult.push({dateStr:candle.date, stock:d, candle:candle, signal:candle.extra.bolmfiii.hold?'buy':'sell'})
            }
          })
          current_load_stock -= 1
      })
    }
    while (current_load_stock > 0)
      await sleep(50)
    console.log('reload!!!!')
    new_data_all = data_all.map((item)=>item)
    context.sync_lock = 0
    const maxStocks = 4
    // const covDate = 20
    const maxPrice = 100000
    let cash = 1000000
    let earn = 0
    let stocks:any = {}
    resultSetter({
      result:Object.entries(preResult.reduce((prev, data)=>{
        if (prev[data.dateStr] == undefined)
          prev[data.dateStr] = {stocks:[], trades:[]}
        prev[data.dateStr].stocks.push({stock:data.stock, signal:data.signal, candle:data.candle})
        return prev
      }, {} as Record<string, ResultGroup>)).sort((a, b)=>a[0] > b[0]?1:-1).map((result)=>{
        result[1].stocks = result[1].stocks.sort((a, b)=>a.candle.extra.volume.mas[0].val < b.candle.extra.volume.mas[0].val?1:-1)
        result[1].stocks.filter((d)=>d.signal=='sell' && stocks[d.stock.full_code]).forEach((d)=>{
          cash += d.candle.close * stocks[d.stock.full_code][0]
          result[1].trades.push(`${d.stock.full_code} ${stocks[d.stock.full_code][1].close} => ${d.candle.close} ${((d.candle.close / stocks[d.stock.full_code][1].close -1)*100).toFixed(2)}%`)
          earn += (d.candle.close - stocks[d.stock.full_code][1].close) * stocks[d.stock.full_code][0]
          delete stocks[d.stock.full_code]
        })
        result[1].stocks.filter((d)=>d.signal=='buy' && maxPrice>= d.candle.close).slice(0, maxStocks - Object.keys(stocks).length).forEach((d)=>{
          const buyCount = Math.floor((cash / (maxStocks -  Object.keys(stocks).length)) /d.candle.close)
          stocks[d.stock.full_code] = [buyCount, d.candle]
          cash -= d.candle.close * stocks[d.stock.full_code][0]
        })
        result[1].cash = cash
        result[1].earn = earn
        result[1].currentStocks = {...stocks}
        return result
      }),
      condition:condition,
      title: ddFormat(new Date()).replace(/\//g, '') + '_' + new Date().valueOf()
    })
    setter(new_data_all)
  }
}

export default function BackTradeSyncSection(props:{data:any[], setData:(data_all:any[])=>void,  setResult:(result:BackTradeResult)=>void, context:typeof backTradeContext}) {  
  const syncLength = React.useMemo(()=>{
      return [
          props.data.filter((item)=>item['traded']).length,
          props.data.length,
      ]
    }, [props.data])
  return (
    <View>
      <Button title={"Search!"} onPress={
              props.context.sync_lock==0?
              ()=>{backTrade(props.data, props.setData, props.setResult, 1, props.context)}:
              ()=>{}}/>
      <Text>({syncLength[0]}/{syncLength[1]})</Text>
    </View>
  )
}