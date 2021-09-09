import React from "react";
import { StyleSheet, View } from "react-native";

import Chart from "./Chart";
import Handler from  "./Handler"
import Side from "./Side"
import { Candle, Chart as ChartType } from "./CandleType"
import hloc from "./indices/hloc";
import volume from "./indices/volume";
import mpt1 from "./indices/mpt1";
import tdd from "./indices/tdd";
import Plot from "./Plot"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});


export default (props:{data:Candle[], width:number, sizeRef?:React.MutableRefObject<(shift: number, candleCount:number) => void>}) => {
  const [shift, setShift] = React.useState(0)
  const rawData = React.useRef(props.data)
  const rightWidth = 50
  const width = props.width - rightWidth
  const candleCount = 20
  const charts:ChartType[] = [
    {height: width / 4, chartIndex:hloc},
    {height: width / 16},
    {height: width / 8, chartIndex:volume},
    {height: width / 16},
    {height: width / 8, chartIndex:mpt1, extra:{mpt1:{depth:20, subDepth:20, include:[0,4,9,14,19]}}},
    {height: width / 16},
    {height: width / 8, chartIndex:tdd, extra:{tdd:{depth:252}}},
  ]
  if(rawData.current != props.data){
    props.data.forEach((value, index ,array) => {
      if (index > 0)
        value.prev = array[index - 1]
      value.extra = {}
      charts.forEach((handler)=>{
        handler.chartIndex?.setData(value, handler)
      })
    })
    rawData.current = props.data
  }
  const candles = props.data.slice(-1 -candleCount -shift, -1 -shift);
  const caliber = candles.length?(width / candles.length):0
  charts.forEach((chart)=>{chart.aggregate = {values:[], zValues:[], domain:[0, 0]}});
  candles.forEach((value, index)=>{
    charts.forEach((handler, hIndex)=>{
      const aggregate = charts[hIndex].aggregate
      if(aggregate){
        handler.chartIndex?.setValues(aggregate, value)
      }
    })
  })
  charts.forEach((handler, hIndex)=>{
    const aggregate = charts[hIndex].aggregate
    if(handler.chartIndex && aggregate){
      handler.chartIndex?.setDomains(aggregate)
    }
  })
  const candleRef = React.useRef<(candle:Candle)=>void>((candle)=>{})
  const shiftRef = React.useRef<(shift:number)=>void>((shift)=>{setShift(shift); props.sizeRef?.current(shift, candleCount)})
  candleRef.current = (candle)=>{}
  return (
    <View style={{width:props.width}}>
      <View style={{width:width}}>
        {charts.map((chartHandler, index)=>chartHandler.chartIndex?(
          <View style={styles.container} key={index}>
            <Chart 
              {...{ candles, width }}
              aggregate={chartHandler.aggregate}
              height={chartHandler.height}
              chartIndex={chartHandler.chartIndex}
            />
          </View>
        ):(
          <View style={[styles.container, {minHeight:chartHandler.height}]} key={index}/>
        ))}
        <Handler caliber={caliber} candles={candles} width={width} charts={charts} candleRef={candleRef} shiftRef={shiftRef} rightWidth={rightWidth}/>
      </View>
        <Plot {...{ candles }} domain={charts[4].aggregate?.domain||[0, 0]} size={[props.width, props.width * 0.75]} depth={charts[4].extra?.mpt1?.include?.length} subDepth={charts[4].extra?.mpt1?.subDepth}/>
      <Side candleSetter={(setter)=>{candleRef.current = setter}}/>
    </View>
  );
};