import { MIN_TRDVAL, TRDVAL_DAYS, load_stocklist_json, is_index_stock, load_stock_json, trdval_filter, Jdata, sleep} from '../utils';

const MAX_LOAD_STOCK = 4
let current_load_stock = 0

export default async function(start_date:Date= new Date(), end_date:Date= new Date(), trdval_days:number=TRDVAL_DAYS, min_trdval:number=MIN_TRDVAL, exclude_index:number){
    let data_all = await load_stocklist_json()
    let cnt = 0
    let status = [0, 0, 0, 0]
    console.log('len: ', data_all.length)
    for (const [i, d] of data_all.entries()){
        if (exclude_index && is_index_stock(d['codeName']))
            continue
        let full_code = d['full_code']
        while (current_load_stock >= MAX_LOAD_STOCK){
            await sleep(200)
            console.log(current_load_stock, '/', MAX_LOAD_STOCK)
        }
        current_load_stock += 1
        load_stock_json(full_code, {start_date:start_date, end_date:end_date, log_datetime:1}).then((j2:Jdata)=>{
            status[j2['_status']] += 1
            if (j2['_status'] == 0){
                console.log(i, d)
                console.log(j2['output'].length?j2['output'][0] : null)
            }
            else{
                console.log(i, d['codeName'])
                //print(j2['_status'], j2['output'][0]['TRD_DD']  if len(j2['output']) else None, datetime.strptime(j2['CURRENT_DATETIME'], '%Y.%m.%d %p %I:%M:%S').date())
            }
            if (trdval_filter(j2, trdval_days, min_trdval))
                cnt+=1
                current_load_stock -= 1
        })
    }
    console.log(status, cnt)
}