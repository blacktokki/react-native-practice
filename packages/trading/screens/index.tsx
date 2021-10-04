import UtilScreen from './UtilScreen'
import SearchScreen from './SearchScreen'
import DetailScreen from './DetailScreen'
import BackTradeScreen from './BackTradeScreen'
import PortfolioScreen from './PortfolioScreen'
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
    PortfolioScreen:{
        component:  PortfolioScreen,
        title: 'Tab Portfolio Title',
        url: 'portfolio',
        params: {buys: 'asd', sells: 'asd'}
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
    },
}
