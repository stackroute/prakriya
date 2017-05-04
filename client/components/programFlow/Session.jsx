import React from 'react'
import Request from 'superagent'
import {Card, CardText, CardHeader} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import IconButton from 'material-ui/IconButton'
import SaveIcon from 'material-ui/svg-icons/content/save'
import {lightBlack} from 'material-ui/styles/colors'

const styles = {
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
			position: 'relative',
			left: '42%',
			bottom: '10px'
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
				SessionOn: {},
				Remarks: ''
			},
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
	}

	componentDidMount() {
		this.setState({
			session: this.props.session
		})
	}

	handleActivities(event) {
		let session = this.state.session
		session.Activities = event.target.value
		this.setState({
			session: session
		})
	}

	handleStatus(event) {
		let session = this.state.session
		session.Status = event.target.value
		this.setState({
			session: session
		})
	}

	handleContextSetSession(event) {
		let session = this.state.session
		session.ContextSetSession = event.target.value
		this.setState({
			session: session
		})
	}

	handleSessionBy(event) {
		let session = this.state.session
		session.SessionBy = event.target.value
		this.setState({
			session: session
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
			session: session
		})
	}

	addNewSession() {
		let th = this
		console.log('WaveID: ', th.props.waveID)
		console.log('Add New Session')
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

	enableSave() {
		this.setState({
			saveDisabled: false
		})
	}

	render() {
		let th = this
		return(
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
						value={th.state.session.SessionOn}
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
