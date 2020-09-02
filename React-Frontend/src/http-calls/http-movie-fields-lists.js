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

export const getFieldsLists = (() => 

	axios.all([
		axios.get(getBaseURL(false) + 'api/genres'),
		axios.get(getBaseURL(false) + 'api/codes'),
		axios.get(getBaseURL(false) + 'api/studios')
	])
     .then(axios.spread((firstResponse, secondResponse, thirdResponse) => {  
		//  console.log(firstResponse.data,secondResponse.data, thirdResponse.data);
		 transformResponseDataToLocalStorage(firstResponse.data, "genres")
		 transformResponseDataToLocalStorage(secondResponse.data, "codes")
		 localStorage.setItem("studios", JSON.stringify(thirdResponse.data))
		// transformResponseDataToLocalStorage(thirdResponse.data, "studios")

		 // no return : result in localstorage
		 // return firstResponse.data.concat(secondResponse.data)
     }))
	 .catch(error => console.log(error))
)
