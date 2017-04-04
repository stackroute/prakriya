import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const tableItems = [
	{
		course: 'React JS',
		expected: 10,
		actual: 12,
		remarks: 'Expert in React'
	},
	{
		course: 'Express JS',
		expected: 10,
		actual: 7,
		remarks: 'Need to do more hands on exercises on Express'
	},
	{
		course: 'Node JS',
		expected: 10,
		actual: 10,
		remarks: 'Good in Node JS'
	},
	{
		course: 'Mongo DB',
		expected: 10,
		actual: 5,
		remarks: 'Need to put more efforts on Mongo'
	},
]
export default class PerformanceMatrix extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<Table>
		    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
		      <TableRow>
		        <TableHeaderColumn>Courses</TableHeaderColumn>
		        <TableHeaderColumn>Expected</TableHeaderColumn>
		        <TableHeaderColumn>Actual</TableHeaderColumn>
		        <TableHeaderColumn>Remarks</TableHeaderColumn>
		      </TableRow>
		    </TableHeader>
		    <TableBody displayRowCheckbox={false}>
		    	{
		    		tableItems.map(function(item, key) {
		    			return <TableRow key={key}>
				        <TableRowColumn>{item.course}</TableRowColumn>
				        <TableRowColumn>{item.expected}</TableRowColumn>
				        <TableRowColumn>{item.actual}</TableRowColumn>
				        <TableRowColumn>{item.remarks}</TableRowColumn>
				      </TableRow>
		    		})
		    	}
		    </TableBody>
		  </Table>
		)
	}
}