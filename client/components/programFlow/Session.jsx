import React from 'react'
import Request from 'superagent'
import {Card, CardText, CardHeader} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import IconButton from 'material-ui/IconButton'
import SaveIcon from 'material-ui/svg-icons/content/save'
import {lightBlack} from 'material-ui/styles/colors'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const styles = {
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
	},
	card: {
		box: {
				border: '0.5px solid #009ab1'
		},
		header: {
			backgroundColor: '#00bcd4'
		},
		title: {
			fontWeight: 'bold',
			fontSize: '1.2em'
		},
		text: {
			backgroundColor: '#c4edf2',
			borderTop: '0.5px solid white'
		}
	},
	action: {
		edit: {
			position:'relative',
			left: '92%',
			bottom: '45px'
		},
		save: {
			position: 'absolute',
			right: '10%',
			bottom: '15px'
		},
		delete: {
			position: 'absolute',
			right: '2%',
			bottom: '15px'
		}
	}
}

export default class Session extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			session: {
				SessionID: '',
				CourseName: '',
				Week: '',
				Activities: '',
				Status: '',
				ContextSetSession: '',
				SessionBy: '',
				SessionOn: new Date(),
				Remarks: '',
				showDialog: false
			},
			WeekErrorText: '',
			ActivitiesText: '',
			StatusErrorText: '',
			ContextSetSessionErrorText: '',
			SessionByErrorText: '',
			saveDisabled: true
		}

		this.handleActivities = this.handleActivities.bind(this)
		this.handleStatus = this.handleStatus.bind(this)
		this.handleContextSetSession = this.handleContextSetSession.bind(this)
		this.handleSessionBy = this.handleSessionBy.bind(this)
		this.handleSessionOn = this.handleSessionOn.bind(this)
		this.handleRemarks = this.handleRemarks.bind(this)
		this.handleWeek = this.handleWeek.bind(this)
		this.addNewSession = this.addNewSession.bind(this)
		this.updateSession = this.updateSession.bind(this)
		this.enableSave = this.enableSave.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.deleteSession = this.deleteSession.bind(this)
		this.validationSuccess = this.validationSuccess.bind(this)
		this.resetFields = this.resetFields.bind(this)
	}

	componentWillMount() {
		if(this.props.openDialog) {
			this.setState({
				showDialog: this.props.openDialog
			})
		}
		else {
			this.setState({
				session: this.props.session,
			})
		}
	}

	handleActivities(event) {
		let session = this.state.session
		session.Activities = event.target.value
		this.setState({
			session: session,
			ActivitiesErrorText: ''
		})
	}

	handleStatus(event) {
		let session = this.state.session
		session.Status = event.target.value
		this.setState({
			session: session,
			StatusErrorText: ''
		})
	}

	handleContextSetSession(event) {
		let session = this.state.session
		session.ContextSetSession = event.target.value
		this.setState({
			session: session,
			ContextSetSessionErrorText: ''
		})
	}

	handleSessionBy(event) {
		let session = this.state.session
		session.SessionBy = event.target.value
		this.setState({
			session: session,
			SessionByErrorText: ''
		})
	}

	handleSessionOn(x, event) {
		let session = this.state.session
		session.SessionOn = event
		this.setState({
			session: session
		})
	}

	handleRemarks(event) {
		let session = this.state.session
		session.Remarks = event.target.value
		this.setState({
			session: session
		})
	}

	handleWeek(event) {
		let session = this.state.session
		session.Week = event.target.value
		this.setState({
			session: session,
			WeekErrorText: ''
		})
	}

	addNewSession() {
		let th = this
		if(this.validationSuccess()) {
			let session = this.state.session
			Request
				.post('/mentor/addnewsession')
				.set({'Authorization': localStorage.getItem('token')})
				.send({session: session, waveID: th.props.waveID})
				.end(function(err, res) {
					if(err)
			    	console.log(err)
			    else{
			    	console.log('Created session and Server responded', res.body)
						th.setState({
							saveDisabled: true
						})
						th.props.onSessionAddition()
					}
				})
		}
	}

	updateSession() {
		let th = this
		console.log('WaveID: ', th.props.waveID)
		console.log('Update Session')
		let session = this.state.session
		Request
			.post('/mentor/updatesession')
			.set({'Authorization': localStorage.getItem('token')})
			.send({session: session, waveID: th.props.waveID})
			.end(function(err, res) {
				if(err)
		    	console.log(err)
		    else{
		    	console.log('Updated session and Server responded', res.body)
					th.setState({
						saveDisabled: true
					})
				}
			})
	}

	deleteSession() {
			let session = this.state.session
			let th = this;
		Request
			.post('/mentor/deletesession')
			.set({'Authorization': localStorage.getItem('token')})
			.send({session: session, waveID: th.props.waveID})
			.end(function(err, res) {
				if(err)
		    	console.log(err)
		    else{
		    	console.log('Deleted session and Server responded', res.body)
					th.setState({
						saveDisabled: true
					})
					th.props.onSessionDeletion()
				}
			})
	}

	validationSuccess() {
		if(this.state.session.Week.trim().length == 0) {
			this.setState({
				WeekErrorText: 'This field cannot be empty'
			})
		} else if(this.state.session.Status.trim().length == 0) {
			this.setState({
				StatusErrorText: 'This field cannot be empty'
			})
		} else if(this.state.session.Activities.trim().length == 0) {
			this.setState({
				ActivitiesErrorText: 'This field cannot be empty'
			})
		} else if(this.state.session.SessionBy.trim().length == 0) {
			this.setState({
				SessionByErrorText: 'This field cannot be empty'
			})
		} else {
			return true
		}
		return false
	}

	resetFields() {
			this.state({
				session: {
					SessionID: '',
					CourseName: '',
					Week: '',
					Activities: '',
					Status: '',
					ContextSetSession: '',
					SessionBy: '',
					SessionOn: new Date(),
					Remarks: '',
					showDialog: false
				},
				WeekErrorText: '',
				ActivitiesText: '',
				StatusErrorText: '',
				ContextSetSessionErrorText: '',
				SessionByErrorText: '',
				saveDisabled: true
			})
	}

	enableSave() {
		this.setState({
			saveDisabled: false
		})
	}

	handleClose() {
		this.setState({
			showDialog: false
		})
		this.props.handleClose();
	}

	render() {
		let th = this
		let title, actions
		if(this.props.openDialog) {
			title="ADD NEW SESSION"
			actions = [
				<FlatButton
					label="Cancel"
					style={styles.actionButton}
					onTouchTap={this.handleClose}
				/>,
				<FlatButton
    	 		label="Add Session"
    	   	style={styles.actionButton}
    			onClick={th.state.session.SessionID === '' ? th.addNewSession : th.updateSession}
				/>
			]
		}
		if(this.props.openDialog) {
			return(
			<Dialog
			    	bodyStyle={styles.dialog}
	          title={title}
						titleStyle={styles.dialogTitle}
	          open={this.state.showDialog}
	          autoScrollBodyContent={true}
	          onRequestClose={this.handleClose}
						actionsContainerStyle={styles.actionsContainer}
						actions={actions}
      >
			<div>
				<div style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
	      <TextField
								floatingLabelText='Week Number'
								value={th.state.session.Week}
								onChange={th.handleWeek}
								onBlur={th.enableSave}
								errorText={this.state.WeekErrorText}
				/></div>
				<div style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
				<TextField
								floatingLabelText='Status'
								value={th.state.session.Status}
								onChange={th.handleStatus}
								onBlur={th.enableSave}
								errorText={this.state.StatusErrorText}
				/></div>
			</div>
			<div>
				<div style={{width: '100%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
				<TextField
								floatingLabelText='Activities'
								value={th.state.session.Activities}
								onChange={th.handleActivities}
								onBlur={th.enableSave}
								errorText={this.state.ActivitiesErrorText}
				/>
				</div>
			</div>
			<div>
				<div style={{width: '33%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
					<TextField
									floatingLabelText='ContextSetSession'
									value={th.state.session.ContextSetSession}
									onChange={th.handleContextSetSession}
									onBlur={th.enableSave}
									errorText={this.state.ContextSetSessionErrorText}
						/>
				</div>
				<div style={{width: '34%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
					<TextField
								floatingLabelText='SessionBy'
								value={th.state.session.SessionBy}
								onChange={th.handleSessionBy}
								onBlur={th.enableSave}
								errorText={this.state.SetSessionByErrorText}
					/>
				</div>
				<div style={{width: '33%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
					<DatePicker
								floatingLabelText='SessionOn'
								defaultDate={new Date()}
								onChange={th.handleSessionOn}
								onBlur={th.enableSave}
					/>
				</div>
			</div>
			<div>
				<div style={{width: '100%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', display: 'inline-block'}}>
					<TextField
								floatingLabelText='Remarks'
								value={th.state.session.Remarks}
								onChange={th.handleRemarks}
								onBlur={th.enableSave}
					/>
				</div>
			</div>
			</Dialog>
		)}
		else {
			let z = new Date(th.state.session.SessionOn);
			let date = new Date(z.getFullYear()+'-'+(z.getMonth()+1)+'-'+z.getDate())
			return (
				<div>
				<Card  style={styles.card.box}>
					<CardHeader
						style={styles.card.header}
					>
						<TextField
							floatingLabelText='Week Number'
							value={th.state.session.Week}
							onChange={th.handleWeek}
							onBlur={th.enableSave}
						/>
						<IconButton tooltip="Save Session" style={styles.action.save} onClick={th.state.session.SessionID === '' ? th.addNewSession : th.updateSession} disabled={this.state.saveDisabled}>
							<SaveIcon color={lightBlack} />
						</IconButton>
						<IconButton tooltip="Delete Session" style={styles.action.delete} onClick={th.deleteSession}>
							<DeleteIcon color={lightBlack} />
						</IconButton>
					</CardHeader>
					<CardText>
						<TextField
							floatingLabelText='Activities'
							value={th.state.session.Activities}
							onChange={th.handleActivities}
							onBlur={th.enableSave}
						/>
						<TextField
							floatingLabelText='Status'
							value={th.state.session.Status}
							onChange={th.handleStatus}
							onBlur={th.enableSave}
						/>
						<TextField
							floatingLabelText='ContextSetSession'
							value={th.state.session.ContextSetSession}
							onChange={th.handleContextSetSession}
							onBlur={th.enableSave}
						/>
						<TextField
							floatingLabelText='SessionBy'
							value={th.state.session.SessionBy}
							onChange={th.handleSessionBy}
							onBlur={th.enableSave}
						/>
						<DatePicker
							floatingLabelText='SessionOn'
							value={date}
							onChange={th.handleSessionOn}
							onBlur={th.enableSave}
						/>
						<TextField
							floatingLabelText='Remarks'
							value={th.state.session.Remarks}
							onChange={th.handleRemarks}
							onBlur={th.enableSave}
						/>
					</CardText>
				</Card>
				</div>
			)
		}
	}
}
