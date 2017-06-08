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
			projects: [],
			imageURL: '',
			wave: null
		}
		this.getProjects = this.getProjects.bind(this);
		this.getCadet = this.getCadet.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
		this.saveProfilePic = this.saveProfilePic.bind(this);
		this.getProfilePic = this.getProfilePic.bind(this);
		this.getWave = this.getWave.bind(this);
	}
	componentWillMount() {
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
		    	th.getProfilePic(res.body.EmployeeID);
		    	th.getWave(res.body.Wave);
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
	saveProfilePic(picFile) {
		let th = this;
		Request
			.post('/dashboard/saveimage')
			.set({'Authorization': localStorage.getItem('token')})
			.field('cadet', JSON.stringify(this.state.cadet))
			.attach('file', picFile)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let array = new Uint8Array(res.text.length);
	        for (var i = 0; i < res.text.length; i++){
	            array[i] = res.text.charCodeAt(i);
	        }
	        var blob = new Blob([array], {type: 'image/jpeg'});
		    	let blobUrl = URL.createObjectURL(blob);
		    	th.setState({
		    		imageURL: blobUrl
		    	})
		    }
			})
	}
	getProfilePic(eid) {
		let th = this;
		Request
			.get(`/dashboard/getimage?eid=${eid}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	if(res.text) {
		    		let array = new Uint8Array(res.text.length);
		        for (var i = 0; i < res.text.length; i++){
		            array[i] = res.text.charCodeAt(i);
		        }
		        var blob = new Blob([array], {type: 'image/jpeg'});
			    	let blobUrl = URL.createObjectURL(blob);
			    	th.setState({
			    		imageURL: blobUrl
			    	})
		    	}
		    }
			})
	}
	getWave(waveid) {
		let th = this;
		Request
			.get(`/dashboard/wave?waveid=${waveid}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		wave: res.body
		    	})
		    }
		  })
	}

	render() {
		return(
			<div>
				{
					this.state.cadet != null &&
					this.state.wave != null &&
					<ProfileView
						cadet={this.state.cadet}
						wave={this.state.wave}
						projects={this.state.projects}
						imageURL={this.state.imageURL}
						handleUpdate={this.updateProfile}
						handlePicSave={this.saveProfilePic}
					/>
				}
			</div>
		)
	}
}
