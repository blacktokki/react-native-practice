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
    domain: [number, number];
    height: number
    zDomain?: [number, number];
    verticalLines?: number[];
    CandleComponent?: React.ComponentType<any>
}