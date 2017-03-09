import React from 'react';
import LoginPage from './LoginPage.jsx';
import Admin from '../admin/index.jsx';

export default class Welcome extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			loginStatus: false
		}
		this.showDashboard = this.showDashboard.bind(this);
	}

	showDashboard() {
		this.setState({loginStatus: true})
	}

	render() {
		let show = ""
		if(this.state.loginStatus)
			show = <Admin />
		else 
			show = <div><h1>Welcome To Prakriya</h1>
								<LoginPage showDashboard={this.showDashboard}/ ></div>
		return(
			<div>
				{show}
			</div>
		)
	}

}