import { ComponentType } from "react"

const Constants:{
    initialRouteName?:string,
    packages: Record<string, {
        component: ComponentType<any>,
        title: string,
        url: string
    }>[],
    notFoundScreen:string,
    rootPath: string,  //github repository name,
} = {
    initialRouteName:undefined,
    packages: [],
    notFoundScreen:'../screens',
    rootPath: '/react-native-practice',
}
export default Constants