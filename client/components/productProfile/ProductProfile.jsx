import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Link} from 'react-router';

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
		marginTop: '1px',
		height: '1px',
		backgroundColor: '#202D3E'
	},
	container: {
		marginLeft: '10%',
		marginRight: '10%'
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

		let cadetSkill = []
		let i = 0

		let cadetList = []
		let j = 0

		let title = '';
		if(th.state.version !== null) {
			if(th.state.version.wave[0] === 'I') {
				title = 'Immersive Wave ' + th.state.version.wave.substring(1);
			} else if(th.state.version.wave[0] === 'O') {
				title = 'Online Immersive Wave ' + th.state.version.wave.substring(1);
			} else if(th.state.version.wave[0] === 'H') {
				title = 'Hybrid Wave ' + th.state.version.wave.substring(1);
			}
		}
		return (
			<div>
				{
					th.state.version != null &&
					<div>
						<div style={{backgroundColor: '#202D3E'}}>
							<br/>
							<br/>
							<br/>
						</div>
						<div style={styles.hr}></div>
						<div style={styles.logo}>{th.props.routeParams.name.toUpperCase().charAt(0)}</div>
					</div>
				}
				{
					th.state.version != null &&
					<div style={{width: '80%', margin: 'auto', border: '2px solid #202D3E'}}>
						<div>
							<h3 style={{textAlign: 'center'}}>
								{th.props.routeParams.name.toUpperCase()}
							</h3>
							<h3 style={{textAlign: 'center'}}>
								<sub>Developed by {title}</sub>
							</h3>
						</div>
						<div style={styles.container}>
							<div>
								<h4>Description</h4>
								<p style={{textIndent: '70px'}}>{th.state.version.description}</p>
							</div>
							<div>
								<h4>Skills</h4>
								{
		              cadetSkill[i] = []
		            }
								{
									th.state.version.skills.map(function(skill, key) {
										if(key % 5 === 0) {
		                  i = i + 1
		                  cadetSkill[i] = []
		                }
		                cadetSkill[i].push(<Col md={2}><li key={key}>{skill}</li></Col>)
									})
								}
								<Grid style = {{marginLeft: '15px'}}>
		            {
		                  cadetSkill.map(function (skills) {
		                    return <Row>{skills}</Row>
		                  })
		            }
		          </Grid>
							</div>
							<div>
								<h4>Contributors ({th.state.version.members.length})</h4>
								<div>
									{
			              cadetList[i] = []
			            }
									{
										th.state.version.members.map(function (member, key) {
											if(key % 4 === 0) {
			                  j = j + 1
			                  cadetList[j] = []
			                }
			                cadetList[j].push(<Col md={2}><Link to={'/candidate/' + member.EmployeeID} target="_blank" style = {{textDecoration: 'none', color: '#202D3E'}}>
										   {key + 1}. {member.EmployeeName}</Link></Col>)
										})
									}
									<Grid style = {{marginLeft: '15px'}}>
			            {
			                  cadetList.map(function (members) {
			                    return <Row>{members}</Row>
			                  })
			            }
			          </Grid>
								</div>
							</div>
							<div>
								{
									th.state.version.gitURL !== null &&
									<h4>Git URL - <a href={th.state.version.gitURL} target="_blank"> {th.state.version.gitURL} </a></h4>
								}
							</div>
							<div>
								{
									th.state.version.videoURL !== undefined &&
									<h4>Video URL - <a href={th.state.version.videoURL} target="_blank"> {th.state.version.videoURL} </a></h4>
								}
							</div>
							<div>
								{
									th.state.version.presentationURL !== undefined &&
									<h4>Presentation URL - <a href={th.state.version.presentationURL} target="_blank"> {th.state.version.presentationURL} </a></h4>
								}
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}
