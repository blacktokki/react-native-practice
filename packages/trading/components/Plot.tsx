import React from "react";
import { Svg } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import { Candle as CandleModel } from "./CandleType"
import { Circle, Line } from "react-native-svg";

function avgstd(array:number[]) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return [mean, Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)]
  }

interface ChartProps {
  candles: CandleModel[];
  domain: [number, number];
  size: [number, number];
}

const Dot = ({ x, y, width, fill }: any) => {
    return (
        <>
            <Circle
            cx={x}
            cy={y}
            r={width*0.5}
            {...{ fill }}
        />
        </>
    );
  };

  type DataType = {fill:string, data:[number, number, number, string][]}

export default ({ candles, domain, size }: ChartProps) => {
  const depth = 14
  const colors = [...Array(depth).keys()].map((v)=>'rgba('+ (255 - v * 4) +', 0, '+ (127 + v * 4 )  +', 0.5)')
  const data:DataType[] = colors.map((value, index)=>{
    const lists:[number, number, number, string][] = []
    if (candles.length < 1)
        return {fill: value, data: []}
    let now = candles[Math.max(candles.length -1, 0)]
    let prev = candles[Math.max(candles.length -1 - index, 0)]
    for(let i = 1;i <= candles.length; i++){
        const indexEnd = candles.length - i
        const key = prev.date + "~" + now.date 
        lists.push([indexEnd, 100 * (now.close/prev.open -1), (now.volume + prev.volume)/2, key])
        now = now.prev || now
        prev = prev.prev || prev
      }
    return {fill: value, data:lists}
  })
  const width = size[0] / candles.length;
  const numberOnly = data.reduce((prev, v)=>{return prev.concat(v.data.map((v)=>v[1]));}, [] as number[])
  const maxVolume = Math.max(...data.reduce((prev, v)=>{return prev.concat(v.data.map((v)=>v[2]));}, [] as number[]), 0)
  console.log(maxVolume)
  const _domain = [Math.min(...numberOnly, 0), Math.max(...numberOnly, 0)]
  const scaleY = scaleLinear().domain(_domain).range([size[1], 0]);
  console.log('@@', data, _domain)
  return (
    <Svg width={size[0]} height={size[1]}>
      {data.map((d, i)=>{return d.data.map((value, index) => {
            const x = value[0] * width + width * 0.5;
            const y = scaleY((value[1]))
            const r = (Math.exp(2*(value[2]/maxVolume -1)))
                return (<Dot
                    key={i + "-" + index}
                    {...{ x, y}}
                    width={width * r} //(i/depth * 0.75 + 0.25)
                    fill={d.fill}
                />
            );
        })
      })}
    
        <Line x1={0} x2={size[0]} y1={scaleY(0)} y2={scaleY(0)} stroke={"red"} strokeWidth={1}/>
    </Svg>
  );
};