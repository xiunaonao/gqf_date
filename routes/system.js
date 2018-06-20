var express = require('express');
let crypto = require('crypto');
var router = express.Router();

let aesMethod=(token,callback)=>{
  token=token.replace(' ','+')
  let key='ZXSWEDCSFRTGBGFW'
  let iv='8765432176547657'
  var crypted = new Buffer(token, 'base64').toString('binary')

  var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  console.log(decipher)
  var decoded = decipher.update(crypted, 'binary', 'utf8')
  decoded += decipher.final('utf8')
  callback(decoded)
}

/* GET users listing. */
router.get('/getUser', (req, res, next)=>{
  let token=req.query.token.replace(' ','+')
  let user=JSON.parse(decoded)
  aesMethod(token,(decoded)=>{
    res.json({success:0,str:decoded,data:{}})
  })
  
});



module.exports = router;
