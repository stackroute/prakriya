import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import UploadIcon from 'material-ui/svg-icons/file/file-upload';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
	}
}

export default class FileDrop extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			template: [],
			showSelFile: false,
			selectedFile: {},
			email: ''
		}
		this.getTemplate = this.getTemplate.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.uploadCadets = this.uploadCadets.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
	}

	componentWillMount() {
		this.getTemplate();	
	}

	getTemplate() {
		let th = this;
		Request
			.get('/dashboard/candidatetemplate')
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
	uploadCadets() {
		this.props.uploadCadets(this.state.selectedFile, this.state.email)
		this.setState({
			showSelFile: false,
			email: ''
		})
	}
	handleEmailChange(event, key, val) {
		this.setState({
			email: val
		})
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
						<Col md={2} mdOffset={7}>
							<CSVLink 
								data={this.state.template}
								filename={"candidate_template.csv"} 
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
	    			<Col md={6} mdOffset={3}>
							<Dropzone style={styles.dropzone} onDrop={this.handleDrop}>
			          <div>Drop or Click to upload csv files using given template</div>
			        </Dropzone>
			        <SelectField
			          value={this.state.email}
			          onChange={this.handleEmailChange}
			          floatingLabelText="Notify to..."
			          fullWidth={true}
			        >
			          {
			          	this.props.users.map((user, i) => {
			          		return (
			          			<MenuItem key={i} value={user.email} primaryText={user.email} />
			          		)
			          	})
			          }
			        </SelectField>
			        <br/>
					    <RaisedButton
					      label="Upload"
					      primary={true}
					      icon={<UploadIcon />}
					      onClick={this.uploadCadets}
					      disabled={!(this.state.showSelFile && this.state.email)}
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
