import UtilScreen from './UtilScreen'
import SearchScreen from './SearchScreen'
import DetailScreen from './DetailScreen'
import BackTradeScreen from './BackTradeScreen'
export default {
    SearchScreen:{
        component: SearchScreen,
        title: 'Tab Search Title',
        url: ''
    },
    BackTradeScreen:{
        component:  BackTradeScreen,
        title: 'Tab BackTrade Title',
        url: 'backtrade'
    },
    DetailScreen:{
        component: DetailScreen,
        title: 'Tab Detail Title',
        url: {
            path:'detail/:full_code',
            exact:true,
        },
        params: {full_code: 'asd'}
    },
    UtilScreen:{
        component: UtilScreen,
        title: 'Tab Util Title',
        url: 'util',
        params: {optionStd: 'asd'}
    },
}
