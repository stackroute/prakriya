import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import Calendar from './Calendar.jsx';

export default class Candidate extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Grid>
          <Row>
            <Col md={12}>
							<Calendar/>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
}
