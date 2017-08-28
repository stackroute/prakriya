import React from 'react';
import Request from 'superagent';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import Checkbox from 'material-ui/Checkbox';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import {Grid, Row, Col} from 'react-flexbox-grid';
import app from '../../styles/app.json';
import dialog from '../../styles/dialog.json';

const styles = {
	underlineDisabled: {
		display: 'none'
	},
	paper: {
		margin: '5px',
		padding: '5px',
		width: 'auto',
		height: '130px',
		borderRadius: '2px',
		overflowY: 'scroll'
	},
	wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
	chip: {
    margin: '4px',
    background: '#eee'
  }
}

export default class ProjectDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showDialog: false,
			waves: [],
			projectName: '',
			versionName: '',
			projectDesc: '',
			candidateSet:[],
			wave: '',
			snackbarOpen: false,
			snackbarMessage: '',
			sessionOn: {},
			candidates: [],
			skillName: '',
			skills: [],
			skillSet: [],
			projectNameErrorText: '',
			projectDescErrorText: '',
			waveErrorText: '',
			skillsErrorText: '',
			candidateNames: [] ,
			candidateIDs: [] ,
			candidateEmailID: [],
			project: {},
			Course: [],
			gitURL: '',
			gitBranch: '',
			videoURL: '',
			presentationURL: ''
		}
		this.getSkillSet = this.getSkillSet.bind(this);
		this.getWaveIDs = this.getWaveIDs.bind(this)
		this.onDialogOpen = this.onDialogOpen.bind(this);
		this.onDialogClose = this.onDialogClose.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.onVersionChange = this.onVersionChange.bind(this);
		this.onDescChange = this.onDescChange.bind(this);
		this.onProductAddition = this.onProductAddition.bind(this);
		this.onToggleCandidate = this.onToggleCandidate.bind(this);
		this.onWaveChange = this.onWaveChange.bind(this);
		this.onSkillAddition = this.onSkillAddition.bind(this);
		this.onSkillChange = this.onSkillChange.bind(this);
		this.onSkillDeletion = this.onSkillDeletion.bind(this);
		this.onVersionUpdation = this.onVersionUpdation.bind(this);
		this.onVersionAddition = this.onVersionAddition.bind(this);
		this.onGitBranchChange = this.onGitBranchChange.bind(this);
		this.onGitURLChange = this.onGitURLChange.bind(this);
		this.onVideoURLChange = this.onVideoURLChange.bind(this);
		this.onPresentationURLChange = this.onPresentationURLChange.bind(this);
		this.validationSuccess = this.validationSuccess.bind(this);
		this.resetFields = this.resetFields.bind(this);
		this.openSnackbar = this.openSnackbar.bind(this);
		this.hideSnackbar = this.hideSnackbar.bind(this);
	}

	componentWillMount() {
		if(localStorage.getItem('token')) {
			this.getWaveIDs();
			this.getSkillSet();
		}
		if(this.props.dialogTitle == 'EDIT VERSION') {
			let th = this;
			let candidates = [];
			let candidateIDs = [];
			this.props.project.version[th.props.version].members.map(function(member) {
				candidates.push(member.EmployeeName)
				candidateIDs.push(member.EmployeeID)
			})
			let git = this.props.project.version[th.props.version].gitURL.split('/tree/');
			let gitBranch = '';
			let gitURL = '';
			if(git.length > 0) {
				gitURL = git[0];
				gitBranch = git[1];
			}
			let videoURL = this.props.project.version[th.props.version].videoURL;
			let presentationURL = this.props.project.version[th.props.version].presentationURL;
			this.setState({
				project: th.props.project,
				projectName: this.props.project.product,
				versionName: this.props.project.version[th.props.version].name,
				projectDesc: this.props.project.version[th.props.version].description,
				candidates: candidates,
				candidateIDs: candidateIDs,
				wave: this.props.project.version[th.props.version].wave,
				skills: this.props.project.version[th.props.version].skills,
				showDialog: this.props.openDialog,
				gitURL: gitURL,
				gitBranch: gitBranch,
				videoURL: videoURL,
				presentationURL: presentationURL
			})
			this.getCandidates(this.props.project.version[th.props.version].wave);
		}
		if(this.props.dialogTitle == 'ADD VERSION') {
			this.setState({
				showDialog: this.props.openDialog,
				projectName: this.props.project.product
			})
		}
	}

	getSkillSet() {
    let th = this;
    Request
    .get('/dashboard/skillset')
    .set({'Authorization': localStorage.getItem('token')})
    .end(function(err, res) {
      if (err) {
				console.log('Error in fetching skillset. ');
			} else {
        th.setState({skillSet: res.body});
      }
    });
  }

	getWaveIDs() {
		let th = this
		Request
			.get('/dashboard/waveids')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				let wave = [];
	      let course = [];
	      res.body.waveids.map(function (waveDetails) {
	        wave.push(waveDetails.waveID);
	        course.push(waveDetails.course);
	      })
	      th.setState({
	        waves: wave,
	        Course: course
	      })
			})
	}

	onWaveChange(e) {
		let th = this
		th.setState({
			wave: e.target.outerText,
			waveErrorText: '',
			candidates: [],
			candidateIDs: []
		})
		th.getCandidates(e.target.outerText)
	}

	getCandidates(waveID) {
			let th = this;
			let candidateSet = [];
			let candidateNames = [];
			let candidateIDs = [];
			let candidateEmailID = [];
			let candidates = [];
			let wave = waveID.split('(')[0].trim();
	    let course = waveID.split('(')[1].split(')')[0];
	    Request
				.post('/dashboard/cadetsofwave')
				.set({'Authorization': localStorage.getItem('token')})
				.send({waveid: wave, course: course})
				.end(function(err, res){
					res.body.map(function(candidate,index) {
						let flag = false;
						candidateSet.push(candidate)
						if(th.props.dialogTitle == 'EDIT VERSION') {
							th.props.project.version[th.props.version].members.filter(function (cadet) {
								if(candidate.EmployeeName === cadet.EmployeeName) {
									candidateNames.push({value: candidate.EmployeeName, checked: true})
									candidates.push(cadet);
									flag = true;
								}
							});
							if(!flag) {
								candidateNames.push({value: candidate.EmployeeName, checked: false})
							}
						}
						else {
							candidateNames.push({value: candidate.EmployeeName, checked: false});
						}
						candidateIDs.push(candidate.EmployeeID)
						candidateEmailID.push(candidate.EmailID)
					});
					th.setState({
						candidateSet: candidateSet,
						candidateNames: candidateNames,
						candidateIDs: candidateIDs,
						candidates: candidates,
						candidateEmailID: candidateEmailID
					});
				})
	}

	onToggleCandidate(event, isChecked) {
		event.persist();
		let th = this;
		let index = -1;
		let value = event.target.value;
		let candidateNames = th.state.candidateNames;
		let candidates = this.state.candidates;
		candidateNames.some(function(name, indx) {
			if(name.value == value) {
				index = indx;
				name.checked = isChecked;
			}
			return name.value == value;
		});
		if(isChecked) {
			candidates.push(
				{
					EmployeeID: th.state.candidateIDs[index],
					EmployeeName: value,
					Email: th.state.candidateEmailID[index]
				}
			);
			console.log(candidates)
			this.setState({
				candidateNames: candidateNames,
				candidates: candidates
			});
		} else {
			let id = th.state.candidateIDs[index];
			candidates = candidates.filter(function(candidate) {
				return candidate.EmployeeID != id;
			});
			this.setState({
				candidateNames: candidateNames,
				candidates: candidates
			});
		}
	}

	onDialogOpen() {
		this.setState({
			showDialog: true
		})
	}

	openSnackbar(message) {
		this.setState({
			snackbarMessage: message,
			snackbarOpen: true
		});
	}

	hideSnackbar() {
		this.setState({
			snackbarMessage: '',
			snackbarOpen: false
		});
	}

	onDialogClose(e, action) {
		if(action == 'CLOSE DIALOG') {
			if(this.props.dialogTitle == 'ADD PRODUCT') {
				this.resetFields()
			} else if(this.props.dialogTitle == 'EDIT VERSION') {
				this.setState({
					showDialog: false,
					projectNameErrorText: '',
					projectVersionErrorText: '',
					projectDescErrorText: '',
					waveErrorText: '',
					skillsErrorText: ''
				})
				this.props.handleClose()
			} else if(this.props.dialogTitle == 'ADD VERSION') {
				this.setState({
					showDialog: false,
					projectName: '',
					versionName: '',
					projectDesc: '',
					wave: '',
					projectNameErrorText: '',
					projectDescErrorText: '',
					waveErrorText: '',
					skillsErrorText: ''
				})
				this.props.handleClose();
			}
		} else if(this.validationSuccess()) {
			if(action == 'ADD PRODUCT') {
				this.onProductAddition()
			} else if(action == 'EDIT VERSION') {
				this.props.handleClose()
				this.onVersionUpdation()
			} else if(action == 'ADD VERSION') {
				this.props.handleClose()
				this.onVersionAddition()
			}
			this.setState({
				showDialog: false
			})
		}
	}

	onGitBranchChange(e) {
		this.setState({
			gitBranch: e.target.value
		});
	}

	onGitURLChange(e) {
		this.setState({
			gitURL: e.target.value
		});
	}

	onVideoURLChange(e) {
		this.setState({
			videoURL: e.target.value
		});
	}

	onPresentationURLChange(e) {
		this.setState({
			presentationURL: e.target.value
		});
	}

	onNameChange(e) {
		this.setState({
			projectName: e.target.value,
			projectNameErrorText: ''
		});
	}

	onVersionChange(e) {
		this.setState({
			versionName: e.target.value,
			projectVersionErrorText: ''
		});
	}

	onDescChange(e) {
		this.setState({
			projectDesc: e.target.value,
			projectDescErrorText: ''
		});
	}

	onProductAddition() {
			console.log('Product Addition: ', this.state.candidates)
			let th = this;
			let project = {};
			project.version = [];
			project.version.push({});
		  project.version[0].members = this.state.candidates;
			project.product = this.state.projectName;
			project.version[0].name = this.state.versionName;
			project.version[0].description = this.state.projectDesc;
			project.version[0].wave = this.state.wave;
			project.version[0].skills = this.state.skills;
			project.version[0].updated = false;
			project.version[0].addedOn = new Date();
			project.version[0].gitURL =
				this.state.gitURL.trim().length > 0 && this.state.gitBranch.trim().length > 0 ?
				this.state.gitURL + '/tree/' + this.state.gitBranch :
				'';
			project.version[0].videoURL = this.state.videoURL;
			project.version[0].presentationURL = this.state.presentationURL;
			this.resetFields();
			this.props.addProject(project);
	}

	onVersionAddition() {
			let th = this;
			let product = th.state.projectName;
			let version = {};
		  version.members = this.state.candidates;
			version.name= this.state.versionName;
			version.description = this.state.projectDesc;
			version.wave = this.state.wave;
			version.skills = this.state.skills;
			version.updated = true;
			version.gitURL =
				this.state.gitURL.trim().length > 0 && this.state.gitBranch.trim().length > 0 ?
				this.state.gitURL + '/tree/' + this.state.gitBranch :
				'';
			version.videoURL = this.state.videoURL;
			version.presentationURL = this.state.presentationURL;
			this.resetFields();
			this.props.handleAddVersion({product: product, version: version});
		}

	onSkillAddition() {
		let th = this;
		if(this.state.skillName.trim().length != 0) {
			let skillSet = this.state.skillSet;
			let skills = this.state.skills;
			let skill = this.state.skillName;
			let duplicateFound = skills.some(function(s) {
				return s.toLowerCase() == skill.toLowerCase();
			});
			let matchFound = skillSet.some(function(s) {
				return s.toLowerCase() == skill.toLowerCase();
			});
			if(duplicateFound) {
				this.openSnackbar('Duplicate Skill! Cannot be added.');
			} else if (!matchFound){
				this.openSnackbar('Skill not found! Please select one from the drop down.');
			} else {
				skills.push(skill);
				th.setState({
					skills: skills,
					skillName: '',
					skillsErrorText: ''
				});
			}
		} else {
			th.setState({
				skillName: ''
			});
		}
	}

	onSkillChange(value) {
		this.setState({
			skillName: value,
			skillsErrorText: ''
		})
	}

	onSkillDeletion(skill) {
		let skills = this.state.skills.filter(function(s) {
			return skill != control;
		});
		this.setState({
			skills: skills
		});
	}

	onVersionUpdation() {
		let th = this;
		let version = this.state.project.version[th.props.version];
		version.members = this.state.candidates;
		console.log(version.members);
		version.name = this.state.versionName;
		version.description = this.state.projectDesc;
		version.wave = this.state.wave;
		version.skills = this.state.skills;
		version.addedOn = new Date();
		version.gitURL =
			this.state.gitURL.trim().length > 0 && this.state.gitBranch.trim().length > 0 ?
			this.state.gitURL + '/tree/' + this.state.gitBranch :
			'';
		version.videoURL = this.state.videoURL;
		version.presentationURL = this.state.presentationURL;
		this.setState({
			projectName: '',
			projectDesc: '',
			candidateSet:[],
			wave: '',
			skills: [],
			gitURL: '',
			gitBranch: '',
			videoURL: '',
			presentationURL: ''
		})
		this.props.handleUpdate(version);
		this.props.handleClose();
	}

	validationSuccess() {
		if(this.state.projectName.trim().length == 0) {
			this.setState({
				projectNameErrorText: 'This field cannot be empty'
			})
		} else if(this.state.versionName.trim().length == 0) {
			this.setState({
				projectVersionErrorText: 'This field cannot be empty'
			})
		} else if(this.state.wave.length == 0) {
			this.setState({
				waveErrorText: 'This field cannot be empty'
			})
		} else if(this.state.skills.length == 0) {
			this.setState({
				skillsErrorText: 'This list cannot be empty'
			})
		} else if(this.state.projectDesc.trim().length == 0) {
			this.setState({
				projectDescErrorText: 'This field cannot be empty'
			})
		} else {
				return true
		}
		return false
	}

	resetFields() {
		this.setState({
			showDialog: false,
			projectName: '',
			versionName: '',
			projectDesc: '',
			candidateSet: [],
			candidateNames: [],
			candidateIDs: [],
			candidateEmailID: [],
			wave: '',
			skills: [],
			gitURL: '',
			gitBranch: '',
			videoURL: '',
			presentationURL: '',
			projectNameErrorText: '',
			projectDescErrorText: '',
			waveErrorText: '',
			skillsErrorText: ''
		});
	}

	render() {
		let th = this
		const	AddActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={(e)=>{this.onDialogClose(e, 'CLOSE DIALOG')}}
				style={dialog.actionButton}
      />,
      <FlatButton
        label='Add'
        onTouchTap={(e)=>{this.onDialogClose(e, 'ADD PRODUCT')}}
				style={dialog.actionButton}
      />
    ]

		const	VersionActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={(e)=>{this.onDialogClose(e, 'CLOSE DIALOG')}}
				style={dialog.actionButton}
      />,
      <FlatButton
        label='Add'
        onTouchTap={(e)=>{this.onDialogClose(e, 'ADD VERSION')}}
				style={dialog.actionButton}
      />
    ]

    const	EditActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={(e)=>{this.onDialogClose(e, 'CLOSE DIALOG')}}
				style={dialog.actionButton}

      />,
      <FlatButton
        label='Update'
				onTouchTap={(e)=>{this.onDialogClose(e, 'EDIT VERSION')}}
				style={dialog.actionButton}
      />
    ]

		let actions = [];
		if(this.props.dialogTitle == 'ADD PRODUCT') actions = AddActions;
		else if(this.props.dialogTitle == 'ADD VERSION') actions = VersionActions;
		else actions = EditActions;
		return(
		<div>
			<FloatingActionButton mini={true} style={app.fab} onTouchTap={this.onDialogOpen}>
	      <ContentAdd />
	    </FloatingActionButton>
	    <Dialog
	    	bodyStyle={dialog.body}
        title={this.props.dialogTitle}
				titleStyle={dialog.title}
        actions={actions}
				actionsContainerStyle={dialog.actionsContainer}
        open={this.state.showDialog}
        autoScrollBodyContent={true}
      >
				<div>
				 <TextField
			      floatingLabelText='Name *'
						floatingLabelStyle={app.mandatoryField}
						value={this.state.projectName}
			      onChange={this.onNameChange}
						errorText={this.state.projectNameErrorText}
						disabled={this.props.openDialog}
						underlineDisabledStyle={styles.underlineDisabled}
						style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', top:'-22px'}}
			    />
					<br/>
					<TextField
					floatingLabelText='Version *'
					floatingLabelStyle={app.mandatoryField}
					value={this.state.versionName}
					onChange={this.onVersionChange}
					errorText={this.state.projectVersionErrorText}
					disabled={this.props.showAddVersion}
					underlineDisabledStyle={styles.underlineDisabled}
					style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', top:'-22px'}}
				/>
					 <SelectField
							onChange={th.onWaveChange}
							errorText={this.state.waveErrorText}
							floatingLabelText='Wave *'
							floatingLabelStyle={app.mandatoryField}
							value={th.state.wave}
							style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px'}}
						>
							{
								th.state.waves.map(function(val, key) {
									return <MenuItem key={key} value={val + ' (' + th.state.Course[key] + ')'} primaryText={val + ' (' + th.state.Course[key] + ')'} />
								})
							}
					</SelectField>
				</div>
				<div>
					<div style={dialog.box100}>
						<p>
							Contributors
							{
								th.state.candidates.length > 0 ? ` - (${th.state.candidates.length})` : ''
							}
						</p>
	          {
							th.state.candidateNames.length > 0 ?
	          	th.state.candidateNames.map(function(name, index) {
	          		return(
		          		<Checkbox
										label={name.value}
										value={name.value}
										onCheck={th.onToggleCandidate}
										checked={name.checked}
										key={index}
										style={{width: '50%', display: 'inline-block'}}
										iconStyle={{fill: '#202D3E'}}
									/>
								)
	          	}) :
								th.state.wave == '' ?
								<p>Please select a wave to see the list of available cadets.</p> :
								<p>Sorry! No cadets available.</p>
						}
					</div>
				</div>
				<div>
					<div style={dialog.box100}>
						<AutoComplete
							floatingLabelText="Add Skills *"
							floatingLabelStyle={app.mandatoryField}
							filter={AutoComplete.fuzzyFilter}
							searchText={th.state.skillName}
							onUpdateInput={th.onSkillChange}
							onNewRequest={th.onSkillAddition}
							dataSource={th.state.skillSet}
							errorText={th.state.skillsErrorText}
							maxSearchResults={5}
						/>
						<Paper style={styles.paper} zDepth={1} >
							<div style={styles.wrapper}>
								{
									this.state.skills.map(function (skill, index) {
										return(
											<Chip
												onRequestDelete={() => th.onSkillDeletion(skill)}
							          style={styles.chip}
							          key={index}
							        >
							          <span style={styles.chipName}>{skill}</span>
							        </Chip>
						        )
									})
								}
							</div>
						</Paper>
						</div>
					</div>
					<div>
						<div style={dialog.box100}>
			      	<TextField
					      floatingLabelText='Description *'
								floatingLabelStyle={app.mandatoryField}
					      value={th.state.projectDesc}
					      onChange={th.onDescChange}
								errorText={th.state.projectDescErrorText}
					      multiLine={true}
					      rows={3}
					      rowsMax={3}
					      fullWidth={true}
					    />
						</div>
					</div>
					<div>
						<div style={dialog.box50}>
			      	<TextField
					      floatingLabelText='Git URL'
					      value={th.state.gitURL}
					      onChange={th.onGitURLChange}
					      multiLine={true}
					      fullWidth={true}
					    />
						</div>
						<div style={dialog.box50}>
			      	<TextField
					      floatingLabelText='Git Branch'
					      value={th.state.gitBranch}
					      onChange={th.onGitBranchChange}
					      multiLine={true}
					      fullWidth={true}
					    />
						</div>
					</div>
					<div>
						<div style={dialog.box100}>
			      	<TextField
					      floatingLabelText='Video URL'
					      value={th.state.videoURL}
					      onChange={th.onVideoURLChange}
					      multiLine={true}
					      fullWidth={true}
					    />
						</div>
					</div>
					<div>
						<div style={dialog.box100}>
			      	<TextField
					      floatingLabelText='Presentation URL'
					      value={th.state.presentationURL}
					      onChange={th.onPresentationURLChange}
					      multiLine={true}
					      fullWidth={true}
					    />
						</div>
					</div>
      </Dialog>
			<Snackbar
				open={this.state.snackbarOpen}
				message={this.state.snackbarMessage}
				autoHideDuration={4000}
				onRequestClose={this.hideSnackbar}
			/>
		</div>)
	}
}
