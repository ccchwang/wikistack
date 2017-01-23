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

wiki.get('/:url/similar',function(req, res, next){
  Page.findOne({
    where: {
      urlTitle:req.params.url
    }
  }).then((page)=>{
    return page.findSimilar();
  }).then((result)=>{
    res.render('index', {pages: result})
  })
})

wiki.get('/:title',function(req, res, next){
  var title = req.params.title;
  var page;
  Page.findOne({
    where: {
      urlTitle: title
    },
    include: [
      {model: User, as: 'author'}
    ]
  }).then(function(page) {
    if (page===null){
      res.status(404).send();
    } else{
      res.render('wikipage', {page:page})
    }
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
  var tags= req.body.tags.replace(/\s+/g,'').split(',');
  var user,page;
  console.log(tags)
  User.findOrCreate({
    where: {
      name: name,
      email: email}
  }).then(function(result){
    console.log("Result:", result)
    user = result[0]
    console.log(user)

    page = Page.build({
      title: title,
      content: content,
      tags: tags
    })

    return page.save().then(function(page){
      return page.setAuthor(user);
    });
  }).then(function(page){
    res.redirect(page.route)
  }).catch(function(err){
    res.render('error', err);
  });

  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  // -> after save -> res.redirect('/');
});
