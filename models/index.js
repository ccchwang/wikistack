var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  getterMethods :{
    route: function(){ return '/wiki/'+ this.getDataValue('urlTitle');}
  }
});

Page.hook('beforeValidate', function(page, options){
    if (page.title) {
      page.urlTitle = page.title.replace(/[^a-zA-z0-9]/g,"_")
    } else {
      page.urlTitle = Math.random().toString(36).substring(2, 7)
    }
})

var User = db.define('user', {
  name: {
    type:Sequelize.STRING,
    allowNull: false
  },
  email: {
    type:Sequelize.STRING,
    allowNull: false,
    isEmail: true
  }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
