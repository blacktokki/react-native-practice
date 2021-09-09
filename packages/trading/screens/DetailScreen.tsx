import * as React from 'react';
import { StyleSheet, Text, ScrollView, FlatList, TextInput, Button, Dimensions, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import useResizeWindows from  '@react-native-practice/core/hooks/useResizeWindow';
import { CompanyResponse } from '../types';
import { load_stock_json } from '../utils';
import CoinBasePro from '../components/ChartContainer';

export default function TabDetailScreen({
    navigation, route
}: StackScreenProps<typeof DrawerParamList, 'TabDetail'>) {
    const [fullCode, setFullCode] = React.useState()
    const [data, setData] = React.useState<CompanyResponse>()
    const window = useResizeWindows()
    const CoinData = React.useMemo(()=>data?data.output.map((item)=>{
        return {
            "date": item.TRD_DD,
            "open":  parseInt(item.TDD_OPNPRC.replace(',', '')),
            "high": parseInt(item.TDD_HGPRC.replace(',', '')),
            "low": parseInt(item.TDD_LWPRC.replace(',', '')),
            "close":parseInt( item.TDD_CLSPRC.replace(',', '')),
            "volume":parseInt(item.ACC_TRDVOL.replace(',', '')),
        }
    }).reverse():[], [data])
    const shortCode = React.useMemo(()=>(fullCode || '').slice(3,9), [fullCode])
    const stockPlusUrl = React.useMemo(()=>'stockplus://viewStock?code=A'+ shortCode + '&tabIndex=0&marketIndex=0', [shortCode])
    if (fullCode !=  route.params?.full_code){
        load_stock_json(route.params?.full_code).then((_data)=>{
            setFullCode(route.params?.full_code)
            setData(_data)
        })
    }
    return (
    <ScrollView>
        <Text>{fullCode}</Text>
        <CoinBasePro data={CoinData} width={window.width}/>
        {Platform.OS == 'android' && shortCode && Linking.canOpenURL(stockPlusUrl)?(
            <Button title={shortCode} onPress={()=>{Linking.openURL(stockPlusUrl)}}></Button>
        ):undefined}
    </ScrollView>)
}