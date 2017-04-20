import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	container: {
		marginTop: 10,
		marginBottom: 20
	},
	dropzone: {
		background: '#eee',
		height: '100px',
		borderStyle: 'dashed',
		paddingTop: '40px',
		boxSizing: 'border-box'
	}
}

export default class FileDrop extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showSelFile: false,
			selectedFile: {}
		}
		this.uploadCadets = this.uploadCadets.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}
	uploadCadets() {
		this.setState({
			showSelFile: false
		})
		this.props.uploadCadets(this.state.selectedFile)
	}
	handleDrop(acceptedFiles, rejectedFiles) {
		this.setState({
			showSelFile: true,
			selectedFile: acceptedFiles[0]
		})
		console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
	}

	render() {
		return(
			<div style={styles.container}>
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
