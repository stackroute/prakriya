import React from 'react';
import Request from 'superagent';
import FileList from './FileList.jsx';
import FileDrop from './FileDrop.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AddCandidate from './AddCandidate.jsx';

export default class BulkUpload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			files: []
		}
		this.getFiles = this.getFiles.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.addCandidate = this.addCandidate.bind(this);
	}
	componentDidMount() {
		this.getFiles();
	}
	getFiles() {
		let th = this;
		Request
			.get('/dashboard/files')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Response came from the server', res.body)
		    	if(res.body.length > 0) {
		    		let files = res.body.sort(function(a,b) {
		    			if (a.submittedOn > b.submittedOn)
						    return -1;
						  if (a.submittedOn < b.submittedOn)
						    return 1;
						  return 0;
		    		})
		    		th.setState({
			    		files: files
		    		})
		    	}
		    }
		  })
	}

	handleUpload(file) {
		let th = this;
		Request
			.post('/upload/cadets')
			.set({'Authorization': localStorage.getItem('token')})
			.attach('file', file)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('File uploaded:', res.body.fileName)
		    	th.getFiles();
		    }
			})
	}

	addCandidate(candidate) {
		let th = this;
		Request
			.post('/dashboard/addcandidate')
			.set({'Authorization': localStorage.getItem('token')})
			.send(candidate)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Success');
		    }
			})
	}

	render() {
		let th = this;
		return(
			<div>
		   <AddCandidate addCandidate={this.addCandidate}/>
				 <FileDrop uploadCadets={this.handleUpload}/>
		    {
		    	this.state.files.length > 0 &&
		    	<FileList files={this.state.files}/>
		    }
			</div>
		)
	}
}