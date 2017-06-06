import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CandidateCard from './CandidateCard.jsx';
import CandidateHome from './CandidateHome.jsx';
import AddCandidate from './AddCandidate.jsx';
import FilterItem from './FilterItem.jsx';
import Chip from 'material-ui/Chip';

const styles = {
	heading: {
		textAlign: 'center'
	}
}

export default class Candidates extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			candidates: [],
			showCandidate: false,
			displayCandidate: {},
			cadets: [],
			filterCadetName: '',
			filterCadetWave: '',
			candidatesName:[],
			appliedFilters: []
		}

		this.getCandidates = this.getCandidates.bind(this);
		this.candidateView = this.candidateView.bind(this);
		this.handleBack = this.handleBack.bind(this);
		this.deleteCandidate = this.deleteCandidate.bind(this);
		this.updateCandidate = this.updateCandidate.bind(this);
		this.addCandidate = this.addCandidate.bind(this);
		this.handleFilterName = this.handleFilterName.bind(this);
		this.handleFilterWave = this.handleFilterWave.bind(this);
		this.handleClearFilter = this.handleClearFilter.bind(this);
		this.getAccordianValues = this.getAccordianValues.bind(this);
		this.addFilter = this.addFilter.bind(this);
	}

	componentDidMount() {
		this.getCandidates();
	}

	handleFilterName(val) {
		console.log("value",val)
		this.setState({
			filterCadetName: val,
			filterCadetWave: ''
		});
	}

	handleFilterWave(val) {
		console.log("value",val)
		this.setState({
			filterCadetWave: val,
			filterCadetName: ''
		});
	}

	handleClearFilter() {
		this.setState({
			filterCadetWave: '',
			filterCadetName: ''
		});
	}

	addFilter(key, value) {
		let appliedFilters = this.state.appliedFilters;
		appliedFilters.push({key: value});
		this.setState({
			appliedFilters: appliedFilters
		})
	}

	getCandidates() {
		let th = this;
		Request
			.get('/dashboard/cadets')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
				let cadets = res.body.filter(function(cadet) {
					if(!(cadet.Wave == undefined))
						return cadet;
				})
		    	th.setState({
		    		candidates: cadets
		    	})
		    }
		  })
	}

	candidateView(candidate) {
		this.setState({
			showCandidate: true,
			displayCandidate: candidate
		})
	}
	handleBack() {
		this.setState({
			showCandidate: false
		})
	}
	deleteCandidate(candidate) {
		let th = this
		Request
			.delete('/dashboard/deletecadet')
			.set({'Authorization': localStorage.getItem('token')})
			.send(candidate)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.getCandidates();
		    }
		  })
	}
	updateCandidate(candidate) {
		let th = this
		Request
			.post('/dashboard/updatecadet')
			.set({'Authorization': localStorage.getItem('token')})
			.send(candidate)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCandidates();
		    }
			});
	}

	addCandidate(candidate) {
		let th = this;
		Request
			.post('/dashboard/addcandidate')
			.set({'Authorization': localStorage.getItem('token')})
			.send(candidate)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Success');
		    }
			})
	}

	getAccordianValues(key) {
		console.log('parent func called')
		let valueArr = []
		this.state.candidates.map(function(candidate) {
			valueArr.push(candidate[key])
		})
		return valueArr
	}

	render() {
		let th = this;
		let cadetsName = [];
		let cadetsWave=[];
		let cadetsDistinctWave=[];
		this.state.candidates.map(function (cadet, i) {
			cadetsName.push(cadet.EmployeeName);
		})
		this.state.candidates.map(function (cadet, i) {
			cadetsWave.push(cadet.Wave);
			})
		cadetsDistinctWave=cadetsWave.filter(function (cadet, i, cadetsWave) {
	    return cadetsWave.indexOf(cadet) == i;
		});
		return(
			<div>
			<AddCandidate addCandidate={this.addCandidate}/>
			{
				!this.state.showCandidate ?
				<div>
					<h1 style={styles.heading}>Candidate Management</h1>
					<Grid>
						<Row>
							<Col md={3}>
								<h3 style={{
									textAlign: 'center',
									backgroundColor: '#eeeeee',
									border: '2px solid silver',
									width: '100%',
									marginLeft: '0px',
									marginRight: '0px',
									marginTop: '5px',
									marginBottom: '0px',
									padding: '3px',
									color: 'teal'
								}}>... FILTERS ...</h3>
								<div>
									{
										this.state.appliedFilters.map(function(filter, index) {
											return (
												<Chip
								          key={index}
								        >
								          <span>{filter.value}</span>
								        </Chip>
											)
										})
									}
								</div>
								<FilterItem
									title={'EmployeeID'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('EmployeeID')}
									onAddFilter={th.addFilter}
								/>
								<FilterItem
									title={'EmployeeName'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('EmployeeName')}
									onAddFilter={th.addFilter}
								/>
								<FilterItem
									title={'DigithonQualified'}
									type={'RadioButton'}
									onGetAccordianValues={()=>th.getAccordianValues('DigithonQualified')}
									onAddFilter={th.addFilter}
								/>
								<FilterItem
									title={'DigithonPhase'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('DigithonPhase')}
									onAddFilter={th.addFilter}
								/>
								<FilterItem
									title={'DigithonScore'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('DigithonScore')}
									onAddFilter={th.addFilter}
								/>
								<FilterItem
									title={'Skills'}
									type={'CheckBox'}
									onGetAccordianValues={()=>th.getAccordianValues('Skills')}
									onAddFilter={th.addFilter}
								/>
								<FilterItem
									title={'CGPA'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('CGPA')}
									onAddFilter={th.addFilter}
								/>
								{/*<AutoComplete
									hintText="Search By"
									filter={AutoComplete.fuzzyFilter}
									searchText={this.state.filterCadetName}
									dataSource={this.state.filterCategories}
									onNewRequest={this.handleFilterName}
								/>
								<AutoComplete
									hintText="SortBy Wave"
									filter={AutoComplete.fuzzyFilter}
									searchText={this.state.filterCadetWave}
									dataSource={cadetsDistinctWave}
									onNewRequest={this.handleFilterWave}
								/>
								<FlatButton
									label="Clear Filter"
									primary={true}
									onClick={this.handleClearFilter}
								/>*/}
							</Col>
							<Col md={9}>
								{
									this.state.candidates.map(function(candidate, key) {
										if((th.state.filterCadetWave === candidate.Wave)||(th.state.filterCadetName === candidate.EmployeeName)) {
											return (
												candidate.Wave != undefined &&
													<CandidateCard
														candidate={candidate}
														handleCardClick={th.candidateView}
														handleDelete={th.deleteCandidate}
														k={key}
													/>
											)
										}
										else if((th.state.filterCadetName === '') && (th.state.filterCadetWave === '')) {
											return(
													<CandidateCard
														candidate={candidate}
														handleCardClick={th.candidateView}
														handleDelete={th.deleteCandidate}
														k={key}
													/>
											)
										}
									})
								}
							</Col>
						</Row>
					</Grid>
				</div>
				:
				<div>
					<CandidateHome
						candidate={this.state.displayCandidate}
						handleBack={this.handleBack}
						handleDelete={this.deleteCandidate}
						handleUpdate={this.updateCandidate}
					/>
				</div>
			}
			</div>
		)
	}
}
