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

export default class UpdateProfileLogo extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			disableUpdatePicture: true,
			picFile: {},
			picPreview: '',
			imageURL: '../assets/images/avt-default.jpg'
		};

		this.onDrop = this.onDrop.bind(this);
		this.updatePicture = this.updatePicture.bind(this);
    this.getProductLogo = this.getProductLogo.bind(this);
	}

	componentWillMount() {
		this.getProductLogo(this.props.productname);
	}

	onDrop(acceptedFiles, rejectedFiles) {
		this.setState({
			picFile: acceptedFiles[0],
			picPreview: acceptedFiles[0].preview,
			disableUpdatePicture: false
		});
	}

  getProductLogo(projectname) {
  	let th = this;
  	Request
  		.get(`/dashboard/getimage`)
  		.set({'Authorization': localStorage.getItem('token')})
      .query({filename: projectname})
  		.end(function(err, res) {
  			if(err) {
    	    	console.log('Profile pic not found.');
        } else {
  	    	if(res.text) {
  		    	th.setState({
  		    		imageURL: res.text
  		    	})
  	    	}
  	    }
  		})
  }

	updatePicture() {
		let th = this;
		let picFile = this.state.picFile;
		let projectname = this.props.productname;
		let project = {
			projectname: projectname
		};
		Request
			.post('/dashboard/saveProjectLogo')
			.set({'Authorization': localStorage.getItem('token')})
			.field('project', JSON.stringify(project))
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
		    }
			});
		th.props.handleClose();
	}

	render() {
		console.log(this.props.productname)
		return(
			<Card style={styles.card}>
				<Dropzone
					accept="image/jpeg, image/png"
					onDrop={this.onDrop}
					style={styles.dropzone}
				>
					<CardMedia>
						<img src={this.state.picPreview || this.state.imageURL} style={styles.picPreview}/>
					</CardMedia>
				</Dropzone>
				 <CardText>
					 <RaisedButton
					 	label="Update Picture"
						disabled={this.state.disableUpdatePicture}
						onClick={this.updatePicture}
						style={{width: '100%', backgroundColor: '#202D3E'}} />
				 </CardText>
			</Card>
		)
	}
}
