import React from 'react'
import Request from 'superagent'
import RaisedButton from 'material-ui/RaisedButton'
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
import Paper from 'material-ui/Paper';
import {lightBlack} from 'material-ui/styles/colors';
import Schedule from './Schedule.jsx';
import app from '../../styles/app.json';

const styles = {
	tableHeading: {
		paddingTop: 20,
		paddingBottom: 20,
		background: '#333',
		color: '#eee',
		textAlign: 'center'
	}
}

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
		this.waveUpdate = this.waveUpdate.bind(this)
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

	waveUpdate(waveObj) {
		let th = this
		Request
			.post('/dashboard/updatewave')
			.set({'Authorization': localStorage.getItem('token')})
			.send({'wave': waveObj})
			.end(function(err, res){
				console.log('Wave Updated')
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
					{
						Object.keys(this.state.waveObj).length !== 0 &&
						Object.keys(this.state.courseObj).length !== 0 &&
						<Row style={styles.tableHeading}>
							<Col md={1}>Day</Col>
							<Col md={2}>Name</Col>
							<Col md={2}>Skills</Col>
							<Col md={2}>Session By</Col>
							<Col md={2}>Session On</Col>
							<Col md={2}>Status</Col>
						</Row>
					}
					{
						Object.keys(this.state.waveObj).length !== 0 &&
						Object.keys(this.state.courseObj).length !== 0 &&
						this.state.courseObj.Schedule.map(function(session, i) {
							return (
								<Schedule 
									wave={th.state.waveObj} 
									session={session} 
									key={i}
									handleWaveUpdate={th.waveUpdate}
								/>
							)
						})
					}
				</Grid>
			</div>
		)
	}
}
