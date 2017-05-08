	import React from 'react';
	import Request from 'superagent';
	import SelectField from 'material-ui/SelectField';
	import MenuItem from 'material-ui/MenuItem';
	import DatePicker from 'material-ui/DatePicker';
	import {Card,  CardHeader,  CardTitle, CardText} from 'material-ui/Card';
	import AutoComplete from 'material-ui/AutoComplete';
	import Paper from 'material-ui/Paper';
	import Chip from 'material-ui/Chip';
	import Snackbar from 'material-ui/Snackbar';
	import FlatButton from 'material-ui/FlatButton';
	import SaveIcon from 'material-ui/svg-icons/content/save';

	const styles = {
		heading: {
			textAlign: 'center'
		},
		chip: {
	    margin: '4px',
	    background: '#eee'
	  },
	  chipName: {
	  	// fontSize: '12px'
	  }
	  }



	export default class Attendance extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
			WaveIds:[],
			WaveId:'',
			candidates:[],
			absentList:[],
			searchPerm: '',
			openSnackBar: false,
			snackBarMsg: '',
			sessionOn: {}
			}
			this.onWaveIdChange = this.onWaveIdChange.bind(this);
			this.getWaveSpecificCandidates=this.getWaveSpecificCandidates.bind(this);
			this.getWaveId = this.getWaveId.bind(this);
			this.handleControlDelete = this.handleControlDelete.bind(this);
			this.handleUpdateInputPerm = this.handleUpdateInputPerm.bind(this);
			this.handleAddNewPerm = this.handleAddNewPerm.bind(this);
			this.savePerms = this.savePerms.bind(this);
			this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
			this.handleSessionOn = this.handleSessionOn.bind(this);
		}
		componentWillMount() {
			if(localStorage.getItem('token')) {
				this.getWaveId()
			}
			this.setState({
				sessionOn: new Date().getDate()
			})
		}

		handleControlDelete(perm) {
			let absentList = this.state.absentList.filter(function(control) {
				return perm != control
			})
			this.setState({
				absentList: absentList,
				disableSave: false
			})
		}

		handleUpdateInputPerm(searchPerm) {
			this.setState({
				searchPerm: searchPerm
			})
		}

		handleAddNewPerm() {
			let perms = [];
			if(this.state.candidates.indexOf(this.state.searchPerm)> -1 && this.state.absentList.indexOf(this.state.searchPerm) === -1)
			{
					perms = this.state.absentList
					perms.push(this.state.searchPerm)
					this.setState({
						absentList: perms,
						searchPerm: '',
						disableSave: false
					})
			}
			else
			{
				if(this.state.absentList.indexOf(this.state.searchPerm) >= 0)
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

		savePerms() {
			this.setState({
				snackBarMsg: "Updated Absentees",
				openSnackBar: true,
				sessionOn : this.state.sessionOn.setDate(this.state.sessionOn.getDate() + 1)
			})
			let th = this
			Request
				.post('/dashboard/updateabsentees')
				.set({'Authorization': localStorage.getItem('token')})
				.send({date:th.state.sessionOn,absentees:th.state.absentList})
				.end(function(err, res){
				if(err)
		    	console.log(err);
		    else {
		    	th.getWaveId();
		    }
				})
		}

		handleSessionOn(e,date) {
			this.setState({
				sessionOn: date
			})
		}

		handleSnackBarClose() {
			this.setState({openSnackBar: false})
		}

		getWaveId() {
			let th = this
			Request
				.get('/dashboard/WaveId')
				.set({'Authorization': localStorage.getItem('token')})
				.end(function(err, res){
				th.setState({
					WaveIds: res.body.WaveId
				})
				})
			}

			getWaveSpecificCandidates(waveId){
			let th = this;
			let candidateName = [];
			Request
				.get('/dashboard/WaveSpecificCandidates?waveId='+waveId)
				.set({'Authorization': localStorage.getItem('token')})
				.end(function(err, res){
				th.setState({
            candidates:res.body.data
				})
				th.state.candidates.map(function(candidate,index) {
					candidateName.push(candidate.EmployeeName);
				})
				th.setState({
					candidates: candidateName
				})
				})
			}

		onWaveIdChange(e) {
			this.setState({
				WaveId: e.target.textContent
			})
			console.log(e.target.textContent);
			this.getWaveSpecificCandidates(this.state.WaveId);
		}

		render() {
		let th=this;
			return(
				<div>
				<Card>
					<CardHeader>
						<h3 style={styles.heading}> Attendance </h3>
						</CardHeader>
						<CardText>
						<SelectField
							onChange={th.onWaveIdChange}
							floatingLabelText="Select WaveID"
							value={th.state.WaveId}
						>
							{
								th.state.WaveIds.map(function(val, key) {
									return <MenuItem key={key} value={val} primaryText={val} />
								})
							}
						</SelectField>

						      <DatePicker hintText="select Date" mode="landscape" value={this.state.sessionOn} onChange={this.handleSessionOn}/>
									{
										th.state.candidates.map(function(cand, index) {
											return (
												<div>{cand.EmployeeName}</div>
												);
										})
									}
								</CardText>
								<CardText style={styles.cardText} >
									<AutoComplete
							      floatingLabelText="Select absentees..."
							      filter={AutoComplete.fuzzyFilter}
							      searchText={this.state.searchPerm}
					          onUpdateInput={this.handleUpdateInputPerm}
					          onNewRequest={this.handleAddNewPerm}
							      dataSource={this.state.candidates}
							      maxSearchResults={5}
							    />
						    	<Paper style={styles.paper} zDepth={1} >
										<div style={styles.wrapper}>
											{
												this.state.absentList.map(function (absent, index) {
													return(
														<Chip
															onRequestDelete={() => th.handleControlDelete(absent)}
										          style={styles.chip}
										          key={index}
										        >
										          <span style={styles.chipName}>{absent}</span>
										        </Chip>
									        )
												})
											}
										</div>
									</Paper>
						    </CardText>
								<FlatButton
					    		label="Save"
					    		primary={true}
					    		disabled={this.state.disableSave}
					    		icon={<SaveIcon />}
									onClick = {this.savePerms}
					    	/>
				</Card>
				<Snackbar
          open={this.state.openSnackBar}
          message={this.state.snackBarMsg}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackBarClose}
					onClick={this.savePerms}
        />
				</div>
			)
		}
	}
