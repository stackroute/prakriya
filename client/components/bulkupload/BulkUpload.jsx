import React from 'react';
import Request from 'superagent';
import FileList from './FileList.jsx';
import FileDrop from './FileDrop.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';

export default class BulkUpload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			files: [],
			user: {},
			users: []
		}
		this.getFiles = this.getFiles.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.sendMail = this.sendMail.bind(this);
		this.getUser = this.getUser.bind(this);
		this.getUsers = this.getUsers.bind(this);
	}
	componentDidMount() {
		console.log('User obj', this.props.user);
		this.getFiles();
		this.getUser();
		this.getUsers();
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
	getUser() {
		let th = this;
		Request
			.get('/dashboard/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		user: res.body
		    	})
		    }
		  })
	}
	getUsers() {
		let th = this;
		Request
			.get('/admin/users')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		users: res.body
		    	})
		    }
		  })
	}
	handleUpload(file, email) {
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
		    	th.sendMail(email);
		    	th.getFiles();
		    }
			})
	}
	sendMail(email) {
		let emailObj = {};
		emailObj.email = email;
		emailObj.subject = 'Cadets uploaded for Mentor Connect';
		emailObj.content = this.props.user.name + ` have uploaded a list of cadets for Mentor Connect. 
			Please check and further connect.`
		Request
			.post('/dashboard/sendmail')
			.set({'Authorization': localStorage.getItem('token')})
			.send(emailObj)
			.end(function(err, res){
				if(err)
					console.log(err)
				else {
					console.log('Mail sent...')
				}
			})
	}

	render() {
		let th = this;
		return(
			<div>
	   	 	<FileDrop 
	   	 		uploadCadets={this.handleUpload}
	   	 		user={this.state.user}
	   	 		users={this.state.users}
	   	 	/>
		    {
		    	this.state.files.length > 0 &&
		    	<FileList files={this.state.files}/>
		    }
			</div>
		)
	}
}