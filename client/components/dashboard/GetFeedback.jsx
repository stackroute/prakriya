import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Request from 'superagent';
import Moment from 'moment';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';

const styles = {
	container: {
		padding: 20,
		borderRadius: 5,
		backgroundColor: '#C6D8D3'
	}
}

export default class WaveDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbacks: [],
			waveIDs: [],
			waveID: ''
		};
		this.getWaves = this.getWaves.bind(this);
		this.onIDChange = this.onIDChange.bind(this);
		this.onIDSelect = this.onIDSelect.bind(this);
		this.getFeedbacks = this.getFeedbacks.bind(this);
	}

	componentWillMount() {
		this.getWaves();
	}

	onIDChange(val) {
		let th = this;
		console.log('onIDChange');
		this.setState({
			waveID: val
		})
	}

	onIDSelect(val) {
		let th = this;
		console.log('onIDSelect');
		console.log('ID selected: ', val, this.state.waveID);
		this.getFeedbacks(val);
	}

	getWaves() {
		let th = this;
		Request
			.get('/dashboard/waves')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				if(err)
					console.log('Error in fetching waves: ', err)
				else {
					console.log('All Waves: ', res.body)
					let waveIDs = res.body.map(function(wave) {
						return wave.WaveID
					});
					th.setState({
						waveIDs: waveIDs
					});
				}
			})
	}

	getFeedbacks(waveID) {
		console.log('should get feedbacks for ', waveID);
	}

	render() {
		let th = this;
		return(
			<Paper style={styles.container}>
					<h3>Download Feedbacks</h3>
					<AutoComplete
					      floatingLabelText='Wave ID'
					      filter={AutoComplete.fuzzyFilter}
					      searchText={this.state.waveID}
					      dataSource={this.state.waveIDs}
								onInputUpdate={this.onIDChange}
								onNewRequest={this.onIDSelect}
					      listStyle={{ maxHeight: 80, overflow: 'auto' }}
								style={{padding: '5px'}}
					    />
			</Paper>
		)
	}
}
