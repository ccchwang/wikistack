const express = require('express');
const router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports=router;

router.use(express.static('public')) //ask about this later

router.get('/search', function(req, res, next){
  if(req.query.tagName){
    var tags =  req.query.tagName.replace(/\s+/g,'').split(',');
    Page.findByTagName(tags).then((results)=>{
      res.render('tagsearch', {showResult: true, pages: results})
    })

  } else {
    res.render('tagsearch')
  }
  ;
})

router.get('/',function(req, res, next){
  Page.findAll()
  .then(function(pages){
    res.render('index', {pages: pages})
  })

})
