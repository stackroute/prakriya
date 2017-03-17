import React from 'react';
import Request from 'superagent';
import AddRole from './AddRole.jsx';
import RoleTable from './RoleTable.jsx';

const style = {
	textAlign: 'center'
}

export default class RoleManagement extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			roles: []
		}
		this.addRole = this.addRole.bind(this);
	}
	componentDidMount() {
		let th = this
		Request
			.get('/admin/roles')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		roles: res.body
		    	})
		    }
			})
	}
	addRole(role) {
		let th = this
		Request
			.post('/admin/addrole')
			.set({'Authorization': localStorage.getItem('token')})
			.send(role)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Added role and Server responded',res.body)
		    	let roles = th.state.roles;
		    	roles.push(res.body);
		    	th.setState({
		    		roles: roles
		    	})
		    }
			})
	} 
	render() {
		return (
			<div style={style} >
				<AddRole addRole={this.addRole}/>
				<h1>Role Management</h1>
				<RoleTable roles={this.state.roles}/>
			</div>
		);
	}
}