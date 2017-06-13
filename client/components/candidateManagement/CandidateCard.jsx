import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import {lightBlack} from 'material-ui/styles/colors';
import Request from 'superagent';
import jsPDF from 'jspdf';
import dialog from '../../styles/dialog.json';

const styles = {
	profilePic: {
		height: 300,
		width: 300
	},
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
			showDownloadDialog: false,
			imageURL: '../../assets/images/avt-default.jpg',
		}
		this.getProfilePic = this.getProfilePic.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCardClick = this.handleCardClick.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.downloadProfile = this.downloadProfile.bind(this);
	}
	componentWillMount() {
		this.getProfilePic(this.props.candidate.EmployeeID);
	}
	getProfilePic(eid) {
		let th = this;
		Request
			.get(`/dashboard/getimage?eid=${eid}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log('Image not found for ', eid);
		    else {
		    	if(res.text) {
		    		let array = new Uint8Array(res.text.length);
		        for (var i = 0; i < res.text.length; i++){
		            array[i] = res.text.charCodeAt(i);
		        }
		        let blob = new Blob([array], {type: 'image/jpeg'});
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
	downloadProfile() {
		let doc = new jsPDF()
		let x = 10;
		let y = 20;
		doc.setFontSize(22);
		doc.text(110, y+=10, this.props.candidate.EmployeeName, 'center')
		doc.setFontSize(14);
		doc.text(x, y+=10, this.props.candidate.EmployeeID+'')
		doc.text(x, y+=10, this.props.candidate.EmailID)
		// doc.addImage(this.state.imageURL, 'JPEG', x, y+=10)
		doc.text(x, y+=10, $('<div>Hello</div>').html());
		doc.save(this.props.candidate.EmployeeID + '.pdf')
	}

	render() {
		const deleteDialogActions = [
      <FlatButton
        label="Cancel"
        style={dialog.actionButton}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label="Delete"
        style={dialog.actionButton}
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDelete}
      />
    ]
		return(
			<div style={{width: '285px', display: 'inline-block', padding: '5px'}} key={this.props.k}>
				<Card style={{border: '2px solid silver'}}>
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
			      <img style={styles.profilePic} src={this.state.imageURL} />
			    </CardMedia>
			    <CardTitle
			    	title={this.props.candidate.EmployeeID}
			    	subtitle={this.props.candidate.CareerBand}
			    	style={styles.cardTitle}
			    />
			    <CardActions style={styles.actions}>
			    	<IconButton 
			    		tooltip="Download Profile" 
			    		style={{float: 'left'}}
			    		onTouchTap={this.downloadProfile}
			    	>
				      <DownloadIcon color={lightBlack} />
				    </IconButton>
				    <IconButton tooltip="Delete Candidate" onTouchTap={this.openDeleteDialog}>
				      <DeleteIcon color={lightBlack} />
				    </IconButton>
			    </CardActions>
			  </Card>
			  <Dialog
          actions={deleteDialogActions}
					actionsContainerStyle={dialog.actionsContainer}
					bodyStyle={dialog.confirmBox}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this candidate?
        </Dialog>
			</div>
		)
	}

}
