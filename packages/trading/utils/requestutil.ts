import requests from 'axios'

export const simpleModelKeys = ['TRD_DD', 'TDD_CLSPRC', 'TDD_OPNPRC', 'TDD_HGPRC', 'TDD_LWPRC', 'ACC_TRDVOL', 'ACC_TRDVAL', 'FLUC_RT'] 

export async function request_company_list(){
    const params = new URLSearchParams();
    params.append('bld', 'dbms/comm/finder/finder_stkisu');
    return (await requests.post('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', params)).data
}

function dd_format(date:Date){
    return date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2,'0') + date.getDate().toString().padStart(2,'0')
}

export async function request_company(full_code:string, isSimple:number, options:{start_date:Date, end_date:Date}={start_date:new Date(1990,1,1), end_date:new Date(2100,1,1)}){
    const params = new URLSearchParams();
    let data = {
        'bld': 'dbms/MDC/STAT/issue/MDCSTAT23902',
        'isuCd': full_code,
        'isuCd2': '',
        'strtDd': dd_format(options.start_date),
        'endDd': dd_format(options.end_date),
        'share': '1',
        'money': '1',
        'csvxls_isNo': 'false',
    }
    Object.keys(data).map(key=>params.append(key, (data as any)[key]))
    const _data = (await requests.post('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', params)).data
    if (isSimple){
        _data['output'] = _data['output'].map((item)=>{return simpleModelKeys.reduce((prev, current)=>{prev.push(item[current]); return prev},[])})
    }
    return _data
}