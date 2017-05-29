import React from 'react';
import Request from 'superagent'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ProjectDialog from './ProjectDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import Cadets from './Cadets.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
    text: {
      wordWrap: 'break-word',
      textAlign: 'justify'
    },
    view: {
    	cursor: 'pointer',
    	textDecoration: 'underline',
    	color: 'blue'
    },
    dialog: {
      backgroundColor: '#DDDBF1',
  		borderBottom: '10px solid teal',
  		borderRight: '10px solid teal',
  		borderLeft: '10px solid teal'
    },
    dialogTitle: {
  		fontWeight: 'bold',
  		backgroundColor: 'teal',
  		color: '#DDDBF1',
  		textAlign: 'center'
  	},
		col: {
			marginBottom: 20,
			marginRight: -20,
			width:150
		},
		grid: {
			width: '100%'
		},
		deleteDialog: {
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
};

export default class ProjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialog: false,
			openDialog: false,
			dialogOpen: false,
			showDeleteDialog: false,
			cadets: []
		}
		this.formatDate = this.formatDate.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleEditProject = this.handleEditProject.bind(this);
		this.handleUpdateProject = this.handleUpdateProject.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.getCadets = this.getCadets.bind(this);
		this.handleDeleteProject = this.handleDeleteProject.bind(this);
	}

	getCadets(name) {
		let th = this;
		Request
			.post('/dashboard/cadetsofproj')
			.set({'Authorization': localStorage.getItem('token')})
			.send({name:name})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all cadets', res.body)
		    	th.setState({
		    		cadets: res.body,
		    		dialog: false,
		    		dialogOpen: true
		    	})
		    }
			})
	}


	formatDate(date) {
		return Moment(date).fromNow();
	}

	handleClose() {
		this.setState({
			dialogOpen: false,
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
		if(this.props.project.updated) {
			detail = this.props.project.addedBy + ' updated ' + this.formatDate(this.props.project.addedOn)
		} else {
			detail = this.props.project.addedBy + ' added ' + this.formatDate(this.props.project.addedOn)
		}
		const deleteDialogActions = [
      <FlatButton
        label='Cancel'
        style={styles.actionButton}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label='Delete'
        style={styles.actionButton}
        onClick={this.handleDeleteProject}
      />
    ]
    let bgColor = this.props.bgColor;
    let th = this
		return (
			<div>
				<Card
					style={{
						width:'370px',
						marginRight:'20px',
						marginBottom:'20px',
						background: bgColor
					}}
				>
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
			    	<h3>Tech Skills:</h3><ul>{this.props.project.skills.map(function(skill, index){
        		return <li key={index}>{skill}</li>
        		})}</ul>
			    	<h3>Developed By:</h3>{this.props.project.wave}
			    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={this.handleOpen} style={styles.view}>view members</span>
			    	</CardText>
			    	<IconButton tooltip="Edit Course" onClick={this.handleEditProject}>
				      <EditIcon/>
				    </IconButton>
				    <IconButton tooltip="Delete Course" onClick={this.openDeleteDialog}>
				      <DeleteIcon/>
				    </IconButton>
				  	</Card>
				 {
				 		this.state.dialog && 
				 		th.getCadets(this.props.project.name)}
				 		<Dialog
                bodyStyle={styles.dialog}
			          title='TEAM MEMBERS'
			          titleStyle={styles.dialogTitle}
			          open={this.state.dialogOpen}
			          autoScrollBodyContent={true}
			          onRequestClose={this.handleClose}
        		>
		        <Grid style={styles.grid}><Row>
			       {
		          this.state.cadets.length > 0 ?
		            this.state.cadets.map(function(cadet, index){
		                return <Col xs={3} key={index} style={styles.col}><Cadets cadet={cadet}/></Col>
		            }) :
		          <div><br/>Team list has not been updated yet. Sorry for the inconvenience caused.</div>
		        }
		        </Row>
			      </Grid>
		        </Dialog>
          
        {
							this.state.openDialog &&
							<ProjectDialog project={this.props.project} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateProject} handleClose={this.handleClose} dialogTitle={'EDIT PRODUCT'}/>
				}
				<Dialog
					bodyStyle={styles.deleteDialog}
          actions={deleteDialogActions}
          modal={false}
          actionsContainerStyle={styles.actionsContainer}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this project?
        </Dialog>
			</div>
		)
	}
}
