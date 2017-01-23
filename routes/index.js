const express = require('express');
const router = express.Router();

module.exports=router;

router.use(express.static('public')) //ask about this later

router.get('/',function(req, res, next){
  res.render('index')
})
