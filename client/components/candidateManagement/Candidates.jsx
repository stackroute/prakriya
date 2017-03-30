import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CandidateInfo from './CandidateInfo.jsx';

const styles = {
	heading: {
		textAlign: 'center'
	}
}
export default class Candidates extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			candidates: []
		}
		
		this.getCandidates = this.getCandidates.bind(this);
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

	render() {
		return(
			<div>
				<h1 style={styles.heading}>Candidate Management</h1>
				<Grid>
					<Row>
						{
							this.state.candidates.map(function(candidate, key) {
								return (
									<Col md={3} key={key}>
										<CandidateInfo candidate={candidate} />
									</Col>
								)
							})
						}
					</Row>
				</Grid>
			</div>
		)
	}
}