import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, FlatList, TextInput, Button, ScrollView } from 'react-native';
import ConditionSection from '../sections/ConditionSection';
import BackTradeSyncSection, {backTradeContext, BackTradeResult, BackTradeRow} from '../sections/BackTradeSyncSection';
import { delete_backtrade_json, load_backtrade_json, load_stocklist_json, save_backtrade_json } from '../utils';
import { useHeaderHeight } from '@react-navigation/stack';
import Separator from '../components/Separator';

export default function TabBackTradeScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabBackTrade'>) {
   const [data, setData] = React.useState<any[]>([])
   const [reportList, setReportList] = React.useState<string[]|undefined>()
   const [result, setResult] = React.useState< BackTradeResult>({})
   const [year, setYear] = React.useState(new Date().getFullYear())
   const [popup, setPopup] = React.useState<{x?:number, y?:number, idx?:number}>({})
   const [popupHeight, setPopupHeight] = React.useState(0)
   const scrollOffsetRef = React.useRef(0)
   const screenHeight = useHeaderHeight()
   const resultRow = React.useMemo(()=>{return (popup.idx!=undefined && result?.result)?result.result[popup.idx]:undefined}, [result, popup])
   React.useEffect(()=>{
    console.log('reload finished')
    backTradeContext.reload_stock = 0
    if (data.length == 0){
        load_stocklist_json().then(
          (data_all)=>{
            //limited data
            //data_all.splice(10)
            //console.log(data_all)
            setData(data_all);
        })
    }
    if(reportList==undefined){
      load_backtrade_json().then(setReportList)
    }
  },[data, reportList])
  const resultYear = React.useMemo(()=>{
    return result.result?.filter((value)=>{return value[0].startsWith(year.toString())})
  }, [result, year])
  const renderReport = React.useCallback(({item}:{item:string})=>{
    return (
    <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>{setResult({});load_backtrade_json(item).then((data)=>{setResult(data)})}}>
        <Text>{item}</Text>
      </TouchableOpacity>
      <Button title={'X'} onPress={()=>{delete_backtrade_json(item).then(()=>load_backtrade_json().then(setReportList))}}/>
    </View>)
  }, [])

 const renderItem = React.useCallback(({item, index}:{item:BackTradeRow, index:number})=>{
    return (<TouchableOpacity onPress={(e)=>{setPopup({
        x:e.nativeEvent.pageX,
        y:e.nativeEvent.pageY - screenHeight + scrollOffsetRef.current,
        idx:index
      })}}>
      <Text>{item[0]} cash:{item[1].cash} earn:{item[1].earn}</Text>
    </TouchableOpacity>)
 }, [screenHeight])

 const navigateDetail = (fullcode:string)=>{
  navigation.navigate("Detail", {
    screen: 'DetailScreen',
    params: {full_code: fullcode}
  })
 }
   return (
    <ScrollView onScroll={(e)=>{scrollOffsetRef.current = e.nativeEvent.contentOffset.y}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flexDirection:'column', flex:0.5}}>
            <FlatList
              style={{borderColor:'#000', borderWidth: 1, margin: 10, padding:5}}
              data={reportList||[]}
              renderItem={renderReport}
              scrollEnabled={false}
            />
            <Button
              title={'save'}
              onPress={()=>{save_backtrade_json(result).then(()=>load_backtrade_json().then(setReportList))}}
            />
          </View>
          <View style={{flex:0.5}}>
            <ConditionSection/>
            <BackTradeSyncSection data={data} setData={setData} setResult={setResult} context={backTradeContext}/>
          </View>
        </View>
        <Separator/>
        <View style={{flexDirection:'row'}}>
          <Button title={'prev'} onPress={()=>{setYear(year-1)}}/>
          <Text>{year}</Text>
          <Button title={'next'} onPress={()=>{setYear(year+1)}}/>
        </View>
        <FlatList
          scrollEnabled={false}
          data={resultYear}
          renderItem={renderItem}
        />
        <View style={{width:'100%', height:popupHeight}}/>
        {resultRow?(
          <View
            style={{
              position: 'absolute',
              top: popup.y,
              left: popup.x,
              backgroundColor: 'white',
              borderColor:'#000',
              borderWidth: 2,
              padding:5
            }}
            onLayout={(e)=>{setPopupHeight(e.nativeEvent.layout.height)}}>
            <Text>{resultRow[0]}</Text>
            <Separator/>
            <Text>매도</Text>
            {resultRow[1].sells.map((v, k)=>(<TouchableOpacity key={k} onPress={()=>{navigateDetail( v.stock['full_code'])}}>
              <Text>{v.stock['full_code']}:{v.stock['codeName']}:{v.candle.close}원:({v.minCorr})</Text>
              </TouchableOpacity>
            ))}
            <Separator/>
            <Text>매수</Text>
            {resultRow[1].buys.map((v, k)=>(<TouchableOpacity key={k} onPress={()=>{navigateDetail( v.stock['full_code'])}}>
              <Text>{v.stock['full_code']}:{v.stock['codeName']}:{v.candle.close}원:({v.minCorr})</Text>
              </TouchableOpacity>  
            ))}
            <Separator/>
            <Text>거래</Text>
            {resultRow[1].trades.map((v, k)=>(// <TouchableOpacity key={k} onPress={()=>{navigateDetail(v.split(' ')[0])}}>
              <Text key={k}>{v}</Text> //</TouchableOpacity>
            ))
            }
            <Separator/>
            <Text>보유</Text>
            {Object.entries<any>(resultRow[1].currentStocks).map((v, k)=>(<TouchableOpacity key={k} onPress={()=>{navigateDetail(v[0])}}>
            <Text>{v[0]}:{v[1][0]}</Text>
            </TouchableOpacity>))}
            <Button title={'go portfolio'} onPress={()=>{navigation.navigate("Portfolio", {
              screen: 'PortfolioScreen',
              params: {
                buys: resultRow[1].buys.map((v)=>`${v.stock['full_code']}:${v.stock['codeName']}`).join(','),
                sells:resultRow[1].sells.map((v)=>`${v.stock['full_code']}:${v.stock['codeName']}`).join(','),
              }
          })}}/>
            <Button title={'close'} onPress={()=>{setPopup({});setPopupHeight(0)}}/>
          </View>
        ):undefined}
    </ScrollView>
  )
}
