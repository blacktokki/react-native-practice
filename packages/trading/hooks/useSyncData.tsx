// import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import moment from 'moment'
import { View, Text } from 'react-native';
import { load_stock, syncContext, LOAD_BULK_COUNT } from '../sections/SyncSection';
import { CompanyInfoBlock } from '../types';
import { load_stocklist_json } from '../utils';

export default function useSyncData() {
  const [isSyncComplete, setSyncComplete] = React.useState(false);
  const [data, setData] = React.useState<CompanyInfoBlock[]>([])
  React.useEffect(() => {
    load_stocklist_json().then(
      (data_all)=>{
        setData(data_all);
        load_stock(data_all, new Date(), setData, 1, syncContext).then(()=>{
          setSyncComplete(true);
        })
      }
    )
  }, []);
  React.useEffect(()=>{
    console.log('reload finished')
    syncContext.reload_stock = 0
  }, [data])
  const syncRender = React.useMemo(()=>{
    const syncLength = [
      data.filter((item)=>item.checked).length,
      data.length
    ]
    return (<View style={{left:'50%', top:'50%', alignContent:'center'}}>
      <Text>({syncContext.bulk_count == LOAD_BULK_COUNT?syncLength[0]:'-'}/{syncLength[1]})</Text>
    </View>)
  }, [data])
  return [isSyncComplete, syncRender];
}
