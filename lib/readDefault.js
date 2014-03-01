var spawn = require('child_process').spawn;
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

module.exports = function(domain, key, callback){
  var defaults = spawn('defaults', ['read', domain, key]);

  var result = '';
  defaults.stdout.on('data', function(data){
    result += decoder.write(data);
  });
  defaults.on('close', function(code){
    if(code === 0){
      callback(null, result);
    } else {
      var message = 'Unable to get "' +
        key + '" on domain: ' + domain +
        '. Exit code was: ' + code;
      callback(new Error(message));
    }
  });
};