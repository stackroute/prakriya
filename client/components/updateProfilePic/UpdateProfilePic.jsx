import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';
import {Card, CardMedia, CardText} from 'material-ui/Card';
import Dropzone from 'react-dropzone';

const styles = {
	picPreview: {
		height: 250,
		width: '100%'
	},
	card: {
		background: 'rgba(255,255,255,0.15)',
	},
	dropzone: {
		borderStyle: 'solid'
	}
}

export default class UpdateProfilePic extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			disableUpdatePicture: true,
			defaultProfilePic: '../../assets/images/avt-default.jpg',
			picFile: {},
			picPreview: '',
		};

		this.onDrop = this.onDrop.bind(this);
		this.getPicture = this.getPicture.bind(this);
		this.updatePicture = this.updatePicture.bind(this);
	}

	onDrop(acceptedFiles, rejectedFiles) {
		this.setState({
			picFile: acceptedFiles[0],
			picPreview: acceptedFiles[0].preview,
			disableUpdatePicture: false
		});
	}

	getPicture() {

	}

	updatePicture() {
		let th = this;
		let picFile = this.state.picFile;
		let username = this.props.username;
		let non_cadet = {
			username: username
		};

		Request
			.post('/dashboard/saveimage')
			.set({'Authorization': localStorage.getItem('token')})
			.field('non_cadet', JSON.stringify(non_cadet))
			.attach('file', picFile)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let array = new Uint8Array(res.text.length);
	        for (var i = 0; i < res.text.length; i++){
	            array[i] = res.text.charCodeAt(i);
	        }
	        var blob = new Blob([array], {type: 'image/jpeg'});
		    	let blobUrl = URL.createObjectURL(blob);
		    	th.setState({
		    		imageURL: blobUrl
		    	});
		    }
			});
		th.props.handleClose();
	}

	render() {
		return(
			<Card style={styles.card}>
				<Dropzone
					accept="image/jpeg, image/png"
					onDrop={this.onDrop}
					style={styles.dropzone}
				>
					<CardMedia>
						<img src={this.state.picPreview} style={styles.picPreview}/>
					</CardMedia>
				</Dropzone>
				 <CardText>
					 <RaisedButton
					 	label="Update Picture"
						primary={true}
						disabled={this.state.disableUpdatePicture}
						onClick={this.updatePicture}
						style={{width: '100%'}} />
				 </CardText>
			</Card>
		)
	}
}
