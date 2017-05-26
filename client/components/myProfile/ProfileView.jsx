import React from 'react';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ProjectIcon from 'material-ui/svg-icons/file/folder';
import AssetIcon from 'material-ui/svg-icons/hardware/laptop';
import {grey500, grey900, white} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
import SaveIcon from 'material-ui/svg-icons/content/save';
import Dropzone from 'react-dropzone';
import Moment from 'moment';

const styles = {
	container: {
		marginBottom: 20
	},
	heading: {
		textAlign: 'center'
	},
	editIcon: {
		cursor: 'pointer',
		marginLeft: 30,
		height: 16,
		width: 16
	},
	name: {
		color: '#fff',
		background: '#555',
		textAlign: 'center',
	},
	pic: {
		height: 200,
		width: 150
	},
	dropzone: {
		borderStyle: 'none' 
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
	actionButtons: {
		margin: 20
	}
}

export default class ProfileView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadet: {},
			wave: {},
			showPersonalDialog: false,
			showProjectDialog: false,
			showAssetDialog: false,
			projectName: '',
			projectDesc: '',
			projectSkills: '',
			disableSave: true,
			disableSavePic: true,
			defaultProfilePic: '../../assets/images/avt-default.jpg',
			picFile: {},
			picPreview: '',
			assetID: '',
			email: '',
			contact: ''
		}
		this.openProjectDialog = this.openProjectDialog.bind(this);
		this.closeProjectDialog = this.closeProjectDialog.bind(this);
		this.handleProjectChange = this.handleProjectChange.bind(this);
		this.openAssetDialog = this.openAssetDialog.bind(this);
		this.closeAssetDialog = this.closeAssetDialog.bind(this);
		this.handleAssetChange = this.handleAssetChange.bind(this);
		this.openPersonalDialog = this.openPersonalDialog.bind(this);
		this.closePersonalDialog = this.closePersonalDialog.bind(this);
		this.handleAltEmailChange = this.handleAltEmailChange.bind(this);
		this.handleContactChange = this.handleContactChange.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handlePicSave = this.handlePicSave.bind(this);
		this.formatDate = this.formatDate.bind(this);
	}
	componentDidMount() {
		let picPreview = this.state.defaultProfilePic;
		this.setState({
			cadet: this.props.cadet,
			assetID: this.props.cadet.AssetID,
			email: this.props.cadet.AltEmail,
			contact: this.props.cadet.Contact,
			projectName: this.props.cadet.ProjectName,
			projectDesc: this.props.cadet.ProjectDescription,
			projectSkills: this.props.cadet.ProjectSkills,
  		picPreview: this.state.defaultProfilePic
  	})
	}
	componentWillUpdate(nextProps, nextState) {
		nextState.wave = nextProps.wave;
		if(nextState.picPreview != this.state.picPreview)
			nextState.picPreview = nextState.picPreview;
		else if(nextProps.imageURL != '')
			nextState.picPreview = nextProps.imageURL;
	}
	openPersonalDialog() {
		this.setState({
			showPersonalDialog: true
		})
	}
	closePersonalDialog() {
		this.setState({
			showPersonalDialog: false
		})
	}
	handleAltEmailChange(event) {
		this.setState({
			disableSave: false,
			email: event.target.value
		})
	}
	handleContactChange(event) {
		this.setState({
			disableSave: false,
			contact: event.target.value
		})
	}
	openProjectDialog() {
		this.setState({
			showProjectDialog: true
		})
	}
	closeProjectDialog() {
		this.setState({
			showProjectDialog: false
		})
	}
	handleProjectChange(event, key, value) {
		let th = this;
		this.props.projects.map(function (project, index) {
			if(index == key) {
				th.setState({
					disableSave: false,
					projectName: project.name,
					projectDesc: project.description,
					projectSkills: project.skills
				})
			}
		})
	}
	openAssetDialog() {
		this.setState({
			showAssetDialog: true
		})
	}
	closeAssetDialog() {
		this.setState({
			showAssetDialog: false
		})
	}
	handleAssetChange(event) {
		this.setState({
			disableSave: false,
			assetID: event.target.value
		})
	}
	handleUpdate() {
		let cadet = this.state.cadet;
		cadet.AltEmail = this.state.email;
		cadet.Contact = this.state.contact;
		cadet.AssetID = this.state.assetID;
		cadet.ProjectName = this.state.projectName;
		cadet.ProjectDescription = this.state.projectDesc;
		cadet.ProjectSkills = this.state.projectSkills;
		this.setState({
			disableSave: false,
			assetID: '',
			email: '',
			contact: '',
			projectName: '',
			projectDesc: '',
			projectSkills: ''
		})
		this.props.handleUpdate(cadet)
	}
	handlePicSave() {
		this.setState({
			disableSavePic: true
		})
		console.log('Save the pic');
		this.props.handlePicSave(this.state.picFile)
	}
	handleDrop(acceptedFiles, rejectedFiles) {
		console.log('Prev pic', this.state.picPreview);
		this.setState({
			picFile: acceptedFiles[0],
			picPreview: acceptedFiles[0].preview,
			disableSavePic: false
		})
		console.log('Accepted Files', acceptedFiles);
		console.log('New pic', this.state.picPreview);
	}
	formatDate(date) {
		return Moment(date).format("MMM Do YYYY");
	}

	render() {
		const projectDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeProjectDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.closeProjectDialog}
        onClick={this.handleUpdate}
        disabled={this.state.disableSave}
      />,
    ];
    const assetDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeAssetDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.closeAssetDialog}
        onClick={this.handleUpdate}
        disabled={this.state.disableSave}
      />,
    ];
    const perosnalDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closePersonalDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.closePersonalDialog}
        onClick={this.handleUpdate}
        disabled={this.state.disableSave}
      />,
    ];
    let pic = <CardMedia>
								<img src='../../assets/images/avt-default.jpg'/>
							</CardMedia>
		return (
			<div style={styles.container}>
				<h1 style={styles.heading}> My Profile </h1>
				<Grid>
					<Row>
						<Col md={8} mdOffset={2} style={styles.name}>
							<span>
								<h3>
									{this.state.cadet.EmployeeName}
								</h3>
							</span>
						</Col>
					</Row>
					<Row>
						<Col md={2} mdOffset={2} style={styles.pic}>
							<Dropzone 
								accept="image/jpeg, image/png"
								onDrop={this.handleDrop} 
								style={styles.dropzone}
							>
								<CardMedia>
									<img src={this.state.picPreview} style={styles.pic}/>
								</CardMedia>
							</Dropzone>

							<p style={styles.basicDetails}>
								<IconButton 
									disabled={this.state.disableSavePic}
									onClick={this.handlePicSave}
									style={{margin: 'auto'}}
								>
									<SaveIcon />
								</IconButton>
								<br/>
								<strong>Employee Id:</strong> {this.state.cadet.EmployeeID}<br/>
								<strong>Career Band:</strong> {this.state.cadet.CareerBand}<br/>
								<strong>Email:</strong> {this.state.cadet.EmailID}<br/>
								<strong>Wave:</strong> {this.state.cadet.Wave}
							</p>
						</Col>
						<Col md={5} mdOffset={1}>

							<h4>
								Personal
								<span>
									<EditIcon 
										style={styles.editIcon} 
										onClick={this.openPersonalDialog}
									/>
								</span>
							</h4>
 							<p style={styles.details}>
								<strong>Alternate Email:</strong> {this.state.cadet.AltEmail}<br/>
								<strong>Contact:</strong> {this.state.cadet.Contact}
							</p>

							<h4>Experience</h4>
 							<p style={styles.details}>
								<strong>Work Experience:</strong> {this.state.cadet.WorkExperience}
							</p>

							<h4>Digi-Thon</h4>
							<p style={styles.details}>
								<strong>Digi-Thon Phase:</strong> {this.state.cadet.DigiThonPhase}<br/>
								<strong>Digi-Thon Score:</strong> {this.state.cadet.DigiThonScore}
							</p>

							<h4>Training Details</h4>
							<p style={styles.details}>
								<strong>Training Track:</strong> {this.state.cadet.TrainingTrack}<br/>
								<strong>Wave:</strong> {this.state.cadet.Wave}<br/>
								<strong>Start Date:</strong> {this.formatDate(this.state.wave.StartDate)}<br/>
								<strong>End Date:</strong> {this.formatDate(this.state.wave.EndDate)}
							</p>

							{
								this.state.cadet.AcademyTrainingSkills != undefined &&
								this.state.cadet.AcademyTrainingSkills != '' &&
								<div>
									<h4>Academy Training Skills</h4>
									<p style={styles.details}>
										<strong>Skills:</strong> {this.state.cadet.AcademyTrainingSkills}
									</p>
								</div>
							}

							{
								this.state.cadet.ProjectName != undefined &&
								this.state.cadet.ProjectName != '' &&
								<div>
									<h4>
										Project Details
										<span>
											<EditIcon 
												style={styles.editIcon} 
												onClick={this.openProjectDialog}
											/>
										</span>
									</h4>
									<p style={styles.details}>
										<strong>Project Name:</strong> {this.state.cadet.ProjectName}<br/>
										<strong>Project Description:</strong> {this.state.cadet.ProjectDescription}<br/>
										<strong>Skills:</strong> <ul>{
											this.state.cadet.ProjectSkills.map(function(skill) {
												return <li>{skill}</li>
											})}</ul>
									</p>
								</div>
							}

							{
								this.state.cadet.AssetID != undefined &&
								this.state.cadet.AssetID != '' &&
								<div>
									<h4>
										Asset Details
										<span>
											<EditIcon 
												style={styles.editIcon} 
												onClick={this.openAssetDialog}
											/>
										</span>
									</h4>
									<p style={styles.details}>
										<strong>Asset Id:</strong> {this.state.cadet.AssetID}
									</p>
								</div>
							}

							<h4>Manager Details</h4>
							<p style={styles.details}>
								<strong>Primary Supervisor:</strong> {this.state.cadet.PrimarySupervisor}<br/>
								<strong>Project Supervisor:</strong> {this.state.cadet.ProjectSupervisor}
							</p>

							{
								(this.state.cadet.ProjectName == undefined ||
								this.state.cadet.ProjectName == '') &&
								<RaisedButton
						      label="Add Project"
						      backgroundColor={grey900}
						      labelColor={white}
						      style={styles.actionButtons}
						      icon={<ProjectIcon color={white}/>}
						      onClick={this.openProjectDialog}
						    />
							}

							{
								(this.state.cadet.AssetID == undefined ||
								this.state.cadet.AssetID == '') &&
								<RaisedButton
						      label="Add Asset"
						      backgroundColor={grey900}
						      labelColor={white}
						      style={styles.actionButtons}
						      icon={<AssetIcon color={white}/>}
						      onClick={this.openAssetDialog}
						    />	
							}

						</Col>
					</Row>
				</Grid>
				<Dialog
					title="Add your personal details"
          actions={perosnalDialogActions}
          open={this.state.showPersonalDialog}
          onRequestClose={this.closePersonalDialog}
        >
        	<TextField
			      floatingLabelText="Alternate Email"
			      value={this.state.email}
			      onChange={this.handleAltEmailChange}
			    />
			    <TextField
			      floatingLabelText="Contact"
			      value={this.state.contact}
			      onChange={this.handleContactChange}
			    />
        </Dialog>
				<Dialog
					title="Add your project"
          actions={projectDialogActions}
          open={this.state.showProjectDialog}
          onRequestClose={this.closeProjectDialog}
        >
        	<SelectField
	          value={this.state.projectName}
	          onChange={this.handleProjectChange}
	          floatingLabelText="Select your project"
	        >
	          {
	          	this.props.projects.map(function (project, key) {
	          		return <MenuItem key={key} value={project.name} primaryText={project.name} />
	          	})
	          }
	        </SelectField><br/>
	        <TextField
			      floatingLabelText="Description"
			      value={this.state.projectDesc}
			      multiLine={true}
			      rows={3}
			      rowsMax={3}
			      disabled={true}
			      fullWidth={true}
			    />
			    <TextField
			      floatingLabelText="Skills"
			      value={this.state.projectSkills}
			      multiLine={true}
			      rows={3}
			      rowsMax={3}
			      disabled={true}
			      fullWidth={true}
			    />
        </Dialog>
        <Dialog
					title="Add your laptop details"
          actions={assetDialogActions}
          open={this.state.showAssetDialog}
          onRequestClose={this.closeAssetDialog}
        >
        	<TextField
			      floatingLabelText="Asset Id"
			      value={this.state.assetID}
			      onChange={this.handleAssetChange}
			    />
        </Dialog>
			</div>	
		)
	}	
}