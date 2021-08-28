import React from "react";
import { Svg, Text } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import { Candle as CandleModel } from "./CandleType"
import { Circle, Line } from "react-native-svg";

function avgstd(array:number[]) {
    const n = array.length
    if (n == 0)
      return [0, 0]
    const mean = array.reduce((a, b) => a + b) / n
    return [mean, Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)]
  }

interface ChartProps {
  candles: CandleModel[];
  domain: [number, number];
  size: [number, number];
  depth: number,
  subDepth: number
}

const Dot = ({id, x, y, r, fill, px, py }: any) => {
    return (
        <>
          <Circle
            cx={x}
            cy={y}
            r={r}
            {...{ fill }}
          />
          {(px && py)?(<Line
             x1={x} x2={px} y1={y} y2={py} stroke={"black"} strokeWidth={1}
          />):undefined}
          <Text x={x} y={y} fill="black">{id}</Text>
        </>
    );
  };

type DataType = {fill:string, avg:number, std:number, prev?:DataType}

export default ({ candles, domain, size, depth, subDepth }: ChartProps) => {
  const candle = candles[candles.length-1]
  let prev:DataType|undefined = undefined
  const data:DataType[] = [...Array(depth).keys()].map((v)=>{
    let fill = ''
    if (candles.length == 0)
      return {fill, avg:0, std:0}
    const arr:number[] = []
    let _candle = candle
    for(let i=0; i<subDepth; i++){
      const multiDot = _candle.extra?.multiDot
      if (multiDot){
        fill = multiDot[v].fill
        arr.push(multiDot[v].value)
      }
      else
        arr.push(0)
      _candle = _candle.prev || _candle
    }
    const [avg, std] = avgstd(arr)
    prev = {fill, avg, std:std, prev}
    return prev
  })
  const avgOnly = data.map((v)=>v.avg)
  const stdOnly = data.map((v)=>v.std)
  const scaleX = scaleLinear().domain([Math.min(...stdOnly, 0) -1, Math.max(...stdOnly, 0) + 1]).range([0, size[0]]);
  const scaleY = scaleLinear().domain([Math.min(...avgOnly, 0) -1, Math.max(...avgOnly, 0) + 1]).range([size[1], 0]);
  return (
    <Svg width={size[0]} height={size[1]}>
      {data.map((d, i)=>{
        const x = scaleX(d.std)
        const y = scaleY(d.avg)
        const px = d.prev?scaleX(d.prev.std): undefined
        const py = d.prev?scaleY(d.prev.avg): undefined
        const r = 6
        return (<Dot
            key={i}
            id={i}
            {...{ x, y ,r, px, py}}
            fill={d.fill}
        />);}
      )}
        <Line x1={0} x2={size[0]} y1={scaleY(0)} y2={scaleY(0)} stroke={"red"} strokeWidth={1}/>
        <Line x1={scaleX(0)} x2={scaleX(0)} y1={0} y2={size[1]} stroke={"red"} strokeWidth={1}/>
    </Svg>
  );
};