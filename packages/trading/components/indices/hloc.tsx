import math from "mathjs";
import React from "react";
import { Line, Rect } from "react-native-svg";
import { CandleProps, IndexType } from "../CandleType"

const MARGIN = 1;

const Candle = ({ candle, index, width, scaleY, scaleBody }: CandleProps) => {
  const { close, open, high, low } = candle;
  const up = candle.extra?.hloc?.up;
  const fill = up ? "#E33F64" : "#4A9AFA";
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
      {(open==close)?(
        <Line
        x1={x + margin}
        y1={scaleY(open)}
        x2={x + width - margin}
        y2={scaleY(close)}
        stroke={fill}
        strokeWidth={1}
      />
      ):(
      <Rect
        x={x + margin}
        y={scaleY(max)}
        width={width - margin * 2}
        height={scaleBody(max - min)}
        {...{ fill }}
      />
      )}
    </>
  );
};

export default {
    CandleComponent: Candle,
    setData: (candle)=>{
      let hlocUp;
      if (candle.open==candle.close)
        hlocUp = candle.prev?((candle.prev.close==candle.open && candle.prev.extra?.hloc)?candle.prev.extra.hloc.up:(candle.prev.close<candle.open)):true
      else
        hlocUp = candle.open < candle.close
      if (candle.extra)
        candle.extra.hloc = {up: hlocUp}
    },
    setValues: (prev, candle) =>{
      prev.values.push(candle.low)
      prev.values.push(candle.high)
    },
    setDomains: (values)=>{
      values.domain = values.values.length?[Math.min(...values.values), Math.max(...values.values)]:[0, 0]
    }
} as IndexType