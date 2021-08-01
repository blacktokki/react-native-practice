const Constants = {
    initialRouteName:"TabOne",
    repo:"https://github.com/blacktokki/react-native-practice.git",
    packages: ['core'],
    rootPath: '/react-native-practice',  //github repository name
    link: {
        '.not-found': 'not-found'
    },
}
try {
    Object.assign(Constants, require('../packages').default)
}
catch(e){
}
module.exports = Constants