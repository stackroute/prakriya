import React from 'react';
import Request from 'superagent';
import AddRole from './AddRole.jsx';
import RoleItem from './RoleItem.jsx';

const styles = {
	heading: {
		textAlign: 'center'
	}
}

export default class RoleManagement extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			roles: [],
			permissions: []
		}
		this.addRole = this.addRole.bind(this);
		this.deleteRole = this.deleteRole.bind(this);
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

		// Request
		// 	.get('/admin/permissions')
		// 	.set({'Authorization': localStorage.getItem('token')})
		// 	.end(function(err, res) {
		// 		if(err)
		//     	console.log(err);
		//     else {
		//     	th.setState({
		//     		permissions: res.body
		//     	})
		//     }
		// 	})
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
	deleteRole(role) {
		console.log('Role from request',role)
		let th = this
		let roleObj = {
      "role": role
    }
		Request
			.delete('/admin/deleterole')
			.set({'Authorization': localStorage.getItem('token')})
			.send(roleObj)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let roles = th.state.roles.filter(function(roleObj) {
		    		return role != roleObj.role;
		    	})
		    	th.setState({roles: roles})
		    	console.log('Roles in state',th.state.roles)
		    }
		  })
	}
	render() {
		let th = this;
		return (
			<div >
				<AddRole addRole={this.addRole}/>
				<h1 style={styles.heading}>Role Management</h1>
				{
					this.state.roles.map(function (role, index) {
						return(
							<RoleItem roleperm={role} permissions={th.state.permissions} key={index} deleteRole={th.deleteRole} />
						)
					})
				}
			</div>
		);
	}
}