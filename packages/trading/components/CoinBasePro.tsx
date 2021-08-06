import React from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add,
  diffClamp,
  eq,
  modulo,
  sub,
  call,
} from "react-native-reanimated";

import Chart, { size } from "./Chart";
import Line from "./Line";
import Label from "./Label";
import { Candle } from "./Candle";

const data = require('./dummydata.json')
const candles = data.slice(0, 20);
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  const delay = React.useRef({delay:0})
  console.log(labelX, labelY, size)
  let translateY = diffClamp(labelY, 0, size);
  let translateX = add(sub(labelX, modulo(labelX, props.caliber)), props.caliber / 2);
  let opacity = eq(labelState, State.ACTIVE);
  return (
  <PanGestureHandler minDist={0} onGestureEvent={(e)=>{
    if (delay.current.delay==0){
      setLabelX(e.nativeEvent.x)
      setLabelY(e.nativeEvent.y)
      setLabelState(e.nativeEvent.state)
      delay.current.delay=1
    }
  }}>
    <Animated.View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity,
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Line x={size} y={0} />
      </Animated.View>
      <Animated.View
        style={{
          transform: [{ translateX }],
          opacity,
          ...StyleSheet.absoluteFillObject,
        }}
      >
        <Line x={0} y={size} />
      </Animated.View>
      <Label y={translateY} {...{ size, domain, opacity }} />
      <Animated.Code>{()=>call([translateX, translateY], ()=>{delay.current.delay=0})}
    </Animated.Code>
    </Animated.View>
  </PanGestureHandler>
  )
}

export default () => {
  const caliber = size / candles.length;
  return (
    <View style={styles.container}>
        <Chart {...{ candles, domain }} />
        <Handler caliber={caliber}/>
    </View>
  );
};