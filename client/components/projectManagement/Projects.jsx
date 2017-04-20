import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AddProject from './AddProject.jsx';
import ProjectCard from './ProjectCard.jsx';

const styles = {
	heading: {
		textAlign: 'center'
	},
	col: {
		marginBottom: 20
	}
}

export default class Projects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: []
		}
		this.getProjects = this.getProjects.bind(this);
		this.addProject = this.addProject.bind(this);
	}
	componentDidMount() {
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
	addProject(project) {
		let th = this;
		Request
			.post('/dashboard/addproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send(project)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully added a project', res.body)
		    	let projects = th.state.projects;
		    	projects.push(res.body);
		    	th.setState({
		    		projects: projects
		    	})
		    }
			})
	}

	render() {
		let th = this;
		return(
			<div>
				<h2 style={styles.heading}>Projects</h2>
				<AddProject addProject={this.addProject}/>
				<Grid>
					<Row>
						{
							this.state.projects.map(function (project, key) {
								return (
									<Col md={3} key={key} style={styles.col}>
										<ProjectCard project={project}/>
									</Col>
								)
							})
						}
					</Row>
				</Grid>
			</div>
		)
	}
}
