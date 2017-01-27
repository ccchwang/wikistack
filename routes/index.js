const express = require('express');
const router = express.Router();
const wikiRouter = require('./wiki.js');
const userRouter = require('./users.js')
const db = require('../models');
const Page = db.Page;

router.use(express.static('public')) //ask about this later

//mounted wikiRouter at /wiki path
router.use('/wiki', wikiRouter);

//mounted userRouter at /users path
router.use('/users', userRouter);

router.get('/',function(req, res, next){

  Page.findAll({})
    .then((allPages)=> {
      res.render('index', {pages: allPages})
    })
    .catch(next)

});

router.get('/search',function(req, res, next){
  var query = req.query.tag;
  Page.findByTag(query)
    .then((foundPages) => {
      res.render('search', {pages: foundPages, showForm: true})
    })
    .catch(next)
})


module.exports = router;
