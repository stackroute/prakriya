import React from 'react'
import Request from 'superagent'
import {Grid, Row, Col} from 'react-flexbox-grid'
import ProjectDialog from './ProjectDialog.jsx'
import ProjectCard from './ProjectCard.jsx'
import Masonry from 'react-masonry-component'

const styles = {
	heading: {
		textAlign: 'center'
	},
	col: {
		marginBottom: 20
	},
	masonry: {
		width: '1200px'
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
}

export default class Projects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects:{
				product: " ",
				description: " ",
				version:[]
			}
		}
		this.getProjects = this.getProjects.bind(this)
		this.addProject = this.addProject.bind(this)
		this.handleUpdate = this.handleUpdate.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.addVersion = this.addVersion.bind(this)
	}
	componentWillMount() {
		 this.getProjects()

	}

	getProjects() {
		console.log("inside getproj in proj")
    let th = this
		Request
			.get('/dashboard/projects')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				console.log("success")
				if(err)
		    	console.log(err,"err");
		    else {
					console.log('Successfully fetched all projects -- ', res.body)
		    	th.setState({
		    		projects: res.body
		    	})
		    }
			})
	}
	addProject(project) {
		console.log("addproj n projects",project)
		let th = this;
		Request
			.post('/dashboard/addproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send(project)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully added a project')
		    	let projects = th.state.projects;
		    	projects.push(res.body);
		    	th.setState({
		    		projects: projects
		    	})
		    }
			})
	}

	addVersion(version) {
		let th = this;
		Request
			.post('/dashboard/addversion')
			.set({'Authorization': localStorage.getItem('token')})
			.send(version)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully added a version')
		    	th.getProjects();
		    	}
			})
	}

	handleUpdate(projObj) {
		let th = this;
		Request
			.post('/dashboard/updateproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send(projObj)
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully updated a project')
		    	th.getProjects();
		    	}
			})
	}

	handleDelete(project, type)
	{
		let th = this;
		Request
			.post('/dashboard/deleteproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send({project:project,type:type})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully deleted a project')
		    	th.getProjects();
		    	}
			})
	}

	render() {
		let th = this;
				return(
			<div>
				<h2 style={styles.heading}>Product Management</h2>
				<ProjectDialog addProject={this.addProject} dialogTitle={'ADD PRODUCT'}/>
				<Grid><Row md={10}>
						<Masonry
							className={'my-class'}
							elementType={'ul'}
							options={masonryOptions}
							style={styles.masonry}
						>
								{
									this.state.projects.length > 0 ?
									th.state.projects.map(function (project, key) {
											return (
												<ProjectCard
													key={key}
													project={project}
													handleUpdate={th.handleUpdate}
													handleDelete={th.handleDelete}
													handleAddVersion={th.addVersion}
													bgColor={backgroundColors[key%4]}
												/>
											)
									}):
									<span>No projects to display</span>
								}
						</Masonry></Row></Grid>
			</div>
		)
	}
}
