import path from 'path'
import moment from 'moment'
import {load_json, save_json, exists_file, init_folder} from './jsonio'
import {request_company, request_company_list } from './requestutil'
import { CompanyResponse, DailyFullModel, DailySimpleModel } from '../types'
import { compressModel, decompressModel } from './compress'

export const INDEX_STOCK = ['ARIRANG', 'HANARO', 'KBSTAR', 'KINDEX', 'KODEX', 'TIGER', 'KOSEF', 'SMART', 'TREX']
export const FILE_SPLIT = 10
export const TRDVAL_DAYS = 20
export const MIN_TRDVAL = 2000000000
export const REPORT_OFFSET2 = 0.5
export const STORAGE_KEY = {
    'last_date': 'RNP_LAST_DATE'
}

export function sleep(ms:number){
    return new Promise((r) => setTimeout(r, ms));
}

export async function load_stocklist_json(){
    const _path = path.join('data', 'list.json')
    await init_folder('data')
    if (await exists_file(_path)){
        var j = await load_json(_path)
    }
    else
        var j = await request_company_list() as any
        save_json(j, _path)
    //filtering stock!
    const data_all = ((j as any)['block1'] as any[]).filter((d) =>{
        return ['KSQ', 'STK'].indexOf(d['marketCode']) >= 0 && d['full_code'][2] == '7' && (d['full_code'] as string).substring(8, 11) == '000' && (d['codeName'] as string).search('스팩') < 0 && ! is_index_stock(d['codeName'])
    })
    const _path2 = path.join('data', 'last_date.json')
    if (await exists_file(_path2)){
        const last_dates = await load_json(_path2)
        data_all.forEach((d)=>{
            d['lastDate'] = last_dates[d['full_code']]
        })
    }
    else
        save_json({}, _path2)
    return data_all
}

const default_date = {
    start_date:new Date(2016, 0, 1), 
    end_date:moment(new Date()).set({h: 0, m: 0, s:0}).toDate()
}

export async function load_stock_json(full_code:string, options?:{start_date:Date, end_date:Date, log_datetime:number, isSimple:number}){
    options = Object.assign({start_date:default_date.start_date, end_date:default_date.end_date, log_datetime:0}, options)
    let folder = options.isSimple? 'simple': 'stock'
    let _path = path.join('data', folder, full_code + '.json')
    await init_folder('data')
    await init_folder(path.join('data', folder))
    let success = true;
    let j2:CompanyResponse
    try{
        j2 = await load_json(_path)
        decompressModel(options.isSimple, j2)
    }catch(e){
        success = false;
        j2 = await request_company(full_code, default_date)
        compressModel(options.isSimple, j2)
        save_json(j2, _path)
        j2['_status'] = 0
        await sleep(200)
    }
    if (success){
        let output_len = (j2['output'] as any[]).length
        let date = moment(new Date(j2['output'][0]['TRD_DD'])).add(1, 'second').toDate()
        let last_date = output_len ? date : moment(options.start_date).add(1, 'day').toDate()
        if (options.log_datetime)
            console.log(options.start_date, last_date, options.end_date)
        if  (output_len == 0){
            j2 = await request_company(full_code, default_date) as any
            compressModel(options.isSimple, j2)
            save_json(j2, _path)
            j2['_status'] = 2
            await sleep(200)
        }
        else if (options.start_date < last_date && last_date < options.end_date){
            let j3:CompanyResponse = await request_company(full_code, {start_date:last_date, end_date:options.end_date})
            j2['output'] = j3['output'].concat(j2['output'].slice(1))
            j2['CURRENT_DATETIME'] = j3['CURRENT_DATETIME']
            compressModel(options.isSimple, j2)
            save_json(j2, _path)
            j2['_status'] = 3
            await sleep(200)
        }
        else
            j2['_status'] = 1
    }
    return j2
}

export async function save_last_date(data_all:any[]){
    const last_dates:any = {}
    data_all.forEach((d)=>{
        last_dates[d['full_code']] = d['lastDate']
    })
    const _path2 = path.join('data', 'last_date.json')
    await save_json(last_dates, _path2)
}

export function is_index_stock(codename:string){
    for (let index_stock of INDEX_STOCK){
        if (codename.startsWith(index_stock))
            return true
    }
    return false
}

export function trdval_filter(data:any, trdval_days:number, min_trdval:number){
    let trd_val_sum = 0
    let trd_val_cnt = 0
    for (let d of data['output']){
        trd_val_sum += parseInt((d as any)['ACC_TRDVAL'].replace(',',''))
        trd_val_cnt += 1
        if (trd_val_cnt == trdval_days)
            break
    }
    return trd_val_sum > min_trdval
}

export function ddFormat(date:Date){
    return date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString().padStart(2,'0') + '/' + date.getDate().toString().padStart(2,'0')
}

export const ModelToCandle = (item:(DailySimpleModel | DailyFullModel))=>{
    return {
        "date": item.TRD_DD,
        "open":  parseInt(item.TDD_OPNPRC.replace(/,/g, '')),
        "high": parseInt(item.TDD_HGPRC.replace(/,/g, '')),
        "low": parseInt(item.TDD_LWPRC.replace(/,/g, '')),
        "close":parseInt( item.TDD_CLSPRC.replace(/,/g, '')),
        "volume":parseInt(item.ACC_TRDVOL.replace(/,/g, '')),
        "volumeVal":parseInt(item.ACC_TRDVAL.replace(/,/g, '')),
    }
}