import React from 'react';
import Request from 'superagent';
import IconButton from 'material-ui/IconButton';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'; 
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
// import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';
import FlatButton from 'material-ui/FlatButton';


export default class UserList extends React.Component {
	constructor(props) {
		super(props)
		// this.state = {
		// 	users: []
		// }
	}
	
	render() {
		console.log(this.props)
		return (
			<div>
				
					<Card>

						<CardMedia overlay={<CardTitle title={this.props.currUser.name} subtitle={this.props.currUser.email} />}>
				      <img src="../../../assets/images/avt-default.jpg" />
				    </CardMedia>
				    <CardTitle subtitle={this.props.currUser.username} />							
						<CardActions>
						  <FlatButton label="Edit" />
						  <FlatButton label="Remove" />
						</CardActions>

				  </Card>
			  
			</div>
			
		);
	}
}

