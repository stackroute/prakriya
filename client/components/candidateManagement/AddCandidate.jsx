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
import AddIcon from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import dialog from '../../styles/dialog.json';
import app from '../../styles/app.json';

export default class AddCourse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			empID: '',
			empIDErrorText: '',
			empName: '',
			empNameErrorText: '',
			email: '',
			emailErrorText: '',
			contact: '',
			contactErrorText: '',
			careerBand: '',
			revisedBU: '',
			digithonQualified: '',
			digithonQualifiedErrorText: '',
			digithonPhase: '',
			digithonPhaseErrorText: '',
			digithonScore: '',
			digithonScoreErrorText: '',
			trainingStatus: '',
			trainingsUndergone: '',
			workExperienceYear: '',
			workExperienceMonths: '',
			primarySupervisor: '',
			projectSupervisor: '',
			college: '',
			CGPA: ''
		}
		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.onChangeID = this.onChangeID.bind(this)
		this.onChangeName = this.onChangeName.bind(this)
		this.onChangeEmail = this.onChangeEmail.bind(this)
		this.onChangeContact = this.onChangeContact.bind(this)
		this.onChangeDigithonQualified = this.onChangeDigithonQualified.bind(this)
		this.onChangeCareerBand = this.onChangeCareerBand.bind(this)
		this.onChangeRevisedBU = this.onChangeRevisedBU.bind(this)
		this.onChangeDigiThonPhase = this.onChangeDigiThonPhase.bind(this)
		this.onChangeDigiThonScore = this.onChangeDigiThonScore.bind(this)
		this.onChangeTrainingStatus = this.onChangeTrainingStatus.bind(this)
		this.onChangeTrainingsUndergone = this.onChangeTrainingsUndergone.bind(this)
		this.onChangeWorkExperienceYear = this.onChangeWorkExperienceYear.bind(this)
		this.onChangeWorkExperienceMonths = this.onChangeWorkExperienceMonths.bind(this)
		this.onChangePrimarySupervisor = this.onChangePrimarySupervisor.bind(this)
		this.onChangeProjectSupervisor = this.onChangeProjectSupervisor.bind(this)
		this.onChangeCollege = this.onChangeCollege.bind(this)
		this.onChangeCGPA = this.onChangeCGPA.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
		this.validationSuccess = this.validationSuccess.bind(this)
		this.resetFields = this.resetFields.bind(this)
	}

	handleClose(e, action) {
		if(action == 'CLOSE') {
			this.resetFields()
		} else if(action == 'ADD') {
			if(this.validationSuccess()) {
				this.handleAdd()
			}
		}
	}

	handleOpen() {
		this.setState({
			showDialog: true
		})
	}

	onChangeID(e) {
		this.setState({
			empID: e.target.value,
			empIDErrorText: ''
		})
	}

	onChangeName(e) {
		this.setState({
			empName: e.target.value,
			empNameErrorText: ''
		})
	}

	onChangeEmail(e) {
		this.setState({
			email: e.target.value,
			emailErrorText: ''
		})
	}

	onChangeContact(e) {
		this.setState({
			contact: e.target.value,
			contactErrorText: ''
		})
	}

	onChangeDigithonQualified(e) {
		this.setState({
			digithonQualified: e.target.value,
			digithonQualifiedErrorText: ''
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
			digithonPhase: e.target.value,
			digithonPhaseErrorText: ''
		})
	}

	onChangeDigiThonScore(e) {
		this.setState({
			digithonScore: e.target.value,
			digithonScoreErrorText: ''
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
			primarySupervisior: '',
			projectSupervisior: '',
			college: '',
			CGPA: '',
			empIDErrorText: '',
			empNameErrorText: '',
			emailErrorText: '',
			digithonQualifiedErrorText: '',
			digithonPhaseErrorText: '',
			digithonScoreErrorText: '',
			contactErrorText: ''
		})
	}

	validationSuccess() {
		let empIDPattern = /[0-9]{6}/
		let emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/
		let digithonScorePattern1 = /[0-9]{1,}/
		let digithonScorePattern2 = /[0-9]{1,}.[0-9]{1,}/
		let contactPattern = /[0-9]{10}/
		if(this.state.empID.trim().length == 0) {
			this.setState({
				empIDErrorText: 'This field cannot be empty.'
			})
		} else if(!empIDPattern.test(this.state.empID)) {
			this.setState({
				empIDErrorText: 'Invalid ID! Expecting a 6 digit numeric id.'
			})
		} else if(this.state.empName.trim().length == 0) {
			this.setState({
				empNameErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.email.trim().length == 0) {
			this.setState({
				emailErrorText: 'This field cannot be empty.'
			})
		} else if(!emailPattern.test(this.state.email)) {
			this.setState({
				emailErrorText: 'Enter a valid email address.'
			})
		} else if(this.state.contact.trim().length != 0 && !contactPattern.test(this.state.contact)) {
			this.setState({
				contactErrorText: 'Enter a valid 10 digit mobile number.'
			})
		} else if(this.state.digithonQualified.trim().length == 0) {
			this.setState({
				digithonQualifiedErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.digithonPhase.trim().length == 0) {
			this.setState({
				digithonPhaseErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.digithonScore.trim().length == 0) {
			this.setState({
				digithonScoreErrorText: 'This field cannot be empty.'
			})
		} else if(!digithonScorePattern1.test(this.state.digithonScore)) {
			this.setState({
				digithonScoreErrorText: 'Invalid Score. Digithon score must be a number.'
			})
		} else {
			return true
		}
		return false
	}

	handleAdd() {
		let candidate = {}
		candidate.EmployeeID = this.state.empID;
		candidate.EmployeeName = this.state.empName;
		candidate.EmailID = this.state.email;
		candidate.Contact = this.state.contact;
		candidate.CareerBand = this.state.careerBand;
		candidate.RevisedBU = this.state.revisedBU;
		candidate.DigiThonQualified = this.state.digithonQualified;
		candidate.DigiThonPhase = this.state.digithonPhase;
		candidate.DigiThonScore = this.state.digithonScore;
		candidate.TrainingStatus = this.state.trainingStatus;
		candidate.TrainingsUndergone = this.state.trainingsUndergone;
		candidate.WorkExperience = `${this.state.workExperienceYear} Year(s) ${this.state.workExperienceMonths} Month(s)`;
		candidate.PrimarySupervisor = this.state.primarySupervisor;
		candidate.ProjectSupervisor = this.state.projectSupervisor;
		candidate.College = this.state.college;
		candidate.CGPA = this.state.CGPA;
		this.props.addCandidate(candidate);
		this.resetFields();
	}

	render() {
		let th = this
		let actions = [
			<FlatButton
				label="CANCEL"
				style={dialog.actionButton}
				onClick={(e) => this.handleClose(e, 'CLOSE')}
				/>,
			<FlatButton
				label="Add Candidate"
				style={dialog.actionButton}
				onClick={(e) => this.handleClose(e, 'ADD')}
				/>
		]
			return(
				<div>
				<FloatingActionButton mini={true} style={app.fab} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
					<Dialog
	          title="ADD CANDIDATE"
	          open={this.state.showDialog}
	          autoScrollBodyContent={true}
						actionsContainerStyle={dialog.actionsContainer}
						bodyStyle={dialog.body}
						titleStyle={dialog.title}
						actions={actions}
	        >
					<div>
						<div style={dialog.box50}>
	        	<TextField
			    		hintText="Enter a six digit Employee ID"
			    		floatingLabelText="Employee ID *"
							floatingLabelStyle={app.mandatoryField}
			    		value={this.state.empID}
			    		onChange={this.onChangeID}
							errorText={this.state.empIDErrorText}
			    	/>
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Name"
			    		floatingLabelText="Name *"
							floatingLabelStyle={app.mandatoryField}
			    		value={this.state.empName}
			    		onChange={this.onChangeName}
							errorText={this.state.empNameErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Email"
			    		floatingLabelText="Email *"
							floatingLabelStyle={app.mandatoryField}
			    		value={this.state.email}
			    		onChange={this.onChangeEmail}
							errorText={this.state.emailErrorText}
			    	/>
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Enter a 10 digit mobile number"
			    		floatingLabelText="Contact"
			    		value={this.state.contact}
			    		onChange={this.onChangeContact}
							errorText={this.state.contactErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Career Band"
			    		floatingLabelText="Career Band"
			    		value={this.state.careerBand}
			    		onChange={this.onChangeCareerBand}
							errorText={this.state.careerBandErrorText}
			    	/>
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="BU"
			    		floatingLabelText="Revised BU"
			    		value={this.state.revisedBU}
			    		onChange={this.onChangeRevisedBU}
			    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box33}>
			    	<TextField
			    		hintText="Digithon"
			    		floatingLabelText="Digithon Qualified *"
							floatingLabelStyle={app.mandatoryField}
			    		value={this.state.digithonQualified}
			    		onChange={this.onChangeDigithonQualified}
							errorText={this.state.digithonQualifiedErrorText}
			    	/>
						</div>
						<div style={dialog.box34}>
			    	<TextField
			    		hintText="Phase"
			    		floatingLabelText="Digithon Phase *"
							floatingLabelStyle={app.mandatoryField}
			    		value={this.state.digithonPhase}
			    		onChange={this.onChangeDigiThonPhase}
			    		type="number"
							errorText={this.state.digithonPhaseErrorText}
			    	/>
						</div>
						<div style={dialog.box33}>
			    	<TextField
			    		hintText="Score"
			    		floatingLabelText="Digithon Score *"
							floatingLabelStyle={app.mandatoryField}
			    		value={this.state.digithonScore}
			    		onChange={this.onChangeDigiThonScore}
							errorText={this.state.digithonScoreErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Status"
			    		floatingLabelText="Training Status"
			    		value={this.state.trainingStatus}
			    		onChange={this.onChangeTrainingStatus}
			    	/>
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Trainings Undergone"
			    		floatingLabelText="Trainings Undergone"
			    		value={this.state.trainingsUndergone}
			    		onChange={this.onChangeTrainingsUndergone}
			    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Experience In Years"
			    		floatingLabelText="Experience In Years"
			    		value={this.state.workExperienceYear}
			    		onChange={this.onChangeWorkExperienceYear}
			    	/>Year(s)
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Experience In Months"
			    		floatingLabelText="Experience In Months"
			    		value={this.state.workExperienceMonths}
			    		onChange={this.onChangeWorkExperienceMonths}
			    	/>Month(s)
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Primary Supervisor"
			    		floatingLabelText="Primary Supervisor"
			    		value={this.state.primarySupervisor}
			    		onChange={this.onChangePrimarySupervisor}
			    	/>
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="Project Supervisor"
			    		floatingLabelText="Project Supervisor"
			    		value={this.state.projectSupervisor}
			    		onChange={this.onChangeProjectSupervisor}
			    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="College"
			    		floatingLabelText="College"
			    		value={this.state.college}
			    		onChange={this.onChangeCollege}
			    	/>
						</div>
						<div style={dialog.box50}>
			    	<TextField
			    		hintText="CGPA"
			    		floatingLabelText="CGPA"
			    		value={this.state.CGPA}
			    		onChange={this.onChangeCGPA}
			    	/>
						</div>
					</div>
					</Dialog>
					</div>
				)
	}
}
