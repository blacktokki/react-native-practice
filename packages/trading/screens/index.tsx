import MainScreen from './MainScreen'
import SearchScreen from './SearchScreen'
import DetailScreen from './DetailScreen'
import PortFolioScreen from './PortFolioScreen'
export default {
    SearchScreen:{
        component: SearchScreen,
        title: 'Tab Search Title',
        url: ''
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
    PortFolioScreen:{
        component: PortFolioScreen,
        title: 'Tab PortFolio Title',
        url: 'portfolio'
    },
    MainScreen:{
        component: MainScreen,
        title: 'Tab Main Title',
        url: 'main'
    },
}
