const LinkGenre = require("../../models").LinkGenres;
const Movie = require("../../models").Movies;
const db = require("../../models");


const staticArrayGenres = ["Action", "Adult", "Adventure", "Animation", "Biography", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Musical", "Mystery",
    "News", "null", "Reality-TV", "Romance", "Sci-Fi", "Sport", "Talk-Show", "Thriller", "War", "Western"]

function getArrayGenres(genres) {
   // console.log('genres', genres)
    let result = []
    staticArrayGenres.forEach(staticGenre => {
        let genreYN = {
            genre: staticGenre,
            value: (genres.indexOf(staticGenre) == -1 ? 0 : 1)
        }
        result.push(genreYN)
    })
    //console.log('result getArrayGenres', result)
    return result
}


function getArrayPersons(crewAndActors, focussedPersons) {
    //console.log('crewAndActors', crewAndActors)
    //console.log('focussedPersons', focussedPersons)

    let result = []
    focussedPersons.forEach(person => {
        let personYN = {
            pPersonId: 'p' + person.personId,
            value: (crewAndActors.indexOf(person.name) == -1 ? 0 : 1)
        }
        result.push(personYN)
    })
    // console.log('result getArrayPersons', result)
    return result

}


const { QueryTypes, sequelize, Op, literal } = require('sequelize');

module.exports = {

    getPersons(req, res) {

        db.sequelize.query(
            "select distinct(P.name) from persons P "
            + "where  P.personId in "   //  P.name like 'Brad%' and
            + "   (select LP.personId from linkpersons LP , movies M where LP.movieId = M.movieId and catData = '12xx')",
            { type: QueryTypes.SELECT })
            .then(persons => {
                // We don't need spread here, since only the results will be returned for select queries
                //   console.log(persons)

                let simplePersons = persons.map(p => {
                    return p.name;
                });

                res.status(200).send(simplePersons)
            }).catch((error) => res.status(400).send(error))
    },


    createFileOnTheFly(req, res) {

        let focussedPersons = [
            { personId: 16948, name: 'Hans Zimmer' },
            { personId: 23019, name: 'Christopher Nolan' },
            { personId: 31414, name: 'Joseph Gordon-Levitt' },
            { personId: 32599, name: 'Leonardo DiCaprio' },
            { personId: 40968, name: 'Ellen Page' }
        ]

        db.sequelize.query(
            "SELECT * FROM movies "
            + " WHERE catData = '12xx' and movieId <>  'tt1375666' and movieId  IN  "
            + "  (select movieId from LinkPersons WHERE personId in ( 23019, 40968 , 16948, 31414, 32599)) ",
            { type: QueryTypes.SELECT })
            .then(movies => {
                let cvsLines = movies.map(m => {
                    //console.log('movie m', m)

                    let arrayGenres = getArrayGenres(m.genres)
                    let crewAndActorsColl = m.crew.concat(m.actors)
                    let crewAndActorsArrStr = crewAndActorsColl.map(p => p.personName)
                    let arrayPersons = getArrayPersons(crewAndActorsArrStr, focussedPersons)

                    let csvLine = {
                        'year': m.year,
                        'code': m.code,
                        'duration': m.duration,
                        'studio': m.studio,
                        'budget': m.budget,
                        'budgetLog': Math.log10(m.budget),
                        'resultLog': Math.log10(m.result)
                    }
                   // console.log('csvLine t0', csvLine)
                   // console.log('arrayGenres', arrayGenres)
                   let trailLogLine = ""
                    arrayGenres.forEach(genreYN => 
                        {
                            csvLine[genreYN.genre] = genreYN.value ;
                            trailLogLine += ';'+genreYN.value
                        });
                    // console.log('csvLine t1', csvLine)
                    arrayPersons.forEach(personYN => 
                        {
                            csvLine[personYN.pPersonId] = personYN.value
                            trailLogLine += ';'+personYN.value
                        });
                    // console.log('csvLine t2', csvLine)
                    console.log(csvLine.year+';'+csvLine.code+';'+csvLine.duration+';'+csvLine.studio+';'+csvLine.budget+';'+csvLine.budgetLog+';'+csvLine.resultLog+trailLogLine)
                    return csvLine;
                });

                res.status(200).send(cvsLines)
            }).catch((error) => res.status(400).send(error))
    }
};
