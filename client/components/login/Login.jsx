import React from 'react';
import cookie from 'react-cookie'; 
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import {Link} from 'react-router';

// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');
// }




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

		    console.log(res)
		    if(res.body.token != ''){
		    	localStorage.setItem('token', res.body.token);
				// console.log(localStorage.getItem('token'));
		    	// cookie.save('token', res.body.token, { path: '/' });
      			// dispatch({ type: AUTH_USER });

		    	// th.props.showDashboard();

		    	th.context.router.push('/admin')
		    	window.loginStatus = true
		    }
		    else {
		    	th.setState({
		    		errMsg: "*Invalid username or password"
		    	})
		    }
		    // if(res.text == "true") {
		    // 	// th.props.showDashboard();
		    // 	window.loginStatus = true
		    // 	th.context.router.push('/admin')
		    // }
		    // else {
		    // 	th.setState({
		    // 		errMsg: "*Invalid username or password"
		    // 	})
		    // }
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