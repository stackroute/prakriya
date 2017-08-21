import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardMedia} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import {grey50} from 'material-ui/styles/colors';
import Request from 'superagent';
import Moment from 'moment';
import DownloadProfile from '../candidateManagement/DownloadProfile.jsx';

const styles = {
	iconWrapper : {
		float: 'right'
	},
	container: {
		marginTop: 10,
		marginBottom: 20
	},
	actionIcon: {
		marginRight: 15,
		cursor: 'pointer'
	},
	name: {
		color: '#fff',
		background: '#555',
		textAlign: 'center'
	},
	pic: {
		padding: 0
	},
	basicDetails: {
		textAlign: 'center',
		marginTop: 10,
		color: '#333',
		lineHeight: 2,
		fontSize: 13
	},
	details: {
		marginTop: -15,
		marginLeft: 50,
		fontSize: 13,
		lineHeight: 1.5
	}
}

export default class CandidateProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cadet: {},
			imageURL: '../../assets/images/avt-default.jpg',
			startDate: '',
			endDate: '',
			mode: '',
			Wave: ''
		}
		this.getCandidate = this.getCandidate.bind(this);
		this.getProfilePic = this.getProfilePic.bind(this);
		this.formatDate = this.formatDate.bind(this);
	}

	componentWillMount() {
		this.getCandidate(this.props.routeParams.id);
	}

	getCandidate(EmpID) {
		let th = this;
    Request
			.post(`/dashboard/getcadetandwave`)
			.set({'Authorization': localStorage.getItem('token')})
			.send({EmpID: EmpID})
			.end(function(err, res) {
      if (err)
        console.log(err);
      else {
				let cadet = res.body;
				cadet.Mode = cadet.Wave.Mode;
				cadet.startDate = cadet.Wave.StartDate;
				cadet.endDate = cadet.Wave.EndDate;
				cadet.Wave = cadet.Wave.WaveID;
				console.log(cadet);
				th.setState({
						cadet: cadet
					});
				th.getProfilePic(res.	body.EmailID)
      }
    })
	}
	getProfilePic(emailID) {
		let th = this;
		let username = emailID.split("@wipro.com")[0];
		Request
			.get(`/dashboard/getimage`)
			.set({'Authorization': localStorage.getItem('token')})
			.query({filename: username})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	if(res.text) {
			    	th.setState({
			    		imageURL: res.text
			    	})
		    	}
		    }
			})
	}
	formatDate(date) {
		return Moment(date).format("MMM Do YYYY");
	}

	render() {
		let cadetSkill = []
		let i = 0

		return (
			<div>
				<Grid>
					<div style={styles.container}>
						{
							<Grid>
								<Row>
									<Col md={8} mdOffset={2} style={styles.name}>
										<span>
											<h3>
												{this.state.cadet.EmployeeName}
												<span style={styles.iconWrapper}>
													<DownloadProfile
														color={grey50}
														style={styles.actionIcon}
														candidate={this.state.cadet}
														imageURL={this.state.imageURL}
														zip={false}
													/>
												</span>
											</h3>
										</span>
									</Col>
								</Row>
								<Row>
									<Col md={2} mdOffset={2} style={styles.pic}>
										<CardMedia>
											<img src={this.state.imageURL}/>
										</CardMedia>
										<p style={styles.basicDetails}>
											Employee Id: {this.state.cadet.EmployeeID}<br/>
											Career Band: {this.state.cadet.CareerBand}<br/>
											Email: {this.state.cadet.EmailID}<br/>
											Wave: {this.state.cadet.Wave}
										</p>
									</Col>
									<Col md={6} mdOffset={1}>
										<h4>Personal Details</h4>
										<p style={styles.details}>
											EmailID: {this.state.cadet.EmailID} <br/>
											Alternate EmailID: {this.state.cadet.AltEmail}<br/>
											Contact Number: {this.state.cadet.Contact} </p>
										<h4>Experience</h4>
			 							<p style={styles.details}>
											Work Experience: {this.state.cadet.WorkExperience}
										</p>

										<h4>Digi-Thon</h4>
										<p style={styles.details}>
											Digi-Thon Phase: {this.state.cadet.DigiThonPhase}<br/>
											Digi-Thon Score: {this.state.cadet.DigiThonScore}
										</p>

										{
											this.state.cadet.Remarks != undefined &&
											this.state.cadet.Remarks != '' &&
											<div>
												<h4>Mentor Meet</h4>
												<p style={styles.details}>
													Selected: {this.state.cadet.Selected}<br/>
													Remarks: {this.state.cadet.Remarks}
											</p>
											</div>
										}
										<h4>Training Details</h4>
										<p style={styles.details}>
											Wave: {this.state.cadet.Wave}<br/>
											Mode: {this.state.cadet.Mode}<br/>
											Start Date: {this.formatDate(new Date(parseInt(this.state.cadet.startDate, 10)))}<br/>
											End Date: {this.formatDate(new Date(parseInt(this.state.cadet.endDate, 10)))}
										</p>
										{
											<div>
												<h4>Skills:</h4>
												{
													cadetSkill[i] = []
												}
												{
													this.state.cadet.Skills !== undefined &&
													this.state.cadet.Skills.map(function(skill, key) {
														if(key % 3 === 0) {
															i = i + 1
															cadetSkill[i] = []
														}
														cadetSkill[i].push(<Col md={2}><li>{skill}</li></Col>)
													})
												}
												<Grid>
												{
															cadetSkill.map(function(skills){
																return <Row>{skills}</Row>
															})
												}
											</Grid>
											</div>
										}

										{
											this.state.cadet.AcademyTrainingSkills != undefined &&
											this.state.cadet.AcademyTrainingSkills != '' &&
											<div>
												<h4>Academy Training Skills</h4>
												<p style={styles.details}>
													Skills: {this.state.cadet.AcademyTrainingSkills}
											</p>
											</div>
										}
										{(this.state.cadet.ProjectName !== '' && this.state.cadet.ProjectName !== undefined) &&
										<div>
										<h4>Project Details</h4>
										<p style={styles.details}>
											Project Name: {this.state.cadet.ProjectName}<br/>
											Project Description: {this.state.cadet.ProjectDescription}<br/>
										</p></div>
										}
										<h4>Manager Details</h4>
										<p style={styles.details}>
											Primary Supervisor: {this.state.cadet.PrimarySupervisor}<br/>
											Project Supervisor: {this.state.cadet.ProjectSupervisor}
										</p>
									</Col>
								</Row>
							</Grid>
						}
					</div>
				</Grid>
			</div>
		);
	}
}
