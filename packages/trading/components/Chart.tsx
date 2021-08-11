import React from "react";
import { Dimensions } from "react-native";
import { Svg } from "react-native-svg";
import { scaleLinear } from "d3-scale";

import Candle, { Candle as CandleModel } from "./Candle";

export const WIDTH = Dimensions.get("window").width * 0.8;
export const HEIGHT = WIDTH / 2

interface ChartProps {
  candles: CandleModel[];
  domain: [number, number];
}

export default ({ candles, domain }: ChartProps) => {
  const width = WIDTH / candles.length;
  const scaleY = scaleLinear().domain(domain).range([HEIGHT, 0]);
  const scaleBody = scaleLinear()
    .domain([0, Math.max(...domain) - Math.min(...domain)])
    .range([0, HEIGHT]);
  return (
    <Svg width={WIDTH} height={HEIGHT}>
      {candles.map((candle, index) => (
        <Candle
          key={candle.date}
          {...{ candle, index, width, scaleY, scaleBody }}
        />
      ))}
    </Svg>
  );
};