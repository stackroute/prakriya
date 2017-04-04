import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {lightBlack} from 'material-ui/styles/colors'; 

const styles = {
	actions: {
		textAlign: 'right'
	},
	cardClick: {
		cursor: 'pointer'
	}
}

export default class CandidateCard extends React.Component {

	constructor(props) {
		super(props);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCardClick = this.handleCardClick.bind(this);
	}
	handleCardClick() {
		this.props.handleCardClick(this.props.candidate);
	}
	handleEdit() {

	}
	handleDelete() {

	}

	render() {
		return(
			<div>
				<Card>
			    <CardMedia
			    	style={styles.cardClick}
			    	onClick={this.handleCardClick}
			      overlay={
			      	<CardTitle 
			      		title={this.props.candidate.EmployeeName}
			      		subtitle={this.props.candidate.EmailID} 
			      	/>
			      }
			    >
			      <img src="../../assets/images/avt-default.jpg" />
			    </CardMedia>
			    <CardTitle 
			    	title={this.props.candidate.EmployeeID}
			    	subtitle={this.props.candidate.CareerBand}
			    />
			    <CardActions style={styles.actions}>
			      <IconButton tooltip="Edit Candidate" onTouchTap={this.handleEdit}>
				      <EditIcon color={lightBlack} />
				    </IconButton>
				    <IconButton tooltip="Delete Candidate" onTouchTap={this.handleDelete}>
				      <DeleteIcon color={lightBlack} />
				    </IconButton>
			    </CardActions>
			  </Card>
			</div>
		)
	}

}