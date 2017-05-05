import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
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
			cadets: [],
			filterCadet: ''
		}
		this.getCadets = this.getCadets.bind(this);
		this.saveRemarks = this.saveRemarks.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleClearFilter = this.handleClearFilter.bind(this);
	}

	componentDidMount() {
		this.getCadets();
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
				<Grid>
					<Row style={{textAlign: 'center'}}>
						<Col md={4} mdOffset={4}>
							<AutoComplete
			          hintText="Search Candidate"
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
						})
					}
				</Grid>
				<AddWave />
			</div>
		)
	}	
}