var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    set: function(val) {
      val = val.toString().toLowerCase().split(",");
      var tags = [];
      val.forEach((tag) => {tag.trim(); tags.push(tag)})
      this.setDataValue('tags', tags)
    }
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATEONLY,
    defaultValue: Sequelize.NOW
  }
}, {
  hooks: {
    beforeValidate: function(page) {
      if (page.title) {
      page.urlTitle = page.title.replace(/\s+/g, "_");
    } else {
      page.urlTitle = Math.random().toString(36).substring(2, 7)
    }
    }
  }, getterMethods: {
    route: function(){ return '/wiki/'+ this.urlTitle
  }
  }, classMethods: {
      findByTag: function(tag) {
        return Page.findAll({
          // $overlap matches a set of possibilities
          where: {
              tags: {
                  $overlap: [tag]
              }
            }
        });
      }
  }, instanceMethods: {
      findSimilar: function(){
        return Page.findAll({
          // $overlap matches a set of possibilities
          where: {
              tags: {
                  $overlap: [...this.tags],
              },
              id: {
                $ne: this.id
              }
            }
        });
      }
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
    validate: {isEmail: true}
  }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
