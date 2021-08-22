import { CompanyResponse, DailySimpleModel, DailyCompressModel, CompanyCompress } from '../types';

export const simpleModelKeys:(keyof DailySimpleModel)[] = ['TRD_DD', 'TDD_CLSPRC', 'TDD_OPNPRC', 'TDD_HGPRC', 'TDD_LWPRC', 'ACC_TRDVOL', 'ACC_TRDVAL', 'FLUC_RT'] 

export function compressModel(isSimple:number, data:CompanyResponse | CompanyCompress){
    if(isSimple)
        (data as CompanyCompress)['output'] = (data as CompanyResponse)['output'].map((item)=>{
            return simpleModelKeys.reduce((prev, current)=>{prev.push(item[current]); return prev}, [] as unknown as DailyCompressModel)
        })
}

export function decompressModel(isSimple:number, data:CompanyResponse | CompanyCompress){
    if(isSimple){
        (data as CompanyResponse)['output'] = (data as CompanyCompress)['output'].map((item)=>{
            return simpleModelKeys.reduce((prev, current, index)=>{prev[current] = item[index]; return prev}, {} as DailySimpleModel)
        })
    }
}