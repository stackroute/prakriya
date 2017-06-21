import React from 'react';
import Calendar from './Calendar.jsx';

export default class Candidate extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Calendar/>
			</div>
		)
	}
}
