import { ScaleLinear } from "d3-scale";

export interface Candle {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    prev?: Candle;
    up?: boolean;
    volumeUp?: boolean;
    extra?:{
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

  
export interface Chart {
    CandleComponent: React.ComponentType<any>
    verticalLines?: number[];
}

export type ChartProps = Chart & {
    width: number,
    height: number
    candles: Candle[];
    domain: [number, number];
    zDomain?: [number, number];
  }

export type ChartIndex = Chart & {
    setData:(candle:Candle) => void
    setValues:(prev:HandlerValues, candle:Candle) => void
    getDomains:(values:HandlerValues)=>HandlerDomains
}

  
export type HandlerValues = {values:number[], zValues:number[]}
export type HandlerDomains = {domain:[number, number], zDomain?:[number, number]}

export type Handler={
    height:number,
    chartIndex?:ChartIndex
}
  
  export type HandlerProps = {
    caliber:number, 
    candles:Candle[], 
    width:number,
    rightWidth:number,
    chartHandlers: Handler[],
    domains: HandlerDomains[],
    candleRef: React.MutableRefObject<(candle: Candle) => void>
  }