import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';

const items = [
  <MenuItem key={1} value={"mentor"} primaryText="Mentor" />,
  <MenuItem key={2} value={"administrator"} primaryText="Administrator" />,
  <MenuItem key={3} value={"sradministrator"} primaryText="Sr. Administrator" />,
  <MenuItem key={4} value={"sponsor"} primaryText="Sponsor" />
];

export default class AddUser extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			name: '',
			email: '',
			password: '',
			cpassword: '',
			role: '',
			actions: []
		}
		this.onChangeName = this.onChangeName.bind(this)
		this.onChangeEmail = this.onChangeEmail.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)
		this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
		this.onChangeRole = this.onChangeRole.bind(this)
		this.onChangeActions = this.onChangeActions.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	onChangeName(e) {
		this.setState({name: e.target.value})
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
	onChangeActions(event, isChecked) {
		let actionList = this.state.actions
		if(isChecked) {
			actionList.push(event.target.value)
			this.setState({actions: actionList})
		}
		else {
			actionList = this.state.actions.filter(function(item) {
				return item != event.target.value;
			})
			this.setState({actions: actionList})
		}
	}
	handleSubmit() {
		let th = this
		let user = {}
		user.name = this.state.name
		user.email = this.state.email
		user.password = this.state.password
		user.role = this.state.role
		user.actions = this.state.actions
		Request
			.post('/admin/adduser')
			.send(user)
			.end(function(err, res){
		    // Do something
		    let userObj
		    if(res.text)
		    	userObj = JSON.parse(res.text)
		    th.context.router.push('/admin')
		  });
	}

	render() {
		const labelStyle = {
			fontFamily: 'sans-serif'
		}
		return(
			<div>
				<Grid>
					<Row middle="md" center="md">
						<Col md={12} xs={12}>
							<h1>Add User</h1>
						</Col>
					</Row>
	        <Row middle="md" >
	          <Col xs={12} md={2} mdOffset={3} >
	          	<div style={labelStyle} >Name</div>
	          </Col>
	          <Col xs={12} md={6}>
	          	<TextField hintText="Enter your name" onChange={this.onChangeName} />
	          </Col>
	        </Row>
	        <Row middle="md" >
	          <Col xs={12} md={2} mdOffset={3} >
	          	<div style={labelStyle} >Email</div>
	          </Col>
	          <Col xs={12} md={6}>
	          	<TextField hintText="Enter your email" onChange={this.onChangeEmail} />
	          </Col>
	        </Row>
	        <Row middle="md" >
	          <Col xs={12} md={2} mdOffset={3} >
	          	<div style={labelStyle} >Password</div>
	          </Col>
	          <Col xs={12} md={6}>
	          	<TextField hintText="Enter password" type="password" onChange={this.onChangePassword} />
	          </Col>
	        </Row>
	        <Row middle="md" >
	          <Col xs={12} md={2} mdOffset={3} >
	          	<div style={labelStyle} >Confirm Password</div>
	          </Col>
	          <Col xs={12} md={6}>
	          	<TextField hintText="Re enter password" type="password" onChange={this.onChangeConfirmPassword} />
	          </Col>
	        </Row>
	        <Row middle="md" >
	          <Col xs={12} md={2} mdOffset={3} >
	          	<div style={labelStyle} >Select Role</div>
	          </Col>
	          <Col xs={12} md={6}>
	          	<SelectField
			          onChange={this.onChangeRole}
			          floatingLabelText="Select Role"
			          value={this.state.role}
			        >
			          {items}
			        </SelectField>
	          </Col>
	        </Row>
	        <Row middle="md" >
	          <Col xs={12} md={2} mdOffset={3} >
	          	<div style={labelStyle} >Select Actions</div>
	          </Col>
	          <Col xs={12} md={2}>
	          	<Checkbox
								label="Candidate review"
								value="Candidate review"
								onCheck={this.onChangeActions}
							/>
	          </Col>
	          <Col xs={12} md={2}>
	          	<Checkbox
								label="Add assignment"
								value="Add assignment"
								onCheck={this.onChangeActions}
							/>
	          </Col>
	          <Col xs={12} md={2}>
	          	<Checkbox
								label="Provide Feedback"
								value="Provide Feedback"
								onCheck={this.onChangeActions}
							/>
	          </Col>
	        </Row>
	        <Row middle="md" center="md" style={{marginTop: '40px'}} >
	        	<Col xs={12} md={12}>
	        		<RaisedButton 
	        			label="Add User" 
	        			primary={true}
	        			onClick={this.handleSubmit}
	        		/>
	        	</Col>
	        </Row>
	      </Grid>
			</div>
		)
	}
}

AddUser.contextTypes = {
  router: React.PropTypes.object.isRequired
};