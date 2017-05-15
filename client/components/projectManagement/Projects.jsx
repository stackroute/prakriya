import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AddProject from './AddProject.jsx';
import ProjectCard from './ProjectCard.jsx';
import Masonry from 'react-masonry-component';

const styles = {
	heading: {
		textAlign: 'center'
	},
	col: {
		marginBottom: 20
	}
}
const backgroundColors = [
	'#F5DEBF',
	'#DDDBF1',
	'#CAF5B3',
	'#C6D8D3'
]
const masonryOptions = {
    transitionDuration: 0
};
 
export default class Projects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: []
		}
		this.getProjects = this.getProjects.bind(this);
		this.addProject = this.addProject.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
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

	handleUpdate(project) {
		let th = this;
		Request
			.post('/dashboard/updateproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send(project)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully updated a project', res.body)
		    	th.getProjects();
		    	}
			})
	}

	handleDelete(project)
	{
		let th = this;
		Request
			.post('/dashboard/deleteproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send(project)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully deleted a project', res.body)
		    	th.getProjects();
		    	}
			})
	}

	render() {
		let th = this;
		return(
			<div>
				<h2 style={styles.heading}>Projects</h2>
				<AddProject addProject={this.addProject}/>
				<Masonry
          className={'my-class'} 
          elementType={'ul'} 
          options={masonryOptions}
          style={{margin: 'auto'}}
        >
          	{
							this.state.projects.map(function (project, key) {
								return (
									<ProjectCard 
										key={key} 
										project={project} 
										handleUpdate={th.handleUpdate} 
										handleDelete={th.handleDelete}
										bgColor={backgroundColors[key%4]}
									/>
								)
							})
						}
				</Masonry>
			</div>
		)
	}
}
