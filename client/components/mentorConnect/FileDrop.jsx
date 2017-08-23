import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import {CSVLink, CSVDownload} from 'react-csv';
import Request from 'superagent';

const styles = {
	paper: {
		padding: '10px',
		backgroundColor: '#C6D8D3'
	},
	dropzone: {
		background: '#eee',
		height: '100px',
		borderStyle: 'dashed',
		paddingTop: '40px',
		boxSizing: 'border-box',
		textAlign: 'center'
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
	}

	render() {
		return(
			<div>
				<Paper style={styles.paper}>
					<div>
						<Dropzone style={styles.dropzone} onDrop={this.handleDrop}>
							<div>Drop or Click to upload csv files in required format</div>
						</Dropzone>
					</div>
				</Paper>
				<Paper style={styles.paper}>
					<div style={{textAlign: 'left', padding: '3px'}}>
						<RaisedButton
							label="Upload"
							primary={true}
							icon={<UploadIcon />}
							onClick={this.handleUpdateRemarks}
							disabled={!this.state.showSelFile}
						/>
						{
							this.state.showSelFile ?
							<span> {this.state.selectedFile.name}</span> :
							<span> No File Selected.</span>
						}
					</div>
					<div style={{textAlign: 'right', padding: '3px'}}>
						<CSVLink
							data={this.state.template}
							filename={"remarks_template.csv"}
						>
							<FlatButton
					      label="Template"
					      secondary={true}
					      icon={<DownloadIcon />}
					    />
					  </CSVLink>
					</div>
				</Paper>
			</div>
		)
	}
}
