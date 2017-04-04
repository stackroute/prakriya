import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CandidateCard from './CandidateCard.jsx';
import CandidateHome from './CandidateHome.jsx';

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
			displayCandidate: {}
		}
		this.getCandidates = this.getCandidates.bind(this);
		this.candidateView = this.candidateView.bind(this);
		this.handleBack = this.handleBack.bind(this);
	}
	componentDidMount() {
		this.getCandidates();
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
		    	console.log('Response came from the server', res.body)
		    	th.setState({
		    		candidates: res.body
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

	render() {
		let th = this;
		return(
			<div>
			{
				!this.state.showCandidate ? 
				<div>
					<h1 style={styles.heading}>Candidate Management</h1>
					<Grid>
						<Row>
							{
								this.state.candidates.map(function(candidate, key) {
									return (
										<Col md={3} key={key}>
											<CandidateCard candidate={candidate} handleCardClick={th.candidateView}/>
										</Col>
									)
								})
							}
						</Row>
					</Grid>
				</div>
				:
				<div>
					<CandidateHome candidate={this.state.displayCandidate} handleBack={this.handleBack}/>
				</div>
			}
			</div>
		)
	}
}