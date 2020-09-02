import getBaseURL from "./common-http-calls"

import axios from "axios";

export async function Authenticate(email, Mdp) {
    return axios.post(getBaseURL(false) + "api/authenticate", {
        email,
        Mdp,
    }).then((response) => {
 //       console.log(response);
        localStorage.setItem('JWTtoken', response.data.token)
 //       console.log('put in localStorage');
 //       console.log(localStorage.getItem('JWTtoken'));
    })
/*	
	.catch((error) => {
		console.log('error auth '+error);
	}
	)
*/	}

export async function CreateUser(name, firstName, email, password) {
    return axios.post(getBaseURL(false) + "api/user", {
        name,
        firstName,
        email,
        password
    });
}


