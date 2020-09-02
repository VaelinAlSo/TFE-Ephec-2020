const axios = require("axios");
var instanceRetry = axios.create();


function getML_URL(req) {
//    if (req.secure) {
        return 'http://q251bla.pythonanywhere.com/'

/*    } else {
        return 'http://localhost:5000/'
    }
    */
}

/*
axios2.interceptors.response.use(req => req, res=> res, (error) => {
    if (res.status === 500) {
        console.log("error axios2", error)
        throw error
    }

    return Promise.reject(error);
});
*/

instanceRetry.interceptors.response.use(
    async (response) => {
        const originalRequest = response.request
        console.log ('response', response)
        console.log('intercept resp in instanceRetry', response.config.data, ' has given ', response.data )
        if (!Array.isArray(response.data)) // && !originalRequest._retry) 
        {
         //   originalRequest._retry = true;
         response.config.data.Genres = "Action"
            console.log('axios-retry on ', response.config.data, ' because ', response.data)
            setTimeout(function () {
                 retryToML(response.config.url, response.config.headers.Authorization, response.config.data);
            }, 3000);
        }
        return response;
    },
    function (error) {
        const originalRequest = error.config;
        if (error.response.status === 500 && !originalRequest._retry) {

            originalRequest._retry = true;

            return instanceRetry(originalRequest);
        }

        //throw error;
        return error.response
    }
);

const retryToML = (backendURL, token, movieFields) => {
    movieFields.Genres = "Action"
    return instanceRetry.post(backendURL, movieFields,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(predictRes => {
            console.log("retryToML ", backendURL, token, movieFields, " has given "+ predictRes)
            // return (predictRes.data);
            return (predictRes);
        })
}

const predict12xxPUT = async (req) => {
    axios.put(getML_URL(req) + 'predict-12xx', req.body,
        {
            headers: {
                //'Authorization': token
                'Authorization': req.header("Authorization")
            }
        })
        .then(predictRes => {
            return (predictRes.data);
        })
}


module.exports = {

    predict12xx(req, res) {

        // console.log('req.body',req.body)
        axios.post(getML_URL(req) + 'predict-12xx', req.body,
            {
                headers: {
                    //'Authorization': token
                    'Authorization': req.header("Authorization")
                }
            })
            .then(predictRes => {
                res.status(predictRes.status).json(predictRes.data);
            });
    },

    predict65xx(req, res) {
        axios.post(getML_URL(req) + 'predict-65xx', req.body,
            {
                headers: {
                    //'Authorization': token
                    'Authorization': req.header("Authorization")
                }
            })
            .then(predictRes => {
                res.status(predictRes.status).json(predictRes.data);
            }
            );
    }
}