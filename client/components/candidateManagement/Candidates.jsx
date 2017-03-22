import React from 'react';
import BulkUpload from './BulkUpload.jsx';

export default class RoleManagement extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div>
				<BulkUpload />
			</div>
		)
	}
}