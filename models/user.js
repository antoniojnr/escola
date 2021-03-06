module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
    },
    password: { type: DataTypes.STRING, allowNull: false }
  });

  User.associate = function(models) {
    User.hasMany(models.Pokemon, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }

  return User;
}