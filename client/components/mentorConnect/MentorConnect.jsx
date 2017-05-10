import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import FileDrop from './FileDrop.jsx';
import CadetItem from './CadetItem.jsx';
import AddWave from './AddWave.jsx';
 
const styles = {
	heading: {
		textAlign: 'center'
	},
	rowHeaders: {
		// textAlign: 'center',
		height: 40,
		fontWeight: 'bold',
		color: '#eee',
		background: '#555',
		paddingTop: 10
	}
}

export default class MentorConnect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			cadets: [],
			filterCadet: '',
			open: false,
			message: ''
		}
		this.getCadets = this.getCadets.bind(this);
		this.saveRemarks = this.saveRemarks.bind(this);
		this.addWave = this.addWave.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleClearFilter = this.handleClearFilter.bind(this);
		this.handleRequestClose = this.handleRequestClose.bind(this);
	}

	componentDidMount() {
		this.getUser();
		this.getCadets();
	}

	getUser() {
		let th = this
		Request
			.get('/dashboard/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				if(err)
					console.log(err)
				else {
					th.setState({
						user: res.body
					})
				}
			})
	}
	getCadets() {
		let th = this;
		Request
			.get('/dashboard/cadets')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		cadets: res.body
		    	})
		    }
		  })
	}
	updateBulkRemarks(file) {
		let th = this;
		Request
			.post('/upload/remarks')
			.set({'Authorization': localStorage.getItem('token')})
			.attach('file', file)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('File uploaded and remarks saved')
		    	th.getCadets();
		    }
			})
	}
	saveRemarks(cadet) {
		let th = this;
		Request
			.post('/dashboard/updatecadet')
			.set({'Authorization': localStorage.getItem('token')})
			.send(cadet)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCadets();
		    }
			});
	}
	addWave(wave) {
		let th = this;
		Request
			.post('/dashboard/addwave')
			.set({'Authorization': localStorage.getItem('token')})
			.send(wave)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		open: true,
		    		message: "Wave added successfully with Wave ID: " + res.body.WaveID
		    	})
		    	th.getCadets();
		    }
			});
	}
	handleFilter(val) {
		this.setState({
			filterCadet: val
		})
	}
	handleClearFilter() {
		this.setState({
			filterCadet: ''
		})
	}
	handleRequestClose() {
		this.setState({
			open: false
		})
	}
	
	render() {
		let th = this;
		let cadetsName = [];
		this.state.cadets.map(function (cadet, i) {
			cadetsName.push(cadet.EmployeeName);
		})
		return(
			<div>
				{
					//<div style={{height: 200, width: 200, background: 'url(../../assets/images/drawer_top.jpg) -30px -50px'}}>
					//</div>
				}
				<h1 style={styles.heading}>Mentor Connect</h1>
				<FileDrop handleBulkUpdateRemarks={this.updateBulkRemarks}/>
				<Grid>
					<Row style={{textAlign: 'center'}}>
						<Col md={4} mdOffset={4}>
							<AutoComplete
			          hintText="Search Candidate"
				  filter={AutoComplete.fuzzyFilter}
						
			          style={styles.heading}
			          dataSource={cadetsName}
			          onNewRequest={this.handleFilter}
			        />
			        <FlatButton 
			        	label="Clear Filter" 
			        	primary={true} 
			        	onClick={this.handleClearFilter}
			        />
		        </Col>
					</Row>
					<Row style={styles.rowHeaders}>
						<Col md={1} mdOffset={1}>
							Cadet ID
						</Col>
						<Col md={2}>
							Cadet Name
						</Col>
						<Col md={4}>
							Remarks
						</Col>
						<Col md={2}>
							Selected
						</Col>
						<Col>
							Save
						</Col>
					</Row>
					{
						this.state.cadets.map(function (cadet, i) {
							if(cadet.Wave == undefined) {
								if(th.state.filterCadet != '') {
									return (
										cadet.EmployeeName.startsWith(th.state.filterCadet) &&
										<CadetItem cadet={cadet} key={i} handleRemarksUpdate={th.saveRemarks}/>
									)
								}
								else 
									return (
										<CadetItem cadet={cadet} key={i} handleRemarksUpdate={th.saveRemarks}/>
									)
							}
						})
					}
				</Grid>
				{
					this.state.user.role == "administrator" &&
					this.state.cadets.length > 0 &&
					<AddWave cadets={this.state.cadets} handleWaveAdd={this.addWave}/>
				}
				<Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
			</div>
		)
	}	
}
