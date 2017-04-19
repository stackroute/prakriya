import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const styles = {
	addButtonStyle: {
		position:'fixed',
	  bottom: '50px',
	  right: '15px',
	  zIndex: 2
	},
	dialogStyle: {
	  textAlign: 'center'
	}
}

const items = [
  <MenuItem key={1} value={1} primaryText="Assignment" />,
  <MenuItem key={2} value={2} primaryText="Quiz" />,
  <MenuItem key={3} value={3} primaryText="Book" />,
  <MenuItem key={4} value={4} primaryText="URL" />
];

export default class AddCourse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			course: '',
			key: -1
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleCourseChange = this.handleCourseChange.bind(this);
	}
	handleOpen() {
		this.setState({
			showDialog: true
		})
	}
	handleClose() {
		this.setState({
			showDialog: false
		})
	}
	handleCourseChange(event, key, value) {
		console.log(key);
		this.setState({
			course: value,
			key: key
		})
	}

	render() {
		return(
			<div>
				<FloatingActionButton mini={true} style={styles.addButtonStyle} onTouchTap={this.handleOpen}>
		      <ContentAdd />
		    </FloatingActionButton>
		    <Dialog 
		    	style={styles.dialog}
          title="Add a new Course"
          open={this.state.showDialog}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
        >
        	<SelectField
        		value={this.state.course}
          	onChange={this.handleCourseChange}
	          floatingLabelText="Type of Course"
	        >
	          {items}
	        </SelectField>
	        <br/>
	        {
	        	this.state.key == 0 &&
	        	<TextField
				      hintText="Provide a description"
				      multiLine={true}
				      rows={4}
				      rowsMax={4}
				      fullWidth={true}
				    />
	        }
        </Dialog>
			</div>
		)
	}
}