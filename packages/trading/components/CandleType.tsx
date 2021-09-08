import { ScaleLinear } from "d3-scale";

type Aggregate = {
  values:number[], 
  zValues:number[],
  domain:[number, number],
  zDomain?:[number, number]
}

export type IndexType = {
  CandleComponent: React.ComponentType<any>  
  setData:(candle:Candle) => void
  setValues:(prev:Aggregate, candle:Candle) => void
  setDomains:(aggregate:Aggregate)=>void
  getVerticals?:(aggregate:Aggregate)=>number[]
}

export interface Candle {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    prev?: Candle;
    extra?:{
        hloc?:{
          up: boolean;
        },
        volume?:{
          volumeUp: boolean;
        },
        multiDot?:{
            fill:string,
            value:number,
            volume:number,
            desc:string,
            avg?:number,
            std?:number,
        }[],
        dd?:number,
        tdd?:number,
    }
}

export interface CandleProps {
    candle: Candle;
    index: number;
    width: number;
    scaleY: ScaleLinear<number, number>;
    scaleZ?: ScaleLinear<number, number>;
    scaleBody: ScaleLinear<number, number>;
}

export type Chart = {
  height:number,
  chartIndex?:IndexType,
  aggregate?:Aggregate
}

type CommonProps = {
  candles:Candle[], 
  width:number,
}

export type ChartProps = CommonProps & Chart

export type HandlerProps = CommonProps & {
  charts: Chart[],
  caliber:number, 
  rightWidth:number,
  candleRef: React.MutableRefObject<(candle: Candle) => void>
}