import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
	addButton: {
		position:'fixed',
	  bottom: 40,
	  right: 20,
	},
}

export default class AddWave extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			cadets: []
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		this.setState({
			cadets: this.props.cadets
		})
		console.log('State', this.state.cadets)
	}
	handleOpen() {
		this.setState({
			open: true
		})
	}
	handleClose() {
		this.setState({
			open: false
		})
	}
	handleSubmit() {

	}

	render() {
		const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
        onClick={this.handleSubmit}
      />,
    ];
		return(
			<div>
				<Dialog
          title="Add a new Wave"
          actions={dialogActions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        	<TextField
			      hintText="It should be unique"
			      floatingLabelText="Wave Id"
			      fullWidth={true}
			    /><br />
			    <TextField
			      hintText="Provide some name to the wave"
			      floatingLabelText="Wave Name"
			      fullWidth={true}
			    /><br />
			    <TextField
			      hintText="Provide the base location"
			      floatingLabelText="Location"
			      fullWidth={true}
			    />
			    <DatePicker 
			    	hintText="Start Date" 
			    />
			    <DatePicker 
			    	hintText="End Date" 
			    />
			    <SelectField
		        multiple={true}
		        hintText="Select a name"
		        onChange={this.handleChange}
		      >
		        {
		        	this.state.cadets.map(function(cadet, i) {
		        		return (
		        			cadet.Selected != undefined &&
		        			cadet.Selected == 'Yes' &&
		        			<MenuItem
						        key={i}
						        value={cadet.EmployeeName}
						        primaryText={cadet.EmployeeName}
						      />
		        		)
		        	})
		        }
		      </SelectField>
        </Dialog>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
			</div>
		)
	}
}