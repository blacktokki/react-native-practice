import { ScaleLinear } from "d3-scale";

type Aggregate = {
  values:number[], 
  zValues:number[],
  domain:[number, number],
  zDomain?:[number, number]
}

export type IndexType = {
  CandleComponent: React.ComponentType<any>  
  setData:(candle:Candle, chart:Chart) => void
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
        mpt1?:{
          mpts:{
              fill:string,
              value:number,
              // volume:number,
              desc:string,
              avg?:number,
              avgExp?:number, 
              std?:number,
          }[],
          _first:Candle,
        }
        tdd?:{
          dd:number,
          tdd:number
        }
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
  extra?:{
    mpt1?:{
      depth:number,
      subDepth:number
      include?:number[]
    }
    tdd?:{
      depth:number,
    }
  }
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
  shiftRef: React.MutableRefObject<(shift: number) => void>
}