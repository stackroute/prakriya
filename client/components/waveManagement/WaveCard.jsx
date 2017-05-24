import React from 'react';
import Request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import Cadets from './Cadets.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    text: {
      wordWrap: 'break-word'
    },
    view: {
    	cursor: 'pointer',
    	textDecoration: 'underline',
    	color: 'blue'
    },
	col: {
		marginBottom: 20,
		marginRight: -20,
		width:150
	},
	grid: {
		width: '100%'
	},
	dialog: {
	  textAlign: 'center'
	}
};

export default class WaveCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadetFetch: false,
			cadets: [],
			dialog: false,
			imageURL: [],
			showDeleteDialog: false
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleEditProject = this.handleEditProject.bind(this);
		this.getCadets = this.getCadets.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.handleDeleteProject = this.handleDeleteProject.bind(this);	
	}

	handleEditProject() {
		// this.setState({
		// 	openDialog: true
		// })
		console.log('handle Edit');
	}

	handleDeleteProject() {
		this.props.handleDelete(this.props.wave);
		this.closeDeleteDialog();
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

	handleOpen() {
		this.setState({
			cadetFetch: true
		})
	}

	getCadets(cadets) {
		let th = this;
		Request
			.post('/dashboard/cadetsofwave')
			.set({'Authorization': localStorage.getItem('token')})
			.send({cadets:cadets})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all cadets', res.body)
		    	th.setState({
		    		cadets: res.body,
		    		cadetFetch: false,
		    		dialog: true
		    	})
		    }
			})
	}

	handleClose() {
		this.setState({
			dialog: false
		})
	}

	render() {
		let startdate = new Date(this.props.wave.StartDate);
		startdate = startdate.getDate() + '/' + (startdate.getMonth()+1) + '/' + startdate.getFullYear();
		let enddate = new Date(this.props.wave.EndDate);
		enddate = enddate.getDate() + '/' + (enddate.getMonth()+1) + '/' + enddate.getFullYear();
		let date = startdate + ' - ' + enddate;
		let th = this
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
		<Card 
					style={{
						width:'300px', 
						marginRight:'20px', 
						marginBottom:'20px'
					}}
				>
					<CardHeader
			      title={this.props.wave.WaveNumber}
			      subtitle={this.props.wave.Location}
			      avatar={
			      	<Avatar>
			      		{this.props.wave.WaveID.charAt(0).toUpperCase()}
			      	</Avatar>
			      }/>
			    	<CardText style={styles.text}>
			    	<p><b>Date:</b>{date}</p>
			    	<h3>Course:</h3><ul>{this.props.wave.CourseNames.map(function(course,index) {
			    		if(course != '')
			    			return <li>{course}</li>
			    	})
			    	}</ul>
			    	<h3>Cadets:</h3><span onClick={this.handleOpen} style={styles.view}>view members</span>
			    	</CardText>
			    	<IconButton tooltip="Edit Course" onClick={this.handleEditProject}>
				      <EditIcon/>
				    </IconButton>
				    <IconButton tooltip="Delete Course" onClick={this.openDeleteDialog}>
				      <DeleteIcon/>
				    </IconButton>
				  	</Card>
				  	{this.state.cadetFetch &&
		        	th.getCadets(this.props.wave.Cadets)}
		        	<Dialog
					    	style={styles.dialog}
			          title="Cadets"
			          open={this.state.dialog}
			          autoScrollBodyContent={true}
			          onRequestClose={this.handleClose}
			        >
			        <Grid style={styles.grid}><Row>
			        {
			        	th.state.cadets.map(function(cadet,index){
			        		return <Col xs={3} key={index} style={styles.col}><Cadets cadet={cadet}/></Col>
			        	})
			        }
			        </Row>
			        </Grid>
			        </Dialog>
			        <Dialog
			          actions={deleteDialogActions}
			          modal={false}
			          open={this.state.showDeleteDialog}
			          onRequestClose={this.closeDeleteDialog}
			        >
        			Are you sure you want to delete this Wave?
        			</Dialog>
        </div>
		)
	}
}