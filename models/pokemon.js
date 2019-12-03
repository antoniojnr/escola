module.exports = function(sequelize, DataTypes) {
  var Pokemon = sequelize.define('Pokemon', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: DataTypes.INTEGER
  });

  Pokemon.associate = function(models) {
    Pokemon.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  }

  return Pokemon;
}