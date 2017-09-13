import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Slider from 'material-ui/Slider';
import FileDrop from './FileDrop.jsx';
import CadetItem from './CadetItem.jsx';
import app from '../../styles/app.json';

const styles = {
	rowHeaders: {
		height: 40,
		fontWeight: 'bold',
		color: '#eee',
		background: '#555',
		paddingTop: 10,
		border: '1px solid #F0F8FF'
	},
	paper1: {
		padding: 10,
		textAlign: 'left',
		backgroundColor: '#C6D8D3'
	},
	paper2: {
		padding: 10,
		paddingBottom: 1,
		marginBottom: 20,
		backgroundColor: '#C6D8D3'
	},
	sliderVal: {
		textAlign: 'left',
		marginTop: -20,
		marginBottom: 40,
		color: ''
	}
}

export default class MentorConnect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			cadets: [],
			filterCadet: '',
			slider: 0,
			open: false,
			message: ''
		}
		this.getCadets = this.getCadets.bind(this);
		this.updateBulkRemarks = this.updateBulkRemarks.bind(this);
		this.saveRemarks = this.saveRemarks.bind(this);
		this.saveAllRemarks = this.saveAllRemarks.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleClearFilter = this.handleClearFilter.bind(this);
		this.handleSliderChange = this.handleSliderChange.bind(this);
		this.handleRequestClose = this.handleRequestClose.bind(this);
		this.handleSliderSelected = this.handleSliderSelected.bind(this);
	}

	componentWillMount() {
		this.setState({
			user: this.props.user
		})
		this.getCadets();
	}

	getCadets() {
		let th = this;
		Request
			.get('/dashboard/newcadets')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let cadets = res.body;
		    	cadets.sort(th.handleSort());
		    	th.setState({
		    		cadets: cadets
		    	})
		    	console.log('Cadets', th.state.cadets)
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
	saveAllRemarks(cadets) {
		let th = this;
		Request
			.post('/dashboard/updatecadets')
			.set({'Authorization': localStorage.getItem('token')})
			.send(cadets)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCadets();
		    }
			});
	}
	handleFilter(val) {
		this.setState({
			filterCadet: val
		})
	}
	handleSliderChange(event, value) {
		this.setState({
			slider: value
		})
	}
	handleSliderSelected() {
		let cadets = this.state.cadets;
		let th = this;
		let saveCadets = []
		cadets.map(function(cadet) {
			if(cadet.DigiThonScore >= th.state.slider) {
				cadet.Selected = 'Yes'
				saveCadets.push(cadet)
			}
			else {
				cadet.Selected = 'No'
				saveCadets.push(cadet)
			}
		})
		this.saveAllRemarks(saveCadets);
	}
	handleSort() {
		return function (a,b) {
		  if (a.DigiThonScore < b.DigiThonScore)
		    return 1;
		  if (a.DigiThonScore > b.DigiThonScore)
		    return -1;
		  return 0;
		}
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
				<h1 style={app.heading}>Mentor Connect</h1>
				{
				this.state.cadets.length != 0 ?
				<Grid>
					<Row style={{textAlign: 'center'}}>
						<Col md={6}>
							<Paper style={styles.paper1}>
								<AutoComplete
				          hintText="Search Candidate"
					  			filter={AutoComplete.fuzzyFilter}
				          dataSource={cadetsName}
				          onNewRequest={this.handleFilter}
				        />
								{' '}
				        <FlatButton
				        	label="Clear Filter"
				        	primary={true}
				        	onClick={this.handleClearFilter}
				        />
				      </Paper>
				      <br/>
				      <Paper style={styles.paper2}>
			        	<Slider
				          min={0}
				          max={200}
				          step={1}
				          value={this.state.slider}
				          onChange={this.handleSliderChange}
				        />
				        <div style={styles.sliderVal}>
				        	<span>Digithon Score > {this.state.slider}</span>
				        	<span style={{float: 'right'}}>
				        		<FlatButton
				        			label="Select Cadets"
				        			primary={true}
				        			onClick={this.handleSliderSelected}
				        		/>
				        	</span>
				        </div>
				      </Paper>
		        </Col>
		        <Col md={6}>
		        	<FileDrop handleBulkUpdateRemarks={this.updateBulkRemarks}/>
		        </Col>
					</Row>
					<Row style={styles.rowHeaders}>
						<Col md={2} style={{textAlign: 'center'}}>
							Digithon Score
						</Col>
						<Col md={2} style={{textAlign: 'center'}}>
							Cadet Name
						</Col>
						<Col md={4} style={{textAlign: 'center'}}>
							Cadet Remarks
						</Col>
						<Col md={3} style={{textAlign: 'center'}}>
							Cadet Selected
						</Col>
					</Row>
					{
						this.state.cadets.map(function (cadet, i) {
							if(th.state.filterCadet != '') {
								return (
									cadet.EmployeeName.startsWith(th.state.filterCadet) &&
									<CadetItem cadet={cadet} key={i} handleRemarksUpdate={th.saveRemarks}/>
								)
							} else
								return (
									<CadetItem cadet={cadet} key={i} handleRemarksUpdate={th.saveRemarks}/>
								)
						})
					}

				</Grid> :
				<h3 style={{textAlign: 'center'}}>NO CADETS AVAILABLE FOR MENTOR CONNECT</h3>
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
