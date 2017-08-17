import React from 'react';

export default class CandidateProfile extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div>
				<br />
				<br />
				<center>
					<h3>Candidate ID: {this.props.routeParams.id}</h3>
				</center>
			</div>
		);
	}
}
