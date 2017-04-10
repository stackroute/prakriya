import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {green500, cyan500, yellow600} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar'; 
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import Download from 'material-ui/svg-icons/file/file-download';
import Warning from 'material-ui/svg-icons/action/info';
import Humanize from 'humanize';
import Moment from 'moment';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	fileDetail: {
		marginTop: 5,
		marginBottom: 20,
		paddingLeft: 50,
		paddingRight: 50,
		fontSize: 13
	},
	download: {
		float: 'right',
		cursor: 'pointer'
	}
}

export default class FileList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showList: false
		}
		this.formatDate = this.formatDate.bind(this);
		this.rightIcon = this.rightIcon.bind(this);
		this.handleDownload = this.handleDownload.bind(this);
	}
	formatDate(date) {
		if(date) {
			return Moment(date).fromNow();
			// return Humanize.naturalDay(newdate,'H:i:s dS M, Y')
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
	handleDownload(file) {
		console.log('Download clicked', file);
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
		        						rightIcon={th.rightIcon(file.status)}
		        						secondaryTextLines={2}
		        						secondaryText={
		        							<p>
		        								{file.addedBy} added {th.formatDate(file.submittedOn)}<br/>
		        								Import Completed {th.formatDate(file.completedOn)} with
		        								Total: {file.totalCadets} &nbsp;
		        								Imported: {file.importedCadets} &nbsp;
					                	Failed: {file.failedCadets}
		        							</p>
		        						}
		        					/>
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