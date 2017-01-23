const express = require('express');
const wiki = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


module.exports=wiki;

wiki.get('/',function(req, res, next){
  res.redirect("/")
})

wiki.get('/add',function(req, res, next){
  res.render('addpage')
})

wiki.get('/:title',function(req, res, next){
  var title = req.params.title;

  Page.findAll({
    where: {
      urlTitle: title
    }
  }).then(function(result) {
    var page=result[0].dataValues;
    res.render('wikipage', {title: page.title,
      content: page.content})
  }).catch(function(err){
    res.render('error', err)
  });

})

wiki.post('/', function(req, res, next) {

  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`
  var title = req.body.title;
  var content = req.body.content;
  var name = req.body.name;
  var email = req.body.email;

  var page = Page.build({
    title: title,
    content: content,
  });

  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  page.save().then(function(result){
    res.redirect(result.route)
  }).catch(function(err){
    res.render('error', err);
  });
  // -> after save -> res.redirect('/');
});
