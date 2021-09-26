import axios from 'axios'

export async function request_company_list(){
    const params = new URLSearchParams();
    params.append('bld', 'dbms/comm/finder/finder_stkisu');
    return (await axios.post('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', params)).data
}

function dd_format(date:Date){//defferent ddFormat!
    return date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2,'0') + date.getDate().toString().padStart(2,'0')
}

const MAX_REQUESTS_COUNT = 4
const INTERVAL_MS = 500
let PENDING_REQUESTS = 0
const companyApi = axios.create({})
companyApi.interceptors.request.use(function (config) {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
          PENDING_REQUESTS++
          clearInterval(interval)
          setTimeout(()=>{PENDING_REQUESTS--}, INTERVAL_MS)
          resolve(config)
        } 
      }, INTERVAL_MS)
    })
  })

export async function request_company(full_code:string, options:{start_date:Date, end_date:Date}={start_date:new Date(1990,1,1), end_date:new Date(2100,1,1)}){
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
    const _data = (await companyApi.post('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', params)).data
    /* ADJ_CLSPRC
    let _data2 = ((await axios.get('https://fchart.stock.naver.com/sise.nhn?timeframe=day&count=6000&requestType=0&symbol=' + full_code.slice(3, 9))).data as string).match(/<item data=\"(.*?)\" \/>/gi)?.reduce((prev, value)=>{
      const d = value.replace(/(<item data=\"|\" \/>)/gi, '').split('|')
      prev[d[0]] = d
      return prev
    }, {} as any)
    if(_data2)(_data['output'] as any[]).forEach((value)=>{
        value['ADJ_CLSPRC'] = _data2[dd_format(new Date(value['TRD_DD']))][4]
    })
    _data2 = null
    */
    return _data
}