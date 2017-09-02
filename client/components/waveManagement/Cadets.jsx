import React from 'react';
import Avatar from 'material-ui/Avatar';
import Request from 'superagent';
import {Link} from 'react-router';

const styles = {
	profilePic: {
		height: 90,
		width: 90,
		border: '2px solid #202D3E',
		borderRadius: 75,
		textAlign: 'center'
	}
}
export default class CandidateCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageURL: '../../assets/images/avt-default.jpg'
		}
		this.getProfilePic = this.getProfilePic.bind(this);
	}

	componentWillMount() {
		this.getProfilePic(this.props.cadet.EmailID)
	}

	getProfilePic(emailID) {
		let th = this;
		let username = emailID.split("@wipro.com")[0];
		Request
			.get(`/dashboard/getimage`)
			.set({'Authorization': localStorage.getItem('token')})
			.query({filename: username})
			.end(function(err, res) {
				if(err) {
					console.log('Image not found for ', emailID);
				} else {
		    	if(res.text) {
			    	th.setState({
			    		imageURL: res.text
			    	})
		    	}
		    }
			})
	}

	render() {
		return(
			<center><span>
				<br/>
				<img style={styles.profilePic} src={this.state.imageURL} />
				<Link
					to={'/candidate/' + this.props.cadet.EmployeeID}
					target="_blank"
					style={{color: '#333'}}
				>
					<h4>{this.props.cadet.EmployeeName}</h4>
				</Link>
			</span></center>
		);
	}
}
