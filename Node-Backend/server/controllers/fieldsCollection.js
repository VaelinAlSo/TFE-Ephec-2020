const LinkGenre = require("../../models").LinkGenres;
const Movie = require("../../models").Movies;
const db = require("../../models");


const { QueryTypes, sequelize, Op, literal } = require('sequelize');

module.exports = {

    getGenres(req, res) {
        return LinkGenre.aggregate(
            'genre', 'DISTINCT',
            {
                plain: false, order: literal('1'),
                /*  no  catData on LinkGenres !
                where: {
                    catData: '12xx'
                }
                */
            })
            .then(
                (msg) => {
                    // console.log(msg)
                    let simpleGenres = msg.map(g => {
                        return g.DISTINCT;
                    });
                    // console.log(simpleGenres)
                    res.status(200).send(simpleGenres)
                })
            .catch((error) => res.status(400).send(error))
    },

    getCodes(req, res) {
        return Movie.aggregate(
            'code', 'DISTINCT', 
            { 
                plain: false, order: literal('1') ,
                where: {
                    catData: '12xx',
                    code: {
                        [Op.ne]: null
                      }
                }
            })
            .then(
                (msg) => {
                    // console.log(msg)
                    let simpleCodes = msg.map(c => {
                        return c.DISTINCT;
                    });
                    // console.log(simpleGenres)
                    res.status(200).send(simpleCodes)
                })
            .catch((error) => res.status(400).send(error))
    },

    getStudios(req, res) {
        return Movie.aggregate(
            'studio', 'DISTINCT', 
            { 
                plain: false, order: literal('1'),
                where: {
                    catData: '12xx'
                }
            })
            .then(
                (msg) => {
                    // console.log(msg)
                    let simpleStudios = msg.map(s => {
                        return s.DISTINCT;
                    });
                    // console.log(simpleGenres)
                    res.status(200).send(simpleStudios)
                })
            .catch((error) => res.status(400).send(error))
    },

};
