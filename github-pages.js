var spawn = require('cross-spawn');
var ghpages = require('gh-pages');
var copyfiles = require('copyfiles')
var Config = require('./navigation/Config')

spawn.sync('cross-env', ['WEB_PUBLIC_URL='+ Config.rootPath, 'expo', 'build:web'], { stdio: 'inherit' })
copyfiles(['404.html', 'web-build'], {up: true}, function(){
    ghpages.publish('web-build', { repo: Config.repo } ,function(err) {console.log('finished')});
});
