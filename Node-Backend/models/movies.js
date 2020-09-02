"use strict";
module.exports = (sequelize, DataTypes) => {
  const Movies = sequelize.define(
    "Movies",
    {
        movieId: {
	        allowNull: false,
	        primaryKey: true,
	        type: DataTypes.STRING
	      },
      title: DataTypes.STRING,
      year: DataTypes.INTEGER,
      code: DataTypes.STRING(20),
      duration: DataTypes.INTEGER,
      genres: DataTypes.JSON,
      studio: DataTypes.STRING,
      budget: DataTypes.DOUBLE,
      result: DataTypes.DOUBLE,
      date : DataTypes.DATEONLY,
      catData: DataTypes.ENUM('12xx', '65xx'),
      catML: DataTypes.ENUM('TR', 'TST', 'VAL'),
      crew : DataTypes.JSON,
      actors: DataTypes.JSON
    },
    {
        indexes: [
            {
                unique: false,
                fields: ['studio']
            }, 
            {
                unique: false,
                fields: ['code']
            },
            {
                unique: false,
                fields: ['catData', 'catML']
            }
        ]
    }
  );

  Movies.associate = function (models) {
    Movies.hasMany(models.LinkPersons, {
      foreignKey: "movieId",
      as: "linkPerson",
    });
    Movies.hasMany(models.LinkGenres, {
        foreignKey: "movieId",
        as: "linkGenre",
      })
    }
  
  
  return Movies;
};
