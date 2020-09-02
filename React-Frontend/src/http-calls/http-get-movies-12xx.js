import getBaseURL from "./common-http-calls"
import axios from "axios";

//const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImlhdCI6MTU5NzAzNzIyNywiZXhwIjoxNTk4MjM2MDI3LCJpc3MiOiJTaXRlUHN5X0RldiJ9.W0Se9cqQ0LtOLvWKhExB3ByvF7ZcbWYADRipw60tAz4'

function transformResponseDataToLocalStorage(collection, collectionName) {
	let transfCollection = collection.map(e => { 
		let titled = {title : e }
		return titled;
	})
	localStorage.setItem(collectionName,JSON.stringify(transfCollection))
	return 
}

export const getMoviesSamples = (() => 
	
	axios.get(getBaseURL(false) + 'api/movies/12xx/nonTR',
	{
		headers: {
			// 'Authorization': token
			'Authorization': localStorage.getItem('JWTtoken') //TOKEN
		}
	})
     .then((response) => {  
//		  console.log(response);
		 localStorage.setItem("moviesSamples", JSON.stringify(response.data))
//		 return response.data

     })
	 .catch(error => console.log(error))
)
