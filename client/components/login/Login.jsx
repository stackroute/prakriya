import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import {Link} from 'react-router';

export default class Login extends React.Component {

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
			.post('/login/token')
			.send({username: this.state.username, password: this.state.password})
			.end(function(err, res){
		    // Do something 
		    if(res.body.token != ''){
		    	localStorage.setItem('token', res.body.token);
		    	th.context.router.push('/dashboard')
		    }
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
				<RaisedButton label="Login" primary={true} onClick={this.login} />
				<span style={{color:'red'}}>{this.state.errMsg}</span>
			</div>
		)
	}
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};