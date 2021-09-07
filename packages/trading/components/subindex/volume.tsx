import React from "react";
import { Rect } from "react-native-svg";
import { Candle as CandleType ,CandleProps, ChartIndex } from "../CandleType"

const MARGIN = 1;

const Bar = ({ candle, index, width, scaleY, scaleBody }: CandleProps) => {
  const { volume, volumeUp } = candle;
  const fill = volumeUp ? "#E33F64" : "#4A9AFA";
  const x = index * width;
  const max = volume;
  const min = 0;
  const margin = Math.min(MARGIN, width*0.25) 
  return (
    <>
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

export default {
    CandleComponent: Bar,
    setData: (candle)=>{
      candle.volumeUp = candle.prev?((candle.prev.volume==candle.volume)?candle.prev.volumeUp:(candle.prev.volume<candle.volume)):true
    },
    setValues: (prev, candle)=>{
      prev.values.push(candle.volume)
    },
    getDomains: (values)=>{
      return {domain:values.values.length?[Math.min(...values.values, 0), Math.max(...values.values)]:[0, 0], zDomain:undefined} 
    }
} as ChartIndex