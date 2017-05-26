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
	},
	dialog: {
		backgroundColor: '#DDDBF1',
		borderBottom: '3px solid teal',
		borderRight: '10px solid teal',
		borderLeft: '10px solid teal'
	},
	dialogTitle: {
		fontWeight: 'bold',
		backgroundColor: 'teal',
		color: '#DDDBF1',
		textAlign: 'center'
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
	},
	accessControlsNoError: {

	},
	accessControlsError: {
		color: 'red'
	}
};

export default class AddRole extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
	    open: false,
	    role:'',
			roleErrorText: '',
	    actions: [],
			accessControlsText: 'Access Controls',
			accessControlsStyle: styles.accessControlsNoError
	  }
	  this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
	  this.onChangeRole = this.onChangeRole.bind(this);
	  this.onChangeActions = this.onChangeActions.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleOpen() {
    this.setState({open: true});
  }

  handleClose(e, action) {
		if(action == 'CANCEL') {
				this.setState({
					open: false,
					role: '',
					roleErrorText: '',
					accessControlsText: 'Access Controls',
					accessControlsStyle: styles.accessControlsNoError
				})
		} else if(action == 'ADD') {
			if(this.validationSuccess()) {
				this.handleSubmit()
				this.setState({
					open: false,
					roleErrorText: '',
					accessControlsText: 'Access Controls',
					accessControlsStyle: styles.accessControlsNoError
				})
			}
		}
  }

  onChangeRole(e) {
  	this.setState({
  		role: e.target.value,
			roleErrorText: ''
  	})
  }

  onChangeActions(event, isChecked) {
		let actionList = this.state.actions
		if(isChecked) {
			actionList.push(event.target.value)
			this.setState({
				actions: actionList,
				accessControlsText: 'Access Controls',
				accessControlsStyle: styles.accessControlsNoError
			})
		}
		else {
			actionList = this.state.actions.filter(function(item) {
				return item != event.target.value;
			})
			this.setState({
				actions: actionList,
				accessControlsText: 'Access Controls',
				accessControlsStyle: styles.accessControlsNoError
			})
		}
	}

	handleSubmit() {
		let th = this
		let roleObj = {}
		let controlsCode = []
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

	validationSuccess() {
		if(this.state.role.trim().length == 0) {
			this.setState({
				roleErrorText: 'This field cannot be empty'
			})
		} else if(this.state.actions.length == 0) {
			this.setState({
				accessControlsStyle: styles.accessControlsError,
				accessControlsText: 'Choose atleast one access control'
			})
		} else {
			return true
		}
		return false
	}

	render() {
		let th = this

		const dialogActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={(e)=>{this.handleClose(e, 'CANCEL')}}
				style={styles.actionButton}
      />,
      <FlatButton
        label='Add'
        onTouchTap={(e)=>{this.handleClose(e, 'ADD')}}
				style={styles.actionButton}
      />,
    ]

		return (
			<div>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
		    <Dialog
					bodyStyle={styles.dialog}
          title='ADD A NEW ROLE'
					titleStyle={styles.dialogTitle}
          actions={dialogActions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
					actionsContainerStyle={styles.actionsContainer}
        >
          <TextField
          	floatingLabelText='Role'
          	hintText='Name a new role'
						errorText={this.state.roleErrorText}
          	onChange={this.onChangeRole}
						style={{width: '100%', border: '2px solid white', boxSizing: 'border-box', padding: '5px'}}
          />
					<div style={{border: '2px solid white', padding: '5px', textAlign: 'justify', boxSizing: 'border-box'}}>
          <p style={this.state.accessControlsStyle}>{this.state.accessControlsText}</p>
          {
          	this.props.controls.map(function(control, index) {
          		return(
	          		<Checkbox
									label={control.name}
									value={control.name}
									onCheck={th.onChangeActions}
									key={index}
									style={{width: '30%', display: 'inline-block'}}
								/>
							)
          	})
					}
					</div>
        </Dialog>
			</div>
		);
	}
}
