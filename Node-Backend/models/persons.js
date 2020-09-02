"use strict";
module.exports = (sequelize, DataTypes) => {
    const Persons = sequelize.define(
        "Persons",
        {
            personId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['name']
                }
            ]
        }
    );

    Persons.associate = function (models) {
        Persons.hasMany(models.LinkPersons, {
            foreignKey: "personId",
            as: "linkPerson",
        })
    }

    return Persons;
};
