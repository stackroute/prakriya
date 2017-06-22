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
import Schedule from './Schedule.jsx';
import app from '../../styles/app.json';

export default class Wave extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			waves: [],
			waveString: '',
			waveObj: {},
			courseObj: {},
			canCreateSession: true,
			addSessionDialog: false
		}

		this.getWaveIDs = this.getWaveIDs.bind(this)
		this.getWaveObject = this.getWaveObject.bind(this)
		this.getCourse = this.getCourse.bind(this)
		this.onWaveChange = this.onWaveChange.bind(this)
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
					waveObj: res.body.waveObject,
				})
				console.log('Wave obj', th.state.waveObj.Course)
				th.getCourse(th.state.waveObj.Course);
			})
	}

	getCourse(courseID) {
		let th = this
		Request
			.get(`/dashboard/course/${courseID}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					courseObj: res.body,
				})
				console.log('Course', th.state.courseObj)
			})
	}

	onWaveChange(e) {
		this.setState({
			waveString: e.target.outerText,
			waveObj: {}
		})
		this.getWaveObject(e.target.outerText)
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
			waveObj:{}
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
						</Col>
					</Row>
				</Grid>
				{
					Object.keys(this.state.waveObj).length !== 0 &&
					Object.keys(this.state.courseObj).length !== 0 &&
					<Schedule wave={this.state.waveObj} sessions={this.state.courseObj.Schedule}/>
				}
			</div>
		)
	}
}
