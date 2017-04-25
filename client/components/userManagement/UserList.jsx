import React from 'react';
import ReactDOM from 'react-dom'
import Request from 'superagent';
import IconButton from 'material-ui/IconButton';
import {grey400, darkBlack, lightBlack, red500} from 'material-ui/styles/colors'; 
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import LockIcon from 'material-ui/svg-icons/action/lock';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import AddUser from './AddUser.jsx';

const styles = {
	cardActions: {
		textAlign: 'right'
	}
}

export default class UserList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lockConfirm: false,
			deleteConfirm: false,
			openDialog: false
		}
		this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
		this.handleRemoveUser = this.handleRemoveUser.bind(this);
		this.handleEditUser = this.handleEditUser.bind(this);
		this.handleUpdateUser = this.handleUpdateUser.bind(this);
		this.handleAccountSuspension = this.handleAccountSuspension.bind(this);
		this.disabledUser = this.disabledUser.bind(this);
	}

	componentDidMount() {
		// this.disabledUser();
	}

	disabledUser = () => {
		if(this.props.currUser.actions.indexOf('login') > -1)
			return false
		else 
			return true
	}

	handleOpen = () => {
    this.setState({deleteConfirm: true});
  };

  handleClose = () => {
    this.setState({deleteConfirm: false});
  }; 

  handleOpenLock = () => {
    this.setState({lockConfirm: true});
  };

  handleCloseLock = () => {
    this.setState({lockConfirm: false});
  }; 

  handleAccountSuspension() {
  	this.handleCloseLock();
  	this.props.lockUser(this.props.currUser);
		// console.log("yes!!!!!")
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
		const deleteActions = [
	      <FlatButton
	        label="Not sure, maybe later!"
	        primary={true}
	        onTouchTap={this.handleClose}
	      />,
	      <FlatButton
	        label="Yes"
	        primary={true}
	        onClick={this.handleRemoveUser}
	        
	      />,
	  ];
	  const lockActions = [
	      <FlatButton
	        label="Not sure, maybe later!"
	        primary={true}
	        onTouchTap={this.handleCloseLock}
	      />,
	      <FlatButton
	        label="Yes"
	        primary={true}
	        onClick={this.handleAccountSuspension}
	        
	      />,
	  ];
		// console.log(this.props)
		const color = this.disabledUser() ? red500 : lightBlack ;
		const accountTooltip = this.disabledUser() ? 'Unlock Account' : 'Lock Account' ;
		const disabled = this.disabledUser()
		let type = typeof color;
		console.log(type);
		return (
			<div>
				
					<Card>

						<CardMedia overlay={<CardTitle title={this.props.currUser.username} subtitle={this.props.currUser.role.toUpperCase()} />}>
				      <img src="../../../assets/images/avt-default.jpg" />
				    </CardMedia>
				    <CardTitle title={this.props.currUser.name} subtitle={this.props.currUser.email} />							
						<CardActions style={styles.cardActions}>
							<IconButton tooltip={accountTooltip} onTouchTap={this.handleOpenLock} >
					      <LockIcon color={color} />
					    </IconButton>
					    <Dialog
			          title="Confirm user' account suspension?"
			          actions={lockActions}
			          modal={false}
			          open={this.state.lockConfirm}
			          onRequestClose={this.handleCloseLock}
			        >
			          Are you sure, you want to suspend the selected user account?
			        </Dialog>
							<IconButton tooltip="Edit User" onClick={this.handleEditUser} disabled={disabled}>
					      <EditIcon color={lightBlack} />
					    </IconButton>
					    <IconButton tooltip="Delete User" onTouchTap={this.handleOpen} disabled={disabled}>
					      <DeleteIcon color={lightBlack} />
					    </IconButton>
					    <Dialog
			          title="Confirm User Delete"
			          actions={deleteActions}
			          modal={false}
			          open={this.state.deleteConfirm}
			          onRequestClose={this.handleClose}
			        >
			          Are you sure, you want to delete the selected user?
			        </Dialog>
						</CardActions>
						{
							this.state.openDialog &&
							<AddUser user={this.props.currUser} roles={this.props.roles} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateUser} />
						}
				  </Card>
			  
			</div>
			
		);
	}
}

// <FlatButton label="Edit" onClick={this.handleEditUser} />
// <FlatButton label="Remove" onClick={this.handleRemoveUser} />