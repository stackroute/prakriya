import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';

const styles = {
	addButton: {
		position:'fixed',
	  bottom: '60px',
	  right: '15px',
	  zIndex: 1
	},
	dialog: {
	  textAlign: 'center'
	}
}

export default class AddCourse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			empID: '',
			empName: '',
			email: '',
			contact: '',
			careerBand: '',
			revisedBU: '',
			digithonQualified: '',
			digithonPhase: '',
			digithonScore: '',
			trainingStatus: '',
			trainingsUndergone: '',
			workExperienceYear: '',
			workExperienceMonths: '',
			primarySupervisor: '',
			projectSupervisor: '',
			college: '',
			CGPA: ''
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onChangeID = this.onChangeID.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangeContact = this.onChangeContact.bind(this);
		this.onChangeDigithonQualified = this.onChangeDigithonQualified.bind(this);
		this.onChangeCareerBand = this.onChangeCareerBand.bind(this);
		this.onChangeRevisedBU = this.onChangeRevisedBU.bind(this);
		this.onChangeDigiThonPhase = this.onChangeDigiThonPhase.bind(this);
		this.onChangeDigiThonScore = this.onChangeDigiThonScore.bind(this);
		this.onChangeTrainingStatus = this.onChangeTrainingStatus.bind(this);
		this.onChangeTrainingsUndergone = this.onChangeTrainingsUndergone.bind(this);
		this.onChangeWorkExperienceYear = this.onChangeWorkExperienceYear.bind(this);
		this.onChangeWorkExperienceMonths = this.onChangeWorkExperienceMonths.bind(this);
		this.onChangePrimarySupervisor = this.onChangePrimarySupervisor.bind(this);
		this.onChangeProjectSupervisor = this.onChangeProjectSupervisor.bind(this);
		this.onChangeCollege = this.onChangeCollege.bind(this);
		this.onChangeCGPA = this.onChangeCGPA.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
	}

	handleClose() {
		this.setState({
			showDialog: false
		})
	}

	handleOpen() {
		this.setState({
			showDialog: true
		})
	}

	onChangeID(e) {
		this.setState({
			empID: e.target.value
		})
	}

	onChangeName(e) {
		this.setState({
			empName: e.target.value
		})
	}

	onChangeEmail(e) {
		this.setState({
			email: e.target.value
		})
	}

	onChangeContact(e) {
		this.setState({
			contact: e.target.value
		})
	}

	onChangeDigithonQualified(e) {
		this.setState({
			digithonQualified: e.target.value
		})
	}

	onChangeCareerBand(e) {
		this.setState({
			careerBand: e.target.value
		})
	}

	onChangeRevisedBU(e) {
		this.setState({
			revisedBU: e.target.value
		})
	}

	onChangeDigiThonPhase(e) {
		this.setState({
			digithonPhase: e.target.value
		})
	}

	onChangeDigiThonScore(e) {
		this.setState({
			digithonScore: e.target.value
		})
	}

	onChangeTrainingStatus(e) {
		this.setState({
			trainingStatus: e.target.value
		})
	}

	onChangeTrainingsUndergone(e) {
		this.setState({
			trainingsUndergone: e.target.value
		})
	}

	onChangeWorkExperienceYear(e) {
		this.setState({
			workExperienceYear: e.target.value
		})
	}

	onChangeWorkExperienceMonths(e) {
		this.setState({
			workExperienceMonths: e.target.value
		})
	}
	onChangePrimarySupervisor(e) {
		this.setState({
			primarySupervisor: e.target.value
		})
	}

	onChangeProjectSupervisor(e) {
		this.setState({
			projectSupervisor: e.target.value
		})
	}

	onChangeCollege(e) {
		this.setState({
			college: e.target.value
		})
	}

	onChangeCGPA(e) {
		this.setState({
			CGPA: e.target.value
		})
	}

	resetFields() {
		this.setState({
			empID: '',
			empName: '',
			email: '',
			contact: '',
			careerBand: '',
			revisedBU: '',
			digithonQualified: '',
			digithonPhase: '',
			trainingStatus: '',
			trainingsUndergone: '',
			workExperienceYear: '',
			workExperienceMonths: '',
			primarySupervisior: '',
			projectSupervisior: '',
			college: '',
			CGPA: ''
		});
	}

	handleAdd() {
		let th = this;
		let candidate = {};
			candidate.EmployeeID= this.state.empID;
			candidate.EmployeeName= this.state.empName;
			candidate.EmailID= this.state.email;
			candidate.Contact= this.state.contact;
			candidate.CareerBand= this.state.careerBand;
			candidate.RevisedBU= this.state.revisedBU;
			candidate.DigiThonQualified= this.state.digithonQualified;
			candidate.DigiThonPhase= this.state.digithonPhase;
			candidate.DigiThonScore= this.state.digithonScore;
			candidate.TrainingStatus= this.state.trainingStatus;
			candidate.TrainingsUndergone= this.state.trainingsUndergone;
			candidate.WorkExperience= this.state.workExperienceYear+'Years '+this.state.workExperienceMonths+'Months';
			candidate.PrimarySupervisor= this.state.primarySupervisor;
			candidate.ProjectSupervisor= this.state.projectSupervisor;
			candidate.College= this.state.college;
			candidate.CGPA= this.state.CGPA;
		this.resetFields();
		this.handleClose();
		this.props.addCandidate(candidate);
	}

	render() {
		let th = this;
					return(
				<div>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
					<Dialog
			    	style={styles.dialog}
	          title="Add Candidate"
	          open={this.state.showDialog}
	          autoScrollBodyContent={true}
	          onRequestClose={this.handleClose}
	        >
	        	<TextField
			    		hintText="ID"
			    		floatingLabelText="Employee ID"
			    		value={this.state.empID}
			    		onChange={this.onChangeID}
			    		type="number"
			    	/><br/>
			    	<TextField
			    		hintText="Name"
			    		floatingLabelText="Name"
			    		value={this.state.empName}
			    		onChange={this.onChangeName}
			    	/><br/>
			    	<TextField
			    		hintText="Email"
			    		floatingLabelText="Email"
			    		value={this.state.email}
			    		onChange={this.onChangeEmail}
			    	/><br/>
			    	<TextField
			    		hintText="Contact"
			    		floatingLabelText="Contact"
			    		value={this.state.contact}
			    		onChange={this.onChangeContact}
			    		type="number"
			    	/><br/>
			    	<TextField
			    		hintText="Band"
			    		floatingLabelText="Career Band"
			    		value={this.state.careerBand}
			    		onChange={this.onChangeCareerBand}
			    	/><br/>
			    	<TextField
			    		hintText="BU"
			    		floatingLabelText="Revised BU"
			    		value={this.state.revisedBU}
			    		onChange={this.onChangeRevisedBU}
			    	/><br/>
			    	<TextField
			    		hintText="Digithon"
			    		floatingLabelText="Digithon Qualified"
			    		value={this.state.digithonQualified}
			    		onChange={this.onChangeDigithonQualified}
			    	/><br/>
			    	<TextField
			    		hintText="Phase"
			    		floatingLabelText="Digithon Phase"
			    		value={this.state.digithonPhase}
			    		onChange={this.onChangeDigiThonPhase}
			    		type="number"
			    	/><br/>
			    	<TextField
			    		hintText="Score"
			    		floatingLabelText="Digithon Score"
			    		value={this.state.digithonScore}
			    		onChange={this.onChangeDigiThonScore}
			    		type="number"
			    	/><br/>
			    	<TextField
			    		hintText="Status"
			    		floatingLabelText="Training Status"
			    		value={this.state.trainingStatus}
			    		onChange={this.onChangeTrainingStatus}
			    	/><br/>
			    	<TextField
			    		hintText="Trainings Undergone"
			    		floatingLabelText="Trainings Undergone"
			    		value={this.state.trainingsUndergone}
			    		onChange={this.onChangeTrainingsUndergone}
			    	/><br/>
			    	<TextField
			    		hintText="Experience"
			    		floatingLabelText="Year"
			    		value={this.state.workExperienceYear}
			    		onChange={this.onChangeWorkExperienceYear}
			    		type="number"
			    		style = {{width:'50px'}}
			    	/>Year(s)
			    	<TextField
			    		hintText="Experience"
			    		floatingLabelText="Month"
			    		value={this.state.workExperienceMonths}
			    		onChange={this.onChangeWorkExperienceMonths}
			    		type="number"
			    		style = {{width:'50px'}}
			    	/>Month(s)
			    	<br/>
			    	<TextField
			    		hintText="Primary Supervisor"
			    		floatingLabelText="Primary Supervisor"
			    		value={this.state.primarySupervisor}
			    		onChange={this.onChangePrimarySupervisor}
			    	/><br/>
			    	<TextField
			    		hintText="Project Supervisor"
			    		floatingLabelText="Project Supervisor"
			    		value={this.state.projectSupervisor}
			    		onChange={this.onChangeProjectSupervisor}
			    	/><br/>
			    	<TextField
			    		hintText="College"
			    		floatingLabelText="College"
			    		value={this.state.college}
			    		onChange={this.onChangeCollege}
			    	/><br/>
			    	<TextField
			    		hintText="CGPA"
			    		floatingLabelText="CGPA"
			    		value={this.state.CGPA}
			    		onChange={this.onChangeCGPA}
			    	/><br/>
			    	<RaisedButton
							    	 		label="Add Candidate"
							    	   	primary={true}
							    			onClick={this.handleAdd}
							    	 	/>
						</Dialog>
					</div>

					)
	}
}
