import React from 'react';
import StarRating from 'react-stars';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

const styles = {
	heading: {
		textAlign: 'center'
	},
	selectors: {
		marginBottom: 20
	},
	row: {
		marginTop: 10
	},
	single: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 14
	},
	submit: {
		textAlign: 'center',
		marginBottom: 20
	}
}

const evaluation = [
	{
		type: "programming",
		options: [
			"Ability to understand requirements during the last 12 weeks",
			"Ability to translate requirements into an implementation",
			"Problem solving ability (think, evaluate and choose among alternates, and innovation/creativity)",
			"Debugging / troubleshooting skills",
			"Quality of UX thinking demonstrated"
		]
	},
	{
		type: "code quality",
		options: [
			"Writes clean, well commented code",
			"Effort made to optimize code",
			"Code documentation, structure and maintainability",
			"Defensive code focus – understands validations, handles negative scenarios"
		]
	},
	{
		type: "testability",
		options: [
			"Thinks and understand testing – has the “what-if” focus",
			"Writing automated test cases for server side code",
			"Writing automated test cases for client side code"
		]
	},
	{
		type: "engineering culture",
		options: [
			"Stand-up readiness – preparation and participation",
			"Understands agile process",
			"Understands agile thinking – takes ownership of requirements",
			"Timeliness (meeting task timelines)",
			"Devops understanding – CI processes"
		]
	},
	{
		type: "technology",
		options: [
			"HTML and CSS3, BootStrap and Material Design",
			"JavaScript",
			"Basic language command",
			"Async behavior and callbacks",
			"Working with objects",
			"AngularJS or ReactJS",
			"NodeJS architecture concepts – NPM and require, exports",
			"Async Behavior in NodeJS",
			"Express –writing middleware, routes, separation of code",
			"MongoDB and Mongoose",
			"Other tech like Neo4J",
			"Docker/Vagrant and deployment environments",
			"Passport/other authentication mechanisms",
			"Websockets and/or REST APIs",
			"Client side troubleshooting",
			"Client side automated testing tools",
			"Server side automated testing tools"
		]
	},
	{
		type: "communication",
		options: [
			"Presentation Skill",
			"Confidence in communication",
			"Leadership/Taking Initiative"
		]
	}
]

export default class EvaluationForms extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadets: [],
			waveList: [],
			wave: '',
			cadetID: '',
			cadetName: '',
			attitude: 1,
			punctuality: 1,
			programming: {},
			codequality: {},
			testability: {},
			engineeringculture: {},
			technology: {},
			communication: {},
			overall: 1,
			doneWell: '',
			improvement: '',
			suggestions: '',
			open: false,
			disableSave: true
		}
		this.getCadets = this.getCadets.bind(this);
		this.handleWaveChange = this.handleWaveChange.bind(this);
		this.handleCandidateChange = this.handleCandidateChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleDoneWellChange = this.handleDoneWellChange.bind(this);
		this.handleAreasOfImprovementChange = this.handleAreasOfImprovementChange.bind(this);
		this.handleSuggestionsChange = this.handleSuggestionsChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.saveEvaluation = this.saveEvaluation.bind(this);
	}
	componentDidMount() {
		this.getCadets();
		this.setState({
			programming: {'1':1, '2':1, '3':1, '4':1, '5':1},
			codequality: {'1':1, '2':1, '3':1, '4':1},
			testability: {'1':1, '2':1, '3':1, '4':1, '5':1, '6': 1},
			engineeringculture: {'1':1, '2':1, '3':1, '4':1, '5':1},
			technology: {
				'1':1, '2':1, '3':1, '4':1, '5':1,
				'6':1, '7':1, '8':1, '9':1, '10':1,
				'11':1, '12':1, '13':1, '14':1, '15':1, '16': 1
			},
			communication: {'1':1, '2':1, '3':1}
		})
	}
	componentWillUpdate(nextProps, nextState) {
		nextState.disableSave = !(
			nextState.wave.trim() != '' &&
			nextState.cadetName.trim() != '' &&
			nextState.doneWell.trim() != '' &&
			nextState.improvement.trim() != ''
		)
	}
	getCadets() {
		let th = this;
		Request
			.get('/dashboard/cadets')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let waves = [];
		    	res.body.map(function (cadet, index) {
		    		if(waves.indexOf(cadet.Wave) < 0)
		    			waves.push(cadet.Wave);
		    	})
		    	th.setState({
		    		cadets: res.body,
		    		waveList: waves
		    	})
		    }
		  })
	}
	handleWaveChange(event, key, val) {
		this.setState({
			wave: val
		})
	}
	handleCandidateChange(event, key, val) {
		let newVal = val.split('-');
		this.setState({
			cadetID: newVal[0],
			cadetName: newVal[1]
		})
	}
	handleChange(val, type, key) {
		if(type == 'attitude') {
			this.setState({
				attitude: val
			})
		}
		else if(type == 'punctuality') {
			this.setState({
				punctuality: val
			})
		}
		else {
			let temp = this.state[type];
			temp[key] = val;
			this.setState({
				[type]: temp
			})
		}
	}
	handleDoneWellChange(event) {
		this.setState({
			doneWell: event.target.value
		})
	}
	handleAreasOfImprovementChange(event) {
		this.setState({
			improvement: event.target.value
		})
	}
	handleSuggestionsChange(event) {
		this.setState({
			suggestions: event.target.value
		})
	}
	handleSubmit() {
		let evaluationObj = {}
		evaluationObj.cadetID = this.state.cadetID;
		evaluationObj.cadetName = this.state.cadetName;
		evaluationObj.attitude = this.state.attitude;
		evaluationObj.punctuality = this.state.punctuality;
		evaluationObj.programming = this.state.programming;
		evaluationObj.codequality = this.state.codequality;
		evaluationObj.testability = this.state.testability;
		evaluationObj.engineeringculture = this.state.engineeringculture;
		evaluationObj.technology = this.state.technology;
		evaluationObj.communication = this.state.communication;
		evaluationObj.overall = this.state.overall;
		evaluationObj.doneWell = this.state.doneWell;
		evaluationObj.improvement = this.state.improvement;
		evaluationObj.suggestions = this.state.suggestions;
		console.log('Evaluation Obj', evaluationObj);
		this.saveEvaluation(evaluationObj);
	}
	saveEvaluation(evaluationObj) {
		let th = this;
		Request
			.post('/dashboard/saveevaluation')
			.set({'Authorization': localStorage.getItem('token')})
			.send(evaluationObj)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Cadet evaluation form saved successfully', res.body);
		    	th.setState({
						open: true
					})
		    }
		  })
	}

	render() {
		let th = this;
		return(
			<div>
				<h1 style={styles.heading}>StackRoute - Cadet Evaluation</h1>
				<Grid>
					<Row style={styles.selectors}>
						<Col md={4} mdOffset={2}>
							<SelectField
			          value={this.state.wave}
			          onChange={this.handleWaveChange}
			          floatingLabelText="Select Wave"
			          fullWidth={true}
			        >
			        	{
			        		this.state.waveList.map(function (wave, index) {
			        			return <MenuItem key={index} value={wave} primaryText={wave} />
			        		})
			        	}
		        	</SelectField>
						</Col>
						<Col md={4}>
							<SelectField
			          value={this.state.cadetID+'-'+this.state.cadetName}
			          onChange={this.handleCandidateChange}
			          floatingLabelText="Select Candidate"
			          fullWidth={true}
			          disabled={this.state.wave == ''}
			        >
			        {
			        	this.state.cadets.map(function (cadet, index) {
			        		return (
			        			cadet.Wave == th.state.wave &&
			        			<MenuItem key={index} value={cadet.EmployeeID+'-'+cadet.EmployeeName} primaryText={cadet.EmployeeName} />
			        		)
			        	})
			        }
			        </SelectField>
						</Col>
					</Row>
					<Row>
						<Col md={6} mdOffset={2} style={styles.single}>
							Attitude – Interest, inclination and involvement
						</Col>
						<Col md={2}>
							<StarRating
								color1={'#ddd'}
								half={false}
								size={30}
								value={this.state.attitude}
								onChange={(newVal) => th.handleChange(newVal, 'attitude')}
							/>
						</Col>
					</Row>
					<Row>
						<Col md={6} mdOffset={2} style={styles.single}>
							Punctuality and attendance
						</Col>
						<Col md={2}>
							<StarRating
								color1={'#ddd'}
								half={false}
								size={30}
								value={this.state.punctuality}
								onChange={(newVal) => th.handleChange(newVal, 'punctuality')}
							/>
						</Col>
					</Row>
					{
						evaluation.map(function (item, key) {
							return (
								<div key={key}>
									<Row>
										<Col md={8} mdOffset={2}>
											<h3>{item.type.toUpperCase()}</h3>
										</Col>
									</Row>
									{
										item.options.map(function (option, index) {
											return (
												<Row key={index}>
													<Col md ={6} mdOffset={2} style={styles.row}>
														{index+1}. {option}
													</Col>
													<Col md={2}>
														<StarRating
															color1={'#ddd'}
															half={false}
															size={30}
															value={th.state[item.type.replace(' ', '')][index+1]}
															onChange={(newVal) => th.handleChange(newVal, item.type.replace(' ', ''), index+1)}
														/>
													</Col>
												</Row>
											)
										})
									}
								</div>
							)
						})
					}
					<Row>
						<Col md={6} mdOffset={2} style={styles.single}>
							Overall Rating across the program
						</Col>
						<Col md={2}>
							<StarRating
								color1={'#ddd'}
								half={false}
								size={30}
								value={this.state.overall}
								onChange={(newVal) => th.handleChange(newVal, 'overall')}
							/>
						</Col>
					</Row>

					<Row>
						<Col md={8} mdOffset={2}>
							<TextField
					      floatingLabelText="Atleast two areas the participant has done well"
					      multiLine={true}
					      rows={3}
					      rowsMax={3}
					      fullWidth={true}
					      value={this.state.doneWell}
					      onChange={this.handleDoneWellChange}
					    />
						</Col>
					</Row>

					<Row>
						<Col md={8} mdOffset={2}>
							<TextField
					      floatingLabelText="At least two areas of improvement"
					      multiLine={true}
					      rows={3}
					      rowsMax={3}
					      fullWidth={true}
					      value={this.state.improvement}
					      onChange={this.handleAreasOfImprovementChange}
					    />
					  </Col>
					</Row>
					<Row>
						<Col md={8} mdOffset={2}>
							<TextField
								floatingLabelText="Suggestions"
								multiLine={true}
								rows={3}
								rowsMax={3}
								fullWidth={true}
								value={this.state.suggestions}
								onChange={this.handleSuggestionsChange}
							/>
						</Col>
					</Row>

					<Row>
						<Col md={8} mdOffset={2} style={styles.submit}>
							<RaisedButton
								label="Submit"
								primary={true}
								onClick={this.handleSubmit}
								disabled={this.state.disableSave}
							/>
							<Snackbar
								open={this.state.open}
          			message="Cadet evaluation form submitted"
								autoHideDuration={2000}
        			/>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
}
