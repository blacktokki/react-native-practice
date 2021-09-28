import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, FlatList, TextInput, Button, ScrollView } from 'react-native';
import ConditionSection from '../sections/ConditionSection';
import BackTradeSyncSection, {backTradeContext, BackTradeResult, BackTradeRow} from '../sections/BackTradeSyncSection';
import { load_backtrade_json, load_stocklist_json, save_backtrade_json } from '../utils';
import { useHeaderHeight } from '@react-navigation/stack';

function Separator(){
  return <View style={{
    backgroundColor: '#000',
    marginVertical: 30,
    height: 1
  }}/>
}

export default function TabBackTradeScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabBackTrade'>) {
   const [data, setData] = React.useState<any[]>([])
   const [reportList, setReportList] = React.useState<string[]|undefined>()
   const [result, setResult] = React.useState< BackTradeResult>({})
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
  const renderReport = React.useCallback(({item}:{item:string})=>{
    return (<TouchableOpacity onPress={()=>load_backtrade_json(item).then((data)=>{
      setResult(data)
    })}><Text>{item}</Text></TouchableOpacity> )
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
        <FlatList
          scrollEnabled={false}
          data={result.result}
          renderItem={renderItem}
        />
        {resultRow?(
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: popup.y,
              left: popup.x,
              backgroundColor: 'white',
              borderColor:'#000',
              borderWidth: 2,
              padding:5
            }}
            onPress={()=>{setPopup({})}}
            onLayout={(e)=>{setPopupHeight(Math.max(popupHeight, e.nativeEvent.layout.height))}}>
            <Text>{resultRow[0]}</Text>
            <Separator/>
            {resultRow[1].stocks.map((v, k)=>(<Text key={k}>{v.stock['full_code']}:{v.stock['codeName']}:{v.candle.close}원:{v.signal}</Text>))}
            <Separator/>
            {resultRow[1].trades.map((v, k)=>(<Text key={k}>{v}</Text>))}
            <Separator/>
            {Object.entries<any>(resultRow[1].currentStocks).map((v, k)=>(<Text key={k}>{v[0]}:{v[1][0]}</Text>))}
          </TouchableOpacity>
        ):undefined}
      <View style={{width:'100%', height:popupHeight}}/>
    </ScrollView>
  )
}
