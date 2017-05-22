import React from 'react';
import Request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import Paper from 'material-ui/Paper';
import Moment from 'moment';

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
		this.getUser = this.getUser.bind(this);
		this.formatDate = this.formatDate.bind(this); 
	}
	componentDidMount() {
		this.getUser()
	}
	getUser() {
		let th = this
		Request
			.get('/dashboard/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				if(err)
					console.log(err)
				else {
					th.setState({
						user: res.body
					})
				}
			})
	}
	formatDate(date) {
		if(date) {
			return Moment(date).fromNow();
		}
		else 
			return '-' 
	}

	render() {
		return(
			<div>
				<h1 style={styles.heading}>This is {this.state.user.name} dashboard</h1>
				<Grid>
					<Row>
						<Col md={6} mdOffset={1} >
							<Card style={styles.card} >
						    <CardHeader
						      title={this.state.user.name}
						      subtitle={this.state.user.username}
						      avatar="../assets/images/avt-default.jpg"
						    />
						    <CardMedia
						      overlay={<CardTitle title={this.state.user.name} subtitle={this.state.user.username} />}
						    >
						      <img src="../assets/images/avt-default.jpg" />
						    </CardMedia>
						  </Card>
					  </Col>
					  <Col md={3} mdOffset={1} >
					  	<Paper style={styles.lastLogin} zDepth={1} >
					  		<strong>Last Login: </strong> 
					  		{
					  			this.formatDate(this.props.user.lastLogin)
					  		}
					  	</Paper>
					  </Col>
				  </Row>
			  </Grid>
			</div>
		)
	}

}
