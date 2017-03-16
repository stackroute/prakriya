import React from 'react';
import Request from 'superagent';

// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';



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
			// .send(user)
			.end(function(err, res){
		    // Do something
		    
		    if(res.status==200)
		    	alert("api hit!!!!!!!");
		    	
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
		              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
		              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
		              <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
		            </TableRow>
		          </TableHeader>
		          <TableBody
		            displayRowCheckbox={true}
		            deselectOnClickaway={true}
		            showRowHover={true}
		            stripedRows={true}
		          >
		            {tableData.map( (row, index) => (
		              <TableRow key={index} selected={row.selected}>
		                <TableRowColumn>{index}</TableRowColumn>
		                <TableRowColumn>{row.name}</TableRowColumn>
		                <TableRowColumn>{row.status}</TableRowColumn>
		              </TableRow>
		              ))}
		          </TableBody>
		          
		        </Table>
			</div>
		);
	}
}