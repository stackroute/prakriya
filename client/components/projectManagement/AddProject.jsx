import React from 'react';
import Request from 'superagent'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import AddIcon from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';

const styles = {
	addButton: {
		position:'fixed',
	  bottom: '60px',
	  right: '15px',
	  zIndex: 1
	},
	dialog: {
	  textAlign: 'center'
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

export default class AddProject extends React.Component {
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
	}

	componentWillMount() {
		if(localStorage.getItem('token')) {
			this.getWaveIDs()
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
			wave: e.target.outerText
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
		if(this.state.candidatesName.indexOf(this.state.searchPerm)> -1 && this.state.candidateList.indexOf(this.state.searchPerm) === -1)
		{
				perms = this.state.candidateList;
				perms.push(this.state.searchPerm);
				this.setState({
					candidateList: perms,
					searchPerm: ''
				})
		}
		else
		{
			if(this.state.candidateList.indexOf(this.state.searchPerm) >= 0)
			{
			this.setState({
				snackBarMsg: "Candidate already added",
				openSnackBar: true
			})
			}
			else
			{
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

	render() {
		let th = this;
		const projectDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        onTouchTap={this.handleClose}
        onClick={this.handleAdd}
      />,
    ];
		return(
			<div>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen}>
		      <ContentAdd />
		    </FloatingActionButton>
		    <Dialog
		    	style={styles.dialog}
          title="Add a new Project"
          actions={projectDialogActions}
          open={this.state.showDialog}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
        >
        	<TextField
			      floatingLabelText="Name"
			      value={this.state.projectName}
			      onChange={this.handleNameChange}
			      fullWidth={true}
			    />
        	<TextField
			      floatingLabelText="Description"
			      value={this.state.projectDesc}
			      onChange={this.handleDescChange}
			      multiLine={true}
			      rows={3}
			      rowsMax={3}
			      fullWidth={true}
			    />
			    <SelectField
							onChange={th.onWaveChange}
							floatingLabelText="Select Wave"
							value={th.state.wave}
						>
							{
								th.state.waves.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>
						<br/>
						{
										th.state.candidatesName.map(function(cand, index) {
											return (
												<div>{cand.EmployeeName}</div>
												);
										})
									}
							<AutoComplete
							      floatingLabelText="Select candidates..."
							      filter={AutoComplete.fuzzyFilter}
							      searchText={this.state.searchPerm}
					          onUpdateInput={this.handleUpdateInputPerm}
					          onNewRequest={this.handleAddNewPerm}
							      dataSource={this.state.candidatesName}
							      maxSearchResults={5}
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

									<TextField
							    		hintText="Skills"
							    		floatingLabelText="Skills"
							    		value={this.state.skillName}
							    		onChange={this.onChangeSkill}
							    	/>
							    	<IconButton tooltip="Add skill" onClick={this.onChangeAddSkill}
							    		>
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
        </Dialog>
			</div>
		)
	}
}
