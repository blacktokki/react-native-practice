import UtilScreen from './UtilScreen'
import SearchScreen from './SearchScreen'
import DetailScreen from './DetailScreen'
import AdvancedScreen from './AdvancedScreen'
export default {
    SearchScreen:{
        component: SearchScreen,
        title: 'Tab Search Title',
        url: ''
    },
    AdvancedScreen:{
        component:  AdvancedScreen,
        title: 'Tab Advanced Search Title',
        url: 'advanced'
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
        url: 'util'
    },
}
