import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {green500, cyan500, yellow600} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar'; 
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import Warning from 'material-ui/svg-icons/action/info';
import Humanize from 'humanize';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import {Grid, Row, Col} from 'react-flexbox-grid';

export default class FileList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showList: false
		}
		this.formatDate = this.formatDate.bind(this);
		this.rightIcon = this.rightIcon.bind(this);
	}
	formatDate(date) {
		if(date) {
			let newdate = new Date(date)
			return Humanize.naturalDay(newdate, 'H:i:s dS M, Y')
		}
		else 
			return '-' 
	}
	rightIcon(status) {
		if(status == 'processing')
		 	return <Warning color={yellow600}/>
		else 
			return <CheckIcon color={green500}/>
	}

	render() {
		let th = this;
		return(
			<Grid>
    		<Row>
    			<Col md={8} mdOffset={2}>
    				<Paper>
				    	<List>
				    		{
						    	this.props.files.map(function(file, key) {
						    		return(
						    			<ListItem
						    			 	key={key} 
						    				leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={cyan500} />}
						    				primaryText={file.fileName}
		        						secondaryText={
		        							<p>
			        							Submitted On: {th.formatDate(file.submittedOn)}<br/>
			        							Completed On: {th.formatDate(file.completedOn)}
		        							</p>
		        						}
		        						rightIcon={th.rightIcon(file.status)}
		        					>
		        					</ListItem>
						    		)
						    	})
						    }
					    </List>
	    			</Paper>
				  </Col>
			  </Row>
    	</Grid>
		)
	}
}