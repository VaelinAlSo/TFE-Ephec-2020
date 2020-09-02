import getBaseURL from "./common-http-calls"
import axios from "axios";

//const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImlhdCI6MTU5NzAzNzIyNywiZXhwIjoxNTk4MjM2MDI3LCJpc3MiOiJTaXRlUHN5X0RldiJ9.W0Se9cqQ0LtOLvWKhExB3ByvF7ZcbWYADRipw60tAz4'


export const predict = (movieFields) => 
 
    // /predict-12xx
	// /predict-65xx
	

	axios.all([
		axios.post(getBaseURL(true) + 'predict-65xx', movieFields,
		{
			headers: {
				//'Authorization': token
				'Authorization': localStorage.getItem('JWTtoken') //TOKEN
			}
		}),
		axios.post(getBaseURL(true) + 'predict-12xx', movieFields,
		{
			headers: {
				// 'Authorization': token
				'Authorization': localStorage.getItem('JWTtoken') //TOKEN
			}
		}),
		axios.post(getBaseURL(false) + 'api/movies/checkResult', movieFields,
		{
			headers: {
				// 'Authorization': token
				'Authorization': localStorage.getItem('JWTtoken') //TOKEN
			}
		})
	])
     .then(axios.spread((firstResponse, secondResponse, checkPotentialResponse) => {  
		// console.log(firstResponse.data,secondResponse.data);
		 return firstResponse.data.concat(secondResponse.data).concat(checkPotentialResponse.data)
     }))
	 .catch(error => 
		{
			 console.log(error);
			 if (error.response.status=== 401) {
				localStorage.removeItem('JWTtoken')
				alert("You have to logon again (session expired) !")

			}
		});
