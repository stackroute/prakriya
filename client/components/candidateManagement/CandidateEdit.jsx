import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Moment from 'moment';

const styles = {
	editContainer: {
		textAlign: 'center',
	},
	paper: {
		paddingTop: 10
	},
	selectField: {
		textAlign: 'left'
	}
}

const selectionStatus = [
  <MenuItem key={1} value="Yes" primaryText="Yes" />,
  <MenuItem key={2} value="No" primaryText="No" />
];

const trainingTrack = [
  <MenuItem key={1} value="Immersive" primaryText="Immersive" />,
  <MenuItem key={2} value="ML" primaryText="ML" />
];

export default class CandidateEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			disableSave: true,
			candidate: {}
		}
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleSkillChange = this.handleSkillChange.bind(this);
		this.handleRemarksChange = this.handleRemarksChange.bind(this);
		this.handleSelectedChange = this.handleSelectedChange.bind(this);
		this.handleTrainingTrackChange = this.handleTrainingTrackChange.bind(this);
		this.handleWaveChange = this.handleWaveChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}
	componentDidMount() {
		console.log('Start Date: ',this.state.candidate.StartDate);
		let candidate = this.props.candidate
		if(candidate.Wave == undefined)
			candidate.Wave = ''
		if(candidate.AcademyTrainingSkills == undefined)
			candidate.AcademyTrainingSkills = ''
		if(candidate.Remarks == undefined)
			candidate.Remarks = ''
		if(candidate.Selected == undefined)
			candidate.Selected = ''
		this.setState({
			candidate: candidate
		})
	}
	handleStartDateChange(event, date) {
		let candidate = this.state.candidate;
		candidate.StartDate = Moment(date).format('D-MM-YY');
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleEndDateChange(event, date) {
		let candidate = this.state.candidate;
		candidate.EndDate = Moment(date).format('D-MM-YY');
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleSkillChange(event) {
		let candidate = this.state.candidate;
		candidate.AcademyTrainingSkills = event.target.value;
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleRemarksChange(event) {
		let candidate = this.state.candidate;
		candidate.Remarks = event.target.value;
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleSelectedChange(event, key, value) {
		let candidate = this.state.candidate;
		candidate.Selected = value;
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleTrainingTrackChange(event, key, value) {
		let candidate = this.state.candidate;
		candidate.TrainingTrack = value;
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleWaveChange(event) {
		let candidate = this.state.candidate;
		candidate.Wave = event.target.value;
		this.setState({
			candidate: candidate,
			disableSave: false
		})
	}
	handleSave() {
		this.props.updateCandidate(this.state.candidate);
	}

	render() {
		return(
			<div>
				<Grid>
					<Row>
						<Col md={8} mdOffset={2} style={styles.editContainer}>
							<Paper style={styles.paper}>
								<h2> Update Candidate Details </h2>
								<TextField
						      disabled={true}
						      value={this.state.candidate.EmployeeName}
						      floatingLabelText="Employee Name"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.EmployeeID}
						      floatingLabelText="Employee Id"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.EmailID}
						      floatingLabelText="Email Id"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.CareerBand}
						      floatingLabelText="Career Band"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.WorkExperience}
						      floatingLabelText="Work Experience"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.DigiThonPhase}
						      floatingLabelText="Digithon Phase"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.DigiThonScore}
						      floatingLabelText="Digithon Score"
						    /><br/>
						    <SelectField
				          value={this.state.candidate.Selected}
				          onChange={this.handleSelectedChange}
				          floatingLabelText="Selected"
				          style={styles.selectField}
				        >
				          {selectionStatus}
				        </SelectField><br />
				        {
				        	this.state.candidate.Selected == 'Yes' &&
				        	<SelectField
					          value={this.state.candidate.TrainingTrack}
					          onChange={this.handleSelectedChange}
					          floatingLabelText="Training Track"
					          style={styles.selectField}
					        >
					          {trainingTrack}
					        </SelectField>
				        }
				        <br />
					      <TextField
						      floatingLabelText="Remarks"
						      hintText="Mentor Track"
						      rows={2}
						      rowsMax={3}
						      value={this.state.candidate.Remarks}
						      onChange={this.handleRemarksChange}
						    /><br/>
						    <DatePicker
					        hintText="Start Date"
					        autoOk={true}
					        onChange={this.handleStartDateChange}
					      />
					      <DatePicker
					        hintText="End Date"
					        autoOk={true}
					        onChange={this.handleEndDateChange}
					      />
					      <TextField
					      	floatingLabelText="Wave"
						      value={this.state.candidate.Wave}
						      onChange={this.handleWaveChange}
						    /><br/>
						    <TextField
						      floatingLabelText="Academy Training Skills"
						      hintText="Skills to showcase"
						      value={this.state.candidate.AcademyTrainingSkills}
						      onChange={this.handleSkillChange}
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.PrimarySupervisor}
						      floatingLabelText="Primary Supervisor"
						    /><br/>
						    <TextField
						      disabled={true}
						      value={this.state.candidate.ProjectSupervisor}
						      floatingLabelText="Project Supervisor"
						    /><br/>
						    <RaisedButton 
						    	label="Save Changes" 
						    	disabled={this.state.disableSave} 
						    	primary={true}
						    	onClick={this.handleSave}
						    />
						  </Paper>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
}