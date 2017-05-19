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
			imageURL: ''
		}
		this.getProjects = this.getProjects.bind(this);
		this.getCadet = this.getCadet.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
		this.saveProfilePic = this.saveProfilePic.bind(this);
		this.getProfilePic = this.getProfilePic.bind(this);
	}
	componentDidMount() {
		this.getCadet();
		this.getProfilePic();
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
	getProfilePic() {
		let th = this;
		Request
			.get('/dashboard/getimage')
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

	render() {
		return(
			<div>
				{
					this.state.cadet != null &&
					<ProfileView
						cadet={this.state.cadet}
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
