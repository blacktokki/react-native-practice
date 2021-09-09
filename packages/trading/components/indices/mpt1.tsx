import React from "react";
import { Circle } from "react-native-svg";
import { CandleProps, IndexType } from "../CandleType"

const Dot = ({ x, y, z, r, fill }: any) => {
    return (
            <Circle
            cx={x + z}
            cy={y}
            r={r}
            {...{ fill }}
        />
    );
  };

const MultiDot = ({ candle, index, width, scaleY, scaleZ, scaleBody }: CandleProps) => {
  const x = index * width;
  return (
    <>
        {(candle.extra?.mpt1?.mpts || []).map((value, index) => {
            const y = scaleY((value.avg||0))
            const z = (scaleZ?scaleZ((value.std||0)): width)
            const r = width / 10
                return (<Dot
                    key={index}
                    {...{ x, y, z, r}}
                    fill={value.fill}
                />
            );
        })}
    </>
  );
};

export default {
    CandleComponent: MultiDot,
    setData: (candle, chart)=>{
      const depth = chart.extra?.mpt1?.depth || 20;// 보유기한
      const subDepth = chart.extra?.mpt1?.subDepth || 20;//계산일수
      if (candle.extra){
        let prev = candle
        for(let i = 0; i < subDepth; i++){
          prev = prev.prev || prev
        }
        candle.extra.mpt1 = {mpts:[], _first:prev}
        prev = candle
        const prevMpts = candle.prev?.extra?.mpt1?.mpts
        const firstMpts = candle.extra.mpt1._first.extra?.mpt1?.mpts
        for(let i = 0; i < depth; i++){
            if(!chart.extra?.mpt1?.include || chart.extra?.mpt1?.include.indexOf(i)>=0){
              const value = (candle.close>0 && prev.open>0)?100 * (candle.close/prev.open -1):0
              const valueExp = value * value
              const i2 = candle.extra.mpt1.mpts.length
              if(candle.prev===undefined)
                console.log(i, i2)
              const avg = prevMpts&&firstMpts?(prevMpts[i2].avg || 0) - (firstMpts[i2].value - value) / subDepth:value
              const avgExp = prevMpts&&firstMpts?(prevMpts[i2].avgExp || 0) - (firstMpts[i2].value * firstMpts[i2].value - valueExp) / subDepth:valueExp
              candle.extra.mpt1.mpts.push({
                  fill: 'rgba('+ (255 - i * 10) +', 0, '+ (0 + i * 10 )  +', 0.5)',
                  value:value,
                  // volume:(candle.volume + prev.volume)/2, 
                  desc: prev.date + "~" + candle.date,
                  avg: avg,
                  avgExp: avgExp,
                  std: Math.sqrt(avgExp - avg * avg)
              })
            }
            prev = prev.prev || prev
        } 
      }
    },
    setValues: (prev, candle)=>{
      candle?.extra?.mpt1?.mpts.forEach((mpt)=>{
        if(mpt.avg)prev.values.push(mpt.avg)
        if(mpt.std)prev.zValues.push(mpt.std)
      })
    },
    setDomains: (aggregate)=>{
      aggregate.domain = [Math.min(...aggregate.values, 0)-1, Math.max(...aggregate.values, 0)+1]
      aggregate.zDomain = [Math.min(...aggregate.zValues, 0), Math.max(...aggregate.zValues, 0)]
    },
    getVerticals: ()=>[0]
} as IndexType