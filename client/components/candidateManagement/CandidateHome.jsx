import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Card, CardMedia} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import PerformanceMatrix from './PerformanceMatrix.jsx';

const styles = {
	back: {
		marginRight: 20
	},
	container : {
		
	},
	name: {
		color: '#fff',
		background: '#555',
		textAlign: 'center',
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

export default class CandidateHome extends React.Component {
	constructor(props) {
		super(props);
		this.handleBack = this.handleBack.bind(this);
	}
	handleBack() {
		this.props.handleBack();
	}

	render() {
		return (
			<div>
				<Grid>
					<Row>
						<Col md={2} mdOffset={10}>
							<FlatButton 
								label="<< Go Back" 
								primary={true} 
								onClick={this.handleBack} 
							/>
						</Col>
					</Row>
					<div style={styles.container}>
						<Row>
							<Col md={8} mdOffset={2} style={styles.name}>
								<span><h1>{this.props.candidate.EmployeeName}</h1></span>
							</Col>
						</Row>
						<Row>
							<Col md={2} mdOffset={2} style={styles.pic}>
								<CardMedia>
									<img src='../../assets/images/avt-default.jpg'/>
								</CardMedia>
								<p style={styles.basicDetails}>
									Employee Id: {this.props.candidate.EmployeeID}<br/>
									Career Band: {this.props.candidate.CareerBand}<br/>
									Email: {this.props.candidate.EmailID}<br/>
									Wave: {this.props.candidate.Wave}
								</p>
							</Col>
							<Col md={6} mdOffset={1}>

								<h4>Experience</h4>
	 							<p style={styles.details}>
									Work Experience: {this.props.candidate.WorkExperience}
								</p>

								<h4>Digi-Thon</h4>
								<p style={styles.details}>
									Digi-Thon Phase: {this.props.candidate.DigiThonPhase}<br/>
									Digi-Thon Score: {this.props.candidate.DigiThonScore}
								</p>

								<h4>Training Details</h4>
								<p style={styles.details}>
									Start Date: {this.props.candidate.StartDate}<br/>
									End Date: {this.props.candidate.EndDate}
								</p>

								<h4>Account Details</h4>
								<p style={styles.details}>
									Revised BU: {this.props.candidate.RevisedBU}<br/>
									Cost Center: {this.props.candidate.CostCenter}
								</p>

								<h4>Manager Details</h4>
								<p style={styles.details}>
									Primary Supervisor: {this.props.candidate.PrimarySupervisor}<br/>
									Project Supervisor: {this.props.candidate.ProjectSupervisor}
								</p>

							</Col>
						</Row>
					</div>
				</Grid>
			</div>
		)
	}
}