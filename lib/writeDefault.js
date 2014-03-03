var spawn = require('child_process').spawn;
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var is = require('is-js');

function addValueToArgs(value, args){
  if(is.string(value)){
    args.push('-string');
    args.push(value);
  } else if(is.array(value)) {
    args.push('-array');
    if(value.length > 0) {
      args.push(value);
    }
  } else if(is.number(value)) {
    args.push('-int');
    args.push(value);
  } else if(is.bool(value)) {
    args.push('-bool');
    args.push(value ? 'TRUE' : 'FALSE');
  } else {
    console.log('WARN unable to convert: ', value);
  }
}

module.exports = function(domain, key, value, callback){
  var args = ['write', domain, key];
  addValueToArgs(value, args);
  console.log(args);

  var defaults = spawn('defaults', args);

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