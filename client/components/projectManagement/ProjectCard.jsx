import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';

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
				<Card>
					<CardHeader
			      title={this.props.project.name}
			      subtitle={this.props.project.addedBy + ' added ' + this.formatDate(this.props.project.addedOn)}
			      avatar={
			      	<Avatar>
			      		{this.props.project.name.charAt(0).toUpperCase()}
			      	</Avatar>
			      }
			      actAsExpander={true}
      			showExpandableButton={true}
			    />
			    <CardText expandable={true}>
			    	{this.props.project.description}
			    </CardText>
				</Card>
			</div>
		)
	}
}