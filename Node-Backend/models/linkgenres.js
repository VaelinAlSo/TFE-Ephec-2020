"use strict";
module.exports = (sequelize, DataTypes) => {
  const LinkGenres = sequelize.define(
    "LinkGenres",
    {
      movieId: DataTypes.STRING,
      genre: DataTypes.STRING(15)
    },
    {
        indexes: [
            {
                unique: false,
                fields: ['genre']
            }
        ]
    }
  );
  LinkGenres.associate = function (models) {
    LinkGenres.belongsTo(models.Movies, {
      foreignKey: "movieId",
      onDelete: "CASCADE",
    });
  };
  return LinkGenres;
};
