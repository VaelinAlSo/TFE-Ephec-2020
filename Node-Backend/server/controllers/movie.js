const Movie = require("../../models").Movies;
const db = require("../../models");



function getGenresForSQL(genresArr) {

    let result = []
    genresArr.forEach(genre => {
        result.push( "'" + genre + "'")
    })
    let resultStr = result.join(",")
    console.log('result getGenresForSQL', resultStr)
    return resultStr
}


const { QueryTypes, sequelize, Op, literal } = require('sequelize');

module.exports = {

    getMovies(req,res) {
        Movie.findAll({
            where: {
                catData: '12xx',
                [Op.not]: [  { catML: 'TR' }]
            },
            attributes: {exclude: ['crew', 'actors', 'createdAt', 'updatedAt', 'result']},
            order: literal('year DESC')
        })
        .then((movies) => res.status(200).send(movies))
        .catch((error) => res.status(400).send(error));
    },


    getMovieResult(req, res) {
        // {"Year":"2020","Duration2":120,"DurationPatched":"0","Budget":"1000000","Genres":"","Code":"G","Studio":"A24"}
        budget = req.body.Budget
        year = req.body.Year
        duration = req.body.Duration2

        code = req.body.Code
        studio = req.body.Studio

        genresArr = req.body.Genres.split(' ')
        genresArrLength = genresArr.length
        genresArrForSql = getGenresForSQL(genresArr)
        /*
        select result from movies
        where budget = 40000000 and code = 'PG' 
        and studio = 'Sony Pictures Releasing' and duration = 140
        and year = 2010 
        and movieId in 
        (select distinct(movieId) from linkgenres
        where genre in ('Action', 'Drama', 'Family', 'Sport')
        group by movieId
        having count(*) = 4);
        */

        db.sequelize.query(
            "select M.result, M.catML from Movies M "
            + "where  M.budget = " +  budget + " and M.code = '" + code + "'"  
            + " and M.studio = '" + studio + "' and M.duration = " + duration
            + " and M.year = " + year + " and M.movieId in "
            + " (select distinct(movieId) from linkgenres LG1"
            + " where LG1.genre in ("+ genresArrForSql + ")"
            + " group by LG1.movieId having count(*) =" + genresArrLength + ")"
            + " and "+ genresArrLength + "= (select count(*) from linkgenres LG2 where LG2.movieId = M.movieId)",
            { type: QueryTypes.SELECT })
            .then(results => {
                // We don't need spread here, since only the results will be returned for select queries
                
                // potentially multiple result, but high likely only 1

                console.log(results)
               
                let resultLikePredicts = results.map(row => {

                    let resultLikePredict = {
                        'algo' : 'real BoxOffice',
                        'catData' : row.catML,
                        'value' : row.result,
                        'valueLog' : Math.log(row.result),
                    }
                    return resultLikePredict;
                });
                

                res.status(200).send(resultLikePredicts)
            }).catch((error) => res.status(400).send(error))
    },

};
