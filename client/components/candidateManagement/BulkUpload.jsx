import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import FileUpload from 'react-fileupload';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	dropzone: {
		// background: '#eee'
	}
}
export default class BulkUpload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			enableDrop: false,
			selFileName: '',
			showSelFile: false
		}
		this.showUpload = this.showUpload.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}
	showUpload() {
		this.setState({
			enableDrop: true
		})
	}
	handleDrop(acceptedFiles, rejectedFiles) {
		this.setState({
			showSelFile: true,
			selFileName: acceptedFiles[0].name
		})
		console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
	}

	render() {
		return(
			<div>
				<FlatButton
		      label="Upload"
		      primary={true}
		      icon={<UploadIcon />}
		      onClick={this.showUpload}
		    />
		    {
		    	this.state.enableDrop &&
		    	<Dropzone onDrop={this.handleDrop}>
	          <div>Drop or Click to upload csv files in required format</div>
	        </Dropzone>
		    }
		    {
		    	this.state.showSelFile &&
		    	<span>	
		    		{this.state.selFileName}
		    	</span>
		    }
			</div>
		)
	}
}