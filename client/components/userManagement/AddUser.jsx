import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import Request from 'superagent';

const items = [
  <MenuItem key={1} value={"mentor"} primaryText="Mentor" />,
  <MenuItem key={2} value={"administrator"} primaryText="Administrator" />,
  <MenuItem key={3} value={"sradministrator"} primaryText="Sr. Administrator" />,
  <MenuItem key={4} value={"sponsor"} primaryText="Sponsor" />
];



const addButtonStyle = {
	position:'fixed',
  top: '13%',
  right:'5%',
  zIndex: 2
}

const dialogStyle = {
  textAlign: 'center'
};

export default class AddUser extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			open: false,
			name: '',
			username: '',
			email: '',
			password: '',
			cpassword: '',
			role: '',
			roles: []
		}
	
		this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
		this.onChangeName = this.onChangeName.bind(this)
		this.onChangeUsername = this.onChangeUsername.bind(this)
		this.onChangeEmail = this.onChangeEmail.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
		this.onChangeRole = this.onChangeRole.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleUpdate = this.handleUpdate.bind(this)
		this.resetFields = this.resetFields.bind(this)
	}
	componentDidMount() {
		if(this.props.openDialog) {
			this.setState({
				open: true,
				name: this.props.user.name,
				username: this.props.user.username,
				email: this.props.user.email,
				password: this.props.user.password,
				role: this.props.user.role
			})
		}
		let th = this
		Request
			.get('/admin/roles')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log(res.body);
		    	let roles = []
		    	res.body.map(function (role, index) {
						roles.push(role.role);			
					})
					// console.log(roles)
		    	th.setState({
		    		roles: roles
		    	})
		    }
			})
	}
	handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };
	onChangeName(e) {
		this.setState({name: e.target.value})
	}
	onChangeUsername(e) {
		this.setState({username: e.target.value})
	}
	onChangeEmail(e) {
		this.setState({email: e.target.value})
	}
	onChangePassword(e) {
		this.setState({password: e.target.value})
	}
	onChangeConfirmPassword(e) {
		this.setState({cpassword: e.target.value})
	}
	onChangeRole(event, key, value) {
		this.setState({role: value})
	}

	resetFields() {
		this.setState({name: '',
			username: '',
			email: '',
			password: '',
			cpassword: '',
			role: ''
		});
	}

	handleSubmit() {
		let th = this
		let user = {}
		user.name = this.state.name
		user.username = this.state.username
		user.email = this.state.email
		user.password = this.state.password
		user.role = this.state.role
		this.resetFields();
		this.props.addUser(user);
	}

	handleUpdate() {
		let th = this
		let user = {}
		user.name = this.state.name
		user.username = this.state.username
		user.email = this.state.email
		user.password = this.state.password
		user.role = this.state.role
		this.resetFields();
		this.props.handleUpdate(user);

	}


	render() {
		const style = {
			fontFamily: 'sans-serif',
			margin: 'auto',
			width: '500px'
		}
		let dialogTitle
		if(this.props.openDialog) {
			dialogTitle = "Edit user"
		}
		else {
			dialogTitle = "Add new user"
		}
		let submitButton
		if(this.props.openDialog) {
			submitButton = <RaisedButton 
						    	 		label="Update User" 
						    	   	primary={true}
						    			onClick={this.handleUpdate}
						    			onTouchTap={this.handleClose}
						    	 	/>
		}
		else {
			submitButton = <RaisedButton 
						    	 		label="Add User" 
						    	   	primary={true}
						    			onClick={this.handleSubmit}
						    			onTouchTap={this.handleClose}
						    	 	/>
		}
		return(
			<div>
				
					<FloatingActionButton style={addButtonStyle} mini={true} onTouchTap={this.handleOpen} >
			      <ContentAdd />
			    </FloatingActionButton>
				
				
		    <Dialog style={dialogStyle}
          title={dialogTitle}
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
        >
      		
      						<TextField 
						    		hintText="Display name" 
						    		floatingLabelText="Name"
						    		value={this.state.name}
						    		onChange={this.onChangeName} 
						    	/><br/>
						    	<TextField 
						    		hintText="Should not be your name" 
						    		floatingLabelText="Username"
						    		value={this.state.username}
						    		onChange={this.onChangeUsername} 
						    		disabled={this.props.openDialog}
						    	/><br/>
						    	<TextField 
						    		hintText="This will be unique"
						    		floatingLabelText="Email" 
						    		value={this.state.email}
						    		onChange={this.onChangeEmail} 
						    	/><br/>
						    	<TextField 
						    		floatingLabelText="Password" 
						    		hintText="Secure your account" 
						    		type="password" 
						    		value={this.state.password}
						    		onChange={this.onChangePassword} 
						    	/><br/>
						    	<TextField 
						    		floatingLabelText="Confirm Password" 
						    		hintText="Confirm password" 
						    		type="password" 
						    		value={this.state.cpassword}
						    		onChange={this.onChangeConfirmPassword} 
						    	/><br/>
						    	<SelectField
						        onChange={this.onChangeRole}
						        floatingLabelText="Select Role"
						        value={this.state.role}
						      >
						        {
						        	this.state.roles.map(function(val, key) {
						        		return <MenuItem key={key} value={val} primaryText={val} />
						        	})
						        }
						      </SelectField><br/><br/><br/>
      					
      			
				    			<div>
				    				{submitButton}
				    				&emsp;	
					    			<RaisedButton 
						    	 		label="Cancel" 
						    	   	primary={true}
						    			onTouchTap={this.handleClose}
						    	 	/>	
				    			</div>
				    			
				    		
        </Dialog>
			</div>
		)
	}
}

AddUser.contextTypes = {
  router: React.PropTypes.object.isRequired
};