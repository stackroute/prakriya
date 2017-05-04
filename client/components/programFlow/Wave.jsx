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

const styles = {
	heading:{
		textAlign:'center'
	},
	save: {
		textAlign: 'center',
		marginBottom: 20
	},
	addButton: {
		position:'fixed',
		bottom: '60px',
		right: '15px',
		zIndex: 1
	}
}

export default class Wave extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			trainingTracks: [],
			trainingTrack: '',
			waves: [],
			waveString: '',
			waveObject: {},
			course: '',
			canCreateSession: true
		}

		this.getTrainingTracks = this.getTrainingTracks.bind(this)
		this.getWaves = this.getWaves.bind(this)
		this.getWaveObject = this.getWaveObject.bind(this)
		this.onTrainingTrackChange = this.onTrainingTrackChange.bind(this)
		this.onWaveChange = this.onWaveChange.bind(this)
		this.onCourseChange = this.onCourseChange.bind(this)
		this.addSession = this.addSession.bind(this)
		this.onSessionAddition = this.onSessionAddition.bind(this)
	}

	componentWillMount() {
		if(localStorage.getItem('token')) {
			this.getTrainingTracks()
		}
	}

	getTrainingTracks() {
		let th = this
		Request
			.get('/mentor/trainingtracks')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					trainingTracks: res.body.trainingtracks
				})
			})
	}

	getWaves(trainingTrack) {
		let th = this
		Request
			.get('/mentor/waves/'+trainingTrack)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					waves: res.body.waves
				})
			})
	}

	getWaveObject(trainingTrack, waveNumber) {
		let th = this
		Request
			.get(`/mentor/waveobject/${trainingTrack}/${waveNumber}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				console.log('Wave recieved from server: ', res.body.waveObject)
				th.setState({
					waveObject: res.body.waveObject
				})
			})
	}

	onTrainingTrackChange(e) {
		let th = this
		th.setState({
			trainingTrack: e.target.outerText
		})
		th.getWaves(e.target.outerText)
	}

	onWaveChange(e) {
		let th = this
		th.setState({
			waveString: e.target.outerText
		})
		th.getWaveObject(th.state.trainingTrack, e.target.outerText)
	}

	onCourseChange(e) {
		let th = this
		th.setState({
			course: e.target.outerText
		})
	}

	addSession() {
		let th = this
		console.log('into addSession: ', th.state)
		if(th.state.canCreateSession
			&& th.state.trainingTrack.length !== 0
			&& th.state.waveString.length !== 0
			&& th.state.course.length !== 0) {
			console.log('if')
			let waveObject = th.state.waveObject
			waveObject.Sessions.push({
				SessionID: '',
				CourseName: th.state.course,
				Week: '',
				Activities: '',
				Status: '',
				ContextSetSession: '',
				SessionBy: '',
				SessionOn: {},
				Remarks: ''
			})
			this.setState({
				waveObject: waveObject,
				canCreateSession: false
			})
		} else {
			console.log('else')
		}
	}

	onSessionAddition() {
		this.setState({
			canCreateSession: true
		})
	}

	render() {
		let th = this
		return(
			<div>
				<Grid>
					<Row>
						<h2 style={styles.heading}>Program Flow</h2>
					</Row>
					<Row>
						<Col>
						<SelectField
							onChange={th.onTrainingTrackChange}
							floatingLabelText="Select Training Track"
							value={th.state.trainingTrack}
						>
							{
								th.state.trainingTracks.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						</Col>
						<Col>
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
						<Col>
						<SelectField
							onChange={th.onCourseChange}
							floatingLabelText="Select Course"
							value={th.state.course}
						>
							{
								th.state.waveObject.CourseNames === undefined ? '' :
								th.state.waveObject.CourseNames.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						</Col>
					</Row>
					{
						th.state.waveObject.Sessions === undefined ? '' :
						th.state.waveObject.Sessions.map(function(session, index) {
							return <Session key={index} session={session} waveID={th.state.waveObject.WaveID} onSessionAddition={th.onSessionAddition} />
						})
					}
				</Grid>
					<FloatingActionButton style={styles.addButton} mini={true} onTouchTap={this.addSession}>
						<AddIcon />
					</FloatingActionButton>
			</div>
		)
	}
}
