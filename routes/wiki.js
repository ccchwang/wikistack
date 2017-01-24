const wikiRouter = require('express').Router();
const models = require('../models');

//connect to our db
const Page = models.Page;
const User = models.User;


// GET /wiki
wikiRouter.get('/', function(req, res, next){
  res.redirect('/')
});


//POST /wiki
//on the HTML form, the input with set "name" attributes will become object keys on req.body
wikiRouter.post('/', function(req, res, next){

  //these names come from the HTML form - the 'name' attributes on the <input> were 'title', 'content', etc
  const title = req.body.title;
  const content = req.body.content;
  const name = req.body.name;
  const email = req.body.email;
  const tags = req.body.tags.split(", ")

//in order to create, we need to pass in ALL required fields or else it'll come up as validation error
  User.findOrCreate({
    where: {
      name: name,
      email: email
    }
  })
  .spread((foundUser, createdBool) => {
    return foundUser.id })
  .then((userId) => {
    return Page.create({
      title: title,
      content: content,
      authorId: userId,
      tags: tags
    })
  })
  .then((page)=> res.redirect(page.route))
  .catch(next);

});


//GET /wiki/add
wikiRouter.get('/add', function(req, res, next){
  res.render('addpage');
});


// GET /wiki/:params (needs to go under add, or would add would always get redirected here)
wikiRouter.get('/:title', function(req, res, next){
  var title = req.params.title;
  var foundPage;

  Page.findOne({
    where: {
      urlTitle: title
    }
  })
  .then((page)=> {
    foundPage = page;
    return page.getAuthor()
  })
  .then((author)=> {res.render('wikipage', {page: foundPage, user: author})})
  .catch(next)

});







module.exports = wikiRouter;
