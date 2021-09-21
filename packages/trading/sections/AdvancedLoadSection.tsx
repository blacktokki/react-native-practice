import * as React from 'react';
import { TouchableOpacity ,Text, View, TextInput, Button } from 'react-native';
import {load_stocklist_json, load_stock_json, sleep, ModelToCandle} from '../utils';
import { CompanyResponse } from '../types';
import { Candle } from '../components/chart/CandleType';
import hloc from '../components/indices/hloc';
import volume from '../components/indices/volume'
import ii from '../components/indices/ii';
import bolii from '../components/indices/bolii';
const MAX_LOAD_STOCK = 4
let current_load_stock = 0
const MAX_RELOAD_STOCK = 32
export const loadContext = {
    reload_stock:0,
    sync_lock:0,
}


async function load_stock(data_all:any[], endDate:Date, setter:(data_all:any[])=>void, show_log:number, context:typeof loadContext){
    if (context.sync_lock == 0){
      context.sync_lock = 1
      let new_data_all: any[] = []
      setter(new_data_all)
      for (const [i, d] of data_all.entries()){
  
        let full_code = d['full_code']
        context.reload_stock += 1
        while (context.sync_lock==2)
          await sleep(1000)
        while (current_load_stock >= MAX_LOAD_STOCK || context.reload_stock>=MAX_RELOAD_STOCK){
            await sleep(200)
            if (context.reload_stock == MAX_RELOAD_STOCK){
                console.log('reload!!!!')
                new_data_all = data_all.filter((value)=>value.candles)
                setter(new_data_all)
            }
            else{
              context.reload_stock +=1
              console.log(current_load_stock, '/', MAX_LOAD_STOCK)
            }
        }
        current_load_stock += 1
        
        load_stock_json(full_code, {
          start_date:new Date(2016, 0, 1), end_date:new Date(2016, 0, 1), log_datetime:0, isSimple:1
        }).then((j2:CompanyResponse)=>{
          const candles:Candle<any>[] = j2.output.map(ModelToCandle).reverse()
          candles.forEach((candle, index, array)=>{
            if (index > 0)
              candle.prev = array[index - 1]
            candle.extra = {}
            hloc.setData(candle, {bollingers:[{fill:'green', count:20, exp:2}]})
            volume.setData(candle, {mas:[20]})
            ii.setData(candle, {depth:21})
            bolii.setData(candle, {depth:756, bolingerIndex:0})
          })
          console.log(i)
          data_all[i]['candles'] = {}
          candles.forEach((candle, index)=>{
            const date = new Date(candle.date)
            if (date.getFullYear() == endDate.getFullYear() && date.getMonth() == endDate.getMonth()){
              data_all[i]['candles'][candle.date] = candle
            }
            else{
              candle.extra = undefined
            }
          })
          current_load_stock -= 1
        })
      }
      while (current_load_stock > 0)
        await sleep(200)
      console.log('reload!!!!')
      context.sync_lock = 0
      new_data_all = data_all.filter((value)=>value.candles)
      setter(new_data_all)
    }
  }


  export default (props:{data:any[], lastDate:Date, lastDateFix:Date|undefined, setData:(data_all:any[])=>void, setLastDateFix:(date:Date)=>void, context:typeof loadContext}) =>{
    const [maxData, setMaxData] = React.useState(0)
    return (
        <View>
             <Button title={props.context.sync_lock == 0?"reload":"reloading..."} onPress={()=>{
                if(props.context.sync_lock == 0){
                    props.setLastDateFix(props.lastDate)
                    if (props.lastDateFix?.getFullYear() != props.lastDate.getFullYear() || props.lastDateFix?.getMonth() != props.lastDate.getMonth()){
                        load_stocklist_json().then(
                            (data_all)=>{
                            setMaxData(data_all.length)
                            load_stock(data_all, props.lastDate, props.setData, 0, props.context)
                            }
                        )
                    }
                }
            }}/>
            <Text>({props.data.length}/{maxData})</Text>
        </View>
    )
}