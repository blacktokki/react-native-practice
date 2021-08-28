import * as React from 'react';
import { StyleSheet, Text, ScrollView, FlatList, TextInput, Button, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import useResizeWindows from  '@react-native-practice/core/hooks/useResizeWindow';
import { CompanyResponse } from '../types';
import { load_stock_json } from '../utils';
import CoinBasePro from '../components/CoinBasePro';

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
            "volume":parseInt(item.ACC_TRDVOL.replace(',', ''))
        }
    }).reverse():[], [data])
    if (fullCode !=  route.params?.full_code){
        load_stock_json(route.params?.full_code).then((_data)=>{
            setFullCode(route.params?.full_code)
            setData(_data)
        })
    }
    return (
    <ScrollView>
        <Text>{fullCode}</Text>
        <CoinBasePro data={CoinData} slice={[-1 -20, -1]} width={window.width}/>
        {/*<Button title={'p'} onPress={()=>{console.log(route)}}></Button>*/}
    </ScrollView>)
}