var spawn = require('child_process').spawn;
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

module.exports = function(domain, key, value, callback){
  var defaults = spawn('defaults', ['write', domain, key, value]);

  defaults.stdout.on('data', function(data){
    console.log(decoder.write(data).replace('\n', ''));
  });
  
  defaults.on('close', function(code){
    if(code === 0){
      callback();
    } else {
      var message = 'Unable to set "' +
        key + '" on domain: ' + domain +
        ' to "' + value + '. Exit code was: ' + code;
      callback(new Error(message));
    }
    
  });
};