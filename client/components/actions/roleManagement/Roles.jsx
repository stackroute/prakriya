import React from 'react';
import AddRole from './AddRole.jsx';
import RoleTable from './RoleTable.jsx';

const style = {
	textAlign: 'center'
}

export default class RoleManagement extends React.Component {
	constructor(props) {
		super(props)
		// this.state = {

		// }
	}
	render() {
		return (
			<div style={style} >
				<AddRole />
				<h1>Role Management</h1>
				<RoleTable />
			</div>
		);
	}
}