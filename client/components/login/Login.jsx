import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import {Link} from 'react-router';
import AppBar from 'material-ui/AppBar';
import Footer from '../../views/Footer.jsx';

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
			.post('/login')
			.send({username: this.state.username, password: this.state.password})
			.end(function(err, res){
		    // Do something 
		    if(res.body.token != ''){
		    	localStorage.setItem('token', res.body.token);
		    	th.context.router.push('/app')
		    }
		    else {
		    	th.setState({
		    		errMsg: "*Invalid username or password"
		    	})
		    }
		  });
	}

	render() {
		const appBarStyle = {
			marginLeft: '-8px',
			marginTop: '-8px'
		}
		const bodyStyle = {
			textAlign: 'center',
			fontFamily: 'sans-serif'
		}
		return(
			<div>
				<AppBar
					style={appBarStyle}
	        title="Prakriya"
	        showMenuIconButton={false}
	        iconElementRight={<FlatButton label="Login" onClick={this.openLoginPage} />}
		    />
		    <div style={bodyStyle}>
					<TextField hintText="Username" onChange={this.onChangeUsername} /> <br />
					<TextField hintText="Password" type="password" onChange={this.onChangePassword} /> <br />
					<RaisedButton label="Login" primary={true} onClick={this.login} />
				</div>
				<Footer />
			</div>
		)
	}
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};