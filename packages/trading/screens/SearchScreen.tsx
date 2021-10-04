import * as React from 'react';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, FlatList, TextInput, Button, ScrollView } from 'react-native';
import {load_stocklist_json, STORAGE_KEY, ddFormat} from '../utils';
import SyncSection, { syncContext } from '../sections/SyncSection';
import Separator from '../components/Separator';

export default function TabSearchScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabSearch'>) {
  const [data, setData] = React.useState<any[]>([])
  const [dataSearch, setDataSearch] = React.useState<any[]>([])
  const [keyword, setKeyword] = React.useState('')
  const [lastDate, setLastDate] = React.useState<Date>(new Date())
  const syncLength = React.useMemo(()=>{
    return [
      data.filter((item)=>(new Date(item['lastDate']) >= lastDate)).length, 
      data.filter((item)=>item['checked']).length,
      data.length
    ]
  }, [lastDate, data])
  const searchRef = React.useRef<NodeJS.Timeout>()
  const renderItem = React.useCallback(({item, index})=>{return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("Detail", {
        screen: 'DetailScreen',
        params: {full_code: item.full_code}
      })}}>
        <Text>[{index + 1}]{item.short_code}:{item.codeName} </Text>
      </TouchableOpacity>
      <Text>({item['lastDate']})</Text>
      <Text style={{color: item['checked'] !== undefined?(item['checked']?'green':'orange'): 'red'}}>◉</Text>
    </View>
  )},[])
  const setLastDateFull = React.useCallback((date:Date) =>{
    setLastDate(date)
    AsyncStorage.setItem(STORAGE_KEY['last_date'], ddFormat(date))
  }, [])
  React.useEffect(()=>{
    console.log('reload finished')
    syncContext.reload_stock = 0
    AsyncStorage.getItem(STORAGE_KEY['last_date']).then((value)=>{
      let date = value?new Date(value):lastDate
      setLastDateFull(date)
      if (data.length == 0){
        load_stocklist_json().then(
          (data_all)=>{
            //limited data
            //data_all.splice(10)
            //console.log(data_all)
            setData(data_all);
          }
        )
        }
        //setData([{full_code:11111},{full_code:11112},{full_code:11113},{full_code:11114},{full_code:11115}])
    })
  },[data])
  const onChangeText = React.useCallback((value)=>{
    setKeyword(value)
    if (searchRef.current)
      clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setDataSearch(value != ''?data.filter((item)=>{return (item.short_code as string).indexOf(value) > -1 || (item.codeName as string).indexOf(value) > -1}):[])
    }, 200);
  }, [data])
  return (
    <ScrollView>
      <TextInput style={{borderColor:'#000', borderWidth: 1, marginVertical: 30}} onChangeText={onChangeText} value={keyword}></TextInput>
      <View style={{flexDirection:'row'}}>
        <Text>Last Date: {ddFormat(lastDate)}</Text>
        <Button title={"down"} onPress={()=>{setLastDateFull(moment(lastDate).add(-1,'day').toDate())}}/>
        <Button title={"up"} onPress={()=>{setLastDateFull(moment(lastDate).add(1,'day').toDate())}}/>
      </View>
      <SyncSection data={data} lastDate={lastDate} setData={setData} setLastDate={setLastDate} context={syncContext}/>
      <Separator/>
      <FlatList
        data={dataSearch}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={item => (item as any).full_code}
        maxToRenderPerBatch={syncContext.sync_lock!=1?200:10}
      />
    </ScrollView>
  )
}
