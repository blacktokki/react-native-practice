import { ComponentType } from "react"

const Constants:{
    initialRouteName?:string,
    notFoundScreen:{
        component: ComponentType<any>,
        title: string,
    },
    rootPath: string,  //github repository name,
} = {
    initialRouteName:undefined,
    notFoundScreen: require('../screens').default.NotFoundScreen,
    rootPath: '/react-native-practice',
}
export default Constants