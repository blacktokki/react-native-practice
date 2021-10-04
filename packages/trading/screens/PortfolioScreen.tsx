import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

import { cov_and_var, ddFormat, load_stock_json, ModelToCandle, STORAGE_KEY } from '../utils';
import Separator from '../components/Separator';
import { Candle } from '../components/chart/CandleType';
import volume from '../components/indices/volume';

type Company={
    full_code: string,
    name: string,
    candles:Candle<any>[],
    rets?:Record<string, number>,
    corrs?:Record<string, number>,
}
type Hold = {count:number, price:number}

type Portfolio = {
    holds:(Company & Hold)[],
    maxHolds:number
    covDate:number
    totalCash:number
}
type Signal = {
    sells: Company[],
    buys: Company[]
}

const defaultPortfolio:Portfolio = {
    holds:[],
    maxHolds:4,
    covDate:252,
    totalCash:1000000
}
const defaultSignal:Signal = {buys:[], sells:[]}

const paramToCompany = async(params:string[])=>{
    const result = []
    for(const param of params){
        const [full_code, name] = param.split(':')
        const j2 = await load_stock_json(full_code, {
            start_date:new Date(2016, 0, 1), end_date:new Date(2016, 0, 1), log_datetime:0, isSimple:1
        })
        const candles:Candle<any>[] = j2.output.map(ModelToCandle)
        j2.output.splice(0, j2.output.length)
        candles.forEach((candle, index, array)=>{
        if (index > 0)
            candle.prev = array[index - 1]
        // if (index < array.length-1){
        //     const change = array[index +1].open/candle.close
        //     if (Math.abs(1- change)>0.3)
        //     candle.willChange = change 
        // }
        candle.extra = {}
        volume.setData(candle, {mas: [20]})
        })
        result.push({
            full_code:full_code,
            name:name,
            candles: candles
        })
    }
    return result
};

export default function TabPortfolioScreen({
    navigation,
    route
  }: StackScreenProps<typeof DrawerParamList, 'TabSearch'>) {
    const [signal, setSignal] = React.useState<Signal>(defaultSignal)
    const [sellCode, setSellCode] = React.useState<string>('')
    const [sellCount, setSellCount] = React.useState<number>(0)
    const [sellPrice, setSellPrice] = React.useState<number>(0)
    const [buyCode, setBuyCode] = React.useState<string>('')
    const [buyPrice, setBuyPrice] = React.useState<number>(0)
    const [buyCount, setBuyCount] = React.useState<number>(0)
    const [portfolio, setPortfolio] = React.useState<Portfolio>(defaultPortfolio)
    const [nextHolds, setNextHolds] = React.useState<(Company & Hold)[]>(defaultPortfolio.holds)
    const [nextMaxHolds, setNextMaxHolds] = React.useState<number>(defaultPortfolio.maxHolds)
    const [nextCovDate, setNextCovDate] = React.useState<number>(defaultPortfolio.covDate)
    const [nextTotalCash, setNextTotalCash] = React.useState<number>(defaultPortfolio.totalCash)
    const setPortfolioFull = React.useCallback((portfolio:Portfolio) =>{
        setPortfolio(portfolio)
        setNextHolds(portfolio.holds)
        setNextMaxHolds(portfolio.maxHolds)
        setNextCovDate(portfolio.covDate)
        setNextTotalCash(portfolio.totalCash)
        AsyncStorage.setItem(STORAGE_KEY['portfolio'], JSON.stringify(portfolio))
      }, [])
    const autoTrade = React.useCallback(()=>{
        const sellsCode = signal.sells.map((d)=>d.full_code)
        const holds = portfolio.holds.filter((d)=>sellsCode.indexOf(d.full_code)<0)
        const cash = nextTotalCash - holds.reduce((prev, item)=>{prev+= item.candles[0].close;return prev}, 0)
        signal.buys = signal.buys.sort((a, b)=>a.candles[0].extra.volume.mas[0].val < b.candles[0].extra.volume.mas[0].val?1:-1)
        const buys = holds.concat(signal.buys.filter((value, index)=>index < signal.buys.length * 0.5) as any)
        buys.forEach((v)=>{
            v.rets = v.candles.reduce((prev, value)=>{prev[value.date] = value.prev?(value.close /value.prev.close -1):0; return prev}, {} as Record<string, number>)
            v.corrs = {}
        })
        buys.forEach((v2)=>{
            buys.forEach((v3)=>{
                if (v2.rets&& v3.rets && v2.corrs){
                    const cv = cov_and_var(v2.rets, v3.rets, nextCovDate, ddFormat(new Date()))
                    if(cv[0]&&cv[1]&&cv[2]){
                        v2.corrs[v3.full_code] = cv[0]/Math.sqrt(cv[1] * cv[2])
                    }
                }
            })
        })
        for(let i=0;i<10000;i++){
            
        }
        buys.sort((a, b)=>(0)).slice(0, nextMaxHolds - Object.keys(holds).length).forEach((d)=>{
            const count = Math.floor((cash / (nextMaxHolds -  Object.keys(holds).length)) /d.candles[0].close)
            holds.push({
                ...d,
                count,
                price:d.candles[0].close
            })
          })
    }, [signal, portfolio, nextTotalCash, nextCovDate, nextMaxHolds])
    React.useEffect(()=>{
        AsyncStorage.getItem(STORAGE_KEY['portfolio']).then((value)=>{
            setPortfolioFull(value?JSON.parse(value):portfolio)
        })
    }, [])
    React.useEffect(()=>{
        const params:any = route.params
        paramToCompany((params?.buys || '' as string).split(',')).then((buys)=>{
            paramToCompany((params?.sells || '' as string).split(',')).then((sells)=>{
                setSignal({buys, sells})
            })
        })
    }, [route.params])
    return (
      <ScrollView>
        <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
                {signal.sells.map((item, index)=>{return <TouchableOpacity key={index} onPress={()=>{setSellCode(item.full_code);setSellPrice(item.candles[0].close)}}><Text>{item.full_code}:{item.name}:{item.candles[0].close}원</Text></TouchableOpacity>})}
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.TextInput} onChangeText={setSellCode} value={sellCode}/>
                    <Button title={'add'} onPress={()=>{}}/>
                    <Button title={'remove'} onPress={()=>{}}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.TextInput} onChangeText={(text)=>setSellPrice(parseInt(text))} value={sellPrice.toString()}/>
                    <TextInput style={styles.TextInput} onChangeText={(text)=>setSellCount(parseInt(text))} value={sellCount.toString()}/>
                    <Button title={'매도'} onPress={()=>{}}/>
                </View>
            </View>
            <View style={{flex:0.5}}>
                {signal.buys.map((item, index)=>{return <TouchableOpacity key={index} onPress={()=>{setBuyCode(item.full_code);setBuyPrice(item.candles[0].close)}}><Text>{item.full_code}:{item.name}:{item.candles[0].close}원</Text></TouchableOpacity>})}
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.TextInput} onChangeText={setBuyCode} value={buyCode}/>
                    <Button title={'add'} onPress={()=>{}}/>
                    <Button title={'remove'} onPress={()=>{}}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <TextInput style={styles.TextInput} onChangeText={(text)=>setBuyPrice(parseInt(text))} value={buyPrice.toString()}/>
                    <TextInput style={styles.TextInput} onChangeText={(text)=>setBuyCount(parseInt(text))} value={buyCount.toString()}/>
                    <Button title={'매수'} onPress={()=>{}}/>
                </View>
            </View>
        </View>
        <Separator/>
        <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
                {portfolio.holds.map((item, index)=>{return <Text key={index}>{item.full_code}:{item.name}:{item.candles[0].close}원</Text>})}
                <Text>최대 보유종목: {portfolio.maxHolds}</Text>
                <Text>투자선 계산일: {portfolio.covDate}</Text>
                <Text>전체 평가액: {portfolio.totalCash}</Text>
                <Button title={'cancel'} onPress={()=>setPortfolioFull(portfolio)}/>
            </View>
            <View style={{flex:0.5}}>
                {nextHolds.map((item, index)=>{return <Text key={index}>{item.full_code}:{item.name}:{item.candles[0].close}원</Text>})}
                <View style={{flexDirection:'row'}}>
                    <Text>최대 보유종목: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextMaxHolds(parseInt(text))} value={nextMaxHolds.toString()}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>투자선 계산일: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextCovDate(parseInt(text))} value={nextCovDate.toString()}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>전체 평가액: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextTotalCash(parseInt(text))} value={nextTotalCash.toString()}/>
                </View>
                <Button title={'clear'} onPress={()=>setPortfolioFull(defaultPortfolio)}/>
                <Button title={'auto'} onPress={()=>autoTrade()} color={'red'}/>
                <Button title={'save'} onPress={()=>setPortfolioFull({
                    holds: nextHolds,
                    maxHolds: nextMaxHolds,
                    covDate: nextCovDate,
                    totalCash: nextTotalCash
                })}/>
            </View>
        </View>
      </ScrollView>
    )
  }
  

  const styles = StyleSheet.create({
    TextInput: {borderColor:'#000', borderWidth: 1, marginVertical: 5}
  });