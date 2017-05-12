import React from 'react';
import Request from 'superagent'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddProject from './AddProject.jsx';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    text: {
      wordWrap: 'break-word'
    },
    view: {
    	cursor: 'pointer',
    	textDecoration: 'underline',
    	color: 'blue'
    }
};

export default class ProjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialog: false,
			openDialog: false,
			showDeleteDialog: false
		}
		this.formatDate = this.formatDate.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleEditProject = this.handleEditProject.bind(this);
		this.handleUpdateProject = this.handleUpdateProject.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.handleDeleteProject = this.handleDeleteProject.bind(this);	
	}

	formatDate(date) {
		return Moment(date).fromNow();
	}

	handleClose() {
		this.setState({
			dialog: false,
			openDialog: false
		})
	}

	handleOpen() {
		this.setState({
			dialog: true
		})
	}

	handleEditProject() {
		this.setState({
			openDialog: true
		})
	}

	handleUpdateProject(project) {
		this.props.handleUpdate(project);
	}

	openDeleteDialog() {
		this.setState({
			showDeleteDialog: true
		})
	}

	closeDeleteDialog() {
		this.setState({
			showDeleteDialog: false
		})
	}

	handleDeleteProject() {
		this.props.handleDelete(this.props.project);
		this.closeDeleteDialog();
	}


	render() {
		let detail = '';
		if(this.props.project.updated)
		{
			detail = this.props.project.addedBy + ' updated ' + this.formatDate(this.props.project.addedOn)
		}
		else
		{
			detail = this.props.project.addedBy + ' added ' + this.formatDate(this.props.project.addedOn)
		}
		const deleteDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.handleDeleteProject}
      />,
    ];
		return (
			<div>
				<Card style = {{width:'300px', marginRight:'20px', marginBottom:'20px'}}>
					<CardHeader
			      title={this.props.project.name}
			      subtitle={detail}
			      avatar={
			      	<Avatar>
			      		{this.props.project.name.charAt(0).toUpperCase()}
			      	</Avatar>
			      }/>
			    	<CardText style={styles.text}>
			    	<h3>Description:</h3>{this.props.project.description}
			    	<h3>Tech Skills:</h3><ul>{this.props.project.skills.map(function(skill){
        		return <li>{skill}</li>
        		})}</ul>
			    	<h3>Developed By:</h3>{this.props.project.wave}
			    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={this.handleOpen} style={styles.view}>View members</span>
			    	</CardText>
			    	<IconButton tooltip="Edit Course" onClick={this.handleEditProject}>
				      <EditIcon/>
				    </IconButton>
				    <IconButton tooltip="Delete Course" onClick={this.openDeleteDialog}>
				      <DeleteIcon/>
				    </IconButton>
				  	</Card>
				 <Dialog
		    	style={styles.dialog}
          title="Team Members"
          open={this.state.dialog}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
        >
        {
        	this.props.project.members.map(function(member){
        		return <h5>{member}</h5>
        	})
        }
        </Dialog>
        {
							this.state.openDialog &&
							<AddProject project={this.props.project} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateProject} handleClose={this.handleClose}/>
				}
				<Dialog
          actions={deleteDialogActions}
          modal={false}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this project?
        </Dialog>
			</div>
		)
	}
}