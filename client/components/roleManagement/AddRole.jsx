import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	addButtonStyle: {
		position:'fixed',
	  top: '13%',
	  right:'3%',
	  zIndex: 2
	}
}

const actionsList = [
	"User Management",
	"Role Management",
	"Candidate Review",
	"Assessment Tracker",
	"Candidate Management"
]

export default class AddRole extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
	    open: false,
	    role:'', 
	    actions: []
	  }
	  this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
	  this.onChangeRole = this.onChangeRole.bind(this);
	  this.onChangeActions = this.onChangeActions.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };
  onChangeRole(e) {
  	this.setState({
  		role: e.target.value
  	})
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
		let roleObj = {}
		roleObj.role = this.state.role.toLowerCase()
		roleObj.permissions = this.state.actions
		this.setState({
			actions: []
		})
		this.props.addRole(roleObj)
	}
	render() {
		let th = this
		const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
        onClick={this.handleSubmit}
      />,
    ];
		return (
			<div>
				<FloatingActionButton mini={true} style={styles.addButtonStyle} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
		    <Dialog
          title="Add a new Role"
          actions={dialogActions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <TextField 
          	floatingLabelText="Role"
          	hintText="Name a new role" 
          	onChange={this.onChangeRole} 
          />
          should have following selected permissions<br/>
          {
          	this.props.permissions.map(function(action, index) {
          		return(
	          		<Checkbox
									label={action}
									value={action}
									onCheck={th.onChangeActions}
									key={index}
								/>
							)
          	})
					}
        </Dialog>
			</div>
		);
	}
}