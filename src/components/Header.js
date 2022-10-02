import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Header(){
	let {user, logoutUser} = useContext(AuthContext)
	return(
		<div>
			<Link to="/">Home</Link>
			<span>|</span>  {/*span is used to create a little space*/}
			{user ? (
				<button onClick={logoutUser}>logout</button>
			):(
				<Link to="/login">Login</Link>
			)}
			

			{user && <p>Hello {user.username}</p>}

			

		</div>		
	);
}

export default Header;