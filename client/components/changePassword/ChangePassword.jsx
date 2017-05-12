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


export default class ChangePassword extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			newPassword: "",
			confirmPassword: "",
			errMsg: "",
			newPasswordErrorText: "",
			confirmPasswordErrorText: ""
		}
		this.onChangeNewPassword = this.onChangeNewPassword.bind(this)
		this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
		this.changePassword = this.changePassword.bind(this)
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
			    	localStorage.setItem('token', res.body.token);
			    	th.context.router.push('/app')
			    }
			  })
			  this.props.handleClose();
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
					 	floatingLabelText="New Password"
						type="password"
					 	onChange={this.onChangeNewPassword}
						style={{width: '100%'}}
						errorText={this.state.newPasswordErrorText}/> <br />
					 <TextField
					 	floatingLabelText="Confirm Password"
						type="password"
						onChange={this.onChangeConfirmPassword}
						style={{width: '100%'}}
						errorText={this.state.confirmPasswordErrorText}/>
					 <br /><br />
					 <RaisedButton
					 	label="Change Password"
						primary={true}
						onClick={this.changePassword}
						style={{width: '100%'}} />
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
