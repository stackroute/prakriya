import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

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
			dialog: false
		}
		this.formatDate = this.formatDate.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
	}

	formatDate(date) {
		return Moment(date).fromNow();
	}

	handleClose() {
		this.setState({
			dialog: false
		})
	}

	handleOpen() {
		this.setState({
			dialog: true
		})
	}

	render() {
		return (
			<div>
				<Card style = {{width:'300px', marginRight:'20px', marginBottom:'20px'}}>
					<CardHeader
			      title={this.props.project.name}
			      subtitle={this.props.project.addedBy + ' added ' + this.formatDate(this.props.project.addedOn)}
			      avatar={
			      	<Avatar>
			      		{this.props.project.name.charAt(0).toUpperCase()}
			      	</Avatar>
			      }/>
			    	<IconButton tooltip="Edit Course" onClick={this.handleEditCourse} style={{display:this.state.hide,marginLeft:'10px'}}>
				      <EditIcon/>
				    </IconButton>
				    <IconButton tooltip="Delete Course" style={{display:this.state.hide}} onClick={this.openDeleteDialog}>
				      <DeleteIcon/>
				    </IconButton>
				    <CardText style={styles.text}>
			    	<h3>Description:</h3>{this.props.project.description}
			    	<h3>Tech Skills:</h3><ul>{this.props.project.skills.map(function(skill){
        		return <li>{skill}</li>
        		})}</ul>
			    	<h3>Developed By:</h3>{this.props.project.wave}
			    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={this.handleOpen} style={styles.view}>View members</span>
			    	</CardText>
			    	
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
			</div>
		)
	}
}