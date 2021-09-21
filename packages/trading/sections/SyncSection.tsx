import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { load_stock_json, save_last_date, sleep, ddFormat } from '../utils';
import { CompanyResponse } from '../types';
const MAX_LOAD_STOCK = 4
let current_load_stock = 0
const MAX_RELOAD_STOCK = 32
export const syncContext = {
    reload_stock:0,
    sync_lock:0,
}

async function load_stock(data_all:any[], endDate:Date, setter:(data_all:any[])=>void, show_log:number, context:typeof syncContext){
  if (context.sync_lock == 0){
    context.sync_lock = 1
    context.reload_stock = 0
    data_all.forEach((item)=>{item['checked'] = false})
    let new_data_all: any[] = data_all.map((item)=>item)
    setter(new_data_all)
    for (const [i, d] of data_all.entries()){
      let full_code = d['full_code']
      context.reload_stock += 1
      while (context.sync_lock==2)
        await sleep(1000)
      while (current_load_stock >= MAX_LOAD_STOCK || context.reload_stock>=MAX_RELOAD_STOCK){
          await sleep(200)
          if (context.reload_stock == MAX_RELOAD_STOCK){
              console.log('reload!!!!')
              new_data_all = data_all.map((item)=>item)
              setter(new_data_all)
              await save_last_date(new_data_all)
          }
          else{
            context.reload_stock += 1
            console.log(current_load_stock, '/', MAX_LOAD_STOCK)
          }
      }
      current_load_stock += 1
      load_stock_json(full_code, {
        start_date:new Date(2016, 0, 1), end_date:endDate, log_datetime:0, isSimple:1
      }).then((j2:CompanyResponse)=>{
          if(show_log){  
            if (j2['_status'] == 0){
              console.log(i, d)
              console.log(j2['output'].length?j2['output'][0] : null)
            }
            else{
              console.log(i, d['codeName'])
            }
          }
          data_all[i]['checked'] = true
          data_all[i]['lastDate'] = j2['output'][0].TRD_DD || data_all[i]['lastDate'] || ddFormat(endDate)
          current_load_stock -= 1
      })
    }
    while (current_load_stock > 0)
      await sleep(200)
    console.log('reload!!!!')
    new_data_all = data_all.map((item)=>item)
    context.sync_lock = 0
    setter(new_data_all)
    await save_last_date(new_data_all)
  }
}

export default (props:{data:any[], lastDate:Date, setData:(data_all:any[])=>void, setLastDate:(date:Date)=>void, context:typeof syncContext}) =>{
    const syncLength = React.useMemo(()=>{
        return [
            props.data.filter((item)=>(new Date(item['lastDate']) >= props.lastDate)).length, 
            props.data.filter((item)=>item['checked']).length,
            props.data.length
        ]
      }, [props.lastDate, props.data])
    return (
        <View>
            {props.context.sync_lock!=1?
                (<Button title={"Sync!"} onPress={
                    props.context.sync_lock==0?
                    ()=>{load_stock(props.data, props.lastDate, props.setData, 1, props.context)}:
                    ()=>{props.context.sync_lock=1}}/>):
                (<Button title={"Pause!"} onPress={()=>{props.context.sync_lock=2;props.setLastDate(new Date(props.lastDate))}}/>)
            }
            <Text>({syncLength[0]}/{syncLength[2]})({syncLength[1]}/{syncLength[2]})</Text>
        </View>
    )
}