import React from 'react';
import LoginPage from './LoginPage.jsx';

export default class Welcome extends React.Component {

	render() {
		return(
			<div>
				<h1>Welcome To Prakriya</h1>
				<LoginPage />
			</div>
		)
	}

}