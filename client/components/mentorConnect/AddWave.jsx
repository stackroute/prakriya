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
			cadets: [],
			WaveID: '',
			WaveNumber: '',
			Location: '',
			StartDate: null,
			EndDate: null,
			selectedCadets: []
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleWaveIdChange = this.handleWaveIdChange.bind(this);
		this.handleWaveNumberChange = this.handleWaveNumberChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleCadetsChange = this.handleCadetsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		this.setState({
			cadets: this.props.cadets
		})
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
	handleWaveIdChange(event) {
		this.setState({
			WaveID: event.target.value
		})
	}
	handleWaveNumberChange(event) {
		this.setState({
			WaveNumber: event.target.value
		})
	}
	handleLocationChange(event) {
		this.setState({
			Location: event.target.value
		})
	}
	handleStartDateChange(event, date) {
		this.setState({
			StartDate: date
		})
	}
	handleEndDateChange(event, date) {
		this.setState({
			EndDate: date
		})
	}
	handleCadetsChange(event, key, val) {
		this.setState({
			selectedCadets: val
		})
	}
	handleSubmit() {
		let wave = {}
		wave.WaveID = this.state.WaveID;
		wave.WaveNumber = this.state.WaveNumber;
		wave.Location = this.state.Location;
		wave.StartDate = this.state.StartDate;
		wave.EndDate = this.state.EndDate;
		wave.Cadets = this.state.selectedCadets;
		this.setState({
			selectedCadets: []
		})
		this.props.handleWaveAdd(wave);
	}

	render() {
		let th = this;
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
			      value={this.state.WaveID}
			      onChange={this.handleWaveIdChange}
			      fullWidth={true}
			    /><br />
			    <TextField
			      hintText="Provide some name to the wave"
			      floatingLabelText="Wave Name"
			      value={this.state.WaveNumber}
			      onChange={this.handleWaveNumberChange}
			      fullWidth={true}
			    /><br />
			    <TextField
			      hintText="Provide the base location"
			      floatingLabelText="Location"
			      value={this.state.Location}
			      onChange={this.handleLocationChange}
			      fullWidth={true}
			    />
			    <DatePicker 
			    	hintText="Start Date" 
			    	onChange={this.handleStartDateChange}
			    />
			    <DatePicker 
			    	hintText="End Date" 
			    	onChange={this.handleEndDateChange}
			    />
			    <SelectField
		        multiple={true}
		        hintText="Select cadets"
		        value={this.state.selectedCadets}
		        onChange={this.handleCadetsChange}
		      >
		        {
		        	this.state.cadets.map(function(cadet, i) {
		        		return (
		        			cadet.Selected != undefined &&
		        			cadet.Selected == 'Yes' &&
		        			<MenuItem
						        key={i}
						        insetChildren={true}
						        checked={
						        	th.state.selectedCadets && 
						        	th.state.selectedCadets.includes(cadet.EmployeeID)
						       	}
						        value={cadet.EmployeeID}
						        primaryText={cadet.EmployeeID + '-' + cadet.EmployeeName}
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