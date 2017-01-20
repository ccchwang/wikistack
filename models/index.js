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
  // route: {
  //   get: function(){
  //     var url=this.getDataValue('urlTitle');
  //     return '/wiki/' + url;
  //   }
  // },
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
});

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
}, {
  getterMethods :{
    route: function(){ return '/wiki/'+ this.getDataValue('urlTitle');}
  }
});

module.exports = {
  Page: Page,
  User: User
};
