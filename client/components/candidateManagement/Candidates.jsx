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
			candidatesName:[],
			appliedFilters: []
		}

		this.getCandidates = this.getCandidates.bind(this);
		this.candidateView = this.candidateView.bind(this);
		this.handleBack = this.handleBack.bind(this);
		this.deleteCandidate = this.deleteCandidate.bind(this);
		this.updateCandidate = this.updateCandidate.bind(this);
		this.addCandidate = this.addCandidate.bind(this);
		this.getAccordianValues = this.getAccordianValues.bind(this);
		this.addFilter = this.addFilter.bind(this);
		this.removeFilter = this.removeFilter.bind(this);
	}

	componentWillMount() {
		this.getCandidates();
	}

	addFilter(filterType, key, value) {
		let appliedFilters = this.state.appliedFilters;
		if(filterType == 'AutoComplete') {
			if(this.duplicateFilterFound(appliedFilters, key, value)) {
				console.log('Duplicate Filter Found...');
			} else {
				appliedFilters.push({key: key, value: value});
				this.setState({
					appliedFilters: appliedFilters
				});
			}
		} else if(filterType == 'RadioButton') {

		} else if(filterType == 'CheckBox') {
			
		}
	}

	removeFilter(key, value) {
		let appliedFilters = this.state.appliedFilters.filter(function(filter) {
			return (filter.key != key && filter.value != value);
		});
		this.setState({
			appliedFilters: appliedFilters
		});
	}

	duplicateFilterFound(appliedFilters, key, value) {
			return appliedFilters.some(function(filter) {
				return (filter.key == key && filter.value == value)
			});
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
		let valueArr = [];
		this.state.candidates.map(function(candidate) {
			valueArr.push(candidate[key]);
		});
		return valueArr;
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
								{
									this.state.appliedFilters.length > 0 ?
									<div style={{border: '2px solid silver', width: ' 100%', padding: '3px'}}>
										{
											this.state.appliedFilters.map(function(filter, index) {
												return (
													<Chip
									          key={index}
														onRequestDelete={()=>th.removeFilter(filter.key, filter.value)}
														style={{border: '2px solid teal'}}
									        >
									          <span>{filter.value}</span>
									        </Chip>
												)
											})
										}
									</div> : ''
								}
								<FilterItem
									title={'EmployeeID'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('EmployeeID')}
									onAddFilter={(filterValue)=>th.addFilter('AutoComplete', 'EmployeeID', filterValue)}
								/>
								<FilterItem
									title={'EmployeeName'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('EmployeeName')}
									onAddFilter={(filterValue)=>th.addFilter('AutoComplete', 'EmployeeName', filterValue)}
								/>
								<FilterItem
									title={'DigithonQualified'}
									type={'RadioButton'}
									onGetAccordianValues={()=>['Yes', 'No']}
									onAddFilter={(filterValue)=>th.addFilter('RadioButton', 'DigithonQualified', filterValue)}
								/>
								<FilterItem
									title={'DigithonPhase'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('DigithonPhase')}
									onAddFilter={(filterValue)=>th.addFilter('AutoComplete', 'DigithonPhase', filterValue)}
								/>
								<FilterItem
									title={'DigithonScore'}
									type={'AutoComplete'}
									onGetAccordianValues={()=>th.getAccordianValues('DigithonScore')}
									onAddFilter={(filterValue)=>th.addFilter('AutoComplete', 'DigithonScore', filterValue)}
								/>
								<FilterItem
									title={'Skills'}
									type={'CheckBox'}
									onGetAccordianValues={()=>th.getAccordianValues('Skills')}
									onAddFilter={(filterValue)=>th.addFilter('CheckBox', 'Skills', filterValue)}
								/>
							</Col>
							<Col md={9}>
								{
									this.state.candidates.map(function(candidate, key) {
										return (
													<CandidateCard
														candidate={candidate}
														handleCardClick={th.candidateView}
														handleDelete={th.deleteCandidate}
														k={key}
													/>
											)
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
