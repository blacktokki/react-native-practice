import requests from 'axios'
//import electron from 'electron'
const headers = {'User-Agent': 'Chrome/78.0.3904.87 Safari/537.36',}

// const filter:electron.Filter = {
//     urls: ['http://data.krx.co.kr/*']
//   };
// const session = electron.remote.session
// session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
//     details.requestHeaders['Origin'] = null;
//     details.headers['Origin'] = null;
//     callback({ requestHeaders: details.requestHeaders })
// });


export async function request_company_list(){
    return (await requests.post('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', {'bld': 'dbms/comm/finder/finder_stkisu',})).data
}

export async function request_company(full_code:string, options:{start_date:Date, end_date:Date}={start_date:new Date(1990,1,1), end_date:new Date(2100,1,1)}){
    let data = {
        'bld': 'dbms/MDC/STAT/issue/MDCSTAT23902',
        'isuCd': full_code,
        'isuCd2': '',
        'strtDd': options.start_date.getFullYear()+options.start_date.getDate(),
        'endDd': options.end_date.getFullYear()+options.end_date.getDate(),
        'share': '1',
        'money': '1',
        'csvxls_isNo': 'false',
    }
    return (await requests.post('http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd', data, {headers:headers})).data
}