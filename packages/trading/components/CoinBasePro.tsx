import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, TapGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add,
  diffClamp,
  eq,
  modulo,
  sub
} from "react-native-reanimated";

import Chart from "./Chart";
import Line from "./Line";
import { Candle, Chart as ChartModel } from "./CandleType"
import CandleComponent from "./Candle";
import BarComponent from "./Bar"
import MultiDot from "./MultiDot"
import MultiDot2 from "./MultiDot2"
import Plot from "./Plot"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});

function numberWithCommas(x?:number) {
  if (x)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return x
}

function avgstd(array:number[]) {
  const n = array.length
  if (n == 0)
    return [0, 0]
  const mean = array.reduce((a, b) => a + b) / n
  return [mean, Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)]
}

type HandlerProps = {
  caliber:number, 
  candles:Candle[], 
  width:number,
  chartModels:ChartModel[],
  candleRef: React.MutableRefObject<(candle: Candle) => void>
}

function Handler(props:HandlerProps){
  const [labelX, setLabelX] = React.useState(0)
  const [labelY, setLabelY] = React.useState(0)
  const [labelState, setLabelState] = React.useState<State>(State.UNDETERMINED)
  const currentY = React.useMemo(()=>props.chartModels.reduce((prev, cur)=>{ return [prev[0] + cur.height, prev[0]<=labelY?prev[1]+1:Math.max(prev[1],0), prev[0]<=labelY?prev[0]:prev[2]]}, [0, -1, 0]), [labelY])
  let [totalY, indexY, minY] = currentY
  const delay = React.useRef({check:0, count:0})
  const onGestureEvent = (e:any)=>{
      setLabelX(e.nativeEvent.x)
      setLabelY(e.nativeEvent.y)
      setLabelState(e.nativeEvent.state)
  }
  //console.log(labelX, labelY, WIDTH, HEIGHT)
  let translateY = diffClamp(labelY, 0, totalY)
  let translateX = add(sub(labelX, modulo(labelX, props.caliber)), props.caliber / 2);
  let opacity = eq(labelState, State.ACTIVE);
  let candleX = props.candles[Math.floor(labelX * props.candles.length/props.width)]
  let chartY = props.chartModels[indexY]
  let valueY = Math.floor(chartY.domain[1] + (chartY.domain[0] - chartY.domain[1])* Math.min(Math.max(0, (labelY-minY)/chartY.height), 1))
  useEffect(()=>{props.candleRef?.current(candleX)}, [candleX])
  delay.current = {check:0, count:0}
  return (
  <PanGestureHandler minDist={0} onGestureEvent={(e)=>{
    if (delay.current.check==0){
      delay.current.check=1
      onGestureEvent(e)
    }
    delay.current.count= (delay.current.count + 1) % 12
  }}
  >
    <TapGestureHandler onGestureEvent={onGestureEvent}>
    <Animated.View style={[StyleSheet.absoluteFill]}>
    <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          flexDirection:'row-reverse',
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Animated.View style={{backgroundColor:'white', width:80, height:20, top:-10, paddingRight:5}}>
          <Animated.Text style={{textAlign:'right', alignSelf: 'stretch'}}>{numberWithCommas(valueY)}</Animated.Text>
        </Animated.View>
        <Line x={props.width} y={0} />
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ translateX }],
          opacity,
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Line x={0} y={totalY} />
        <Animated.View style={{backgroundColor:'white', width:100, left:-40}}>
          <Animated.Text>{candleX?.date}</Animated.Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
    </TapGestureHandler>
  </PanGestureHandler>
  )
}
function Side(props:{candleSetter:(setter:(candle:Candle)=>void)=>void}){
  const [candle, setCandle] = React.useState<Candle>()
  props.candleSetter(setCandle)
  return(<Animated.View
    style={{
      backgroundColor:'#CCC',
      opacity:0.9,
    }}
  >
    <Animated.Text>{candle?.date}</Animated.Text>
    <Animated.Text>{numberWithCommas(candle?.open)}</Animated.Text>
    <Animated.Text style={{color:'red'}}>{numberWithCommas(candle?.high)}</Animated.Text>
    <Animated.Text style={{color:'blue'}}>{numberWithCommas(candle?.low)}</Animated.Text>
    <Animated.Text>{numberWithCommas(candle?.close)}</Animated.Text>
    <Animated.Text>{numberWithCommas(candle?.volume)}</Animated.Text>
  </Animated.View>)

}


const getDomain = (rows: Candle[], isPrice:boolean): [number, number] => {
  if (rows.length == 0)
    return [0, 0]
  const values = rows.reduce((prev, { high, low, volume }) => {
    if(isPrice){
      prev.push(high);
      prev.push(low);
    }
    else
      prev.push(volume)
    return prev
  }, [] as number[]);
  if (!isPrice)
    values.push(0)
  return [Math.min(...values), Math.max(...values)];
};

export default (props:{data:Candle[], slice:[number, number], width:number}) => {
  const multiDotDepth = 20// 보유기한
  const multiDotSubDepth = 250//계산일수
  props.data.forEach((value, index ,array) => {
    if (index > 0)
      value.prev = array[index - 1]
    if (value.open==value.close){
      value.up = value.prev?((value.prev.close==value.open)?value.prev.up:(value.prev.close<value.open)):true
    }
    else
      value.up = value.open < value.close
    value.volumeUp = value.prev?((value.prev.volume==value.volume)?value.prev.volumeUp:(value.prev.volume<value.volume)):true
    value.extra = {}
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
  });
  const candles = props.data.slice(props.slice[0], props.slice[1]);
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
  })
  const candleRef = React.useRef<(candle:Candle)=>void>((candle)=>{})
  const caliber = candles.length?(props.width / candles.length):0
  const [multiDotValues, multiDotVolumes, multiDotAvgs, multiDotStds] = candles.reduce((prev ,curr)=>{
    curr.extra?.multiDot?.forEach((v)=>{
      prev[0].push(v.value)
      prev[1].push(v.volume)
      if(v.avg) prev[2].push(v.avg)
      if(v.std) prev[3].push(v.std)
    })
    return prev
  }, [[], [], [], []] as [number[], number[], number[], number[]])
  const chartHandlers:(ChartModel)[] = [
    {domain: getDomain(candles, true), height: props.width / 4, CandleComponent: CandleComponent},
    {domain: [0, 0], height: props.width / 16},
    {domain: getDomain(candles, false), height: props.width / 8, CandleComponent: BarComponent},
    {domain: [0, 0], height: props.width / 16},
    {domain: [Math.min(...multiDotValues), Math.max(...multiDotValues)], height: props.width / 8, zDomain:[0, Math.max(...multiDotVolumes, 0)], verticalLines:[0], CandleComponent: MultiDot },
    {domain: [0, 0], height: props.width / 16},
    {domain: [Math.min(...multiDotAvgs, -1), Math.max(...multiDotAvgs, 1)], height: props.width / 8, zDomain:[0, Math.max(...multiDotStds, 0)], verticalLines:[0], CandleComponent: MultiDot2},
  ]
  candleRef.current = (candle)=>{}
  return (
    <View style={{width:props.width}}>
      <View>
        {chartHandlers.map((chartHandler, index)=>chartHandler.CandleComponent?(
          <View style={styles.container} key={index}>
            <Chart {...{ candles }} domain={chartHandler.domain} CandleComponent={chartHandler.CandleComponent}  width={props.width} height={chartHandler.height} zDomain={chartHandler.zDomain} verticalLines={chartHandler.verticalLines}/> 
          </View>
        ):(
          <View style={[styles.container, {minHeight:chartHandler.height}]} key={index}/>
        ))}
        <Handler caliber={caliber} candles={candles} width={props.width} chartModels={chartHandlers} candleRef={candleRef}/>
      </View>
      <Plot {...{ candles }} domain={chartHandlers[2].domain} size={[props.width, props.width * 0.75]} depth={multiDotDepth} subDepth={multiDotSubDepth}/>
      <Side candleSetter={(setter)=>{candleRef.current = setter}}/>
    </View>
  );
};