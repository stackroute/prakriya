import React from 'react';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TrackItem from './TrackItem.jsx';

export default class AssessmentTracker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trainingTracks: [],
			waves: [],
			courses: [],
			categories: [],
			candidates: [],
			trainingTrack: '',
			wave: '',
			course: '',
			assessmentCategories: []
		}
		this.getTrainingTracks = this.getTrainingTracks.bind(this);
		this.getWaves = this.getWaves.bind(this);
		this.getCandidates = this.getCandidates.bind(this);
		this.getCourses = this.getCourses.bind(this);
		this.onTrainingTrackChange = this.onTrainingTrackChange.bind(this);
		this.onWaveChange = this.onWaveChange.bind(this);
		this.onCourseChange = this.onCourseChange.bind(this);
	}

	componentWillMount() {
		console.log('at hi')
		if(localStorage.getItem('token')) {
			this.getTrainingTracks()
		}
		console.log('at bi')
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
				console.log('TrainingTracks Retrieved: ', res.body.trainingtracks)
			});
	}

	getWaves(trainingTrack) {
		let th = this
		Request
			.get('/mentor/waves/'+trainingTrack)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					waves: res.body.waves
				});
				console.log('Waves Retrieved: ', res.body.waves)
			});
	}

	getCourses(wave) {
		let th = this
		Request
			.get('/mentor/courses/'+wave)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					courses: res.body.courses
				});
				console.log('Courses Retrieved: ', res.body.courses)
			});
	}

	getCandidates(trainingTrack, wave, course) {
		let th = this
		Request
			.get(`/mentor/candidatesandtracks/${trainingTrack}/${wave}/${course}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				th.setState({
					candidates: res.body.candidates,
					assessmentCategories: res.body.assessmentTrack.categories
				});
				console.log('Candidates Retrieved: ', res.body.candidates)
			});
	}

	onTrainingTrackChange(e) {
		let th = this
		console.log('Track Changed: ', e.target.outerText)
		th.setState({
			trainingTrack: e.target.outerText
		})
		th.getWaves(e.target.outerText)
	}

	onWaveChange(e) {
		let th = this
		console.log('Wave Changed: ', e.target.outerText)
		th.setState({
			wave: e.target.outerText
		})
		th.getCourses(e.target.outerText)
	}

	onCourseChange(e) {
		let th = this
		console.log('Course Changed: ', e.target.outerText)
		th.setState({
			course: e.target.outerText
		})
		th.getCandidates(th.state.trainingTrack, th.state.wave, e.target.outerText)
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
							value={th.state.wave}
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
								th.state.courses.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						</Col>
					</Row>
					{
						th.state.candidates.map(function(candidate, index) {
							return <TrackItem
								key={index}
								track={
									{
										candidateID: candidate.EmployeeID,
										candidateName: candidate.EmployeeName,
										candidateEmail: candidate.EmailID,
										comments: candidate.AssessmentTrack,
										categories: th.state.assessmentCategories
									}
								}/>
						})
					}
				</Grid>
			</div>
		)
	}
}
