import React from "react";
import { Platform, StyleSheet, Text, TextInput } from "react-native";
import Animated, {
  concat,
  cond,
  divide,
  eq,
  floor,
  interpolateNode,
  lessThan,
  modulo,
  multiply,
  sub
} from "react-native-reanimated";
import  "react-native-reanimated/src/reanimated1/derived"
import { Candle } from "./CandleType";

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    backgroundColor: "#FEFFFF",
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const formatInt = (value: Animated.Node<number>) => {
  const t2 = floor(divide(value, 1000000));
  const t = floor(modulo(divide(value, 1000), 1000));
  const t0 = modulo(value, 1000)
  return cond(
    lessThan(t, 1),
    concat(t),
    cond(
      lessThan(t2, 1),
      concat(t, ",", t0),
      concat(t2, ",", t, ",", t0)
    )
  )
};

const format = (value: Animated.Node<number>) => {
  if (Platform.OS === "android") {
    return concat("", divide(floor(multiply(value, 100)), 100));
  }
  const int = floor(value);
  const dec = floor(multiply(sub(value, int), 100));
  const formattedDec = cond(
    eq(dec, 0),
    "00",
    cond(lessThan(dec, 10), concat("0", dec), concat(dec))
  );
  return concat("", formatInt(int), ".", formattedDec);
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface LabelProps {
  domain: [number, number];
  size: [number, number, number];
  y: Animated.Node<number>;
  opacity: Animated.Node<number>;
}

export default ({ domain: [min, max], size, y, opacity }: LabelProps) => {
  const value = interpolateNode(y, {inputRange:[size[1], size[2]], outputRange:[max, min]});
  const fValue = format(value)
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: y }], opacity , top:-20, left:160}]}
    >
      <AnimatedTextInput underlineColorAndroid="transparent" editable={false} value={fValue}/>
    </Animated.View>
  );
};