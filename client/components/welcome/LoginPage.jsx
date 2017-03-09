import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class LoginPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			user_name: "",
			password: ""
		}
		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.login = this.login.bind(this)
	}

	onChangeUsername(e) {
		this.setState({user_name: e.target.value})
	}

	onChangePassword(e) {
		this.setState({password: e.target.value})
	}

	login() {
		
	}

	render() {
		return(
			<div>
				<TextField hintText="Username" onChange={this.onChangeUsername} /> <br />
				<TextField hintText="Password" type="password" onChange={this.onChangePassword} /> <br />
				<RaisedButton label="Login" primary={true} onClick={this.login} />
			</div>
		)
	}

}