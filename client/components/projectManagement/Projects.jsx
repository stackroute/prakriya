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
	'#F5DEBF ',
  '#DDDBF1 ',
  '#CAF5B3 ',
  '#C6D8D3 '
]
const masonryOptions = {
    transitionDuration: 0
}

export default class Projects extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: []
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
    let th = this
		Request
			.get('/dashboard/projects')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err) {
			    console.log(err);
				} else {
					let projects = res.body.map(function(record) {
							return record._fields[0];
					});
		    	th.setState({
		    		projects: projects
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
				if(err) {
					console.log(err);
				} else {
		    	let projects = th.state.projects;
					project.version[0].addedBy = th.props.user.role;
		    	projects.push(project);
		    	th.setState({
		    		projects: projects
		    	})
		    }
			})
	}

	addVersion(version) {
		version.version.addedOn = new Date();
		let th = this;
		Request
			.post('/dashboard/addversion')
			.set({'Authorization': localStorage.getItem('token')})
			.send(version)
			.end(function(err, res) {
				if(err) {
					console.log(err);
				} else {
		    	th.getProjects();
		    }
			})
	}

	handleUpdate(projObj) {
		let th = this;
		console.log(projObj);
		Request
			.post('/dashboard/updateproject')
			.set({'Authorization': localStorage.getItem('token')})
			.send(projObj)
			.end(function(err, res) {
				if(err) {
					console.log(err);
				} else {
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
				if(err) {
					console.log(err);
				} else {
		    	th.getProjects();
		    }
			})
	}

	render() {
		let th = this;
		console.log(th.state.projects);
				return(
			<div>
				<h2 style={styles.heading}>Product Management</h2>
				{
					th.props.user.role === 'mentor' &&
					<ProjectDialog addProject={this.addProject} dialogTitle={'ADD PRODUCT'}/>
				}
				{
					this.state.projects.length > 0 ?
					<Grid><Row md={10}>
						<Masonry
							className={'my-class'}
							elementType={'ul'}
							options={masonryOptions}
							style={styles.masonry}
						>
						{
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
							})
						}
						</Masonry>
					</Row></Grid> :
					<h4 style={{textAlign: 'center', width: '100%'}}>NO PRODUCTS TO DISPLAY</h4>
				}
			</div>
		)
	}
}
