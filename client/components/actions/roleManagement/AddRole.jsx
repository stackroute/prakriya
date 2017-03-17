import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

const addButtonStyle = {
	position:'fixed',
  top: '13%',
  right:'5%'
}

const actions = [
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
	render() {
		let th = this
		actions.map(function (action, index) {
			console.log(action)
		})
		const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];
		return (
			<div>
				<FloatingActionButton style={addButtonStyle} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
		    <Dialog
          title="Add a new Role"
          actions={dialogActions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField hintText="Enter the role" onChange={this.onChangeRole} /><br />
          {
          	actions.map(function(action, index) {
          		<Checkbox
								label={action}
								value={action}
								key={index}
								onCheck={th.onChangeActions}
							/>
          	})
					}
        </Dialog>
			</div>
		);
	}
}