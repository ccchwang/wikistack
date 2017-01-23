const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports=router;

router.use(express.static('public')) //ask about this later

router.get('/',function(req, res, next){
  Page.findAll()
  .then(function(pages){
    console.log(pages)
    res.render('index', {pages: pages})
  })

})
