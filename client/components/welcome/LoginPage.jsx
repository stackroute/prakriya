import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';

export default class LoginPage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			username: "",
			password: "",
			errMsg: ""
		}
		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.login = this.login.bind(this)
	}

	onChangeUsername(e) {
		this.setState({username: e.target.value})
	}

	onChangePassword(e) {
		this.setState({password: e.target.value})
	}

	login() {
		let th = this
		Request
			.post('/login')
			.send({username: this.state.username, password: this.state.password})
			.end(function(err, res){
		    // Do something 
		    if(res.text == "true")
		    	th.props.showDashboard();
		    else {
		    	th.setState({
		    		errMsg: "*Invalid username or password"
		    	})
		    }
		  });
	}

	render() {
		return(
			<div>
				<TextField hintText="Username" onChange={this.onChangeUsername} /> <br />
				<TextField hintText="Password" type="password" onChange={this.onChangePassword} /> <br />
				<RaisedButton label="Login" primary={true} onClick={this.login} /><br />
				<span style={{color:'red'}}>{this.state.errMsg}</span>
			</div>
		)
	}

}