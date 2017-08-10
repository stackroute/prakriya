import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import Request from 'superagent';
import Moment from 'moment';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import WaveProgress from './WaveProgress.jsx';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Cadets from './../waveManagement/Cadets.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';
import dialog from '../../styles/dialog.json';


const styles = {
	container: {
		padding: 20,
		borderRadius: 5,
		backgroundColor: '#C6D8D3'
	},
	progressBar: {
		marginTop: 10,
		marginBottom: 5
	},
	heading: {
		textAlign: 'center'
	},
	wave: {
		marginBottom: 30
	},
  col: {
    marginBottom: 20,
    marginRight: -20,
    width: 150
  },
  grid: {
    width: '100%'
  }
}

export default class WaveDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			waves: [],
			activeWaves: [],
			showDetails: false,
			waveDetail: '',
			onGoingLabel: 'hide details',
			onGoingDiv: 'block',
			open: false,
			acadets:[]
		},
		this.getWaves = this.getWaves.bind(this);
		this.showProgress = this.showProgress.bind(this);
		this.formatDate = this.formatDate.bind(this);
		this.WaveDetails = this.WaveDetails.bind(this);
		this.toggleOnGoing = this.toggleOnGoing.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.getCadetsOfActivewaves = this.getCadetsOfActivewaves.bind(this);

	}
	componentWillMount() {
		this.getWaves();
	}
	getWaves() {
		let th = this;
		Request
			.get('/dashboard/waves')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				if(err)
					console.log(err)
				else {
					let activeWaves = []
					console.log(res.body)
					res.body.map(function(wave, key) {
						let sdate = new Date(wave.StartDate);
						let edate = new Date(wave.EndDate);
						if(sdate < Date.now() && edate > Date.now())
							activeWaves.push(wave);
					})
					th.setState({
						activeWaves: activeWaves
					})
				}
			})
	}

	getCadetsOfActivewaves(wave){
		let th = this;
	 let activewaveid = wave.split("(")[0].trim();
	 let activeCourse = wave.split('(')[1].split(')')[0];
	 console.log(activewaveid)
	 console.log(activeCourse)
        Request
				.post('/dashboard/ActivewaveCadets')
				.set({'Authorization': localStorage.getItem('token')})
				.send({activewaveId: activewaveid,course:activeCourse})
				.end(function(err, res){
					if(err){
						console.log(err);
					}
					else{
						th.handleOpen();
						console.log(res.body);
						th.setState({
							acadets: res.body
						})

					}
				})
				}


	showProgress(waveObj) {
		let sdate = new Date(waveObj.StartDate);
		let edate = new Date(waveObj.EndDate);
		let total = edate - sdate;
		let prog = Date.now() - sdate;
		return Math.round(prog*100/total);
	}
	formatDate(date) {
		return Moment(date).format("MMM Do YYYY");
	}

	WaveDetails(val) {
		let th = this;
		let value = val;
		if(th.state.showDetails) {
			value = ''
		}
		this.setState({
			showDetails: !th.state.showDetails,
			waveDetail: value
		})
	}

	toggleOnGoing() {
		let th = this;
		if(th.state.onGoingDiv === 'block') {
			th.setState({
				onGoingLabel: 'show details',
				onGoingDiv: 'none'
			})
		}
		else {
			th.setState({
				onGoingLabel: 'hide details',
				onGoingDiv: 'block'
			})
		}
	}

handleOpen(){
	this.setState({
		open: true,
		activecadets: true
	})
}
handleClose(){
	this.setState({
		open: false
	})
}
	render() {

		let th = this;

			console.log(th.state.acadets,"acadets")
  let title = 'CADETS'
	if (th.state.acadets.length !== 0) {
		title = ('CADETS - (' + th.state.acadets.length + ')')
	}
		return(
			<Paper style={styles.container}>
				<div style={{float:'right'}}><Toggle
					onToggle={th.toggleOnGoing}
					title={this.state.onGoingLabel}
					defaultToggled={true}
					style={{marginRight: '0px'}}
		    /></div>
				{
					this.state.activeWaves.length > 0 ?
					<h3>On going waves</h3> :
					<h3>No on going waves to show.</h3>
				}
				<div style={{display: th.state.onGoingDiv}}>
				{
					this.state.activeWaves.map(function(wave, key) {
						let progressPercentile = th.showProgress(wave);
						return (
							<div style={styles.wave} key={key}>
								<div style={styles.heading}>{wave.WaveID} ({wave.CourseName}) @ {wave.Location} -- {progressPercentile}%
									<IconButton tooltip="More details" onClick={th.WaveDetails.bind(this, wave.WaveID + ' (' + wave.CourseName + ')')} style={{float:'right'}}>
										{
											th.state.waveDetail === '' &&
											<KeyboardArrowDown/>
										}
										{
											th.state.waveDetail !== '' &&
											th.state.waveDetail === wave.WaveID + ' (' + wave.CourseName + ')' &&
											<KeyboardArrowUp/>
										}
									</IconButton>

									<RaisedButton label="cadets"
									 primary={true} onClick={
									 th.getCadetsOfActivewaves.bind(this, wave.WaveID + ' (' + wave.CourseName + ')')
									 }
										style={{marginLeft:'10px'}}
										/>
										{
											th.state.activecadets &&


<Dialog style={styles.dialog} title={title} open={th.state.open} autoScrollBodyContent={true} onRequestClose={th.handleClose} actionsContainerStyle={dialog.actionsContainer} bodyStyle={dialog.body} titleStyle={dialog.title}>


									{th.state.acadets.length == 0 && <h3 style={{textAlign:'center'}} >No Cadets available</h3>}
									<Grid style={styles.grid}>
										<Row>
											{th.state.acadets.map(function(cadet, index) {
												return (
													<Col xs={3} key={index} style={styles.col}>
														<Cadets cadet={cadet}/>
													</Col>
												)
											})
				}
										</Row>
									</Grid>

									</Dialog>
										}

								</div>

								<LinearProgress
									mode="determinate"
									value={progressPercentile}
									key={key}
									style={styles.progressBar}
								/>
								{th.formatDate(wave.StartDate)}
								<span style={{float: 'right'}}>
									{th.formatDate(wave.EndDate)}
								</span>
								{
									th.state.waveDetail !== '' &&
									th.state.waveDetail === wave.WaveID + ' (' + wave.CourseName + ')' &&
									<WaveProgress
										open = {th.state.showDetails}
										waveDetails = {th.WaveDetails}
										wave = {wave}
									/>
								}
							</div>
						)
					})
				}
				</div>
			</Paper>
		)
	}
}
