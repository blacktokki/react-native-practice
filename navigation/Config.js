const Constants = {
    initialRouteName:"TabOne",
    repo:"https://github.com/blacktokki/react-native-practice.git",
    packages: ['core'],
    rootPath: '/react-native-practice'  //github repository name
}
try {
    Object.assign(Constants, require('../packages').default)
}
catch(e){
}
module.exports = Constants