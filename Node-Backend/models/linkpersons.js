"use strict";
module.exports = (sequelize, DataTypes) => {
  const LinkPersons = sequelize.define(
    "LinkPersons",
    {
      movieId: DataTypes.STRING,
      personId: DataTypes.INTEGER,
      role: DataTypes.STRING
    },
    {}
  );
  LinkPersons.associate = function (models) {
    LinkPersons.belongsTo(models.Movies, {
      foreignKey: "movieId",
      onDelete: "CASCADE",
    })
    LinkPersons.belongsTo(models.Persons, {
        foreignKey: "personId",
        onDelete: "CASCADE",
      })
    ;
  };
  return LinkPersons;
};
