import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';

export default class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wave: {},
			sessions: []
		}
	}
	componentWillMount() {
		this.setState({
			wave: this.props.wave,
			sessions: this.props.sessions
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			wave: nextProps.wave,
			sessions: nextProps.sessions
		})
	}

	render() {
		return(
			<div>
				<Table>
	        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
	          <TableRow>
	            <TableHeaderColumn>Day</TableHeaderColumn>
	            <TableHeaderColumn>Name</TableHeaderColumn>
	            <TableHeaderColumn>Skills</TableHeaderColumn>
	            <TableHeaderColumn>Session By</TableHeaderColumn>
	            <TableHeaderColumn>Session On</TableHeaderColumn>
	          </TableRow>
	        </TableHeader>
	        <TableBody displayRowCheckbox={false}>
	        	{
	        		this.state.sessions.map(function(session, i) {
	        			return (
	        				<TableRow key={i}>
				            <TableRowColumn>{session.Day}</TableRowColumn>
				            <TableRowColumn>{session.Name}</TableRowColumn>
				            <TableRowColumn>{session.Skills}</TableRowColumn>
				            <TableRowColumn>{session.SessionBy}</TableRowColumn>
				            <TableRowColumn>{session.SessionOnss}</TableRowColumn>
				          </TableRow>
	        			)
	        		})
	        	}
	          
	        </TableBody>
	      </Table>
			</div>
		)
	}
}