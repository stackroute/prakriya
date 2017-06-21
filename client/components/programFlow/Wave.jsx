import React from 'react'
import Request from 'superagent'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import {Grid, Row, Col} from 'react-flexbox-grid'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import AutoComplete from 'material-ui/AutoComplete'
import DatePicker from 'material-ui/DatePicker'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import Session from './Session.jsx'
import {Card, CardText, CardHeader} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {lightBlack} from 'material-ui/styles/colors';
import app from '../../styles/app.json';

export default class Wave extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			waves: [],
			waveString: '',
			waveObject: {},
			course: '',
			canCreateSession: true,
			addSessionDialog: false
		}

		this.getWaveIDs = this.getWaveIDs.bind(this)
		this.getWaveObject = this.getWaveObject.bind(this)
		this.onWaveChange = this.onWaveChange.bind(this)
		this.onCourseChange = this.onCourseChange.bind(this)
		this.addSession = this.addSession.bind(this)
		this.onSessionAddition = this.onSessionAddition.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.onSessionDeletion = this.onSessionDeletion.bind(this)
	}

	componentWillMount() {
		if(localStorage.getItem('token')) {
			this.getWaveIDs()
		}
	}

	getWaveIDs() {
		let th = this
		Request
			.get('/dashboard/waveids')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					waves: res.body.waveids
				})
			})
	}

	getWaveObject(waveID) {
		let th = this
		Request
			.get(`/dashboard/waveobject/${waveID}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					waveObject: res.body.waveObject,
				})
				console.log('State Changed: ', th.state.waveObject)
			})
	}

	onWaveChange(e) {
		let th = this
		th.setState({
			waveString: e.target.outerText,
			waveObject: {}
		})
		th.getWaveObject(e.target.outerText)
	}

	onCourseChange(e) {
		let th = this
		th.setState({
			course: e.target.outerText
		})
	}

	addSession() {
		this.setState({
			addSessionDialog: true
		})
	}

	handleClose() {
		this.setState({
			addSessionDialog: false
		})
		this.getWaveObject(this.state.waveString)
	}

	onSessionAddition() {
		this.setState({
			canCreateSession: true,
			addSessionDialog: false
		})
		this.getWaveObject(this.state.waveString)
	}

	onSessionDeletion() {
		this.setState({
			waveObject:{}
		})
		this.getWaveObject(this.state.waveString)
	}

	render() {
		let th = this
		return(
			<div>
				<h1 style={app.heading}>Program Flow</h1>
				<Grid>
					<Row>
						<Col md={6}>
						<SelectField
							onChange={th.onWaveChange}
							floatingLabelText="Select Wave"
							value={th.state.waveString}
						>
							{
								th.state.waves.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						<SelectField
							onChange={th.onCourseChange}
							floatingLabelText="Select Course"
							value={th.state.course}
						>
							{
								th.state.waveObject.Course === undefined ? '' :
								th.state.waveObject.Course.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						</Col>
					</Row>
					<Row>
					{
						th.state.waveObject.Sessions === undefined ? '' :
						th.state.waveObject.Sessions.map(function(session, index) {
							return <Col md={6}><Session key={index} session={session} waveID={th.state.waveObject.WaveID} onSessionAddition={th.onSessionAddition} onSessionDeletion={th.onSessionDeletion}/></Col>
						})
					}
					</Row>
				</Grid>
					<FloatingActionButton style={app.fab} mini={true} onTouchTap={this.addSession}>
						<AddIcon />
					</FloatingActionButton>
					{this.state.addSessionDialog &&
							<Session waveID={th.state.waveObject.WaveID} openDialog={this.state.addSessionDialog} handleClose={this.handleClose} onSessionAddition={th.onSessionAddition}/>}
			</div>
		)
	}
}
