const symlinkDir = require('symlink-dir')
var Config = require('./config')
var keys = Object.keys(Config.link)

function linkAll(i){
    var key = keys[i]
    var link = Config.link[key]
    symlinkDir('packages/' + link,'packages/' + key)
    .then(result => {
        console.log(result)
        if (i+1 < keys.length)
            return linkAll(i + 1)
    }).catch(err => console.error(err))
}

linkAll(0)