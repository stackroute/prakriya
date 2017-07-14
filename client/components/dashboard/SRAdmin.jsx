import React from 'react';
import WaveDetails from './WaveDetails.jsx';
import GetFeedback from './GetFeedback.jsx';

export default class SRAdmin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<WaveDetails /> <br />
				<GetFeedback />
			</div>
		)
	}
}
