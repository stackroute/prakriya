import React from 'react';
import jsPDF from 'jspdf';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import {lightBlack} from 'material-ui/styles/colors';

export default class DownloadProfile extends React.Component {
	constructor(props) {
		super(props);
		this.downloadProfile = this.downloadProfile.bind(this);
	}
	componentWillMount() {
		this.setState({
			imageURL: this.props.imageURL
		})
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			imageURL: nextProps.imageURL
		})
	}

	downloadProfile() {
		let doc = new jsPDF()
		let x = 95;
		let y = 20;

		doc.setFillColor(85, 85, 85);
		doc.setDrawColor(100, 100, 0);
		doc.setLineWidth(1);
		doc.rect(20, 20, 170, 15, 'F');

		doc.setFontSize(18);
		doc.setTextColor(255, 255, 255);
		doc.text(x+15, y+=10, this.props.candidate.EmployeeName, 'center')

		y+=10;

		var img = new Image();
		img.src = this.props.imageURL;
	  doc.addImage(img, 'jpeg', 20, y, 60, 70);

		doc.setFontSize(12);
		doc.setTextColor(0, 0, 0);
		doc.text(x, y+=10, 'Employee ID: ' + this.props.candidate.EmployeeID+'')
		doc.text(x, y+=10, 'Email: ' + this.props.candidate.EmailID)
		doc.text(x, y+=10, 'Band: ' + this.props.candidate.CareerBand)
		doc.text(x, y+=10, 'Wave: ' + this.props.candidate.Wave)
		doc.text(x, y+=10, 'Experience: ' + this.props.candidate.WorkExperience)
		doc.text(x, y+=10, 'Digithon Score: ' + this.props.candidate.DigiThonScore+'')
		doc.text(x, y+=10, 'Project Name: ' + this.props.candidate.ProjectName+'')
		doc.text(x, y+=10, 'Project Description: ' + this.props.candidate.ProjectDescription+'')
		doc.text(x, y+=10, 'Project Skills: ' + this.props.candidate.ProjectSkills+'')

		doc.save(this.props.candidate.EmployeeID + '.pdf')
	}

	render() {
		return(
			<DownloadIcon style={this.props.style} color={this.props.color} onClick={this.downloadProfile}/>
		)
	}
}
