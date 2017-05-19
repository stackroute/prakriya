import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {lightBlack} from 'material-ui/styles/colors'; 
import Request from 'superagent';

const styles = {
	actions: {
		textAlign: 'right'
	},
	cardClick: {
		cursor: 'pointer'
	},
	cardTitle: {
		paddingBottom: 0
	}
}

export default class CandidateCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showDeleteDialog: false,
			imageURL: '../../assets/images/avt-default.jpg'
		}
		this.getProfilePic = this.getProfilePic.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCardClick = this.handleCardClick.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
	}
	componentDidMount() {
		this.getProfilePic(this.props.candidate.EmployeeID)
	}
	getProfilePic(eid) {
		let th = this;
		Request
			.get(`/dashboard/getimage?eid=${eid}`)
			.set({'Authorization': localStorage.getItem('token')})
			.query({q: eid})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	if(res.text) {
		    		let array = new Uint8Array(res.text.length);
		        for (var i = 0; i < res.text.length; i++){
		            array[i] = res.text.charCodeAt(i);
		        }
		        var blob = new Blob([array], {type: 'image/jpeg'});
			    	let blobUrl = URL.createObjectURL(blob);
			    	th.setState({
			    		imageURL: blobUrl
			    	})
		    	}
		    }
			})
	}
	handleCardClick() {
		this.props.handleCardClick(this.props.candidate);
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
	handleDelete() {
		this.props.handleDelete(this.props.candidate);
	}

	render() {
		const deleteDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDelete}
      />,
    ];
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
			      <img src={this.state.imageURL} />
			    </CardMedia>
			    <CardTitle 
			    	title={this.props.candidate.EmployeeID}
			    	subtitle={this.props.candidate.CareerBand}
			    	style={styles.cardTitle}
			    />
			    <CardActions style={styles.actions}>
				    <IconButton tooltip="Delete Candidate" onTouchTap={this.openDeleteDialog}>
				      <DeleteIcon color={lightBlack} />
				    </IconButton>
			    </CardActions>
			  </Card>
			  <Dialog
          actions={deleteDialogActions}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this candidate?
        </Dialog>
			</div>
		)
	}

}