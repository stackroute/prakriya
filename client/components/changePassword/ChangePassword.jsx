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
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';

export default class ChangePassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			passwordType: "password",
			newPassword: "",
			confirmPassword: "",
			errMsg: "",
			newPasswordErrorText: "",
			confirmPasswordErrorText: ""
		}
		this.onChangeNewPassword = this.onChangeNewPassword.bind(this)
		this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
		this.changePassword = this.changePassword.bind(this)
		this.toggleShowPassword = this.toggleShowPassword.bind(this)
	}

	onChangeNewPassword(e) {
		this.setState({
			errMsg: "",
			newPasswordErrorText: "",
			newPassword: e.target.value
		})
	}

	onChangeConfirmPassword(e) {
		this.setState({
			errMsg: "",
			confirmPasswordErrorText: "",
			confirmPassword: e.target.value
		})
	}

	changePassword() {
		let th = this
		if(th.state.newPassword.trim().length === 0) th.setState({
			newPasswordErrorText: "This field cannot be empty"
		})
		if(th.state.confirmPassword.trim().length === 0) th.setState({
			confirmPasswordErrorText: "This field cannot be empty"
		})
		if(th.state.confirmPassword.trim() !== th.state.newPassword.trim()) th.setState({

			confirmPasswordErrorText: "This field should be same as New Password"
		})
		/* need to be changed */
		if(th.state.newPassword.trim().length !== 0 && th.state.confirmPassword.trim().length !== 0 && th.state.confirmPassword.trim() === th.state.newPassword.trim()) {
			console.log('changepassword - object sent: ', this.props.username, ' ', this.state.newPassword)
			Request
				.post('/dashboard/changepassword')
				.set({'Authorization': localStorage.getItem('token')})
				.send({username: this.props.username, password: this.state.newPassword})
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
			    	th.context.router.push('/app')
			    }
			  })
			  this.props.handleClose();
		}
	}

	toggleShowPassword() {
		let passwordType = this.state.passwordType == 'password' ? 'text' : 'password';
		this.setState({
			passwordType: passwordType
		})
	}

	render() {

		return(
			<Card>
				 <CardMedia>
						 <img src="./assets/images/login_head.png"/>
				 </CardMedia>
				 <CardText>
					 <div style={{position: 'relative', display: 'inline-block', width: '100%'}}>
						 {
							 this.state.passwordType == 'password' ?
							 <VisibilityIcon style={{position: 'absolute', right: 0, top: 35, width: 20, height: 20, zIndex: 1, cursor: 'pointer'}} onTouchTap={this.toggleShowPassword}/> :
							 <VisibilityOffIcon style={{position: 'absolute', right: 0, top: 35, width: 20, height: 20, zIndex: 1, cursor: 'pointer'}} onTouchTap={this.toggleShowPassword}/>
						 }
						 <TextField
						 	floatingLabelText="New Password"
							type={this.state.passwordType}
						 	onChange={this.onChangeNewPassword}
							style={{width: '100%'}}
							errorText={this.state.newPasswordErrorText}/> <br />
					 </div>
					 <TextField
					 	floatingLabelText="Confirm Password"
						type={this.state.passwordType}
						onChange={this.onChangeConfirmPassword}
						style={{width: '100%'}}
						errorText={this.state.confirmPasswordErrorText}/>
					 <br /><br />
					 <RaisedButton
					 	label="Change Password"
						onClick={this.changePassword}
						style={{width: '100%', backgroundColor: '#202D3E'}} />
						<br /><br />
					 <div style={{color: 'red', fontWeight: 'bold', textAlign: 'center'}}>{this.state.errMsg}</div>
				 </CardText>
			</Card>
		)
	}
}

ChangePassword.contextTypes = {
  router: PropTypes.object.isRequired
};
