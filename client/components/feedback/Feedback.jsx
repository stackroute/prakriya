import React from 'react';
import StarRating from 'react-stars';
import Request from 'superagent';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	heading: {
		textAlign: 'center'
	},
	name: {
		color: '#fff',
		background: '#555',
		textAlign: 'center',
	},
	submit: {
		textAlign: 'center',
		marginBottom: 20
	}
}

const feedback = [
	{
		type: "relevance",
		options: [
			"The objectives were clearly defined at the beginning of the program",
			"The stated objectives for the Immersive program have been met successfully",
			"This program relevance to learn the new set of tech for Web development",
			"This program is relevant to my role/job",
			"This program made good use of my time"
		]
	},
	{
		type: "training",
		options: [
			"Program was stimulating and challenging",
			"Relevant learning material and reference materials were provided",
			"Program is paced well",
			"Assignments helped in implementing technologies covered"
		]
	},
	{
		type: "confidence",
		options: [
			"Understanding of the technologies that are core to the MEAN or MERN stack",
			"Develop and deploy JavaScript solution using MongoDB, Express and Node.js",
			"Code using HTML / CSS",
			"Code using JavaScript language",
			"Code using Node.js and Express",
			"Use MongoDB and Mongoose"
		]
	},
	{
		type: "mentors",
		options: [
			"Mentor Knowledge of the Subject",
			"Ability to technically challenge and help learn",
			"Interest and involvement in the program",
			"Responsiveness to questions/ queries",
			"Overall ability to mentor"
		]
	},
	{
		type: "facilities",
		options: [
			"Environment / Workspace",
			"Quality and speed of Internet / Network",
			"The facility was clean and well maintained",
			"Overall Infrastructure"
		]
	},
	{
		type: "overall",
		options: [
			"How would you rate your overall satisfaction after completing this program",
			"How would you rate yourself in terms of confidence level",
			"How likely are you to recommend this program to others in your organization"
		]
	}
]

export default class Feedback extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadet: {},
			relevance: {},
			training: {},
			confidence: {},
			mentors: {},
			facilities: {},
			overall: {},
			mostLiked: '',
			leastLiked: '',
			open: false,
			buttonDisabled: false
		}
		this.getCadet = this.getCadet.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleMostLikedChange = this.handleMostLikedChange.bind(this);
		this.handleLeastLikedChange = this.handleLeastLikedChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.saveFeedback = this.saveFeedback.bind(this);
	}
	componentDidMount() {
		this.getCadet();
		this.setState({
			relevance: {'1':1, '2':1, '3':1, '4':1, '5':1},
			training: {'1':1, '2':1, '3':1, '4':1},
			confidence: {'1':1, '2':1, '3':1, '4':1, '5':1, '6':1},
			mentors: {'1':1, '2':1, '3':1, '4':1, '5':1},
			facilities: {'1':1, '2':1, '3':1, '4':1},
			overall: {'1':1, '2':1, '3':1}
		});
	}
	getCadet() {
		let th = this;
		Request
			.get('/dashboard/cadet')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		cadet: res.body
		    	})
		    	console.log(th.state.cadet);
		    }
		  })
	}
	saveFeedback(feedbackObj) {
		let th = this;
		Request
			.post('/dashboard/savefeedback')
			.set({'Authorization': localStorage.getItem('token')})
			.send(feedbackObj)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Feedback saved successfully', res.body);
		    	th.setState({
						open: true
					})
		    }
		  })
	}
	getInitialState() {
	 	return {
		 	invalidData: true,
	 	}
 	}

 	componentWillUpdate(nextProps, nextState) {
	 	nextState.invalidData = !(
	 		nextState.mostLiked.trim() != '' && 
	 		nextState.leastLiked.trim() != ''
	 	);
 	}

	handleChange(val, type, key) {
		let temp = this.state[type];
		temp[key] = val;
		this.setState({
			[type]: temp
		})
	}

	handleMostLikedChange(event) {
	console.log(this.state.open);
		this.setState({
			mostLiked: event.target.value
		})
	}
	handleLeastLikedChange(event) {
		this.setState({
			leastLiked: event.target.value
		})
	}

	handleSubmit() {
		let feedbackObj = {};
		feedbackObj.cadetID = this.state.cadet.EmployeeID;
		feedbackObj.cadetName = this.state.cadet.EmployeeName;
		feedbackObj.relevance = this.state.relevance;
		feedbackObj.training = this.state.training;
		feedbackObj.confidence = this.state.confidence;
		feedbackObj.mentors = this.state.mentors;
		feedbackObj.facilities = this.state.facilities;
		feedbackObj.overall = this.state.overall;
		feedbackObj.mostLiked = this.state.mostLiked;
		feedbackObj.leastLiked = this.state.leastLiked;
		this.saveFeedback(feedbackObj);
		this.setState({
      			buttonDisabled: true
    });
	}

	render() {
		let th = this;
		return(
			<div>
				<h3 style={styles.heading}>	Feedback Form </h3>
				<Grid>
					<Row>
						<Col md={8} mdOffset={2} style={styles.name}>
							<h3>{this.state.cadet.EmployeeName}</h3>
						</Col>
					</Row>
					{
						feedback.map(function(item, key) {
							return (
								<div key={key}>
									<Row>
										<Col md={8} mdOffset={2}>
											<h4>{item.type.toUpperCase()}</h4>
										</Col>
									</Row>
									{
										item.options.map(function (option, index) {
											return(
												<Row key={index}>
													<Col md ={6} mdOffset={2} style={{marginTop: 10}}>
														{index+1}. {option}
													</Col>
													<Col md={2}>
														<StarRating
															color1={'#ddd'}
															half={false}
															size={30}
															value={th.state[item.type][index+1]}
															onChange={(newVal) => th.handleChange(newVal, item.type, index+1)}
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
						<Col md={8} mdOffset={2}>
							<TextField
					      hintText="Express your views"
					      floatingLabelText="Things you liked most about the program"
					      multiLine={true}
					      rows={3}
					      rowsMax={3}
					      fullWidth={true}
					      value={this.state.mostLiked}
					      onChange={this.handleMostLikedChange}
					    />
						</Col>
					</Row>

					<Row>
						<Col md={8} mdOffset={2}>
							<TextField
					      hintText="Express your views"
					      floatingLabelText="Things you liked least about the program"
					      multiLine={true}
					      rows={3}
					      rowsMax={3}
					      fullWidth={true}
					      value={this.state.leastLiked}
					      onChange={this.handleLeastLikedChange}
					    />
					  </Col>
					</Row>

					<Row>
						<Col md={8} mdOffset={2} style={styles.submit}>
							<RaisedButton
								label="Submit"
								primary={true}
								onClick={this.handleSubmit}
								disabled={this.state.buttonDisabled || this.state.invalidData}
							/>
							<Snackbar
								open={this.state.open}
          			message="Feedback submitted"
								autoHideDuration={2000}
        			/>
						</Col>
					</Row>
				</Grid>
			</div>
		)
	}
}
