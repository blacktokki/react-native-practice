import * as React from 'react';
import { TouchableOpacity ,Text, View, Button } from 'react-native';
import Separator from '../components/Separator';
import { BackTradeRow } from './BackTradeSyncSection';

export type Popup = {x?:number, y?:number, idx?:number}

export default function BackTradeDetailSection({resultRow, popup, navigation, setPopup}:{
    resultRow?:BackTradeRow,
    popup:Popup,
    navigation:any
    setPopup:(popup:Popup)=>void,
}) {
    const [popupHeight, setPopupHeight] = React.useState(0)
    const navigateDetail = (fullcode:string)=>{
        navigation.navigate("Detail", {
            screen: 'DetailScreen',
            params: {full_code: fullcode}
        })
    }
    return (
    <>
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
            buys: resultRow[1].buys.map((v)=>v.stock['full_code']).join(','),
            sells:resultRow[1].sells.map((v)=>v.stock['full_code']).join(','),
          }
      })}}/>
        <Button title={'close'} onPress={()=>{setPopup({});setPopupHeight(0)}}/>
      </View>):undefined}
      </>)
}