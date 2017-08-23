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
	},
	dialog: {
		backgroundColor: '#DDDBF1',
		border: '10px solid teal'
	},
	actionsContainer: {
		backgroundColor: 'teal',
		borderTop: '0px',
		marginTop: '0px'
	},
	actionButton: {
		backgroundColor: '#DDDBF1',
		width: '50%',
		color: 'teal',
		border: '1px solid teal',
		height: '100%'
	}
}

export default class UserList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {},
			lockConfirm: false,
			deleteConfirm: false,
			openDialog: false
		}
		this.getProfilePic = this.getProfilePic.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
		this.handleOpenLock = this.handleOpenLock.bind(this);
	  this.handleCloseLock = this.handleCloseLock.bind(this);
		this.handleRemoveUser = this.handleRemoveUser.bind(this);
		this.handleEditUser = this.handleEditUser.bind(this);
		this.handleUpdateUser = this.handleUpdateUser.bind(this);
		this.handleAccountSuspension = this.handleAccountSuspension.bind(this);
		this.disabledUser = this.disabledUser.bind(this);
		this.handleEditClose = this.handleEditClose.bind(this);
	}

	componentWillMount() {
		this.setState({
			user: this.props.currUser
		})
		this.getProfilePic(this.props.currUser)
	}

	getProfilePic(user) {
		let th = this;
  	Request
  		.get(`/dashboard/getimage`)
  		.set({'Authorization': localStorage.getItem('token')})
      .query({filename: user.username})
  		.end(function(err, res) {
  			if(err) {
					user.profilePic = '../../../assets/images/avt-default.jpg'
				} else {
  	    	if(res.text) {
  		    	user.profilePic = res.text
  	    	} else {
						user.profilePic = '../../../assets/images/avt-default.jpg'
					}
  	    }
  	    th.setState({
  	    	user: user
  	    })
  		})
  }

	disabledUser = () => {
		if(this.state.user.actions.indexOf('login') > -1)
			return false
		else
			return true
	}

	handleOpen() {
    this.setState({deleteConfirm: true});
  };

  handleClose() {
    this.setState({deleteConfirm: false});
  };

  handleOpenLock() {
    this.setState({lockConfirm: true});
  };

  handleCloseLock() {
    this.setState({lockConfirm: false});
  };

  handleAccountSuspension() {
  	this.handleCloseLock();
  	if(this.state.user.actions.indexOf('login') > -1)
			this.props.lockUser(this.state.user)
		else
			this.props.unlockUser(this.state.user)
	}

	handleRemoveUser() {
		this.handleClose();
		this.props.deleteUser(this.state.user);
	}

	handleEditUser() {
		this.setState({
			openDialog: true
		})
	}

	handleUpdateUser(updatedUser) {
		this.props.updateUser(updatedUser);
	}

	handleEditClose() {
		this.setState({
			openDialog: false
		})
	}

	render() {
		const deleteActions = [
	      <FlatButton
	        label="Not sure.  Maybe later."
	        onTouchTap={this.handleClose}
					style={styles.actionButton}
	      />,
	      <FlatButton
	        label="Yes"
	        onClick={this.handleRemoveUser}
	        style={styles.actionButton}
	      />
	  ];
	  const lockActions = [
      <FlatButton
        label="Not sure. Maybe later."
        onTouchTap={this.handleCloseLock}
				style={styles.actionButton}
      />,
      <FlatButton
        label="Yes"
        onClick={this.handleAccountSuspension}
				style={styles.actionButton}
      />
	  ];
		const color = this.disabledUser() ? red500 : lightBlack ;
		const accountTooltip = this.disabledUser() ? 'Unlock Account' : 'Lock Account' ;
		const disabled = this.disabledUser()
		let type = typeof color;
		return (
			<div>
					<Card>
						<CardMedia overlay={<CardTitle title={this.state.user.username} subtitle={this.state.user.role.toUpperCase()} />}>
				      <img src={this.state.user.profilePic || '../../../assets/images/avt-default.jpg'} style={{height: 250}}/>
				    </CardMedia>
				    <CardTitle title={this.state.user.name} subtitle={this.state.user.email} />
						<CardActions style={styles.cardActions}>
							<IconButton tooltip={accountTooltip} onTouchTap={this.handleOpenLock} >
					      <LockIcon color={color} />
					    </IconButton>
					    {(this.state.user.actions.indexOf('login') > -1)?(<Dialog
										bodyStyle={styles.dialog}
					          actions={lockActions}
										actionsContainerStyle={styles.actionsContainer}
					          modal={false}
					          open={this.state.lockConfirm}
					          onRequestClose={this.handleCloseLock}
					        >
					          Are you sure, you want to suspend the selected user account?
					        </Dialog>
					      ):(
					      	<Dialog
										bodyStyle={styles.dialog}
					          actions={lockActions}
										actionsContainerStyle={styles.actionsContainer}
					          modal={false}
					          open={this.state.lockConfirm}
					          onRequestClose={this.handleCloseLock}
					        >
					          Are you sure, you want to unsuspend the selected user account?
					        </Dialog>
					      )}
							<IconButton tooltip="Edit User" onClick={this.handleEditUser} disabled={disabled}>
					      <EditIcon color={lightBlack} />
					    </IconButton>
					    <IconButton tooltip="Delete User" onTouchTap={this.handleOpen} disabled={disabled}>
					      <DeleteIcon color={lightBlack} />
					    </IconButton>
					    <Dialog
								bodyStyle={styles.dialog}
			          actions={deleteActions}
								actionsContainerStyle={styles.actionsContainer}
			          modal={false}
			          open={this.state.deleteConfirm}
			          onRequestClose={this.handleClose}
			        >
			          Are you sure, you want to delete the selected user?
			        </Dialog>
						</CardActions>
						{
							this.state.openDialog &&
							<AddUser
								user={this.state.user}
								roles={this.props.roles}
								openDialog={this.state.openDialog}
								handleUpdate={this.handleUpdateUser}
								closeDialog={this.handleEditClose}
							/>
						}
				  </Card>
			</div>
		)
	}
}
