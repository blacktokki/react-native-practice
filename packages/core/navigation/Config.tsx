console.log(require.main)
const Constants:{
    initialRouteName?:string,
    packages: string[],
    notFoundScreen:string,
    rootPath: string,  //github repository name,
} = {
    initialRouteName:undefined,
    packages: [],
    notFoundScreen:'../screens',
    rootPath: '/react-native-practice',
}
export default Constants