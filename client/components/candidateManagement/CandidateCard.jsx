import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {lightBlack} from 'material-ui/styles/colors';
import Request from 'superagent';

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
	},
	dialog: {
		backgroundColor: '#DDDBF1',
		border: '10px solid teal'
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
	}
}

export default class CandidateCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showDeleteDialog: false,
			imageURL: '../../assets/images/avt-default.jpg',
		}
		this.getProfilePic = this.getProfilePic.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCardClick = this.handleCardClick.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
	}
	componentDidMount() {
		this.getProfilePic(this.props.candidate.EmployeeID);
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
        style={styles.actionButton}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label="Delete"
        style={styles.actionButton}
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDelete}
      />
    ]
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
			      <img style={styles.profilePic} src={this.state.imageURL} />
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
					actionsContainerStyle={styles.actionsContainer}
					bodyStyle={styles.dialog}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this candidate?
        </Dialog>
			</div>
		)
	}

}
