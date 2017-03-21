import React from 'react';
import Request from 'superagent';
import IconButton from 'material-ui/IconButton';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'; 
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import AddUser from './AddUser.jsx';

export default class UserList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			openDialog: false
		}
		this.handleRemoveUser = this.handleRemoveUser.bind(this);
		this.handleEditUser = this.handleEditUser.bind(this);
		this.handleUpdateUser = this.handleUpdateUser.bind(this);
	}

	handleRemoveUser() {
		this.props.deleteUser(this.props.currUser);
	}

	handleEditUser() {
		this.setState({
			openDialog: true
		})
	}

	handleUpdateUser(updatedUser) {
		this.props.updateUser(updatedUser);
	}
	
	render() {
		console.log(this.props)
		return (
			<div>
				
					<Card>

						<CardMedia overlay={<CardTitle title={this.props.currUser.name} subtitle={this.props.currUser.email} />}>
				      <img src="../../../assets/images/avt-default.jpg" />
				    </CardMedia>
				    <CardTitle subtitle={this.props.currUser.username} />							
						<CardActions>
							<IconButton tooltip="Edit User" onClick={this.handleEditUser}>
					      <EditIcon color={lightBlack} />
					    </IconButton>
					    <IconButton tooltip="Delete User" onClick={this.handleRemoveUser}>
					      <DeleteIcon color={lightBlack} />
					    </IconButton>
						</CardActions>
						{
							this.state.openDialog &&
							<AddUser user={this.props.currUser} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateUser} />
						}
				  </Card>
			  
			</div>
			
		);
	}
}

// <FlatButton label="Edit" onClick={this.handleEditUser} />
// <FlatButton label="Remove" onClick={this.handleRemoveUser} />