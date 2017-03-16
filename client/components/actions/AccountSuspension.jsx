import React from 'react';
import Request from 'superagent';

// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';

// let allUsers = [];

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
];


export default class AccountSuspension extends React.Component {
	componentDidMount() {
		Request
			.get('/admin/users')
			.set({'Authorization': localStorage.getItem('token')})			
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else
		    	allUsers = res.body;
		    	console.log("Users");
		    	console.log(allUsers);
			    
		    	
		    // th.context.router.push('/app')
		  });
	}
	render() {
		return (
			<div>
				<Table
		          height='300px'
		          fixedHeader={true}
		          fixedFooter={true}
		          selectable={true}
		          multiSelectable={true}
		        >
		          <TableHeader
		            displaySelectAll={true}
		            adjustForCheckbox={true}
		            enableSelectAll={true}
		          >
		            <TableRow>
		              <TableHeaderColumn colSpan="3" tooltip="Super Header" style={{textAlign: 'center'}}>
		                Available Users
		              </TableHeaderColumn>
		            </TableRow>
		            <TableRow>
		              <TableHeaderColumn tooltip="Username">Username</TableHeaderColumn>
		              <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
		              <TableHeaderColumn tooltip="Role">Role</TableHeaderColumn>
		              <TableHeaderColumn tooltip="Email">Email</TableHeaderColumn>
		            </TableRow>
		          </TableHeader>
		          <TableBody
		            displayRowCheckbox={true}
		            deselectOnClickaway={true}
		            showRowHover={true}
		            stripedRows={true}
		          >
		            {allUsers.map( (user, index) => (
		              <TableRow key={index} selected={user.selected}>
		                <TableRowColumn>{user.username}</TableRowColumn>
		                <TableRowColumn>{user.name}</TableRowColumn>
		                <TableRowColumn>{user.role}</TableRowColumn>
		                <TableRowColumn>{user.email}</TableRowColumn>		                
		              </TableRow>
		              ))}
		          </TableBody>
		          
		        </Table>
			</div>
		);
	}
}