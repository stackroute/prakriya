import React from 'react';
import Request from 'superagent';

const styles = {
	logo: {
		width: '50px',
		height: '50px',
		borderRadius: '50%',
		border: '1px solid #F0F8FF',
		fontSize: '30px',
		fontWeight: 'bold',
		backgroundColor: '#202D3E',
		color: '#F0F8FF',
		textAlign: 'center',
		paddingTop: '5px',
		boxSizing: 'border-box',
		margin: 'auto',
		zIndex: '2',
		position: 'relative',
		top: '-25px'
	},
	hr: {
		height: '1px',
		backgroundColor: '#202D3E'
	}
};

export default class ProductProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			version: null
		}

		this.getProductVersion = this.getProductVersion.bind(this);
	}

	componentWillMount() {
		this.getProductVersion();
	}

	getProductVersion() {
		let th = this;
		console.log('Seeking ' + th.props.routeParams.name)
		Request
			.get('/dashboard/projectversion/' + th.props.routeParams.name)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err) {
					console.log(err);
				} else {
					console.log('Version Recieved: ', res.body.version);
					th.setState({version: res.body.version});
		    }
		  });
	}

	render() {
		let th = this;
		return (
			<div style={{padding: '10px'}}>
				{
					th.state.version != null &&
					<div>
						<div>
							<br/>
							<br/>
							<div style={styles.hr}></div>
							<div style={styles.logo}>{th.props.routeParams.name.toUpperCase().charAt(0)}</div>
						</div>
						<div>
							<h3 style={{textAlign: 'center'}}>
								{th.props.routeParams.name.toUpperCase()}
							</h3>
						</div>
						<div>
							<h4>Description</h4>
							<p>{th.state.version.description}</p>
						</div>
						<div>
							<h4>Skills</h4>
							{
								th.state.version.skills.map(function(skill) {
									return (
										<p>{skill}</p>
									)
								})
							}
						</div>
						<div>
							<h4>Contributors</h4>
							<div>
								{
									th.state.version.members.map(function(member) {
										return (
											<p>{member.EmployeeName}</p>
										)
									})
								}
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}
