const csv = require('csv-parser')
const fs = require('fs')

const Movie = require("../../models").Movies;
const LinkGenre = require("../../models").LinkGenres;
const Person = require("../../models").Persons;
const LinkPerson = require("../../models").LinkPersons;

const db = require("../../models");

const { transaction, Op, QueryTypes } = require('sequelize');

function parseCrewOrActors(valuesStr) {
    result = []
    if (valueStr != null) {
        try {
            const personsWithRole = valuesStr.split('|');
            personsWithRole.forEach(element => {
                const splPersonRole = element.split(':');
                const item = {
                    'personName': (splPersonRole[0] ? splPersonRole[0].trim() : '???'),
                    'role': (splPersonRole[1] ? splPersonRole[1].trim() : '???')
                }
                result.push(item)
            });
        } catch (error) {
            console.log('parseCrewOrActors problem on :' + valuesStr)
        }
    }

    return result
}

function parseGenres(valuesStr) {
    result = []
    const valuesArr = valuesStr.split(' ');
    valuesArr.forEach(element => {
        result.push(element)
    });
    return result
}

async function createMovies_26xxx(fileCSV, req, res) {

    db.sequelize.options.logging = false

    fs.createReadStream(req.body.dirCSV + '/' + fileCSV)
        .pipe(csv())
        .on('data', (data) => {
            let crewJson = (data.Crew ? parseCrewOrActors(data.Crew) : [])
            let actorsJson = (data.Actors ? parseCrewOrActors(data.Actors) : [])

            let personsAndRoles = crewJson.concat(actorsJson)

            let genresArr = parseGenres(data.Genres)

            db.sequelize.transaction(function (t) {
                var promises = []

                var newMoviePromise = Movie.create(
                    {
                        movieId: data.ID,
                        title: data.Title,
                        year: data.Year,
                        code: (data.Codes == 'null' ? null : data.Codes),
                        duration: (data.LengthMin == 0 ? null : data.LengthMin),
                        genres: genresArr,
                        studio: (data.BuStudiodget == 'null' ? null : data.Studio),
                        budget: (data.Budget == 'null' ? null : data.Budget),
                        result: data.BoxOfficeRes,
                        date: data.DateOutput,
                        //  catData: DataTypes.ENUM('12xx', '65xx'),
                        //  catML: DataTypes.ENUM('TR', 'TST', 'VAL'),
                        crew: crewJson,
                        actors: actorsJson
                    }, { transaction: t }
                )

                promises.push(newMoviePromise)

                genresArr.forEach(genreVal => {
                    var newLinkGenreProm = LinkGenre.create(
                        {
                            movieId: data.ID,
                            genre: genreVal
                        }, { transaction: t }
                    )
                    promises.push(newLinkGenreProm)
                })
                // console.log('promises-level1', promises)

                return Promise.all(promises)
                    .then(
                        function () {
                            var personPromises = [];

                            personsAndRoles.forEach(personAndRole => {
                                var newOrExistPersonProm = Person.upsert(
                                    {
                                        name: personAndRole.personName
                                    }, { returning: true, transaction: t })
                                personPromises.push(newOrExistPersonProm)
                            });
                            return Promise.all(personPromises)
                                //   upsert seems to be agile to treat new and pre-existing data : it was indeed the goal
                                //    .catch(function(err) {
                                //        // error is possible because Person can pre-exist from a previous movie
                                //        console.log('A promise failed to execute', err);
                                //    })
                                .then(function () {
                                    var personRolesPromises = [];
                                    personsAndRoles.forEach(personAndRole => {

                                        // console.log('personAndRole', personAndRole, 'movieId', data.ID, 'personName', personAndRole.personName, 'role', personAndRole.role)
                                        // insert into where 
                                        var personRolesProm = db.sequelize.query(
                                            "INSERT INTO linkpersons (movieId, role, personId, createdAt, updatedAt)" +
                                            " SELECT $movieId , $role  , T1.personId , T1.createdAt, T1.updatedAt "
                                            + " FROM persons T1 WHERE T1.name = $personName ",
                                            {
                                                bind: { movieId: data.ID, role: personAndRole.role, personName: personAndRole.personName },
                                                // A function (or false) for logging your queries
                                                // Will get called for every SQL query that gets sent
                                                // to the server.
                                                logging: false,
                                                plain: true,
                                                raw: true,
                                                type: QueryTypes.INSERT,
                                                //type: QueryTypes.SELECT ,
                                                transaction: t
                                            });
                                        personRolesPromises.push(personRolesProm);
                                    })
                                    //var commDB_GO = t.commit
                                    // personRolesPromises.push(commDB_GO)
                                    return Promise.all(personRolesPromises);
                                });
                        })
                    .then(function (result) {
                        console.log("movie done " + data.ID);
                        setTimeout(goToNextMovie, 777);
                    })
                    .catch(function (err) {
                        console.log("error on 1 movie " + data.ID + ' ' + err);
                        setTimeout(goToNextMovie, 3000);
                    })
            })
        })
        .on('end', () => {
            //console.log(results);
            console.log("eof")
            res.status(200).json({ "status": "rows loaded" });
            // db.sequelize.options.logging = true
        });

}

function goToNextMovie() {
    // all the stuff you want to happen after that pause
    // do nothing
    // console.log("go to next movie")
}



module.exports = {
    async upload(req, res) {

        const fileCSV = req.body.fileCSV
        const uploadMode = req.body.uploadMode

        console.log('fileCSV', fileCSV)
        console.log('uploadMode', uploadMode)

        if (uploadMode == '1!') {
            res.status(200).json({ "status": "for testing : empty block now" });
        } else if (uploadMode == '26xxx') {
            return createMovies_26xxx(fileCSV, req, res)
        }

    }
}