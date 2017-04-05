import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Card, CardMedia} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {grey50} from 'material-ui/styles/colors'; 
import CandidateEdit from './CandidateEdit.jsx';
import PerformanceMatrix from './PerformanceMatrix.jsx';

const styles = {
	back: {
		marginRight: 20
	},
	iconWrapper : {
		float: 'right'
	},
	actionIcon: {
		marginRight: 15,
		cursor: 'pointer'
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
	},
	editContainer: {
		textAlign: 'center'
	}
}

export default class CandidateHome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDeleteDialog: false,
			showEditDialog: false
		}
		this.handleBack = this.handleBack.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.openEditDialog = this.openEditDialog.bind(this);
		this.closeEditDialog = this.closeEditDialog.bind(this);
	}
	handleBack() {
		this.props.handleBack();
	}
	openDeleteDialog() {
		this.setState({
			showDeleteDialog: true
		})
	}
	closeDeleteDialog() {
		this.setState({
			showDeleteDialog: false
		})
	}
	handleDelete() {
		this.props.handleDelete(this.props.candidate);
	}
	openEditDialog() {
		this.setState({
			showEditDialog: true
		})
	}
	closeEditDialog() {
		this.setState({
			showEditDialog: false
		})
	}
	handleUpdate(candidate) {
		this.setState({
			showEditDialog: false
		})
		this.props.handleUpdate(candidate);
	}

	render() {
		const deleteDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDelete}
      />,
    ];
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
						{
							this.state.showEditDialog &&
							<CandidateEdit 
								candidate={this.props.candidate}
								updateCandidate={this.handleUpdate}
							/>
						}
						{
							!this.state.showEditDialog &&
							<Grid>
								<Row>
									<Col md={8} mdOffset={2} style={styles.name}>
										<span>
											<h3>
												{this.props.candidate.EmployeeName}
												<span style={styles.iconWrapper}>
													<EditIcon style={styles.actionIcon} color={grey50} onClick={this.openEditDialog}/>
													<DeleteIcon style={styles.actionIcon} color={grey50} onClick={this.openDeleteDialog}/>
												</span>
											</h3>
										</span>
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

										{
											this.props.candidate.Remarks != undefined &&
											this.props.candidate.Remarks != '' &&
											<div>
												<h4>Mentor Meet</h4>
												<p style={styles.details}>
													Selected: {this.props.candidate.Selected}<br/>
													Remarks: {this.props.candidate.Remarks}
											</p>
											</div>
										}

										<h4>Training Details</h4>
										<p style={styles.details}>
											Training Track: {this.props.candidate.TrainingTrack}<br/>
											Wave: {this.props.candidate.Wave}<br/>
											Start Date: {this.props.candidate.StartDate}<br/>
											End Date: {this.props.candidate.EndDate}
										</p>

										{
											this.props.candidate.AcademyTrainingSkills != undefined &&
											this.props.candidate.AcademyTrainingSkills != '' &&
											<div>
												<h4>Academy Training Skills</h4>
												<p style={styles.details}>
													Skills: {this.props.candidate.AcademyTrainingSkills}
											</p>
											</div>
										}

										<h4>Manager Details</h4>
										<p style={styles.details}>
											Primary Supervisor: {this.props.candidate.PrimarySupervisor}<br/>
											Project Supervisor: {this.props.candidate.ProjectSupervisor}
										</p>

									</Col>
								</Row>
							</Grid>
						}
					</div>
				</Grid>
        <Dialog
        	actions={deleteDialogActions}
        	open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this candidate?
        </Dialog>
			</div>
		)
	}
}