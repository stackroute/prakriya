import React from 'react'
import Request from 'superagent'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Grid, Row, Col} from 'react-flexbox-grid'
import TrackItem from './TrackItem.jsx'

export default class AssessmentTracker extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			waves: [],
			courses: [],
			categories: [],
			candidates: [],
			wave: '',
			course: '',
			assessmentCategories: []
		}

		this.getCourses = this.getCourses.bind(this)
		this.getWaveIDs = this.getWaveIDs.bind(this)

		this.getCandidates = this.getCandidates.bind(this)
		this.onWaveChange = this.onWaveChange.bind(this)
		this.onCourseChange = this.onCourseChange.bind(this)
		this.updateComments = this.updateComments.bind(this)
		this.saveAssessmentTrack = this.saveAssessmentTrack.bind(this)
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
				console.log("WaveIDs Fetched: ", res.body.waveids)
				th.setState({
					waves: res.body.waveids
				})
			})
	}

	getCourses(waveID) {
		let th = this
		Request
			.get('/dashboard/coursesforwave?waveID=' + waveID)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				console.log('Courses: ', res.body.courses)
				th.setState({
					courses: res.body.courses
				})
			})
	}

	getCandidates(waveID, courseName) {
		let th = this
		Request
			.get(`/dashboard/candidatesandtracks/${waveID}/${courseName}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					candidates: res.body.candidates,
					assessmentCategories: res.body.assessmentTrack.Categories
				})
				console.log('getCandidates Object: ', res.body)
			})
	}

	saveAssessmentTrack(index) {
		let candidateObj = this.state.candidates[index]
		Request
			.post('/mentor/updatecandidateassessment')
			.set({'Authorization': localStorage.getItem('token')})
			.send(candidateObj)
			.end(function(err, res) {
				if(err)
		    	console.log(err)
		    else
		    	console.log('Updated candidate assessment and Server responded', res.body)
			})
	}

	onWaveChange(e) {
		let th = this
		th.setState({
			wave: e.target.outerText,
			course: '',
			candidates: []
		})
		th.getCourses(e.target.outerText)
	}

	onCourseChange(e) {
		let th = this
		th.setState({
			course: e.target.outerText
		})
		th.getCandidates(th.state.wave, e.target.outerText)
	}

	updateComments(index, comments) {
		let candidates = this.state.candidates
		candidates[index].AssessmentTrack = comments
		this.setState({
			candidates: candidates
		})
	}

	render() {
		let th = this
		return(
			<div>
				<Grid>
					<Row>
						<h1>Assessment Tracker</h1>
					</Row>
					<Row>
						<Col md={6}>
						<SelectField
							onChange={th.onWaveChange}
							floatingLabelText="Select Wave"
							value={th.state.wave}
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
								th.state.courses.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						</Col>
					</Row>
				</Grid>

				<Grid><Row>
					{
						th.state.candidates.map(function(candidate, index) {
							let categories = th.state.assessmentCategories
							return <Col md={6}><TrackItem
								key={index}
								track={
									{
										candidateID: candidate.EmployeeID,
										candidateName: candidate.EmployeeName,
										candidateEmail: candidate.EmailID,
										comments: candidate.AssessmentTrack,
										categories: categories
									}
								}
								onUpdateComments={(comments)=>{th.updateComments(index, comments)}}
								onSaveComments={()=>{th.saveAssessmentTrack(index)}} /></Col>
						})
					}
				</Row></Grid>

			</div>
		)
	}
}
