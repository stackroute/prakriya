import React from 'react';

export default class ProductProfile extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<br />
				<br />
				<center>
					<h3>Version Name: {this.props.routeParams.versionname}</h3>
				</center>
			</div>
		);
	}
}
