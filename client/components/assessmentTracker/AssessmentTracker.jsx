import React from 'react';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TrackItem from './TrackItem.jsx';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import app from '../../styles/app.json';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

export default class AssessmentTracker extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			waves: [],
			wave: '',
			waveCadets: {},
			cadetsOfWave: [],
			assessment: '',
			select: false,
			course: {},
			implement: 'Understands and implements very well',
			complete: 'Completed with no help',
			learn: 'High',
			implementation: ['Understands and implements very well','Understands and implements ok', 'Understands but finds it difficult to implement','Do not understand and is not able to implement'],
			completion: ['Completed with no help','Completed with minimal help','Completed with lots of help and review','Was not able to solve the problem'],
			learning: ['High', 'Medium', 'Low']
		}

		this.getWaveIDs = this.getWaveIDs.bind(this)
		this.onWaveChange = this.onWaveChange.bind(this)
		this.getWave = this.getWave.bind(this)
		this.onAssessmentChange = this.onAssessmentChange.bind(this)
    this.onImplementChange = this.onImplementChange.bind(this);
    this.onCompleteChange = this.onCompleteChange.bind(this);
    this.onLearnChange = this.onLearnChange.bind(this);
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

	onWaveChange(e) {
		let th = this
		th.setState({
			wave: e.target.outerText,
			assessment: ''
		})
		console.log(e.target.outerText)
		this.getWave(e.target.outerText);
		this.getCadetsOfWave(e.target.outerText);
	}

	onAssessmentChange(e) {
		let th = this
		th.setState({
			assessment: e.target.outerText
		})
		console.log(e.target.outerText)
	}

		onImplementChange(e) {
			let th = this
			th.setState({
				implement: e.target.outerText
			})
			console.log(e.target.outerText)
		}

			onCompleteChange(e) {
				let th = this
				th.setState({
					complete: e.target.outerText
				})
				console.log(e.target.outerText)
			}

				onLearnChange(e) {
					let th = this
					th.setState({
						learn: e.target.outerText
					})
					console.log(e.target.outerText)
				}

	getWave(waveID) {
		let th = this
		Request
			.get(`/dashboard/wave?waveid=${waveID}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				console.log(res.body);
				th.setState({
					waveCadets: res.body
				})
				th.getCourse(res.body.Course);
			})
	}

	getCourse(course) {
		let th = this
		Request
			.get(`/mentor/course/${course}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				console.log('getCourse Object: ', res.body[0])
				th.setState({
					course: res.body[0],
					select: true
				})
			})
	}

	getCadetsOfWave(waveID) {
		let th = this;
    let candidateName = [];
    let candidateID = [];
    Request.get('/dashboard/wavespecificcandidates?waveID=' + waveID).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({cadetsOfWave: res.body.data})
    })
	}

	render() {
		let th = this
		return(
			<div>
				<h1 style={app.heading}>Assessment Tracker</h1>
				<Grid>
					<Row>
						<Col md={6}><Paper style={{boxSizing: 'border-box', padding: '5px'}}>
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
							onChange={th.onAssessmentChange}
							floatingLabelText="Select Assessment"
							value={th.state.assessment}
						>
							{
								th.state.select && th.state.course.Assignments.map(function(val, key) {
									return <MenuItem key={key} value={val.Name} primaryText={val.Name} />
								})
							}
						</SelectField>
						</Paper></Col>
					</Row></Grid>
						<Table>
							<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
								<TableHeaderColumn style = {{width:'70px'}}>Cadet ID</TableHeaderColumn>
								<TableHeaderColumn style = {{width:'150px'}}>Cadet Name</TableHeaderColumn>
								<TableHeaderColumn style = {{width:'350px'}}>Implementation</TableHeaderColumn>
								<TableHeaderColumn style = {{width:'350px'}}>Completion</TableHeaderColumn>
								<TableHeaderColumn>learning</TableHeaderColumn>
							</TableHeader>
							<TableBody displayRowCheckbox={false} showRowHover={false}>
								{
									th.state.assessment && th.state.cadetsOfWave.map(function(cadet){
										return (<TableRow>
															<TableRowColumn style = {{width:'70px'}}>{cadet.EmployeeID}</TableRowColumn>
															<TableRowColumn style = {{width:'150px'}}>{cadet.EmployeeName}</TableRowColumn>
															<TableRowColumn style = {{width:'350px'}}>
																<SelectField
																	onChange={th.onImplementChange}
																	floatingLabelText="Select Assessment"
																	value={th.state.implement}
                                   fullWidth='true'
																>
																	{
																		th.state.implementation.map(function(implement, key) {
																			return <MenuItem key={key} value={implement} primaryText={implement}/>
																		})
																	}
																</SelectField>
															</TableRowColumn>
														<TableRowColumn style = {{width:'350px'}}>
															<SelectField
																onChange={th.onCompleteChange}
																floatingLabelText="Select Assessment"
																value={th.state.complete}
                                fullWidth='true'
															>
																{
																	th.state.completion.map(function(complete, key) {
																		return <MenuItem key={key} value={complete} primaryText={complete} />
																	})
																}
															</SelectField>
														</TableRowColumn>
													<TableRowColumn>
															<SelectField
																onChange={th.onLearnChange}
																floatingLabelText="Select learning"
																value={th.state.learn}
															>
																{
																	th.state.learning.map(function(learn, key) {
																		return <MenuItem key={key} value={learn} primaryText={learn} />
																	})
																}
															</SelectField>
														</TableRowColumn>
														</TableRow>)
									})
								}
							</TableBody>
						</Table>
			</div>
		)
	}
}
