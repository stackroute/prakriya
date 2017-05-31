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
	dialog: {
		backgroundColor: '#DDDBF1',
		borderBottom: '3px solid teal',
		borderRight: '10px solid teal',
		borderLeft: '10px solid teal'
	},
	dialogTitle: {
		fontWeight: 'bold',
		backgroundColor: 'teal',
		color: '#DDDBF1',
		textAlign: 'center'
	},
	actionsContainer: {
		backgroundColor: 'teal',
		borderTop: '0px',
		marginTop: '0px'
	},
	actionButton: {
		backgroundColor: '#DDDBF1',
		width: '50%',
		color: 'teal',
		border: '1px solid teal',
		height: '100%'
	}
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
		let startDate = new Date(date);
		let endDate = new Date(date.setDate(date.getDate() + 84));
		this.setState({
			StartDate: startDate,
			EndDate: endDate
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
        style={styles.actionButton}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Add"
				style={styles.actionButton}
        onTouchTap={this.handleClose}
        onClick={this.handleSubmit}
      />
    ];
		return(
			<div>
				<Dialog
					bodyStyle={styles.dialog}
          title="ADD A NEW WAVE"
					titleStyle={styles.dialogTitle}
          actions={dialogActions}
					actionsContainerStyle={styles.actionsContainer}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
				<div>
					<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
        	<TextField
			      hintText="It should be unique"
			      floatingLabelText="Wave Id"
			      value={this.state.WaveID}
			      onChange={this.handleWaveIdChange}
			      fullWidth={true}
			    />
					</div>
					<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    <TextField
			      hintText="Provide some name to the wave"
			      floatingLabelText="Wave Name"
			      value={this.state.WaveNumber}
			      onChange={this.handleWaveNumberChange}
			      fullWidth={true}
			    />
					</div>
				</div>
				<div>
					<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    <DatePicker
			    	hintText="Start Date"
						floatingLabelText='Start Date'
			    	value={this.state.StartDate}
			    	onChange={this.handleStartDateChange}
			    />
					</div>
					<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    <DatePicker
			    	hintText="End Date"
						floatingLabelText='End Date'
			    	value={this.state.EndDate}
			    	onChange={this.handleEndDateChange}
			    />
					</div>
				</div>
					<div style={{border: '2px solid white', width: '100%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    <TextField
			      hintText="Provide the base location"
			      floatingLabelText="Location"
			      value={this.state.Location}
			      onChange={this.handleLocationChange}
			      fullWidth={true}
			    />
					</div>
					<div style={{border: '2px solid white', width: '100%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    <SelectField
		        multiple={true}
		        hintText="Select Cadets"
						floatingLabelText='Cadets'
		        value={this.state.selectedCadets}
		        onChange={this.handleCadetsChange}
						menuItemStyle={{borderTop: '1px solid teal', borderBottom: '1px solid teal', backgroundColor: '#DDDBF1'}}
						listStyle={{backgroundColor: 'teal', borderLeft: '5px solid teal', borderRight: '5px solid teal'}}
						style={{width: '100%'}}
						selectedMenuItemStyle={{color: 'black', fontWeight: 'bold'}}
						maxHeight='600'
		      >
		        {
		        	this.state.cadets.map(function(cadet, i) {
		        		return (
		        			cadet.Selected != undefined &&
		        			(cadet.Selected == 'Yes' ||
									cadet.Selected == 'DS') &&
		        			<MenuItem
						        key={i}
						        insetChildren={true}
						        checked={
						        	th.state.selectedCadets &&
						        	th.state.selectedCadets.includes(cadet.EmployeeID)
						       	}
						        value={cadet.EmployeeID}
						        primaryText={`${cadet.EmployeeName} (${cadet.EmployeeID})`}
						      />
		        		)
		        	})
		        }
		      </SelectField>
				</div>
        </Dialog>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
			</div>
		)
	}
}
