import * as React from 'react';
import { Text, View } from '@react-native-practice/core/components/Themed';
import { StyleSheet, TextInput, Button } from 'react-native';
import { Line, Svg } from "react-native-svg";
import { FlatList } from 'react-native-gesture-handler';


type ResultSet = {
    results:{
        std:number,
        ratio:number
    }[],
    risk:number
}

export default function SectionDummy(props:{}){
    const [fixStd, setFixStd] = React.useState('') 
    const [optionStd, setOptionStd] = React.useState('')
    const [optionCount, setOptionCount] = React.useState(0)
    const [size, setSize] = React.useState<{height:number|undefined}>({height:undefined});
    const [results, setResults] = React.useState<ResultSet[]>([])
    const onPress = React.useCallback(()=>{
        let fixSplit = (fixStd.length?fixStd.split(','):[]).map(value=>parseFloat(value))
        let optionSplit = optionStd.length?optionStd.split(','):[]
        if (fixSplit.length + optionSplit.length == 0 || optionCount==0)
            return []
        let optionCountReal = Math.min(optionCount, optionSplit.length)
        let resultSets:ResultSet[] = []
        for(let i=0;i<10000;i++){
            let ratioCount = 0
            let ratios:number[] = []
            for(let j=0;j<fixSplit.length + optionCountReal;j++){
                let r = (1 - ratioCount) * (j==fixSplit.length + optionCountReal -1?1:Math.random())
                ratioCount += r
                ratios.push(r)
            }
            let tmpSplit = optionSplit.map(value=>parseFloat(value))
            let results2 = fixSplit.map((value, index)=>({
                std: value,
                ratio: ratios[index]
            }))
            for(let j=0;j<optionCountReal;j++){
                let idx = Math.floor(Math.random() * tmpSplit.length)
                results2.push({
                    std:tmpSplit[idx],
                    ratio: ratios[j + fixSplit.length]
                })
                tmpSplit.splice(idx, 1);
            }
            resultSets.push({results:results2.sort((a, b)=>a.std > b.std?1:-1), risk:Math.sqrt(results2.reduce((prev, value)=>prev + (value.std * value.std * value.ratio * value.ratio), 0))})
        }
        setResults(resultSets.sort((a, b)=>a.risk > b.risk?1:-1).slice(0, 10))
    }, [fixStd, optionStd, optionCount])
    const renderItem = React.useCallback(({item}:{item:ResultSet})=>{
        return (
        <View style={styles.commonOption}>
            <Text>{item.risk.toFixed(2)} </Text>
            {item.results.map((item2, index2)=>(<Text key={index2}>({item2.std}:{item2.ratio.toFixed(2)}) </Text>))}
        </View>)
    },[])
    return (
    <View style={styles.commonContainer}>
        <View style={styles.commonOption}>
            <Text>고정종목 표준편차</Text>
            <TextInput
                multiline
                onChangeText={setFixStd}
                value={fixStd}
                style={[styles.commonText, {height:size.height}]}
                onContentSizeChange={(e)=>{setSize(e.nativeEvent.contentSize)}}
            />
        </View>
        <View style={styles.commonOption}>
            <Text>선택종목 표준편차</Text>
            <TextInput
                multiline
                onChangeText={setOptionStd}
                value={optionStd}
                style={[styles.commonText, {height:size.height}]}
                onContentSizeChange={(e)=>{setSize(e.nativeEvent.contentSize)}}
            />
        </View>
        <View style={styles.commonOption}>
            <Text>선택수</Text>
            <TextInput
                multiline
                onChangeText={(value)=>{setOptionCount(parseInt(value)|| 0)}}
                value={optionCount.toString()}
                style={[styles.commonText, {height:size.height}]}
                onContentSizeChange={(e)=>{setSize(e.nativeEvent.contentSize)}}
            />
        </View>
        <Button title={'execute'} onPress={onPress}/>
        <View style={styles.commonOption}>
            <FlatList
                data={results}
                renderItem={renderItem}
            />
        </View>
  </View>
    )
}

const styles = StyleSheet.create({
    commonContainer: {
        minWidth: 400,
        alignItems: 'center',
        marginHorizontal: 50,
      },
      commonOption: {
        flexDirection:'row'
      },
      commonText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
      }
  });
