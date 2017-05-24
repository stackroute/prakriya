import React from 'react';
import Request from 'superagent';
import WaveCard from './WaveCard.jsx';
import Masonry from 'react-masonry-component';

const styles = {
	heading: {
		textAlign: 'center'
	}
}
const masonryOptions = {
    transitionDuration: 0
};

export default class Waves extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			waves : []
		}
		this.getWaves = this.getWaves.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		}

	componentDidMount() {
		this.getWaves();
	}

	getWaves() {
		let th = this;
		Request
			.get('/dashboard/waves')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all waves', res.body)
		    	th.setState({
		    		waves: res.body
		    	})
		    }
			})
	}

	handleUpdate(project) {
		// let th = this;
		// Request
		// 	.post('/dashboard/updateproject')
		// 	.set({'Authorization': localStorage.getItem('token')})
		// 	.send(project)
		// 	.end(function(err, res) {
		// 		if(err)
		//     	console.log(err);
		//     else {
		//     	console.log('Successfully updated a project', res.body)
		//     	th.getProjects();
		//     	}
		// 	})
		console.log('handle update');
	}

	handleDelete(wave)
	{
		let th = this;
		Request
			.post('/dashboard/deletewave')
			.set({'Authorization': localStorage.getItem('token')})
			.send({wave:wave})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully deleted a wave', res.body)
		    		th.getWaves();
		    	}
			})
		console.log('handle delete');
	}


	render() {
		let th = this;
		return (
			<div>
				<div>
					<h2 style={styles.heading}>Wave Management</h2>
					<Masonry
          className={'my-class'} 
          elementType={'ul'} 
          options={masonryOptions}
          style={{margin: 'auto'}}
        	>
          	{
							this.state.waves.map(function (wave, key) {
								return (
									<WaveCard 
										key={key} 
										wave={wave} 
										handleUpdate={th.handleUpdate} 
										handleDelete={th.handleDelete}
									/>
								)
							})
						}
				</Masonry>
				</div>
			</div>
		)
	}
}