import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';

const styles = {
    text: {
      wordWrap: 'break-word'
    }
};

export default class ProjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.formatDate = this.formatDate.bind(this);
	}
	formatDate(date) {
		return Moment(date).fromNow();
	}

	render() {
		return (
			<div>
				<Card style = {{width:'300px', marginRight:'20px', marginBottom:'20px'}}>
					<CardHeader
			      title={this.props.project.name}
			      subtitle={this.props.project.addedBy + ' added ' + this.formatDate(this.props.project.addedOn)}
			      avatar={
			      	<Avatar>
			      		{this.props.project.name.charAt(0).toUpperCase()}
			      	</Avatar>
			      }/>
			    <CardText style={styles.text}>
			    	{this.props.project.description}
			    </CardText>
				</Card>
			</div>
		)
	}
}