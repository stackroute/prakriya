import React from 'react';
import Request from 'superagent'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import AutoComplete from 'material-ui/AutoComplete'
import Paper from 'material-ui/Paper'
import Chip from 'material-ui/Chip'
import Snackbar from 'material-ui/Snackbar'
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline'
import IconButton from 'material-ui/IconButton'
import {Grid, Row, Col} from 'react-flexbox-grid'

const styles = {
	addButton: {
		position:'fixed',
	  bottom: '60px',
	  right: '15px',
	  zIndex: 1
	},
	dialog: {
		backgroundColor: '#DDDBF1',
		borderBottom: '3px solid teal',
		borderRight: '10px solid teal',
		borderLeft: '10px solid teal'
	},
	dialogTitle: {
		fontWeight: 'bold',
		backgroundColor: 'teal',
		color: '#DDDBF1',
		textAlign: 'center'
	},
	actionsContainer: {
		backgroundColor: 'teal',
		borderTop: '0px',
		marginTop: '0px'
	},
	actionButton: {
		backgroundColor: '#DDDBF1',
		width: '50%',
		color: 'teal',
		border: '1px solid teal',
		height: '100%'
	},
	underlineDisabled: {
		display: 'none'
	},
	paper: {
		margin: '5px',
		padding: '5px',
		width: 'auto',
		height: '120px',
		borderRadius: '2px'
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
		super(props);
		this.state = {
			showDialog: false,
			waves: [],
			projectName: '',
			projectDesc: '',
			candidatesName:[],
			wave: '',
			searchPerm: '',
			openSnackBar: false,
			snackBarMsg: '',
			sessionOn: {},
			candidateList: [],
			skillName: '',
			skills: []
		}
		this.getWaveIDs = this.getWaveIDs.bind(this)
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleControlDelete = this.handleControlDelete.bind(this);
		this.handleUpdateInputPerm = this.handleUpdateInputPerm.bind(this);
		this.handleAddNewPerm = this.handleAddNewPerm.bind(this);
		this.onWaveChange = this.onWaveChange.bind(this);
		this.onChangeAddSkill = this.onChangeAddSkill.bind(this);
		this.onChangeSkill = this.onChangeSkill.bind(this);
		this.handleSkillDelete = this.handleSkillDelete.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	componentWillMount() {
		if(localStorage.getItem('token')) {
			this.getWaveIDs()
		}
		if(this.props.dialogTitle == 'EDIT PRODUCT') {
			this.setState({
				projectName: this.props.project.name,
				projectDesc: this.props.project.description,
				candidateList:this.props.project.members,
				wave: this.props.project.wave,
				skills: this.props.project.skills,
				showDialog: this.props.openDialog
			})
			this.getCandidates(this.props.project.wave);
		}
	}

	getWaveIDs() {
		let th = this
		Request
			.get('/dashboard/waveids')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				console.log("WaveIDs Fetched: ", res.body.waveids)
				th.setState({
					waves: res.body.waveids
				})
			})
	}

	onWaveChange(e) {
		let th = this
		th.setState({
			wave: e.target.outerText,
			candidateList: []
		})
		th.getCandidates(e.target.outerText);
	}

	getCandidates(waveID) {
			let th = this;
			let candidateName = [];
			let candidateID = [];
			Request
				.get('/dashboard/wavespecificcandidates?waveID='+waveID)
				.set({'Authorization': localStorage.getItem('token')})
				.end(function(err, res){
				res.body.data.map(function(candidate,index) {
					candidateName.push(candidate.EmployeeName);
				})
				th.setState({
					candidatesName: candidateName
				})
				})
	}


	handleControlDelete(perm) {
		let candidatesLists = this.state.candidateList.filter(function(control) {
			return perm != control
		})
		this.setState({
			candidateList: candidatesLists
		})
	}

	handleUpdateInputPerm(searchPerm) {
		this.setState({
			searchPerm: searchPerm
		})
	}

	handleAddNewPerm() {
		let perms = [];
		let th = this;
		if(this.state.candidatesName.indexOf(this.state.searchPerm)> -1
			 && this.state.candidateList.indexOf(this.state.searchPerm) === -1) {
				perms = this.state.candidateList;
				perms.push(this.state.searchPerm);
				this.setState({
					candidateList: perms,
					searchPerm: ''
				})
		} else {
			if(this.state.candidateList.indexOf(this.state.searchPerm) >= 0) {
				this.setState({
					snackBarMsg: "Candidate already added",
					openSnackBar: true
				})
			} else {
				this.setState({
					snackBarMsg: "Candidate not available",
					openSnackBar: true
				})
			}
		}
	}

	handleOpen() {
		this.setState({
			showDialog: true
		})
	}
	handleClose() {
		this.setState({
			showDialog: false
		})
		if(this.props.openDialog) {
			this.props.handleClose();
		}
	}
	handleNameChange(e) {
		this.setState({
			projectName: e.target.value
		})
	}
	handleDescChange(e) {
		this.setState({
			projectDesc: e.target.value
		})
	}
	handleAdd() {
		let project = {}
		project.name = this.state.projectName;
		project.description = this.state.projectDesc;
		project.wave = this.state.wave;
		project.members = this.state.candidateList;
		project.skills = this.state.skills;
		this.setState({
			projectName: '',
			projectDesc: '',
			candidatesName:[],
			wave: '',
			skills: []
		})
		this.props.addProject(project);
	}

	onChangeAddSkill() {
		let skill = this.state.skills;
		skill.push(this.state.skillName);
		this.setState({
			skills: skill,
			skillName: ''
		})
	}

	onChangeSkill(e) {
		this.setState({
			skillName: e.target.value
		})
	}

	handleSkillDelete(perm) {
		let skill = this.state.skills.filter(function(control) {
			return perm != control
		})
		this.setState({
			skills: skill
		})
	}

	handleUpdate() {
		let project = {}
		project.name = this.state.projectName;
		project.description = this.state.projectDesc;
		project.wave = this.state.wave;
		project.members = this.state.candidateList;
		project.skills = this.state.skills;
		this.setState({
			projectName: '',
			projectDesc: '',
			candidatesName:[],
			wave: '',
			skills: []
		})
		this.props.handleUpdate(project);
		this.props.handleClose();
	}

	render() {
		let th = this
		const	AddActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.handleClose}
				style={styles.actionButton}
      />,
      <FlatButton
        label='Add'
        onTouchTap={this.handleClose}
        onClick={this.handleAdd}
				style={styles.actionButton}
      />
    ]

    const	EditActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.handleClose}
				style={styles.actionButton}

      />,
      <FlatButton
        label='Update'
        onClick={this.handleUpdate}
				style={styles.actionButton}
      />
    ]

		let actions = [];
		if(this.props.dialogTitle == 'ADD PRODUCT') actions = AddActions
		else actions = EditActions

		return(
		<div>
			<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen}>
	      <ContentAdd />
	    </FloatingActionButton>
	    <Dialog
	    	bodyStyle={styles.dialog}
        title={this.props.dialogTitle}
				titleStyle={styles.dialogTitle}
        actions={actions}
				actionsContainerStyle={styles.actionsContainer}
        open={this.state.showDialog}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}
      >
				<div>
				 <TextField
			      floatingLabelText='Name'
			      value={this.state.projectName}
			      onChange={this.handleNameChange}
						disabled={this.props.openDialog}
						underlineDisabledStyle={styles.underlineDisabled}
						style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px', top:'-22px'}}
			    />
					<SelectField
							onChange={th.onWaveChange}
							floatingLabelText='Select Wave'
							value={th.state.wave}
							style={{width: '50%', border: '2px solid white', boxSizing: 'border-box', padding: '5px'}}
						>
							{
								th.state.waves.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
					</SelectField>
				</div>
				<div style={{marginTop: '-25px'}}>
					<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box'}}>
					<AutoComplete
					      floatingLabelText="Select Candidates..."
					      filter={AutoComplete.fuzzyFilter}
					      searchText={this.state.searchPerm}
			          onUpdateInput={this.handleUpdateInputPerm}
			          onNewRequest={this.handleAddNewPerm}
					      dataSource={this.state.candidatesName}
					      maxSearchResults={5}
								style={{padding: '5px'}}
					    />
		    	<Paper style={styles.paper} zDepth={1} >
						<div style={styles.wrapper}>
							{
								th.state.candidateList.map(function (candidate, index) {
									return(
										<Chip
											onRequestDelete={() => th.handleControlDelete(candidate)}
						          style={styles.chip}
						          key={index}
						        >
						          <span style={styles.chipName}>{candidate}</span>
						        </Chip>
					        )
								})
							}
						</div>
					</Paper>
					</div>
					<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box'}}>
					<TextField
			    		hintText="Skills"
			    		floatingLabelText="Skills"
			    		value={this.state.skillName}
			    		onChange={this.onChangeSkill}
							style={{padding: '5px'}}
			    	/>
			    	<IconButton tooltip="Add Skill" onClick={this.onChangeAddSkill}>
				      <AddIcon/>
				    </IconButton>
						<Paper style={styles.paper} zDepth={1} >
									<div style={styles.wrapper}>
										{
											this.state.skills.map(function (skill, index) {
												return(
													<Chip
														onRequestDelete={() => th.handleSkillDelete(skill)}
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
		      	<TextField
				      floatingLabelText='Description'
				      value={this.state.projectDesc}
				      onChange={this.handleDescChange}
				      multiLine={true}
				      rows={3}
				      rowsMax={3}
				      fullWidth={true}
							style={{border: '2px solid white', padding: '5px', textAlign: 'justify', boxSizing: 'border-box'}}
				    />
					</div>
      </Dialog>
		</div>)
	}
}
