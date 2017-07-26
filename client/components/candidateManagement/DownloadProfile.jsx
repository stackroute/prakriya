import React from 'react';
import jsPDF from 'jspdf';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import Request from 'superagent';

let imageURL = '';

export default class DownloadProfile extends React.Component {
	constructor(props) {
		super(props);
		this.downloadProfile = this.downloadProfile.bind(this);
		this.downloadCandidateProfile = this.downloadCandidateProfile.bind(this);
		this.getProfilePic = this.getProfilePic.bind(this);
	}

	downloadCandidateProfile() {
		let th = this;
		if(this.props.zip) {
			let candidate = this.props.candidate;
			candidate.map(function (cadet, index) {
				th.getProfilePic(cadet.EmployeeID, cadet, index);
			})
		}
		else {
			let candidate = this.props.candidate;
			imageURL = this.props.imageURL;
			this.downloadProfile(candidate, 0);
		}
	}

	getProfilePic(eid, cadet, index) {
		let th = this;
		Request
			.get(`/dashboard/getimage?eid=${eid}`)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err) {
		    	console.log('Image not found for ', eid);
					imageURL = '../../assets/images/avt-default.jpg';
					th.downloadProfile(cadet, index);
				}
		    else {
		    	if(res.text) {
		    		imageURL = res.text;
						th.downloadProfile(cadet, index);
		    	}
		    }
			})
	}

	downloadProfile(candidate, index) {

		let doc = new jsPDF()
		let x = 95;
		let y = 20;

		doc.setFillColor(85, 85, 85);
		doc.setDrawColor(100, 100, 0);
		doc.setLineWidth(1);
		doc.rect(20, 20, 170, 15, 'F');

		doc.setFontSize(18);
		doc.setTextColor(255, 255, 255);
		doc.text(x+15, y+=10, candidate.EmployeeName, 'center')

		y+=10;

		var img = new Image();
		img.src = imageURL;
	  doc.addImage(img, 'jpeg', 20, y, 60, 70);
		console.log(candidate.EmployeeID)

		doc.setFontSize(12);
		doc.setTextColor(0, 0, 0);
		doc.text(x, y+=10, 'Employee ID: ' + candidate.EmployeeID+'')
		doc.text(x, y+=10, 'Email: ' + candidate.EmailID)
		doc.text(x, y+=10, 'Band: ' + candidate.CareerBand)
		doc.text(x, y+=10, 'Wave: ' + candidate.Wave)
		doc.text(x, y+=10, 'Experience: ' + candidate.WorkExperience)
		doc.text(x, y+=10, 'Digithon Score: ' + candidate.DigiThonScore+'')
		doc.text(x, y+=10, 'Project Name: ' + candidate.ProjectName+'')
		doc.text(x, y+=10, 'Project Description: ' + candidate.ProjectDescription+'')
		doc.text(x, y+=10, 'Project Skills: ' + candidate.ProjectSkills+'')
		if(this.props.role === 'wiproadmin') {
			doc.text(x, y+=10, 'Billability: ' + candidate.Billability+'')
		}
		doc.save(candidate.EmployeeID + '.pdf');
	}

	render() {
			return(
				<DownloadIcon style={this.props.style} color={this.props.color}
					onClick={this.downloadCandidateProfile}/>
			)
		}
}
