import React, {useContext} from 'react';
import AuthContext from '../context/AuthContext';
import {Navigate} from 'react-router-dom';

function LoginPage() {
	let {user, loginUser} = useContext(AuthContext);
	return(
		<div>
			{!user ?( 
				<>
					<p></p>
					<form onSubmit={loginUser}>
						<input type="text" name="username" placeholder="Enter the username:" />
						<input type="password" name="password" placeholder="Enter password:" />
						<input type="submit" />
					</form>
				</>
			):(
				<Navigate to='/' />
			)} {/*only if the user is not there, enable the login page */}
		</div>
	)
}

export default LoginPage;