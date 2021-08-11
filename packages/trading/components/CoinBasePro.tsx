import React from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, TapGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add,
  diffClamp,
  eq,
  modulo,
  sub,
  //call,
  useAnimatedReaction
} from "react-native-reanimated";

import Chart, { WIDTH, HEIGHT } from "./Chart";
import Line from "./Line";
import Label from "./Label";
import { Candle } from "./Candle";
import { useRef } from "react";
import { useCallback } from "react";

const data = require('./dummydata.json')
const candles = data.slice(0, 20);
const marginVertical = HEIGHT/16
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: marginVertical,
    backgroundColor: "black",
  },
});
const getDomain = (rows: Candle[]): [number, number] => {
  const values = rows.reduce((prev, { high, low }) => {prev.push(high);prev.push(low);return prev}, [] as number[]);
  return [Math.min(...values), Math.max(...values)];
};
const domain = getDomain(candles);

function Handler(props:{caliber:number}){
  const [labelX, setLabelX] = React.useState(0)
  const [labelY, setLabelY] = React.useState(0)
  const [labelState, setLabelState] = React.useState<State>(State.UNDETERMINED)
  const delay = React.useRef(0)
  const onGestureEvent = useCallback((e)=>{
      setLabelX(e.nativeEvent.x)
      setLabelY(e.nativeEvent.y)
      setLabelState(e.nativeEvent.state)
  }, [labelX, labelY, labelState])
  //console.log(labelX, labelY, WIDTH, HEIGHT)
  let translateY = diffClamp(labelY, 0, HEIGHT);
  let translateX = add(sub(labelX, modulo(labelX, props.caliber)), props.caliber / 2);
  let opacity = eq(labelState, State.ACTIVE);
  useAnimatedReaction(()=>{delay.current=0},()=>{})
  return (
  <PanGestureHandler minDist={0} onGestureEvent={(e)=>{
    if (delay.current==0)
      onGestureEvent(e)
    delay.current= (delay.current + 1) % 12
    console.log(delay.current)
  }}
  >
    <TapGestureHandler onGestureEvent={onGestureEvent}>
    <Animated.View style={[StyleSheet.absoluteFill, {marginVertical:marginVertical}]}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Line x={WIDTH} y={0} />
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ translateX }],
          opacity,
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Line x={0} y={HEIGHT} />
      </Animated.View>
      <Label y={translateY} size={HEIGHT} {...{ domain, opacity }} />
    </Animated.View>
    </TapGestureHandler>
  </PanGestureHandler>
  )
}

export default () => {
  const caliber = WIDTH / candles.length;
  return (
    <View style={styles.container}>
      <Chart {...{ candles, domain }} /> 
      <Handler caliber={caliber}/>  
    </View>
  );
};