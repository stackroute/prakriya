import React from 'react';
import BulkUpload from './BulkUpload.jsx';
import Request from 'superagent';

export default class RoleManagement extends React.Component {
	constructor(props) {
		super(props)
		this.handleUpload = this.handleUpload.bind(this);
		this.hanbleDrag = this.handleDrag.bind(this);
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
		    	console.log('Response came from the server', res.text)
		    }
		  })
	}
	handleDrag() {
		console.log('Hello');
	}

	render() {
		return(
			<div onDrag={this.handleDrag}>
				<BulkUpload uploadCadets={this.handleUpload}/>
			</div>
		)
	}
}