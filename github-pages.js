var ghpages = require('gh-pages');
var copyfiles = require('copyfiles')
var Config = require('./navigation/Config')

copyfiles(['404.html', 'web-build'], {up: true}, function(err){});
ghpages.publish('web-build', { repo: Config.repo } ,function(err) {});