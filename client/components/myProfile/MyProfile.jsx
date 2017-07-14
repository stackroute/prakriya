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
		this.getCadetProject = this.getCadetProject.bind(this);
	}
	componentWillMount() {
		this.getProjects();
		this.getCadet();
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
					let projects = res.body.map(function(record) {
							return record._fields[0];
					});
					console.log('Successfully fetched all projects', projects)
		    	th.setState({
		    		projects: projects
		    	})
		    }
			})
	}
	getCadet() {
		let th = this;
		Request
			.get('/dashboard/getwaveofcadet')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	th.setState({
		    		cadet: res.body.data,
						wave: res.body.data.Wave
		    	})
					console.log(res.body.data)
		    	th.getProfilePic(res.body.data.EmployeeID);
					th.getCadetProject(res.body.data.EmployeeID);
		    }
		  })
	}

	getCadetProject(EmpID) {
		let th = this;
		Request
			.post('/dashboard/cadetproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send({empid: EmpID})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
					let cadet = th.state.cadet;
					cadet.projectName = res.body.projectName;
					cadet.projectSkills = res.body.projectSkills;
					cadet.projectDesc = res.body.projectDesc;
		    	th.setState({
		    		cadet: cadet
		    	})
					console.log(cadet)
		    	th.getProfilePic(res.body.data.EmployeeID);
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

	render() {
		return(
			<div>
				Hi
			</div>
		)
	}
}
