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
			imageURL: '',
			wave: null
		}
		this.getCadet = this.getCadet.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
		this.saveProfilePic = this.saveProfilePic.bind(this);
		this.getProfilePic = this.getProfilePic.bind(this);
		this.getCadetProject = this.getCadetProject.bind(this);
	}
	componentWillMount() {
		this.getCadet();
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
					let wave = res.body.data.Wave;
					let cadet = res.body.data;
					cadet.Wave = cadet.Wave.WaveID;
					th.setState({
		    		cadet: cadet,
						wave: wave
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
					cadet.ProjectName = res.body.projectName;
					cadet.ProjectSkills = res.body.projectSkills;
					cadet.ProjectDescription = res.body.projectDesc;
		    	th.setState({
		    		cadet: cadet
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
		let th = this;
		return(
			<div>
				{
					th.state.cadet != null &&
					th.state.wave != null &&
					<ProfileView
						cadet={this.state.cadet}
						wave={this.state.wave}
						imageURL={this.state.imageURL}
						handleUpdate={this.updateProfile}
						handlePicSave={this.saveProfilePic}
					/>
				}
			</div>
		)
	}
}
