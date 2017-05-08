import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import {Link} from 'react-router';
import AppBar from 'material-ui/AppBar';
import Footer from '../../views/Footer.jsx';
import {Card, CardMedia, CardText} from 'material-ui/Card';


export default class Login extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			username: "",
			password: "",
			errMsg: "",
			usernameErrorText: "",
			passwordErrorText: ""
		}
		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.login = this.login.bind(this)
	}

	onChangeUsername(e) {
		this.setState({
			errMsg: "",
			usernameErrorText: "",
			username: e.target.value
		})
	}

	onChangePassword(e) {
		this.setState({
			errMsg: "",
			passwordErrorText: "",
			password: e.target.value
		})
	}

	login() {
		let th = this
		if(th.state.username.trim().length === 0) th.setState({
			usernameErrorText: "This field cannot be empty"
		})
		if(th.state.password.trim().length === 0) th.setState({
			passwordErrorText: "This field cannot be empty"
		})
		if(th.state.username.trim().length !== 0 && th.state.password.trim().length !== 0) {
			Request
				.post('/login')
				.send({username: this.state.username, password: this.state.password})
				.end(function(err, res){
			    // Do something
			    if(res.status == 401) {
			    	th.setState({
			    		errMsg: "Invalid username or password. Try again."
			    	})
			    }
			    else if(res.text == 'Account suspended') {
			    	th.setState({
			    		errMsg: "Account is suspended. Contact admin."
			    	})
			    }
			    else if(err) {
			    	th.setState({
			    		errMsg: "Internal Server Error."
			    	})
			    }
			    else {
			    	localStorage.setItem('token', res.body.token);
			    	th.context.router.push('/app')
			    }
			  })
		}
	}

	render() {

		return(
			<Card>
				 <CardMedia>
						 <img src="./assets/images/login_head.png"/>
				 </CardMedia>
				 <CardText>
					 <TextField
					 	floatingLabelText="Username"
					 	onChange={this.onChangeUsername}
						style={{width: '100%'}}
						errorText={this.state.usernameErrorText}/> <br />
					 <TextField
					 	floatingLabelText="Password"
						type="password"
						onChange={this.onChangePassword}
						style={{width: '100%'}}
						errorText={this.state.passwordErrorText}/>
					 <br /><br />
					 <RaisedButton
					 	label="Login"
						primary={true}
						onClick={this.login}
						style={{width: '100%'}} />
						<br /><br />
					 <div style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}>{this.state.errMsg}</div>
				 </CardText>
			</Card>
		)
	}
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};
