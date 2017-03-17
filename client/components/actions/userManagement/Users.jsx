import React from 'react';
import AddUser from './AddUser.jsx';
import UserList from './UserList.jsx';

const style = {
	textAlign: 'center'
}

export default class Users extends React.Component {
	constructor(props) {
		super(props)
		// this.state = {

		// }
	}
	render() {
		return (
			<div style={style} >
				<AddUser />
				<h1>User Management</h1>
				<UserList />
			</div>
		);
	}
}