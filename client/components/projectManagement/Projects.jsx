import React from 'react'
import Request from 'superagent'
import {Grid, Row, Col} from 'react-flexbox-grid'
import ProjectDialog from './ProjectDialog.jsx'
import ProjectCard from './ProjectCard.jsx'
import Masonry from 'react-masonry-component'
import {Tabs, Tab} from 'material-ui/Tabs'

const styles = {
	heading: {
		textAlign: 'center'
	},
	col: {
		marginBottom: 20
	},
	tabs: {
		border: '2px solid teal'
	},
	tab: {
		color: '#DDDBF1',
		fontWeight: 'bold'
	},
	inkBar: {
		backgroundColor: '#DDDBF1',
		height: '5px',
		bottom: '5px'
	},
	tabItemContainer: {
		backgroundColor: 'teal'
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
			},
			activeWaves: []
		}
		this.getProjects = this.getProjects.bind(this)
		this.getActiveWaves = this.getActiveWaves.bind(this)
		this.addProject = this.addProject.bind(this)
		this.handleUpdate = this.handleUpdate.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
		this.addVersion = this.addVersion.bind(this)
	}
	componentWillMount() {
		this.getActiveWaves()
		 this.getProjects()

	}

	getActiveWaves() {
		let th = this
		Request
			.get('/dashboard/activewaves')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all active waves')
		    	th.setState({
		    		activeWaves: res.body
		    	})
		    }
			})
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
					console.log('Successfully fetched all projects')
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
				<Grid><Row md={10}><Tabs
					style={styles.tabs}
					tabItemContainerStyle={styles.tabItemContainer}
					inkBarStyle={styles.inkBar}>
					<Tab label='Ongoing Products' style={styles.tab}>
						<Masonry
							className={'my-class'}
							elementType={'ul'}
							options={masonryOptions}
							style={styles.masonry}
						>
								{
									this.state.projects.length > 0 ?
									th.state.projects.map(function (project, key) {
										if(th.state.activeWaves.indexOf(project.wave) >= 0) {
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
										}
									}):
									<span>No projects to display</span>
								}
						</Masonry>
					</Tab>
					<Tab label='Completed Products' style={styles.tab}>
						<Masonry
							className={'my-class'}
							elementType={'ul'}
							options={masonryOptions}
							style={styles.masonry}
						>
								{
									this.state.projects.length > 0 ?
									this.state.projects.map(function (project, key) {
										if(th.state.activeWaves.indexOf(project.wave) < 0) {
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
										}
									}):
									<span>No projects to display</span>
								}
						</Masonry>
					</Tab>
					<Tab label='All Products' style={styles.tab}>
						<Masonry
							className={'my-class'}
							elementType={'ul'}
							options={masonryOptions}
							style={styles.masonry}
						>
								{
									this.state.projects.length > 0 ?
									this.state.projects.map(function (project, key) {
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
						</Masonry>
					</Tab>
				</Tabs></Row></Grid>
			</div>
		)
	}
}
