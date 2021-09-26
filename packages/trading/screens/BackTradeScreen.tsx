import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, FlatList, TextInput, Button, ScrollView } from 'react-native';
import ConditionSection from '../sections/ConditionSection';
import BackTradeSyncSection, {backTradeContext, BackTradeResult} from '../sections/BackTradeSyncSection';
import { load_stocklist_json } from '../utils';

function Separator(){
  return <View style={{
    backgroundColor: '#000',
    marginVertical: 30,
    height: 1
  }}/>
}

export default function TabBackTradeScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabBackTrade'>) {
   const [data, setData] = React.useState<any[]>([])
   const [result, setResult] = React.useState< BackTradeResult[]>([]) 
   React.useEffect(()=>{
    console.log('reload finished')
    backTradeContext.reload_stock = 0
    if (data.length == 0){
        load_stocklist_json().then(
          (data_all)=>{
            //limited data
            //data_all.splice(10)
            //console.log(data_all)
            setData(data_all);
        })
    }
  },[data])
  const renderItem = React.useCallback(({item}:{item:BackTradeResult})=>{
    return (<View>
      <Text>{item[0]} cash:{item[1].cash} earn:{item[1].earn}</Text>
      {item[1].stocks.map((v, k)=>(<Text key={k}>{v.stock['full_code']}:{v.stock['codeName']}:{v.candle.close}원:{v.signal}</Text>))}
      {item[1].trades.map((v, k)=>(<Text key={k}>{v}</Text>))}
      {Object.entries<any>(item[1].currentStocks).map((v, k)=>(<Text key={k}>{v[0]}:{v[1][0]}</Text>))}
      <Text>{' '}</Text>
    </View>)
  }, [])
   return (
    <ScrollView>
        <ConditionSection/>
        <BackTradeSyncSection data={data} setData={setData} setResult={setResult} context={backTradeContext}/>
        <Separator/>
        <FlatList
          data={result}
          renderItem={renderItem}
        />
    </ScrollView>
  )
}
