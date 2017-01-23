const express = require('express');
const users = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports=users;

users.get('/',function(req, res, next){
  User.findAll({})
  .then(function(users){
    console.log(users)
    res.render('users', {users: users})
  }).catch(next);
})

users.get('/:id',function(req, res, next){
  var userPromise = User.findById(req.params.id)
  var pagePromise = Page.findAll({
    where: {authorId:req.params.id}
  })
  Promise.all([userPromise,pagePromise]).then(function(resultArr){
    res.render('userpage', {author: resultArr[0], pages: resultArr[1]})
  })
})
