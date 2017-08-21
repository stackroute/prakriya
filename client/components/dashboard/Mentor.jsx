import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import WaveDetails from './WaveDetails.jsx';

export default class Mentor extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Grid>
          <Row>
            <Col md={12}>
							<WaveDetails />
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
}
