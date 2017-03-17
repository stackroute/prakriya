import React from 'react';
import Request from 'superagent';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
 import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';



// let allUsers = [];

export default class UserList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			users: []
		}
	}
	componentDidMount() {
		let th = this;
		Request
			.get('/admin/users')
			.set({'Authorization': localStorage.getItem('token')})			
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else
		    	th.setState({
		    		users: res.body
		    	}) 
		    	console.log("Users");
		    	console.log(th.state.users);
			    
		    	
		    // th.context.router.push('/app')
		  });
	}
	render() {
		return (
			<div>
				<Card>
					<CardText>
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
		            {this.state.users.map( (user, index) => (
		              <TableRow key={index} selected={user.selected}>
		                <TableRowColumn>{user.username}</TableRowColumn>
		                <TableRowColumn>{user.name}</TableRowColumn>
		                <TableRowColumn>{user.role}</TableRowColumn>
		                <TableRowColumn>{user.email}</TableRowColumn>		                
		              </TableRow>
		              ))}
		          </TableBody>
		          
		        </Table>
					</CardText>
				</Card>	
				
			</div>
		);
	}
}