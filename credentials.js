const fs = require('fs');
module.exports = {
  //key: null,
  //cert: null
  key: fs.readFileSync('./certificate/private.pem', 'utf8'),
  cert: fs.readFileSync('./certificate/ca.cer', 'utf8')
};
