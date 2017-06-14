import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import {Grid, Row, Col} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import {CSVLink, CSVDownload} from 'react-csv';
import Request from 'superagent';

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
	},
	downloadIcon: {
		float: 'right'
	},
	uploadBtn: {
		marginTop: 20, 
		float: 'left'
	}
}

export default class FileDrop extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			template: [],
			showSelFile: false,
			selectedFile: {}
		}
		this.getTemplate = this.getTemplate.bind(this);
		this.handleUpdateRemarks = this.handleUpdateRemarks.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}

	componentWillMount() {
		this.getTemplate();	
	}

	getTemplate() {
		let th = this;
		Request
			.get('/dashboard/remarkstemplate')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		template: res.body
		    	})
		    }
		  })
	}
	handleUpdateRemarks() {
		this.setState({
			showSelFile: false
		})
		this.props.handleBulkUpdateRemarks(this.state.selectedFile)
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
				<Row>
					<Col md={6} mdOffset={9}>
						<CSVLink 
							data={this.state.template}
							filename={"remarks_template.csv"} 
						>
							<FlatButton
					      label="Template"
					      secondary={true}
					      icon={<DownloadIcon />}
					      style={styles.downloadIcon}
					    />
					  </CSVLink>
					</Col>
				</Row>
    		<Row>
    			<Col md={12} mdOffset={3}>
						<Dropzone style={styles.dropzone} onDrop={this.handleDrop}>
		          <div>Drop or Click to upload csv files in required format</div>
		        </Dropzone>
				    <RaisedButton
				      label="Upload"
				      primary={true}
				      icon={<UploadIcon />}
				      onClick={this.handleUpdateRemarks}
				      disabled={!this.state.showSelFile}
				      style={styles.uploadBtn}
				    />
				    {
				    	this.state.showSelFile &&
				    	<span>
				    		{this.state.selectedFile.name}
				    	</span>
				    }
	    		</Col>
    		</Row>
			</div>
		)
	}
}
