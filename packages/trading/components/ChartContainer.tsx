import React from "react";
import { StyleSheet, View } from "react-native";

import Chart from "./Chart";
import Handler from  "./Handler"
import Side from "./Side"
import { Candle, HandlerValues, HandlerDomains, Handler as HandlerType } from "./CandleType"
import hloc from "./mainindex/hloc";
import volume from "./subindex/volume";
import CandleComponent from "./unused/Candle";
import BarComponent from "./unused/Bar"
import MultiDot from "./unused/MultiDot"
import MultiDot2 from "./unused/MultiDot2"
import LineDot from "./unused/LineDot"
import Plot from "./Plot"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});


// function avgstd(array:number[]) {
//   const n = array.length
//   if (n == 0)
//     return [0, 0]
//   const mean = array.reduce((a, b) => a + b) / n
//   return [mean, Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)]
// }

export default (props:{data:Candle[], slice:[number, number], width:number}) => {
  /*
  const multiDotDepth = 20// 보유기한
  const multiDotSubDepth = 60//계산일수
  const tddDepth = 252
  props.data.forEach((value, index ,array) => {
    // multi dot
    value.extra.multiDot = []
    let prev = value
    for(let i = 0; i < multiDotDepth; i++){
      value.extra.multiDot.push({
          fill: 'rgba('+ (255 - i * 10) +', 0, '+ (0 + i * 10 )  +', 0.5)',
          value:(value.close>0 && prev.open>0)?100 * (value.close/prev.open -1):0,
          volume:(value.volume + prev.volume)/2, 
          desc: prev.date + "~" + value.date 
      })
      prev = prev.prev || prev
    }
    // tdd
    prev = value
    let dds = []
    for(let i =0; i < tddDepth; i++){
      dds.push(prev.close)
      prev = prev.prev || prev
    }
    value.extra.dd = value.close / Math.max(...dds) - 1
    
    prev = value
    dds = []  
    for(let i = 0; i < tddDepth; i++){
      if (prev.extra?.dd)
        dds.push(prev.extra.dd)
      prev = prev.prev || prev
    }
    value.extra.tdd = Math.min(...dds)
  });*/
  const rightWidth = 50
  const width = props.width - rightWidth
  const chartHandlers:HandlerType[] = [
    {height: width / 4, chartIndex:hloc},
    {height: width / 16},
    {height: width / 8, chartIndex:volume},
    // {domain: [0, 0], height: width / 16},
    // {domain: [Math.min(...multiDotValues), Math.max(...multiDotValues)], height: width / 8, zDomain:[0, Math.max(...multiDotVolumes, 0)], verticalLines:[0], CandleComponent: MultiDot },
    // {domain: [0, 0], height: width / 16},
    // {domain: [Math.min(...multiDotAvgs, -1), Math.max(...multiDotAvgs, 1)], height: width / 8, zDomain:[0, Math.max(...multiDotStds, 0)], verticalLines:[0], CandleComponent: MultiDot2},
    // {domain: [0, 0], height: width / 16},
    // {domain: [Math.min(...tddValues), Math.max(...tddValues)], height: width / 8, CandleComponent: LineDot, verticalLines:[0]},
  ]
  props.data.forEach((value, index ,array) => {
    if (index > 0)
      value.prev = array[index - 1]
    value.extra = {}
    chartHandlers.forEach((handler)=>{
      handler.chartIndex?.setData(value)
    })
  })
  const candles = props.data.slice(props.slice[0], props.slice[1]);
  const caliber = candles.length?(width / candles.length):0
  const values:HandlerValues[] = chartHandlers.map((handler)=>({values:[], zValues:[]}))
  const domains:HandlerDomains[] = []
  candles.forEach((value, index)=>{
    chartHandlers.forEach((handler, hIndex)=>{
      if(index == 0)
        values.push({values:[], zValues:[]})
      handler.chartIndex?.setValues(values[hIndex], value)
    })
  })
  chartHandlers.forEach((handler, hIndex)=>{
    if(handler.chartIndex)
      domains.push(handler.chartIndex.getDomains(values[hIndex]))
    else
      domains.push({domain:[0, 0], zDomain:[0, 0]})
  })
  /*
  candles.forEach((value) => {
    // multi dot avgstd
    for(let i = 0; i < multiDotDepth; i++){
      const all = []
      let prev = value
      for(let j = 0; j < multiDotSubDepth; j++){
        all.push((prev.extra?.multiDot)?prev.extra.multiDot[i].value:0)
        prev = prev.prev || prev
      }
      if(value.extra?.multiDot){
        const [avg, std] = avgstd(all)
        value.extra.multiDot[i].avg = avg
        value.extra.multiDot[i].std = std
      }
    }
  })*/
  const candleRef = React.useRef<(candle:Candle)=>void>((candle)=>{})
  /*
  const [multiDotValues, multiDotVolumes, multiDotAvgs, multiDotStds, tddValues] = candles.reduce((prev ,curr)=>{
    curr.extra?.multiDot?.forEach((v)=>{
      prev[0].push(v.value)
      prev[1].push(v.volume)
      if(v.avg) prev[2].push(v.avg)
      if(v.std) prev[3].push(v.std)
    })
    if(curr.extra?.dd)prev[4].push(curr.extra?.dd)
    if(curr.extra?.tdd)prev[4].push(curr.extra?.tdd)
    return prev
  }, [[], [], [], [], []] as [number[], number[], number[], number[], number[]])*/
  candleRef.current = (candle)=>{}
  return (
    <View style={{width:props.width}}>
      <View style={{width:width}}>
        {chartHandlers.map((chartHandler, index)=>chartHandler.chartIndex?(
          <View style={styles.container} key={index}>
            <Chart {...{ candles }} domain={domains[index].domain} CandleComponent={chartHandler.chartIndex.CandleComponent}  width={width} height={chartHandler.height} zDomain={domains[index].zDomain} verticalLines={chartHandler.chartIndex.verticalLines}/> 
          </View>
        ):(
          <View style={[styles.container, {minHeight:chartHandler.height}]} key={index}/>
        ))}
        <Handler caliber={caliber} candles={candles} width={width} chartHandlers={chartHandlers} domains={domains} candleRef={candleRef} rightWidth={rightWidth}/>
      </View>
      {/*<Plot {...{ candles }} domain={chartHandlers[2].domain} size={[props.width, props.width * 0.75]} depth={multiDotDepth} subDepth={multiDotSubDepth}/>*/}
      <Side candleSetter={(setter)=>{candleRef.current = setter}}/>
    </View>
  );
};