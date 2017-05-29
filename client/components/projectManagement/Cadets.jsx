import React from 'react';
import Avatar from 'material-ui/Avatar';
import Request from 'superagent';

const styles = {
	profilePic: {
		height: 100,
		width: 100,
		borderRadius: 75,
		border: '5px solid teal'
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

	componentDidMount() {
		this.getProfilePic(this.props.cadet.EmployeeID)
	}

	getProfilePic(eid) {
		let th = this;
		Request
			.get(`/dashboard/getimage?eid=${eid}`)
			.set({'Authorization': localStorage.getItem('token')})
			.query({q: eid})
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
			<span><br/><img style={styles.profilePic} src={this.state.imageURL} />
				<h3>{this.props.cadet.EmployeeName}</h3></span>
			)
	}
}