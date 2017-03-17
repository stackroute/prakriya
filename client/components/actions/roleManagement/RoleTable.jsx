import React from 'react';
import Request from 'superagent';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';

const roles = [
	'Admin',
	'Mentors',
	'SR Administrator',
	'WD Administrator',
	'Sponsors',
	'Candidate'
]
export default class RoleTable extends React.Component {
	constructor(props) {
		super(props)
		this.setState = {
			roles: []
		}
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
		    	console.log(th)
		    	th.setState({
		    		roles: res.body
		    	})
		    	console.log('Roles in state ',th.state.roles)
		    }
			})
	}
	render() {
		return (
			<div>
				<Table>
			    <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
			      <TableRow>
			        <TableHeaderColumn>Role</TableHeaderColumn>
			        <TableHeaderColumn>Status</TableHeaderColumn>
			      </TableRow>
			    </TableHeader>
			    <TableBody displayRowCheckbox={false} >
			    	{
			    		roles.map((obj, index) => (
			    			<TableRow key={index}>
					        <TableRowColumn>{obj.role}</TableRowColumn>
					        <TableRowColumn>Edit Delete</TableRowColumn>
					      </TableRow>
			    		))
			    	}
			    </TableBody>
			  </Table>
			</div>
		);
	}
}