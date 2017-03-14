import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';

export default class SignUp extends React.Component {

	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		return(
			<Grid>
        <Row>
          <Col xs={12} md={6}></Col>
          <Col xs={12} md={6}>Hello, world!</Col>
        </Row>
      </Grid>
		)
	}

}