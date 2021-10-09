import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { load_stocklist_json, load_stock_json, ModelToCandle } from '../utils';
import Separator from '../components/Separator';
import { CompanyInfoBlock, CompanyInfoHold } from '../types';
import { Candle } from '../components/chart/CandleType';
import volume from '../components/indices/volume';
import FrontierSection, { FrontierFunction, FronTierPrice } from '../sections/FrontierSection';
import FileManagerSection from '../sections/FileManagerSection';

type Portfolio = {
    title:string,
    holds:CompanyInfoHold[],
    maxHolds:number
    covDate:number
    totalCash:number
}

const defaultPortfolio:Portfolio = {
    title: 'portfolio',
    holds:[],
    maxHolds:4,
    covDate:252,
    totalCash:1000000
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
    const [sellSignal, setSellSignal] = React.useState<CompanyInfoBlock[]>([])
    const [buySignal, setBuySignal] = React.useState<CompanyInfoBlock[]>([])
    const signal = {'sells': sellSignal, 'buys':buySignal}
    const setSignal = {'sells': setSellSignal, 'buys': setBuySignal}
    const [companyCode, setCompanyCode] = React.useState<string>('')
    const [companyPrice, setCompanyPrice] = React.useState<number>(0)
    const [companyCount, setCompanyCount] = React.useState<number>(0)
    const [companyMode, setCompanyMode] = React.useState<'buys'|'sells'>('buys')
    const [priceRecord, setPriceRecord] = React.useState<Record<string, FronTierPrice>>({})
    const [portfolio, setPortfolio] = React.useState<Portfolio>(defaultPortfolio)
    const [nextTitle, setNextTitle] = React.useState(defaultPortfolio.title)
    const [nextHolds, setNextHolds] = React.useState<CompanyInfoHold[]>(defaultPortfolio.holds)
    const [nextMaxHolds, setNextMaxHolds] = React.useState<number>(defaultPortfolio.maxHolds)
    const [nextCovDate, setNextCovDate] = React.useState<number>(defaultPortfolio.covDate)
    const [nextTotalCash, setNextTotalCash] = React.useState<number>(defaultPortfolio.totalCash)
    const frontierRef = React.useRef<FrontierFunction>()
    const [totalPrice, nextTotalPrice] = React.useMemo(()=>{
        return [
            portfolio.holds.reduce((prev, v)=>{prev += (v.count || 0) * priceRecord[v.full_code].price; return prev}, 0), 
            nextHolds.reduce((prev, v)=>{prev += (v.count || 0) * priceRecord[v.full_code].price; return prev}, 0), 
        ]
    }, [portfolio, nextHolds, priceRecord])
    const companiesToFrontier = async(companies:CompanyInfoBlock[])=>{
        for(const company of companies){
            priceRecord[company.full_code] = await codeToFrontier(company.full_code)
        }
    };
    const paramsToFrontier = async(params?:string)=>{
        const ls = await load_stocklist_json()
        const result:CompanyInfoBlock[] = (params || '').split(',').map((param)=>{
            return ls.find((d)=>d.full_code == param) as CompanyInfoBlock
        }).filter(v=>v!==undefined)
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
        }
      }, [])
    const autoTrade = React.useCallback(()=>{
        const sellsCode = sellSignal.map((d)=>d.full_code)
        buySignal.sort((a, b)=>priceRecord[a.full_code].candles[0].extra.volume.mas[0].val < priceRecord[b.full_code].candles[0].extra.volume.mas[0].val?1:-1)
        const holds = portfolio.holds.filter((d)=>sellsCode.indexOf(d.full_code)<0)
        const buys = buySignal.filter((value, index)=>index < buySignal.length * 0.5 && holds.find((v)=>v.full_code == value.full_code) == undefined)
        if (frontierRef.current){
            const result = frontierRef.current({
                holds: holds.map((v)=>({...v, ...priceRecord[v.full_code]})), 
                buys: buys.map((v)=>({...v, ...priceRecord[v.full_code]})), 
                config: {covDate:nextCovDate, totalCash:nextTotalCash, maxHolds:nextMaxHolds}
            })[0]
            buys.filter(d=>result.stocks[d.full_code]).forEach((d)=>{
                holds.push({
                    ...d,
                    price: priceRecord[d.full_code].price,
                    count:Math.floor(nextTotalCash * result.stocks[d.full_code] /priceRecord[d.full_code].price),
                })
            })
            setNextHolds(holds)
        }
    }, [buySignal, sellSignal, portfolio, nextTotalCash, nextCovDate, nextMaxHolds, priceRecord, frontierRef.current])
    const renderItemComponent = React.useCallback((item:CompanyInfoHold | CompanyInfoBlock, index:number, mode:'buys'|'sells')=>{
        const _item = (item as CompanyInfoHold)
        return <TouchableOpacity key={index} onPress={()=>{setCompanyMode(mode);setCompanyCode(item.full_code);setCompanyPrice(priceRecord[item.full_code].price)}}>
            <Text>{item.full_code}:{item.codeName}:{priceRecord[item.full_code].price}원 {_item.price?`(${_item.price}원)`:''}</Text>
            {_item.count && _item.price?<Text>{_item.count}주 {priceRecord[item.full_code].price * _item.count}원 ({_item.price * _item.count}원)</Text>:undefined}
        </TouchableOpacity>
    }, [])
    React.useEffect(()=>{
        paramsToFrontier(route.params?.buys).then(setBuySignal)
        paramsToFrontier(route.params?.sells).then(setSellSignal)
    }, [route.params])
    return (
      <ScrollView>
        <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
                {sellSignal.map((item, index)=>renderItemComponent(item, index, 'sells'))}
            </View>
            <View style={{flex:0.5}}>
                {buySignal.map((item, index)=>renderItemComponent(item, index, 'buys'))}
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
            <TextInput style={styles.TextInput} onChangeText={(text)=>setCompanyPrice(parseFloat(text))} value={companyPrice.toString()}/>
            <Button title={'추가'} onPress={()=>{
                codeToFrontier(companyCode).then((comp)=>{
                    priceRecord[companyCode] = comp
                    paramsToFrontier(companyCode).then((result)=>{
                        const newSignal = {...signal[companyMode]}
                        newSignal.push(result[0])
                        setSignal[companyMode](newSignal)
                    })
                })
            }}/>
            <Button title={'삭제'} onPress={()=>{
                const newSignal = {...signal[companyMode]}
                newSignal.splice(newSignal.findIndex((v)=>v.full_code == companyCode), 1)
                setSignal[companyMode](newSignal)
            }}/>
            <Button title={'가격 수정'} onPress={()=>{
                const r = {...priceRecord};
                r[companyCode].price = companyPrice;
                setPriceRecord(r)
            }}/>
            <Button title={'평단가 수정'} onPress={()=>{
                const newNextHolds = nextHolds.slice(0)
                const nextHoldsIndex = newNextHolds.findIndex((v)=>v.full_code == companyCode)
                if(nextHoldsIndex>=0){
                    newNextHolds[nextHoldsIndex].price = companyPrice
                }
                setNextHolds(newNextHolds)
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
                const nextHolldsCount = nextHoldsIndex>=0?newNextHolds[nextHoldsIndex].count:0
                if (companyMode == 'buys' && companyCount>0){
                    const company = signal.buys.find((d)=>d.full_code == companyCode)
                    if(nextHoldsIndex>=0){
                            const beforePrice = nextHolldsCount * newNextHolds[nextHoldsIndex].price
                            newNextHolds[nextHoldsIndex].count = nextHolldsCount + companyCount
                            newNextHolds[nextHoldsIndex].price = (beforePrice + companyCount * companyPrice) / newNextHolds[nextHoldsIndex].count
                    }
                    else if(company){
                        newNextHolds.push({...company, count:companyCount, price: companyPrice})
                    }
                }
                if (companyMode == 'sells' && nextHoldsIndex>=0){
                    newNextHolds[nextHoldsIndex].count = nextHolldsCount - companyCount
                    if (nextHolldsCount <= companyCount)
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
                <Text>이름: {portfolio.title}</Text>
                <Text>최대 보유종목: {portfolio.maxHolds}</Text>
                <Text>투자선 계산일: {portfolio.covDate}</Text>
                <Text>보유액 한도: {portfolio.totalCash}</Text>
                <Button title={'cancel'} onPress={()=>setPortfolioFull(portfolio, false)}/>
            </View>
            <View style={{flex:0.5}}>
                {nextHolds.map((item, index)=>renderItemComponent(item, index, 'sells'))}
                <Text>총 평가액: {nextTotalPrice}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text>이름: </Text><TextInput style={styles.TextInput} onChangeText={(text)=>setNextTitle(text)} value={nextTitle}/>
                </View>
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
                <Button title={'commit'} onPress={()=>setPortfolioFull({
                    title: nextTitle,
                    holds: nextHolds,
                    maxHolds: nextMaxHolds,
                    covDate: nextCovDate,
                    totalCash: nextTotalCash
                }, true)}/>
            </View>
        </View>
        <Separator/>
        <View style={{flexDirection:'row'}}>
            <FileManagerSection
            style={{flexDirection:'column', flex:1}}
            dir={'portfolio'}
            data={portfolio}
            defaultData={defaultPortfolio}
            setData={(data)=>setPortfolioFull(data, true)}
            />
            <FrontierSection frontierRef={frontierRef}/>
        </View>
      </ScrollView>
    )
  }
  

  const styles = StyleSheet.create({
    TextInput: {borderColor:'#000', borderWidth: 1, marginVertical: 5}
  });