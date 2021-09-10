import React from "react";
import { Rect } from "react-native-svg";
import { CandleProps, IndexType } from "../CandleType"

const MARGIN = 1;

type CandleConfig = {
  volume?:{
    volumeUp: boolean;
  }
}

const Bar = ({ candle, index, width, scaleY, scaleBody }: CandleProps<CandleConfig>) => {
  const { volume } = candle;
  const volumeUp = candle.extra?.volume?.volumeUp
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
      if (candle.extra)
        candle.extra.volume = {
          volumeUp: candle.prev?((candle.prev.volume==candle.volume && candle.prev.extra?.volume)?candle.prev.extra.volume.volumeUp:(candle.prev.volume<candle.volume)):true
        }
    },
    setValues: (prev, candle)=>{
      prev.values.push(candle.volume)
    },
    setDomains: (values)=>{
      values.domain = values.values.length?[Math.min(...values.values, 0), Math.max(...values.values)]:[0, 0]
    }
} as IndexType<{}, CandleConfig>