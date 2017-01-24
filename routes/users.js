const userRouter = require('express').Router();
const models = require('../models');

//connect to our db
const Page = models.Page;
const User = models.User;





//GET /users
userRouter.get('/', function(req, res, next){

  User.findAll()
    .then((allUsers) =>{
      res.render('userpage', {users: allUsers})
    })
    .catch(next);

});

//GET /users:id
userRouter.get('/:id', function(req, res, next){

  var user = User.findById(req.params.id);
  var page = Page.findAll({
    where: {authorId: req.params.id}
  })

  Promise.all([user, page])
  .then((array) => {
    res.render('singleuser', {user: array[0], pages: array[1]})
  })
  .catch(next)
});


module.exports = userRouter;
