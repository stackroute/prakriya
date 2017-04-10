import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const styles = {
	addButtonStyle: {
		position:'fixed',
	  top: '13%',
	  right:'3%',
	  zIndex: 2
	},
	dialogStyle: {
	  textAlign: 'center'
	}
}

export default class AddProject extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			projectName: '',
			projectDesc: '',
			disableSave: false
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
	}
	handleOpen() {
		this.setState({
			showDialog: true
		})
	}
	handleClose() {
		this.setState({
			showDialog: false
		})
	}
	handleNameChange(e) {
		this.setState({
			projectName: e.target.value
		})
	}
	handleDescChange(e) {
		this.setState({
			projectDesc: e.target.value
		})
	}
	handleAdd() {
		let project = {}
		project.name = this.state.projectName;
		project.description = this.state.projectDesc;
		this.setState({
			projectName: '',
			projectDesc: ''
		})
		this.props.addProject(project);
	}

	render() {
		const projectDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        onTouchTap={this.handleClose}
        onClick={this.handleAdd}
        disabled={this.state.disableSave}
      />,
    ];
		return(
			<div>
				<FloatingActionButton mini={true} style={styles.addButtonStyle} onTouchTap={this.handleOpen}>
		      <ContentAdd />
		    </FloatingActionButton>
		    <Dialog 
		    	style={styles.dialog}
          title="Add a new Project"
          actions={projectDialogActions}
          open={this.state.showDialog}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
        >
        	<TextField
			      floatingLabelText="Name"
			      value={this.state.projectName}
			      onChange={this.handleNameChange}
			      fullWidth={true}
			    />
        	<TextField
			      floatingLabelText="Description"
			      value={this.state.projectDesc}
			      onChange={this.handleDescChange}
			      multiLine={true}
			      rows={3}
			      rowsMax={3}
			      fullWidth={true}
			    />
        </Dialog>
			</div>
		)
	}
}