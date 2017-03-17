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
export default class UserList extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		Request
			.get('/admin/roles')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				
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
			    		roles.map((role, index) => (
			    			<TableRow key={index}>
					        <TableRowColumn>{role}</TableRowColumn>
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