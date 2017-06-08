import React from 'react';
import Request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import Paper from 'material-ui/Paper';
import Moment from 'moment';
import WaveDetails from './WaveDetails.jsx';

const styles = {
	lastLogin: {
		height: 50,
		padding: 15,
		textAlign: 'center',
		background: '#C6D8D3'
	},	
	heading: {
		textAlign: 'center'
	},
	card: {
		margin: 'auto'
	}
}

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			user: {}
		}
		this.formatDate = this.formatDate.bind(this); 
	}
	componentWillMount() {
		this.setState({
			user: this.props.user
		})
	}
	formatDate(date) {
		if(date) {
			return Moment(date).fromNow();
		}
		else 
			return 'First time login' 
	}

	render() {
		return(
			<div>
				<h2 style={styles.heading}>Dashboard</h2>
				<Grid>
					<Row>
						<Col md={5} mdOffset={1}>
							{
								(this.state.user.role == 'wiproadmin' ||
									this.state.user.role == 'sradmin') &&
								<WaveDetails />
							}
						</Col>
					  <Col md={3} mdOffset={2} >
					  	<Paper style={styles.lastLogin} zDepth={1} >
					  		<strong>Last Login: </strong> 
					  		{this.formatDate(this.props.user.lastLogin)}
					  	</Paper>
					  </Col>
				  </Row>
			  </Grid>
			</div>
		)
	}

}
