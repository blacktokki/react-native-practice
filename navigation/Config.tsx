const Constants:{
    initialRouteName:string,
    repo:string,
    packages: string[],
    rootPath?:string
} = {
    initialRouteName:"TabOne",
    repo:"http://blacktokki.github.io/node-repository",
    packages: ['core']
}
try {
    Object.assign(Constants, require('../packages').default)
}
catch(e){
}
Constants.rootPath = (Constants.repo as string).split('github.io/')[1] //github repository name
export default Constants
