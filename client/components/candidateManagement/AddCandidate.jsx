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

const styles = {
	addButton: {
		position:'fixed',
	  bottom: '60px',
	  right: '15px',
	  zIndex: 1
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
			careerBandErrorText: '',
			revisedBU: '',
			revisedBUErrorText: '',
			digithonQualified: '',
			digithonQualifiedErrorText: '',
			digithonPhase: '',
			digithonPhaseErrorText: '',
			digithonScore: '',
			digithonScoreErrorText: '',
			trainingStatus: '',
			trainingStatusErrorText: '',
			trainingsUndergone: '',
			trainingsUndergoneErrorText: '',
			workExperienceYear: '',
			workExperienceYearErrorText: '',
			workExperienceMonths: '',
			workExperienceMonthsErrorText: '',
			primarySupervisor: '',
			primarySupervisorErrorText: '',
			projectSupervisor: '',
			projectSupervisorErrorText: '',
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
			careerBand: e.target.value,
			careerBandErrorText: ''
		})
	}

	onChangeRevisedBU(e) {
		this.setState({
			revisedBU: e.target.value,
			revisedBUErrorText: ''
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
			trainingStatus: e.target.value,
			trainingStatusErrorText: ''
		})
	}

	onChangeTrainingsUndergone(e) {
		this.setState({
			trainingsUndergone: e.target.value,
			trainingsUndergoneErrorText: ''
		})
	}

	onChangeWorkExperienceYear(e) {
		this.setState({
			workExperienceYear: e.target.value,
			workExperienceYearErrorText: ''
		})
	}

	onChangeWorkExperienceMonths(e) {
		this.setState({
			workExperienceMonths: e.target.value,
			workExperienceMonthsErrorText: ''
		})
	}

	onChangePrimarySupervisor(e) {
		this.setState({
			primarySupervisor: e.target.value,
			primarySupervisorErrorText: ''
		})
	}

	onChangeProjectSupervisor(e) {
		this.setState({
			projectSupervisor: e.target.value,
			projectSupervisorErrorText: ''
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
			contactErrorText: '',
			careerBandErrorText: '',
			revisedBUErrorText: '',
			digithonQualifiedErrorText: '',
			digithonPhaseErrorText: '',
			trainingStatusErrorText: '',
			trainingsUndergoneErrorText: '',
			workExperienceYearErrorText: '',
			workExperienceMonthsErrorText: '',
			primarySupervisiorErrorText: '',
			projectSupervisiorErrorText: '',
		})
	}

	validationSuccess() {
		let empIDPattern = /[0-9]{6}/
		let emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/
		let contactPattern = /[0-9]{10}/
		let digithonScorePattern1 = /[0-9]{1,}/
		let digithonScorePattern2 = /[0-9]{1,}.[0-9]{1,}/
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
				emailErrorText: 'This field cannot be empty'
			})
		} else if(!emailPattern.test(this.state.email)) {
			this.setState({
				emailErrorText: 'Enter a valid email address'
			})
		} else if(this.state.contact.trim().length == 0) {
			this.setState({
				contactErrorText: 'This field cannot be empty'
			})
		} else if(!contactPattern.test(this.state.contact)) {
			this.setState({
				contactErrorText: 'Invalid Contact! Expecting a 10 digit mobile number.'
			})
		} else if(this.state.careerBand.trim().length == 0) {
			this.setState({
				careerBandErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.revisedBU.trim().length == 0) {
			this.setState({
				revisedBUErrorText: 'This field cannot be empty.'
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
		} else if(!(digithonScorePattern1.test(this.digithonScore) || digithonScorePattern2.test(this.digithonScore))) {
			this.setState({
				digithonScoreErrorText: 'Invalid Score. Digithon score must be a number.'
			})
		} else if(this.state.trainingStatus.trim().length == 0) {
			this.setState({
				trainingStatusErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.trainingsUndergone.trim().length == 0) {
			this.setState({
				trainingsUndergoneErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.workExperienceYear.trim().length == 0) {
			this.setState({
				workExperienceYearErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.workExperienceMonths.trim().length == 0) {
			this.setState({
				workExperienceMonthsErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.primarySupervisor.trim().length == 0) {
			this.setState({
				primarySupervisorErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.projectSupervisor.trim().length == 0) {
			this.setState({
				projectSupervisorErrorText: 'This field cannot be empty.'
			})
		} else {
			return true
		}
		return false
	}

	handleAdd() {
		let candidate = {}
		candidate.EmployeeID = this.state.empID
		candidate.EmployeeName = this.state.empName
		candidate.EmailID = this.state.email
		candidate.Contact = this.state.contact
		candidate.CareerBand = this.state.careerBand
		candidate.RevisedBU = this.state.revisedBU;
		candidate.DigiThonQualified = this.state.digithonQualified
		candidate.DigiThonPhase = this.state.digithonPhase
		candidate.DigiThonScore = this.state.digithonScore
		candidate.TrainingStatus = this.state.trainingStatus;
		candidate.TrainingsUndergone = this.state.trainingsUndergone
		candidate.WorkExperience = `${this.state.workExperienceYear} Year(s) ${this.state.workExperienceMonths} Month(s)`
		candidate.PrimarySupervisor = this.state.primarySupervisor
		candidate.ProjectSupervisor = this.state.projectSupervisor
		candidate.College = this.state.college
		candidate.CGPA = this.state.CGPA
		this.props.addCandidate(candidate)
		this.resetFields()
	}

	render() {
		let th = this
		let actions = [
			<FlatButton
				label="CANCEL"
				style={styles.actionButton}
				onClick={(e) => this.handleClose(e, 'CLOSE')}
				/>,
			<FlatButton
				label="Add Candidate"
				style={styles.actionButton}
				onClick={(e) => this.handleClose(e, 'ADD')}
				/>
		]
			return(
				<div>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
					<Dialog
			    	bodyStyle={styles.dialog}
	          title="ADD CANDIDATE"
	          open={this.state.showDialog}
	          autoScrollBodyContent={true}
						actionsContainerStyle={styles.actionsContainer}
						titleStyle={styles.dialogTitle}
						actions={actions}
	          onRequestClose={(e) => this.handleClose(e, 'CLOSE')}
	        >
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
	        	<TextField
			    		hintText="Enter a six digit Employee ID"
			    		floatingLabelText="Employee ID"
			    		value={this.state.empID}
			    		onChange={this.onChangeID}
							errorText={this.state.empIDErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Name"
			    		floatingLabelText="Name"
			    		value={this.state.empName}
			    		onChange={this.onChangeName}
							errorText={this.state.empNameErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Email"
			    		floatingLabelText="Email"
			    		value={this.state.email}
			    		onChange={this.onChangeEmail}
							errorText={this.state.emailErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
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
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Career Band"
			    		floatingLabelText="Career Band"
			    		value={this.state.careerBand}
			    		onChange={this.onChangeCareerBand}
							errorText={this.state.careerBandErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="BU"
			    		floatingLabelText="Revised BU"
			    		value={this.state.revisedBU}
			    		onChange={this.onChangeRevisedBU}
							errorText={this.state.revisedBUErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={{border: '2px solid white', width: '33%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Digithon"
			    		floatingLabelText="Digithon Qualified"
			    		value={this.state.digithonQualified}
			    		onChange={this.onChangeDigithonQualified}
							errorText={this.state.digithonQualifiedErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '34%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Phase"
			    		floatingLabelText="Digithon Phase"
			    		value={this.state.digithonPhase}
			    		onChange={this.onChangeDigiThonPhase}
			    		type="number"
							errorText={this.state.digithonPhaseErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '33%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Score"
			    		floatingLabelText="Digithon Score"
			    		value={this.state.digithonScore}
			    		onChange={this.onChangeDigiThonScore}
			    		type="number"
							errorText={this.state.digithonScoreErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Status"
			    		floatingLabelText="Training Status"
			    		value={this.state.trainingStatus}
			    		onChange={this.onChangeTrainingStatus}
							errorText={this.state.trainingStatusErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Trainings Undergone"
			    		floatingLabelText="Trainings Undergone"
			    		value={this.state.trainingsUndergone}
			    		onChange={this.onChangeTrainingsUndergone}
							errorText={this.state.trainingsUndergoneErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Experience In Years"
			    		floatingLabelText="Experience In Years"
			    		value={this.state.workExperienceYear}
			    		onChange={this.onChangeWorkExperienceYear}
							errorText={this.state.workExperienceYearErrorText}
			    	/>Year(s)
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Experience In Months"
			    		floatingLabelText="Experience In Months"
			    		value={this.state.workExperienceMonths}
			    		onChange={this.onChangeWorkExperienceMonths}
							errorText={this.state.workExperienceMonthsErrorText}
			    	/>Month(s)
						</div>
					</div>
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Primary Supervisor"
			    		floatingLabelText="Primary Supervisor"
			    		value={this.state.primarySupervisor}
			    		onChange={this.onChangePrimarySupervisor}
							errorText={this.state.primarySupervisorErrorText}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="Project Supervisor"
			    		floatingLabelText="Project Supervisor"
			    		value={this.state.projectSupervisor}
			    		onChange={this.onChangeProjectSupervisor}
							errorText={this.state.projectSupervisorErrorText}
			    	/>
						</div>
					</div>
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="College"
			    		floatingLabelText="College"
			    		value={this.state.college}
			    		onChange={this.onChangeCollege}
			    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
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
