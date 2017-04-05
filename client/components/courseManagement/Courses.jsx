import React from 'react';
import AddCourse from './AddCourse.jsx';

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div>
				<AddCourse />
			</div>
		)
	}
}