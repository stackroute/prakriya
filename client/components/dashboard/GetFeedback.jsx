import React from 'react';
import jsPDF from 'jspdf';
import LinearProgress from 'material-ui/LinearProgress';
import Request from 'superagent';
import Moment from 'moment';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
	container: {
		padding: 20,
		borderRadius: 5,
		backgroundColor: '#C6D8D3'
	}
}
const FEEDBACKS = [
  {
    type: "relevance",
    options: [
      "The objectives were clearly defined at the beginning of the program",
      "The stated objectives for the Immersive program have been met successfully",
      "This program relevance to learn the new set of tech for Web development",
      "This program is relevant to my role/job",
      "This program made good use of my time"
    ]
  }, {
    type: "training",
    options: [
      "Program was stimulating and challenging",
      "Relevant learning material and reference materials were provided",
      "Program is paced well",
      "Assignments helped in implementing technologies covered"
    ]
  }, {
    type: "confidence",
    options: [
      "Understanding of the technologies that are core to the MEAN or MERN stack",
      "Develop and deploy JavaScript solution using MongoDB, Express and Node.js",
      "Code using HTML / CSS",
      "Code using JavaScript language",
      "Code using Node.js and Express",
      "Use MongoDB and Mongoose"
    ]
  }, {
    type: "mentors",
    options: [
      "Mentor Knowledge of the Subject",
      "Ability to technically challenge and help learn",
      "Interest and involvement in the program",
      "Responsiveness to questions/ queries", "Overall ability to mentor"
    ]
  }, {
    type: "facilities",
    options: [
      "Environment / Workspace",
      "Quality and speed of Internet / Network",
      "The facility was clean and well maintained",
      "Overall Infrastructure"
    ]
  }, {
    type: "overall",
    options: [
      "How would you rate your overall satisfaction after completing this program",
      "How would you rate yourself in terms of confidence level",
      "How likely are you to recommend this program to others in your organization"]
  }
];

export default class WaveDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbacks: [],
			waveIDs: [],
			waveID: ''
		};
		this.getWaves = this.getWaves.bind(this);
		this.onIDSelect = this.onIDSelect.bind(this);
		this.getFeedbacks = this.getFeedbacks.bind(this);
		this.downloadFeedbacks = this.downloadFeedbacks.bind(this);
	}

	componentWillMount() {
		this.getWaves();
	}

	onIDChange(val) {
		let th = this;
		this.setState({
			waveID: val
		})
	}

	onIDSelect(val) {
		let th = this;
		this.getFeedbacks(val);
	}

	downloadFeedbacks() {

			console.log('download feedback...');

			// let fb = this.state.feedbacks[0];

			let doc = new jsPDF()
			let x = 95;
			let y = 20;

			doc.setFontSize(12);
			doc.setTextColor(0, 0, 0);

			FEEDBACKS.map(function(feedback) {
				doc.text(x, y+=10, feedback.type);
				feedback.options.map(function(option) {
					doc.text(x, y+=10, option)
				});
			});

			doc.save('feedbacks_' + this.state.waveID + '.pdf')
	}

	getWaves() {
		let th = this;
		Request
			.get('/dashboard/waves')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				if(err)
					console.log('Error in fetching waves: ', err)
				else {
					console.log('All Waves: ', res.body)
					let waveIDs = res.body.map(function(wave) {
						return wave.WaveID
					});
					th.setState({
						waveIDs: waveIDs
					});
				}
			});
	}

	getFeedbacks(waveID) {
		let th = this;
		console.log('should get feedbacks for ', waveID);
		Request
			.get('/dashboard/feedbacksforwave')
			.set({'Authorization': localStorage.getItem('token')})
			.query({waveID: waveID})
			.end(function(err, res){
				if(err)
					console.log('Error in fetching feedbacks: ', err)
				else {
					th.setState({
						feedbacks: res.body
					});
					console.log('All Feedbacks: ', res.body)
				}
			});
	}

	render() {
		let th = this;
		let buttonDisabled = this.state.feedbacks.length === 0;
		return(
			<Paper style={styles.container}>
					<h3>Download Feedbacks</h3>
					<div>
					<div style={{width: '49%', display: 'inline-block', boxSizing: 'border-box'}}>
						<AutoComplete
				      floatingLabelText='Wave ID'
				      filter={AutoComplete.fuzzyFilter}
				      dataSource={this.state.waveIDs}
							onNewRequest={this.onIDSelect}
				      listStyle={{ maxHeight: 80, overflow: 'auto' }}

						    />
					</div>
					<div style={{width: '49%', display: 'inline-block', boxSizing: 'border-box'}}>
						<RaisedButton
						  type="submit"
							primary={true}
							style={{width: '100%'}}
							disabled={buttonDisabled}
							onClick={this.downloadFeedbacks}
							>
							Download
						</RaisedButton>
					</div>
					</div>
			</Paper>
		)
	}
}
