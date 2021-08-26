import React, { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, TapGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add,
  diffClamp,
  eq,
  modulo,
  sub,
  useAnimatedReaction
} from "react-native-reanimated";

import Chart from "./Chart";
import Line from "./Line";
import Label from "./Label";
import { Candle } from "./CandleType"
import CandleComponent from "./Candle";
import BarComponent from "./Bar"
import Plot from "./Plot"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

function numberWithCommas(x?:number) {
  if (x)
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return x
}

type ChartHandler = {
  domain: [number, number],
  height: number
}

type HandlerProps = {
  caliber:number, 
  candles:Candle[], 
  width:number,
  chartHandlers:ChartHandler[],
  candleRef: React.MutableRefObject<(candle: Candle) => void>
}

function Handler(props:HandlerProps){
  const [labelX, setLabelX] = React.useState(0)
  const [labelY, setLabelY] = React.useState(0)
  const [labelState, setLabelState] = React.useState<State>(State.UNDETERMINED)
  const currentY = React.useMemo(()=>props.chartHandlers.reduce((prev, cur)=>{ return [prev[0] + cur.height, prev[0]<=labelY?prev[1]+1:Math.max(prev[1],0), prev[0]<=labelY?prev[0]:prev[2]]}, [0, -1, 0]), [labelY])
  let [totalY, indexY, minY] = currentY
  const delay = React.useRef(0)
  const onGestureEvent = useCallback((e)=>{
      setLabelX(e.nativeEvent.x)
      setLabelY(e.nativeEvent.y)
      setLabelState(e.nativeEvent.state)
  }, [labelX, labelY, labelState])
  //console.log(labelX, labelY, WIDTH, HEIGHT)
  let translateY = diffClamp(labelY, 0, totalY)
  let translateX = add(sub(labelX, modulo(labelX, props.caliber)), props.caliber / 2);
  let opacity = eq(labelState, State.ACTIVE);
  let candleX = props.candles[Math.floor(labelX * props.candles.length/props.width)]
  useAnimatedReaction(()=>{delay.current=0},()=>{})
  useEffect(()=>{props.candleRef?.current(candleX)}, [candleX])
  return (
  <PanGestureHandler minDist={0} onGestureEvent={(e)=>{
    if (delay.current==0)
      onGestureEvent(e)
    delay.current= (delay.current + 1) % 12
    console.log(delay.current)
  }}
  >
    <TapGestureHandler onGestureEvent={onGestureEvent}>
    <Animated.View style={[StyleSheet.absoluteFill]}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          ...StyleSheet.absoluteFillObject,
        }}
      >
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
        <Animated.View style={{backgroundColor:'white', width:80, left:-40}}>
          <Animated.Text>{candleX?.date}</Animated.Text>
        </Animated.View>
      </Animated.View>
      <Label y={translateY} size={[props.width, minY, totalY]} {...{ opacity }} domain={props.chartHandlers[indexY].domain}/>
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
  props.data.forEach((value, index ,array) => {
    if (index > 0)
      value.prev = array[index - 1]
    if (value.open==value.close){
      value.up = value.prev?((value.prev.close==value.open)?value.prev.up:(value.prev.close<value.open)):true
    }
    else
      value.up = value.open < value.close
    value.volumeUp = value.prev?((value.prev.volume==value.volume)?value.prev.volumeUp:(value.prev.volume<value.volume)):true
  });
  const candles = props.data.slice(props.slice[0], props.slice[1]);
  const candleRef = React.useRef<(candle:Candle)=>void>((candle)=>{})
  const caliber = props.width / candles.length
  const chartHandlers:ChartHandler[] = [
    {domain: getDomain(candles, true), height: props.width / 2},
    {domain: [0, 0], height: props.width / 8},
    {domain: getDomain(candles, false), height: props.width / 4}
  ]
  candleRef.current = (candle)=>{}
  return (
    <View style={{width:props.width}}>
      <View>
        <View style={styles.container}>
          <Chart {...{ candles}} domain={chartHandlers[0].domain} CandleComponent={CandleComponent} size={[props.width, chartHandlers[0].height]}/>   
        </View>
        <View style={[styles.container, {minHeight:chartHandlers[1].height}]}/>
        <View style={styles.container}>
          <Chart {...{ candles }} domain={chartHandlers[2].domain} CandleComponent={BarComponent} size={[props.width, chartHandlers[2].height]}/> 
        </View>
        <Handler caliber={caliber} candles={candles} width={props.width} chartHandlers={chartHandlers} candleRef={candleRef}/>
      </View>
      <Plot {...{ candles }} domain={chartHandlers[2].domain} size={[props.width, chartHandlers[2].height]}/>
      <Side candleSetter={(setter)=>{candleRef.current = setter}}/>
    </View>
  );
};