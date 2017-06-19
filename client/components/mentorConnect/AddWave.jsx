import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import app from '../../styles/app.json';
import dialog from '../../styles/dialog.json';

export default class AddWave extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			cadets: [],
			WaveID: '',
			WaveIDErrorText: '',
			WaveNumber: '',
			WaveNumberErrorText: '',
			Location: '',
			LocationText: '',
			StartDate: null,
			StartDateErrorText: '',
			EndDate: null,
			EndDateErrorText: '',
			selectedCadets: [],
			CadetsErrorText: ''
		}
		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.handleWaveIdChange = this.handleWaveIdChange.bind(this)
		this.handleWaveNumberChange = this.handleWaveNumberChange.bind(this)
		this.handleLocationChange = this.handleLocationChange.bind(this)
		this.handleStartDateChange = this.handleStartDateChange.bind(this)
		this.handleEndDateChange = this.handleEndDateChange.bind(this)
		this.handleCadetsChange = this.handleCadetsChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.validationSuccess = this.validationSuccess.bind(this)
		this.resetFields = this.resetFields.bind(this)
	}

	componentWillMount() {
		this.setState({
			cadets: this.props.cadets
		})
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			cadets: nextProps.cadets
		})
	}

	handleOpen() {
		this.setState({
			open: true
		})
	}

	handleClose(e, action) {
		if(action == 'CLOSE') {
			this.resetFields()
		} else if(action == 'ADD'){
			if(this.validationSuccess()) {
				this.handleSubmit()
			}
		}
	}

	handleWaveIdChange(event) {
		this.setState({
			WaveID: event.target.value,
			WaveIDErrorText: ''
		})
	}

	handleWaveNumberChange(event) {
		this.setState({
			WaveNumber: event.target.value,
			WaveNumberErrorText: ''
		})
	}

	handleLocationChange(event) {
		this.setState({
			Location: event.target.value,
			LocationErrorText: ''
		})
	}

	handleStartDateChange(event, date) {
		let startDate = new Date(date);
		let endDate = new Date(date.setDate(date.getDate() + 84));
		this.setState({
			StartDate: startDate,
			EndDate: endDate,
			StartDateErrorText: ''
		})
	}

	handleEndDateChange(event, date) {
		this.setState({
			EndDate: date,
			EndDateErrorText: ''
		})
	}

	handleCadetsChange(event, key, val) {
		this.setState({
			selectedCadets: val,
			CadetsErrorText: ''
		})
	}

	handleSubmit() {
		let wave = {}
		wave.WaveID = this.state.WaveID
		wave.WaveNumber = this.state.WaveNumber
		wave.Location = this.state.Location
		wave.StartDate = this.state.StartDate
		wave.EndDate = this.state.EndDate
		wave.Cadets = this.state.selectedCadets
		this.props.handleWaveAdd(wave)
		this.resetFields()
	}

	resetFields() {
		this.setState({
			open: false,
			WaveID: '',
			WaveIDErrorText: '',
			WaveNumber: '',
			WaveNumberErrorText: '',
			Location: '',
			LocationErrorText: '',
			StartDate: null,
			StartDateErrorText: '',
			EndDate: null,
			EndDateErrorText: '',
			selectedCadets: [],
			CadetsErrorText: ''
		})
	}

	validationSuccess() {
		console.log('EndDate: ', this.state.EndDate)
		if(this.state.WaveID.trim().length == 0) {
			this.setState({
				WaveIDErrorText: 'This field cannot be empty'
			})
		} else if(this.state.WaveNumber.trim().length == 0) {
			this.setState({
				WaveNumberErrorText: 'This field cannot be empty'
			})
		} else if(this.state.StartDate == null) {
			this.setState({
				StartDateErrorText: 'This field cannot be empty'
			})
		} else if(this.state.EndDate == null) {
			this.setState({
				EndDateErrorText: 'This field cannot be empty'
			})
		} else if(this.state.Location.trim().length == 0) {
			this.setState({
				LocationErrorText: 'This field cannot be empty'
			})
		} else if(this.state.selectedCadets.length == 0) {
			this.setState({
				CadetsErrorText: 'Select atleast one cadet'
			})
		} else {
				return true
		}
		return false
	}

	render() {
		let th = this;
		const dialogActions = [
      <FlatButton
        label="Cancel"
        style={dialog.actionButton}
        onTouchTap={(e) => this.handleClose(e, 'CLOSE')}
      />,
      <FlatButton
        label="Add"
				style={dialog.actionButton}
        onTouchTap={(e) => this.handleClose(e, 'ADD')}
      />
    ];
		return(
			<div>
				<FloatingActionButton mini={true} style={app.fab} onTouchTap={this.handleOpen} >
		      <ContentAdd/>
		    </FloatingActionButton>
				<Dialog
					bodyStyle={app.dialog}
          title="ADD A NEW WAVE"
					titleStyle={dialog.title}
          actions={dialogActions}
					actionsContainerStyle={dialog.actionsContainer}
          modal={false}
          open={this.state.open}
          onRequestClose={(e) => this.handleClose(e, 'CLOSE')}
          autoScrollBodyContent={true}
        >
				<div>
					<div style={dialog.box50}>
        	<TextField
			      hintText="It should be unique"
			      floatingLabelText="Wave ID"
			      value={this.state.WaveID}
			      onChange={this.handleWaveIdChange}
			      fullWidth={true}
						errorText={this.state.WaveIDErrorText}
			    />
					</div>
					<div style={dialog.box50}>
			    <TextField
			      hintText="Provide some name to the wave"
			      floatingLabelText="Wave Name"
			      value={this.state.WaveNumber}
			      onChange={this.handleWaveNumberChange}
			      fullWidth={true}
						errorText={this.state.WaveNumberErrorText}
			    />
					</div>
				</div>
				<div>
					<div style={dialog.box50}>
			    <DatePicker
			    	hintText="Start Date"
						floatingLabelText='Start Date'
						errorText={this.state.StartDateErrorText}
			    	value={this.state.StartDate}
			    	onChange={this.handleStartDateChange}
			    />
					</div>
					<div style={dialog.box50}>
			    <DatePicker
			    	hintText="End Date"
						floatingLabelText='End Date'
						errorText={this.state.EndDateErrorText}
			    	value={this.state.EndDate}
			    	onChange={this.handleEndDateChange}
			    />
					</div>
				</div>
					<div style={dialog.box100}>
			    <TextField
			      hintText="Provide the base location"
			      floatingLabelText="Location"
			      value={this.state.Location}
			      onChange={this.handleLocationChange}
			      fullWidth={true}
						errorText={this.state.LocationErrorText}
			    />
					</div>
					<div style={dialog.box100}>
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
						maxHeight={600}
						errorText={this.state.CadetsErrorText}
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
			</div>
		)
	}
}
