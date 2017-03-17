import React from 'react';
import Request from 'superagent';
import {Card} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
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

const styles = {
	card: {
		width: '700x',
		margin: 'auto',
		fontSize: '20px'
	},
	chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}

export default class RoleTable extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			roles: []
		}
		this.handlePermissionDelete = this.handlePermissionDelete.bind(this);
	}
	handlePermissionDelete() {
		console.log('Permission Deleted')
	}
	render() {
		let th = this
		return (
			<div>
				<Card style={styles.card}>
					<Table>
				    <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
				      <TableRow>
				        <TableHeaderColumn>Role</TableHeaderColumn>
				        <TableHeaderColumn>Status</TableHeaderColumn>
				      </TableRow>
				    </TableHeader>
				    <TableBody displayRowCheckbox={false} >
				    	{
				    		this.props.roles.map((obj, index) => (
				    			<TableRow key={index}>
						        <TableRowColumn>{obj.role}</TableRowColumn>
						        <TableRowColumn>
						        	<Chip
							          onRequestDelete={th.handlePermissionDelete}
							          style={styles.chip}
							        >
							          Users
							        </Chip>
							        <Chip
							          onRequestDelete={th.handlePermissionDelete}
							          style={styles.chip}
							        >
							          Roles
							        </Chip>
						        </TableRowColumn>
						      </TableRow>
				    		))
				    	}
				    </TableBody>
				  </Table>
			  </Card>
			</div>
		);
	}
}