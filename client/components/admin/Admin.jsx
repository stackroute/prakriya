import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Request from 'superagent';
import AddUser from './AddUser.jsx';

export default class Admin extends React.Component {

	constructor(props) {
		super(props)
		this.authenticate = this.authenticate.bind(this)
	}

	authenticate() {
		Request
			.get('/admin/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				alert(res.text)
			});
	}

	render() {
		return(
			<div>
				<h1>Welcome to Admin Page</h1>
				<RaisedButton label="Login" primary={true} onClick={this.authenticate} />
			</div>
		)
	}

}