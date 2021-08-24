import React from "react";
import { ScaleLinear } from "d3-scale";
import { Line, Rect } from "react-native-svg";

const MARGIN = 2;

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleProps {
  candle: Candle;
  index: number;
  width: number;
  scaleY: ScaleLinear<number, number>;
  scaleBody: ScaleLinear<number, number>;
}

export default ({ candle, index, width, scaleY, scaleBody }: CandleProps) => {
  const { close, open, high, low } = candle;
  const fill = close >= open ? "#E33F64" : "#4A9AFA";
  const x = index * width;
  const max = Math.max(open, close);
  const min = Math.min(open, close);
  const margin = Math.min(MARGIN, width*0.25) 
  return (
    <>
      <Line
        x1={x + width / 2}
        y1={scaleY(low)}
        x2={x + width / 2}
        y2={scaleY(high)}
        stroke={fill}
        strokeWidth={1}
      />
      <Rect
        x={x + margin}
        y={scaleY(max)}
        width={width - margin * 2}
        height={scaleBody(max - min)}
        {...{ fill }}
      />
    </>
  );
};