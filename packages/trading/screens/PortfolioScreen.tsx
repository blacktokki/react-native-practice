import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { avg_and_var, cov_and_var, ddFormat, load_stocklist_json, load_stock_json, ModelToCandle, STORAGE_KEY } from '../utils';
import Separator from '../components/Separator';
import { Candle } from '../components/chart/CandleType';
import volume from '../components/indices/volume';

type Company={
    full_code: string,
    name: string,
}
type Hold = {count:number}

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

type FronTierInput = {
    candles:Candle<any>[],
    rets:Record<string, number>,
    price:number
    avgRatio:number|null,
    corrs?:Record<string, number>,
}

type FronTierOutput = {
    stocks:Record<string, number>,
    ret:number,
    lisk:number
}

const codeToFrontier = async(full_code:string)=>{
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
    return{
        candles:candles,
        rets: candles.reduce((prev, value)=>{prev[value.date] = value.prev?(value.close /value.prev.close -1):0; return prev}, {} as Record<string, number>),
        price:candles[0].close,
        avgRatio:null
    }
}

export default function TabPortfolioScreen({
    navigation,
    route
  }: StackScreenProps<typeof DrawerParamList, 'TabSearch'>) {
    const [signal, setSignal] = React.useState<Signal>(defaultSignal)
    const [companyCode, setCompanyCode] = React.useState<string>('')
    const [companyPrice, setCompanyPrice] = React.useState<number>(0)
    const [companyCount, setCompanyCount] = React.useState<number>(0)
    const [companyMode, setCompanyMode] = React.useState<'buys'|'sells'>('buys')
    const [priceRecord, setPriceRecord] = React.useState<Record<string, FronTierInput>>({})
    const [portfolio, setPortfolio] = React.useState<Portfolio>(defaultPortfolio)
    const [nextHolds, setNextHolds] = React.useState<(Company & Hold)[]>(defaultPortfolio.holds)
    const [nextMaxHolds, setNextMaxHolds] = React.useState<number>(defaultPortfolio.maxHolds)
    const [nextCovDate, setNextCovDate] = React.useState<number>(defaultPortfolio.covDate)
    const [nextTotalCash, setNextTotalCash] = React.useState<number>(defaultPortfolio.totalCash)
    const [totalPrice, nextTotalPrice] = React.useMemo(()=>{
        return [
            portfolio.holds.reduce((prev, v)=>{prev += v.count * priceRecord[v.full_code].price; return prev}, 0), 
            nextHolds.reduce((prev, v)=>{prev += v.count * priceRecord[v.full_code].price; return prev}, 0), 
        ]
    }, [portfolio, nextHolds, priceRecord])
    const companiesToFrontier = async(companies:Company[])=>{
        for(const company of companies){
            priceRecord[company.full_code] = await codeToFrontier(company.full_code)
        }
    };
    const paramsToFrontier = async(params?:string)=>{
        const result:Company[] = (params || '').split(',').map((param)=>{
            const [full_code, name] = param.split(':')
            return{full_code, name}
        })
        await companiesToFrontier(result)
        return result
    };
    const setPortfolioFull = React.useCallback((portfolio:Portfolio, commit:boolean) =>{
        setNextHolds(portfolio.holds)
        setNextMaxHolds(portfolio.maxHolds)
        setNextCovDate(portfolio.covDate)
        setNextTotalCash(portfolio.totalCash)
        if(commit){
            setPortfolio(portfolio)
            AsyncStorage.setItem(STORAGE_KEY['portfolio'], JSON.stringify(portfolio))
        }
      }, [])
    const autoTrade = React.useCallback(()=>{
        const sellsCode = signal.sells.map((d)=>d.full_code)
        const holds = portfolio.holds.filter((d)=>sellsCode.indexOf(d.full_code)<0)
        signal.buys = signal.buys.sort((a, b)=>priceRecord[a.full_code].candles[0].extra.volume.mas[0].val < priceRecord[b.full_code].candles[0].extra.volume.mas[0].val?1:-1)
        const buys = signal.buys.filter((value, index)=>index < signal.buys.length * 0.5 && holds.find((v)=>v.full_code == value.full_code) == undefined)
        
        const willHold = holds.concat(buys as any)
        willHold.forEach((v)=>{
            priceRecord[v.full_code].corrs = {}
            priceRecord[v.full_code].avgRatio = avg_and_var(priceRecord[v.full_code].rets, nextCovDate, ddFormat(new Date()))[0]
        })
        willHold.forEach((v2)=>{
            const frontierV2 = priceRecord[v2.full_code]
            willHold.forEach((v3)=>{
                const frontierV3 = priceRecord[v3.full_code]
                if (frontierV2&& frontierV3){
                    const cv = cov_and_var(frontierV2.rets, frontierV3.rets, nextCovDate, ddFormat(new Date()))
                    if(cv[0]&&cv[1]&&cv[2] && frontierV2.corrs){
                        frontierV2.corrs[v3.full_code] = cv[0]/Math.sqrt(cv[1] * cv[2])
                    }
                }
            })
        })
        
        const resultSets:FronTierOutput[] = []
        for(let i=0;i<30000;i++){
            let ratioCount = 0
            const ratios = holds.reduce((prev, v)=>{
                const ratio = v.count * priceRecord[v.full_code].price / nextTotalCash
                ratioCount += ratio
                prev[v.full_code] = ratio
                return prev
            }, {} as Record<string, number>)
            const localBuys = buys.slice(0)
            while(localBuys.length + Object.keys(ratios).length > nextMaxHolds){
                localBuys.splice(Math.floor(Math.random() * localBuys.length), 1)
            }
            localBuys.forEach((v, j)=>{
                let r= priceRecord[v.full_code].price / nextTotalCash
                ratioCount += r
                ratios[v.full_code] = r
                r = (1 - ratioCount) * (j==localBuys.length -1?1:Math.random())
                ratioCount += r
                ratios[v.full_code] += r
            })

            resultSets.push({
                stocks:ratios,
                ret:nextCovDate * willHold.reduce((prev, v)=>{prev += (priceRecord[v.full_code].avgRatio||0) * (ratios[v.full_code] || 0); return prev}, 0),
                lisk:willHold.reduce((prev, v)=>{
                    prev += willHold.reduce((prev2, v2)=>{
                        const value = priceRecord[v.full_code].corrs
                        prev2 += (value?value[v2.full_code]:0 || 0) * (ratios[v2.full_code] || 0)
                        return prev2
                    }, 0) * (ratios[v.full_code] || 0)
                    return prev
                }, 0)
            })
        }
        const result = resultSets.sort((a, b)=>a.lisk&&b.lisk?(a.ret/a.lisk<b.ret/b.lisk?1:-1):0)[0]
        //////
        buys.filter(d=>result.stocks[d.full_code]).forEach((d)=>{
            holds.push({
                ...d,
                count:Math.floor(nextTotalCash * result.stocks[d.full_code] /priceRecord[d.full_code].price),
            })
          })
        setNextHolds(holds)
    }, [signal, portfolio, nextTotalCash, nextCovDate, nextMaxHolds, priceRecord])
    const renderItemComponent = React.useCallback((item:(Company & Hold) | Company, index:number, mode:'buys'|'sells')=>{
        return <TouchableOpacity key={index} onPress={()=>{setCompanyMode(mode);setCompanyCode(item.full_code);setCompanyPrice(priceRecord[item.full_code].price)}}>
            <Text>{item.full_code}:{item.name}:{priceRecord[item.full_code].price}원</Text>
            {(item as Hold).count?<Text>{(item as Hold).count}주 {priceRecord[item.full_code].price * (item as Hold).count}원</Text>:undefined}
        </TouchableOpacity>
    }, [])
    React.useEffect(()=>{
        AsyncStorage.getItem(STORAGE_KEY['portfolio']).then((value)=>{
            const pf:Portfolio = value?JSON.parse(value):portfolio
            companiesToFrontier(pf.holds).then(()=>setPortfolioFull(pf, true))
        })
    }, [])
    React.useEffect(()=>{
        paramsToFrontier(route.params?.buys).then((buys)=>{
            paramsToFrontier(route.params?.sells).then((sells)=>{
                setSignal({buys, sells})
            })
        })
    }, [route.params])
    return (
      <ScrollView>
        <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
                {signal.sells.map((item, index)=>renderItemComponent(item, index, 'sells'))}
            </View>
            <View style={{flex:0.5}}>
                {signal.buys.map((item, index)=>renderItemComponent(item, index, 'buys'))}
            </View>
        </View>
        <Separator/>
        <View style={{flexDirection:'row'}}>
            <Picker
                selectedValue={companyMode}
                onValueChange={(itemValue, itemIndex) =>
                    setCompanyMode(itemValue)
                }>
                <Picker.Item label="매수신호" value="buys" />
                <Picker.Item label="매도신호" value="sells" />
            </Picker>
            <TextInput style={styles.TextInput} onChangeText={setCompanyCode} value={companyCode}/>
            <TextInput style={styles.TextInput} onChangeText={(text)=>setCompanyPrice(parseInt(text))} value={companyPrice.toString()}/>
            <Button title={'추가'} onPress={()=>{
                codeToFrontier(companyCode).then((comp)=>{
                    priceRecord[companyCode] = comp
                    load_stocklist_json().then(result=>{
                        const newSignal = {...signal}
                        newSignal[companyMode].push({
                            full_code:companyCode,
                            name:result.find((d)=>{d.full_code == companyCode})?.codeName || 'unknown'
                        })
                        setSignal(newSignal)
                    })
                })
            }}/>
            <Button title={'삭제'} onPress={()=>{
                const newSignal = {...signal}
                newSignal[companyMode].splice(newSignal[companyMode].findIndex((v)=>v.full_code == companyCode), 1)
                setSignal(newSignal)
            }}/>
            <Button title={'가격 수정'} onPress={()=>{
                const r = {...priceRecord};
                r[companyCode].price = companyPrice;
                setPriceRecord(r)
            }}/>
            <Button title={'조회'} onPress={()=>{navigation.navigate("Detail", {
                screen: 'DetailScreen',
                params: {full_code: companyCode}
            })}}/>
        </View>
        <View style={{flexDirection:'row'}}>
            <TextInput style={styles.TextInput} onChangeText={(text)=>setCompanyCount(parseInt(text))} value={companyCount.toString()}/>
            <Button title={companyMode=='buys'?'매수':'매도'} onPress={()=>{
                const newNextHolds = nextHolds.slice(0)
                const nextHoldsIndex = newNextHolds.findIndex((v)=>v.full_code == companyCode)
                if (companyMode == 'buys' && companyCount>0){
                    const company = signal.buys.find((d)=>d.full_code == companyCode)
                    if(nextHoldsIndex>=0){
                        newNextHolds[nextHoldsIndex].count += companyCount
                    }
                    else if(company){
                        newNextHolds.push({...company, count:companyCount})
                    }
                }
                if (companyMode == 'sells' && nextHoldsIndex>=0){
                    newNextHolds[nextHoldsIndex].count -= companyCount
                    if (newNextHolds[nextHoldsIndex].count <= 0)
                        newNextHolds.splice(nextHoldsIndex, 1)
                }
                setNextHolds(newNextHolds)
            }}/>
        </View>
        <Separator/>
        <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
                {portfolio.holds.map((item, index)=>renderItemComponent(item, index, 'sells'))}
                <Text>총 평가액: {totalPrice}</Text>
                <Text>최대 보유종목: {portfolio.maxHolds}</Text>
                <Text>투자선 계산일: {portfolio.covDate}</Text>
                <Text>보유액 한도: {portfolio.totalCash}</Text>
                <Button title={'cancel'} onPress={()=>setPortfolioFull(portfolio, false)}/>
            </View>
            <View style={{flex:0.5}}>
                {nextHolds.map((item, index)=>renderItemComponent(item, index, 'sells'))}
                <Text>총 평가액: {nextTotalPrice}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text>최대 보유종목: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextMaxHolds(parseInt(text))} value={nextMaxHolds.toString()}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>투자선 계산일: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextCovDate(parseInt(text))} value={nextCovDate.toString()}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text>보유액 한도: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextTotalCash(parseInt(text))} value={nextTotalCash.toString()}/>
                </View>
                <Button title={'clear'} onPress={()=>setPortfolioFull(defaultPortfolio, false)}/>
                <Button title={'auto'} onPress={()=>autoTrade()} color={'red'}/>
                <Button title={'save'} onPress={()=>setPortfolioFull({
                    holds: nextHolds,
                    maxHolds: nextMaxHolds,
                    covDate: nextCovDate,
                    totalCash: nextTotalCash
                }, true)}/>
            </View>
        </View>
      </ScrollView>
    )
  }
  

  const styles = StyleSheet.create({
    TextInput: {borderColor:'#000', borderWidth: 1, marginVertical: 5}
  });