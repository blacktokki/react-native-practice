import * as React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CompanyInfoBlock, CompanyInfoHold } from "../types";
import { FronTierPrice } from './FrontierSection';

type SectionParamList = {
    style?:ViewStyle
    items:(CompanyInfoHold | CompanyInfoBlock)[],  
    mode:'buys'|'sells', 
    setCompanyMode:(mode:'buys'|'sells')=>void,
    setCompanyCode:(code:string)=>void,
    setCompanyPrice:(price:number)=>void,
    priceRecord:Record<string, FronTierPrice>
}

export default React.memo(({style, items, mode, setCompanyMode, setCompanyCode, setCompanyPrice, priceRecord}:SectionParamList)=>{
    return <View style={style}>
        {items.map((item, index)=>{
            const _item = (item as CompanyInfoHold)
            return <TouchableOpacity key={index} onPress={()=>{setCompanyMode(mode);setCompanyCode(item.full_code);setCompanyPrice(priceRecord[item.full_code].price)}}>
                <Text>{item.full_code}:{item.codeName}:{priceRecord[item.full_code].price}원 {_item.price?`(${_item.price}원)`:''}</Text>
                {_item.count && _item.price?<Text>{_item.count}주 {priceRecord[item.full_code].price * _item.count}원 ({_item.price * _item.count}원)</Text>:undefined}
            </TouchableOpacity>
        })}
    </View>
})