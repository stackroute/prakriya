import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardMedia} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import {grey50} from 'material-ui/styles/colors';
import Request from 'superagent';
import Moment from 'moment';
import DownloadProfile from '../candidateManagement/DownloadProfile.jsx';
import IconButton from 'material-ui/IconButton';
import MailIcon from 'material-ui/svg-icons/communication/email';
import CallIcon from 'material-ui/svg-icons/communication/call';
import {Link} from 'react-router';

const styles = {
	iconWrapper : {
		float: 'right'
	},
	container: {
		marginLeft: -10,
		marginRight: -10
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
		fontSize: 18,
		lineHeight: 1.5
	},
	profilePic: {
		height: 175,
		width: 175,
		border: '3px solid #202D3E',
		borderRadius: 100,
		marginLeft: '8%',
		marginTop: '3%'
	},
	hr: {
		marginTop: '1px',
		height: '2px',
		backgroundColor: '#202D3E'
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

		let cadetSkill = [];
		let i = 0;

		return (
			<div style = {{overflowX: 'hidden'}}>
				<div style={{backgroundColor: '#202D3E'}}>
					<br/>
					<b style = {{color: '#FFFFFF', fontSize: '18px', marginLeft: '40%'}}>CADET PROFILE</b><br/><br/>
				</div>
				<div style={styles.hr}/>
				<Grid>
					<Row>
						<Col md={4}>
							<img src={this.state.imageURL} style = {styles.profilePic}/>
							<h2 style = {{width: '225px', textAlign: 'center'}}>{this.state.cadet.EmployeeName}</h2>
							<h4 style = {{width: '225px', textAlign: 'center'}}>
								<MailIcon style = {{ position: 'relative', top: '5px'}}/> <span> &nbsp;&nbsp;
								{this.state.cadet.EmailID}</span><br/><br/>
								<CallIcon style = {{ position: 'relative', top: '5px'}}/> <span> &nbsp;&nbsp;
								{this.state.cadet.Contact}</span>
								<br/>
							</h4>
							<h3
							style = {{width: '225px', textAlign: 'center'}}>
							<DownloadProfile
									color='black'
									candidate={this.state.cadet}
									imageURL={this.state.imageURL}
									zip={false}
									view = 'full'
									style = {{ position: 'relative', top: '5px', cursor: 'pointer'}}
								/></h3>
							</Col>
							<Col md = {8}>
								<br/>
								<h3>Experience</h3>
	 							<p style={styles.details}>
									<b>Work Experience:</b> {this.state.cadet.WorkExperience}
								</p>

								<h3>Digi-Thon</h3>
								<p style={styles.details}>
									<b>Digi-Thon Phase:</b> {this.state.cadet.DigiThonPhase}<br/>
									<b>Digi-Thon Score:</b> {this.state.cadet.DigiThonScore}
								</p>
								{
											this.state.cadet.Remarks != undefined &&
											this.state.cadet.Remarks != '' &&
											<div>
												<h3>Mentor Meet</h3>
												<p style={styles.details}>
													<b>Selected:</b> {this.state.cadet.Selected}<br/>
													<b>Remarks:</b> {this.state.cadet.Remarks}
											</p>
											</div>
										}
										<h3>Training Details</h3>
										<p style={styles.details}>
											<b>Wave:</b> {this.state.cadet.Wave}<br/>
											<b>Mode:</b> {this.state.cadet.Mode}<br/>
											<b>Start Date:</b> {this.formatDate(new Date(parseInt(this.state.cadet.startDate, 10)))}<br/>
											<b>End Date:</b> {this.formatDate(new Date(parseInt(this.state.cadet.endDate, 10)))}
										</p>
										{
											<div>
												<h3>Skills</h3>
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
														cadetSkill[i].push(<Col md={2}><li style = {{fontSize: '18px'}}>{skill}</li></Col>)
													})
												}
												<Grid style = {{marginLeft : '5%'}}>
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
												<h3>Academy Training Skills</h3>
												<p style={styles.details}>
													<b>Skills:</b> {this.state.cadet.AcademyTrainingSkills}
											</p>
											</div>
										}
										{(this.state.cadet.ProjectName !== '' && this.state.cadet.ProjectName !== undefined) &&
										<div>
										<h3>Project Details</h3>
										<p style={styles.details}>
											<b>Project Name: </b><Link
							          to={'/product/' + this.state.cadet.ProjectName}
							          target="_blank"
												style = {{textDecoration: 'none'}}
								        >{this.state.cadet.ProjectName}<br/>
											</Link>
											<b>Project Description:</b> {this.state.cadet.ProjectDescription}<br/>
										</p></div>
										}
										<h3>Manager Details</h3>
										<p style={styles.details}>
											<b>Primary Supervisor:</b> {this.state.cadet.PrimarySupervisor}<br/>
											<b>Project Supervisor:</b> {this.state.cadet.ProjectSupervisor}
										</p>
							</Col>
						</Row>
				</Grid>
			</div>
		)
	}
}
