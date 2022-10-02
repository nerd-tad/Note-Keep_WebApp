import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useNavigate} from 'react-router-dom';  //use history is replaced by usenavigate

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({children}) => {
	//localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens') : null)
	//let [authTokens, setAuthTokens] = useState(localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
	//let [user, setUser] = useState(localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
	//AS WE NAVIGATE, PAGE WILL BE UPDATED FREQUENTLY, THEN THE LOCAL STORAGE WILL BE READ ALL THE TIME LET'S LIMIT IT
	let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null); //NOW IT WILL RUN ONLY ONCE
	let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
	let [loading, setLoading] = useState(true);
 
	const nav = useNavigate()

	let loginUser = async(e) => {
		e.preventDefault();
		//console.log('form submitted..')
		let response = await fetch('http://127.0.0.1:8000/api/token/',{
			method: 'POST',
			headers: {
				'Content-Type':'application/json'
			},
			body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
		})
		//let data = await response //this is a response type object
		//console.log('data:', data) //you can see here, json() is a method that applies to this data object
		let data = await response.json()  // Now the data is an object (javascript object)
		console.log(`this is the response status: ${response.status}`)
		//console.log(jwt_decode(data.access))

		if (response.status === 200){
			setAuthTokens(data);
			setUser(jwt_decode(data.access));
			localStorage.setItem('authTokens', JSON.stringify(data));
			nav('/');
		} else {
			console.log(`failed with ${response.status} error code!!`);
			alert('Something went wrong!!');
		}
	}

	function logout(){
		setUser(null);
		setAuthTokens(null);
		localStorage.removeItem('authTokens')
		nav('/login')
	}


	async function updateToken(){
		console.log('update token called...')
		let response = await fetch('http://127.0.0.1:8000/api/token/refresh/',{
			method: 'POST',
			headers: {
				'Content-Type':'application/json'
			},
			body:JSON.stringify({'refresh':authTokens?.refresh})  //shortcut for if authToken exists
		})
		let data = await response.json()

		if(response.status === 200){
			setAuthTokens(data);
			setUser(jwt_decode(data.access));
			localStorage.setItem('authTokens', JSON.stringify(data));
		}else{
			logout();

		}
		if(loading){
			setLoading(false);
		}
	}


	let contextData = {
		user:user,
		loginUser:loginUser,
		logoutUser:logout,
		authTokens: authTokens,

	}

	useEffect(() => {
		if(loading){
			updateToken()
		}
		let fourMins = 1000*60*4
		let interval = setInterval(() => {
			if(authTokens){
				updateToken()
			}
		}, fourMins)
		return ()=> clearInterval(interval)
	}, [authTokens, loading])

	return(
		<AuthContext.Provider value={contextData} >
			{loading ? null : children}  {/*till authprovider completes, non of the childrens won't render*/}
		</AuthContext.Provider>
	)
}