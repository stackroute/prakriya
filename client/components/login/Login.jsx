import React from 'react';
import PropTypes from 'prop-types';
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
		this.setState({
			errMsg: "",
			username: e.target.value
		})
	}

	onChangePassword(e) {
		this.setState({
			errMsg: "",
			password: e.target.value
		})
	}

	login() {
		let th = this
		Request
			.post('/login')
			.send({username: this.state.username, password: this.state.password})
			.end(function(err, res){
		    // Do something 
		    if(res.status == 401) {
		    	th.setState({
		    		errMsg: "*Invalid username or password"
		    	})
		    }
		    else if(res.text == 'Account suspended') {
		    	th.setState({
		    		errMsg: "*Account is suspended. Contact admin"
		    	})
		    }
		    else if(err) {
		    	th.setState({
		    		errMsg: "*Internal Server Error"
		    	})
		    }
		    else {
		    	localStorage.setItem('token', res.body.token);
		    	th.context.router.push('/app')
		    }
		  });
	}

	render() {
		const appBarStyle = {
			marginLeft: '-8px',
			marginTop: '-8px'
		}
		const bodyStyle = {
			textAlign: 'center'
			// margin: 'auto',
			// marginTop: '20px',
			// width: '350px',
			// padding: '10px 0px 20px 0px',
			// fontFamily: 'sans-serif',
			// backgroundColor: '#eee',
			// boxShadow: '1px 1px 10px 1px #444',
			// borderRadius: '10px'
		}
		return(
			<div>
		    <div style={bodyStyle}>
					<TextField hintText="Username" onChange={this.onChangeUsername} /> <br />
					<TextField hintText="Password" type="password" onChange={this.onChangePassword} /> 
					<br /><br />
					<RaisedButton label="Login" primary={true} onClick={this.login} /><br />
					<div style={{color: 'red'}}>{this.state.errMsg}</div>
				</div>
			</div>
		)
		// return(
		// 	<div>
		// 		<AppBar
		// 			style={appBarStyle}
	 //        title="Prakriya"
	 //        showMenuIconButton={false}
	 //        iconElementRight={<FlatButton label="Login" onClick={this.openLoginPage} />}
		//     />
		//     <div style={bodyStyle}>
		//     	<h2>Log In to Continue</h2>
		// 			<TextField style={inputStyle} hintText="Username" onChange={this.onChangeUsername} /> <br />
		// 			<TextField style={inputStyle} hintText="Password" type="password" onChange={this.onChangePassword} /> 
		// 			<br /><br />
		// 			<RaisedButton label="Login" primary={true} onClick={this.login} />
		// 		</div>
		// 		<Footer />
		// 	</div>
		// )
	}
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};