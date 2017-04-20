import React from 'react';
import Request from 'superagent';
import ProfileView from './ProfileView.jsx';

const styles = {
	heading: {
		textAlign: 'center'
	}
}

export default class MyProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadet: null,
			projects: []
		}
		this.getProjects = this.getProjects.bind(this);
		this.getCadet = this.getCadet.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
	}
	componentDidMount() {
		this.getCadet();
		this.getProjects();
	}
	getProjects() {
		let th = this;
		Request
			.get('/dashboard/projects')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all projects', res.body)
		    	th.setState({
		    		projects: res.body
		    	})
		    }
			})
	}
	getCadet() {
		let th = this;
		Request
			.get('/dashboard/cadet')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		cadet: res.body
		    	})
		    	console.log(th.state.cadet);
		    }
		  })
	}
	updateProfile(cadet) {
		let th = this;
		Request
			.post('/dashboard/updatecadet')
			.set({'Authorization': localStorage.getItem('token')})
			.send(cadet)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCadet();
		    }
			});
	}

	render() {
		return(
			<div>
				{
					this.state.cadet != null &&
					<ProfileView
						cadet={this.state.cadet}
						projects={this.state.projects}
						handleUpdate={this.updateProfile}
					/>
				}
			</div>
		)
	}
}
