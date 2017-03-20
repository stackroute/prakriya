import React from 'react';
import Request from 'superagent';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	avatar: {
		margin: '3px 10px'
	},
	card: {
		background: '#eeeeee'
	},
	paper: {
		margin: '5px',
		padding: '5px',
		display: 'flex',
		width: '400px',
		height: '120px'
	},
	chip: {
    margin: '4px',
  },
}

export default class RoleItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			permissions: []
		}
		this.handlePermissionDelete = this.handlePermissionDelete.bind(this);
	}
	componentDidMount() {
		this.setState({
			permissions: this.props.roleperm.permissions
		})
	} 
	handlePermissionDelete() {
		console.log('Permission Deleted')
	}
	render() {
		let th = this;
		let role = this.props.roleperm.role.charAt(0).toUpperCase() + this.props.roleperm.role.slice(1)
		console.log(this.props.roleperm)
		return (
			<div>
				<Card style={styles.card} >
					<Grid>
						<Row middle="md">
							<Col md={2}>
								<CardText>
									<Avatar style={styles.avatar}>{this.props.roleperm.role.charAt(0).toUpperCase()}</Avatar>
									{role}
								</CardText>
							</Col>
							<Col md={4} mdOffset={1}>
								<Paper style={styles.paper} zDepth={1} >
									{
										this.state.permissions.map(function (permission, index) {
											return(
												<Chip
													onRequestDelete={th.handlePermissionDelete}
								          style={styles.chip}
								          key={index}
								        >
								          {permission}
								        </Chip>
							        )
										})
									}
								</Paper>
							</Col>
						</Row>
					</Grid>
			  </Card>
			</div>
		);
	}
}