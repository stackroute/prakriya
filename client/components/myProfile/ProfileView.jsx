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
			picPreview: ''
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
	}
	componentDidMount() {
		let picPreview = this.state.defaultProfilePic;
		this.setState({
			cadet: this.props.cadet,
  		picPreview: this.state.defaultProfilePic
  	})
	}
	componentWillUpdate(nextProps, nextState) {
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
		let cadet = this.state.cadet;
		cadet.AltEmail = event.target.value;
		this.setState({
			disableSave: false,
			cadet: cadet
		})
	}
	handleContactChange(event) {
		let cadet = this.state.cadet;
		cadet.Contact = event.target.value;
		this.setState({
			disableSave: false,
			cadet: cadet
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
				let cadet = th.state.cadet;
				cadet.ProjectName = project.name;
				cadet.ProjectDescription = project.description;
				cadet.ProjectSkills = project.skills;
				th.setState({
					disableSave: false,
					cadet: cadet
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
		let cadet = this.state.cadet;
		cadet.AssetID = event.target.value;
		this.setState({
			disableSave: false,
			cadet: cadet
		})
	}
	handleUpdate() {
		this.setState({
			disableSave: false
		})
		this.props.handleUpdate(this.state.cadet)
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
								Employee Id: {this.state.cadet.EmployeeID}<br/>
								Career Band: {this.state.cadet.CareerBand}<br/>
								Email: {this.state.cadet.EmailID}<br/>
								Wave: {this.state.cadet.Wave}
							</p>
						</Col>
						<Col md={6} mdOffset={1}>

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
								Alternate Email: {this.state.cadet.AltEmail}<br/>
								Contact: {this.state.cadet.Contact}
							</p>

							<h4>Experience</h4>
 							<p style={styles.details}>
								Work Experience: {this.state.cadet.WorkExperience}
							</p>

							<h4>Digi-Thon</h4>
							<p style={styles.details}>
								Digi-Thon Phase: {this.state.cadet.DigiThonPhase}<br/>
								Digi-Thon Score: {this.state.cadet.DigiThonScore}
							</p>

							<h4>Training Details</h4>
							<p style={styles.details}>
								Training Track: {this.state.cadet.TrainingTrack}<br/>
								Wave: {this.state.cadet.Wave}<br/>
								Start Date: {this.state.cadet.StartDate}<br/>
								End Date: {this.state.cadet.EndDate}
							</p>

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
										Project Name: {this.state.cadet.ProjectName}<br/>
										Project Description: {this.state.cadet.ProjectDescription}<br/>
										Skills: <ul>{
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
										Asset Id: {this.state.cadet.AssetID}
									</p>
								</div>
							}

							<h4>Manager Details</h4>
							<p style={styles.details}>
								Primary Supervisor: {this.state.cadet.PrimarySupervisor}<br/>
								Project Supervisor: {this.state.cadet.ProjectSupervisor}
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
			      value={this.state.cadet.AltEmail}
			      onChange={this.handleAltEmailChange}
			    />
			    <TextField
			      floatingLabelText="Contact"
			      value={this.state.cadet.Contact}
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
	          value={this.state.cadet.ProjectName}
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
			      value={this.state.cadet.ProjectDescription}
			      multiLine={true}
			      rows={3}
			      rowsMax={3}
			      disabled={true}
			      fullWidth={true}
			    />
			    <TextField
			      floatingLabelText="Skills"
			      value={this.state.cadet.ProjectSkills}
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
			      value={this.state.cadet.AssetID}
			      onChange={this.handleAssetChange}
			    />
        </Dialog>
			</div>	
		)
	}	
}