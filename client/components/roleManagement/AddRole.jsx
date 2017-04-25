import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	addButton: {
		position:'fixed',
	  bottom: '60px',
	  right: '15px',
	  zIndex: 1
	}
};

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
		let th = this;
		let roleObj = {};
		let controlsCode = [];
		this.props.controls.map(function (control, key) {
			if(th.state.actions.indexOf(control.name) >= 0)
				controlsCode.push(control.code)
		})
		roleObj.name = this.state.role.toLowerCase()
		roleObj.controls = controlsCode
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
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
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
          should have following selected controls<br/>
          {
          	this.props.controls.map(function(control, index) {
          		return(
	          		<Checkbox
									label={control.name}
									value={control.name}
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
