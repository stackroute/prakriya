import React from 'react';
import Request from 'superagent';
import FileList from './FileList.jsx';
import FileDrop from './FileDrop.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Snackbar from 'material-ui/Snackbar';

const styles = {
	msg: {
		textAlign: 'center'
	}
}

export default class BulkUpload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			files: [],
			user: {},
			users: [],
			open: false,
			msg: ''
		}
		this.getFiles = this.getFiles.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.sendMail = this.sendMail.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.pushNotification = this.pushNotification.bind(this);
	}
	componentDidMount() {
		this.setState({
			user: this.props.user
		})
		this.getFiles();
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
	getUsers() {
		let th = this;
		Request
			.get('/admin/users')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let users = res.body.filter(function(user) {
		    		return user.email != th.state.user.email
		    	})
		    	th.setState({
		    		users: users
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
					let timestamp = new Date()
					let notification = `You have a mail from  ${th.props.user.name}|${timestamp}`
		    	th.sendMail(email, notification)
		    	th.getFiles()
		    }
			})
	}
	sendMail(email, notification) {
		let th = this;
		let emailObj = {};
		emailObj.email = email;
		emailObj.subject = 'Cadets uploaded for Mentor Connect';
		emailObj.content = this.state.user.name + ` have uploaded a list of cadets for Mentor Connect.
			Please check and further connect.`
		Request
			.post('/dashboard/sendmail')
			.set({'Authorization': localStorage.getItem('token')})
			.send(emailObj)
			.end(function(err, res){
				if(err)
					console.log(err)
				else {
					th.setState({
						open: true,
						msg: res.body.status
					})
					th.pushNotification(email, notification)
					let socket = io()
					socket.emit('mail sent', {notification: notification, to: email})
				}
			})
	}
	pushNotification(to, message) {
		console.log('push notification called: ', to , ' -- ', message)
		let th = this
		Request
			.post('/dashboard/addnotification')
			.set({'Authorization': localStorage.getItem('token')})
			.send({to: to, message: message})
			.end(function(err, res){
				console.log('Notification pushed to server', res)
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
		    	this.state.files.length > 0 ?
		    	<FileList files={this.state.files}/>
		    	:
		    	<h3 style={styles.msg}>No files uploaded</h3>
		    }
		    <Snackbar
          open={this.state.open}
          message={this.state.msg}
          autoHideDuration={4000}
        />
			</div>
		)
	}
}
