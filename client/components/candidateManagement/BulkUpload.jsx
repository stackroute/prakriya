import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import FileUpload from 'react-fileupload';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	dropzone: {
		background: '#eee',
		height: '100px',
		borderStyle: 'dashed',
	}
}
export default class BulkUpload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showSelFile: false,
			selectedFile: {},
			data_uri: null
		}
		this.uploadCadets = this.uploadCadets.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		// this.handleFileChange = this.handleFileChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	uploadCadets() {
		this.props.uploadCadets(this.state.selectedFile)
		// this.props.uploadCadets(this.state.data_uri)
	}
	handleDrop(acceptedFiles, rejectedFiles) {
		this.setState({
			showSelFile: true,
			selectedFile: acceptedFiles[0]
		})
		console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
	}
	// handleFileChange(e) {
	// 	var self = this;
 //    var reader = new FileReader();
 //    var file = e.target.files[0];
 //    console.log('Uploaded file', file)
 //    this.props.uploadCadets(file)
 //    this.setState({
 //    	selectedFile: file
 //    })
 //    reader.onload = function(upload) {
 //      self.setState({
 //        data_uri: upload.target.result,
 //      });
 //    }
 //    reader.readAsDataURL(file);
	// }
	handleSubmit() {
		this.uploadCadets()
	}

	render() {
		return(
			<div>
		    <Grid>
	    		<Row>
	    			<Col md={6} mdOffset={3}>
	    				<Dropzone style={styles.dropzone} onDrop={this.handleDrop}>
			          <div>Drop or Click to upload csv files in required format</div>
			        </Dropzone>
					    <RaisedButton
					      label="Upload"
					      primary={true}
					      icon={<UploadIcon />}
					      onClick={this.uploadCadets}
					      disabled={!this.state.showSelFile}
					    />
					    {
					    	this.state.showSelFile &&
					    	<span>	
					    		{this.state.selectedFile.name}
					    	</span>
					    }
				    </Col>
	    		</Row>
	    	</Grid>
			</div>
		)
	}
}