import React from "react";
import { Svg } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import { Candle as CandleModel } from "./CandleType"
interface ChartProps {
  candles: CandleModel[];
  domain: [number, number];
  size: [number, number];
  CandleComponent: React.ComponentType<any>
}

export default ({ candles, domain, CandleComponent, size }: ChartProps) => {
  const width = size[0] / candles.length;
  const scaleY = scaleLinear().domain(domain).range([size[1], 0]);
  const scaleBody = scaleLinear()
    .domain([0, Math.max(...domain) - Math.min(...domain)])
    .range([0, size[1]]);
  return (
    <Svg width={size[0]} height={size[1]}>
      {candles.map((candle, index) => (
        <CandleComponent
          key={candle.date}
          {...{ candle, index, width, scaleY, scaleBody }}
        />
      ))}
    </Svg>
  );
};