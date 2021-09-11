import React from "react";
import { StyleSheet, View, Platform } from "react-native";

import Chart from "./Chart";
import Handler from  "./Handler"
import Side from "./Side"
import { Candle, Chart as ChartType, AsConfig } from "./CandleType"
import hloc from "./indices/hloc";
import volume from "./indices/volume";
import mpt1, {Mpt1Candle} from "./indices/mpt1";
import tdd from "./indices/tdd";
import mfi from "./indices/mfi";
import Plot from "./Plot"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});


export default (props:{data:Candle<{}>[], width:number, sizeRef?:React.MutableRefObject<(shift: number, candleCount:number) => void>}) => {
  const [shift, setShift] = React.useState(0)
  const rawData = React.useRef(props.data)
  const rightWidth = Platform.OS=='web'?60:50
  const width = props.width - rightWidth
  const candleCount = 20
  const charts:ChartType<
    AsConfig<typeof hloc> |
    AsConfig<typeof volume> |
    AsConfig<typeof mpt1> |
    AsConfig<typeof tdd> | 
    AsConfig<typeof mfi>
  >[] = [
    {height: width / 4, chartIndex:hloc, config:{bollingers:[{fill:'green', count:20, exp:2}]}},
    {height: width / 16},
    {height: width / 8, chartIndex:volume},
    {height: width / 16},
    {height: width / 8, chartIndex:mpt1, config:{depth:20, subDepth:20, include:[0,4,9,14,19]}},
    {height: width / 16},
    {height: width / 8, chartIndex:tdd, config:{depth:252}},
    {height: width / 16},
    {height: width / 8, chartIndex:mfi, config:{depth:20}},
  ]
  if(rawData.current != props.data){
    props.data.forEach((value, index ,array) => {
      if (index > 0)
        value.prev = array[index - 1]
      value.extra = {}
      charts.forEach((handler)=>{
        handler.chartIndex?.setData(value, handler.config)
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
  const candleRef = React.useRef<(candle:Candle<{}>)=>void>((candle)=>{})
  const shiftRef = React.useRef<(shift:number)=>void>((shift)=>{setShift(shift); props.sizeRef?.current(shift, candleCount)})
  const plocConfig = charts[4].config as AsConfig<typeof mpt1>
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
        <Plot candles={candles as Mpt1Candle[]} domain={charts[4].aggregate?.domain||[0, 0]} size={[props.width, props.width * 0.75]} depth={plocConfig.include?.length} subDepth={plocConfig.subDepth}/>
      <Side candleSetter={(setter)=>{candleRef.current = setter}}/>
    </View>
  );
};