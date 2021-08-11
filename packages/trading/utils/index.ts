import path from 'path'
import fs from 'fs'
import moment from 'moment'
import {load_json, save_json, exists_file} from './jsonio'
import {request_company, request_company_list } from './requestutil'

export const INDEX_STOCK = ['ARIRANG', 'HANARO', 'KBSTAR', 'KINDEX', 'KODEX', 'TIGER', 'KOSEF', 'SMART', 'TREX']
export const FILE_SPLIT = 10
export const TRDVAL_DAYS = 20
export const MIN_TRDVAL = 2000000000
export const REPORT_OFFSET2 = 0.5

function sleep(ms:number){
    return new Promise((r) => setTimeout(r, ms));
}

export function load_stocklist_json(){
    const _path = path.join('data', 'list.json')
    if (exists_file(_path))
        var j = load_json(_path)
    else
        var j = request_company_list() as any
        console.log(j)
        save_json(j, _path)
    //filtering stock!
    return ((j as any)['block1'] as any[]).filter((d) =>
            d['marketCode'] in ['KSQ', 'STK'] && d['full_code'][2] == '7' && (d['full_code'] as string).substring(8, 11) == '000' && !('스팩' in d['codeName'])
        )
}

export type Jdata = {
    '_status':number,
    'output':any,
    'CURRENT_DATETIME':any
}

export async function load_stock_json(full_code:string, options={start_date:moment(new Date()).add(-365, 'day').toDate(), end_date:new Date(), log_datetime:0}){
    let _path = path.join('data', 'stock', full_code + '.json')
    let success = true;
    let j2:Jdata
    try{
        j2 = load_json(_path)
    }catch(e){
        success = false;
        j2 = request_company(full_code) as any
        save_json(j2, _path)
        j2['_status'] = 0
        await sleep(250)
    }
    if (success){
        let output_len = (j2['output'] as any[]).length
        let date = j2['output'][0]['TRD_DD']
        let last_date = output_len ? date : null
        if (options.log_datetime)
            console.log(options.start_date, last_date, options.end_date)
        if  (output_len == 0){
            j2 = request_company(full_code) as any
            save_json(j2, _path)
            j2['_status'] = 2
            sleep(250)
        }
        else if (options.start_date < last_date && last_date < options.end_date){
            let j3:Jdata = request_company(full_code, {start_date:last_date, end_date:options.end_date}) as any
            j2['output'] = j3['output'] + j2['output'].slice(1)
            j2['CURRENT_DATETIME'] = j3['CURRENT_DATETIME']
            save_json(j2, _path)
            j2['_status'] = 3
            sleep(250)
        }
        else
            j2['_status'] = 1
    }
    return j2
}

export function is_index_stock(codename:string){
    for (let index_stock in INDEX_STOCK){
        if (codename.startsWith(index_stock))
            return true
    }
    return false
}

export function trdval_filter(data:any, trdval_days:number, min_trdval:number){
    let trd_val_sum = 0
    let trd_val_cnt = 0
    for (let d in data['output']){
        trd_val_sum += parseInt((d as any)['ACC_TRDVAL'].replace(',',''))
        trd_val_cnt += 1
        if (trd_val_cnt == trdval_days)
            break
    }
    return trd_val_sum > min_trdval
}