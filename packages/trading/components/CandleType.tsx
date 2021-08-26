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
}

export interface CandleProps {
    candle: Candle;
    index: number;
    width: number;
    scaleY: ScaleLinear<number, number>;
    scaleBody: ScaleLinear<number, number>;
  }