import React from 'react';
import {
	Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Grid, Row, Col} from 'react-flexbox-grid'

const status = [
  <MenuItem key={1} value="Pending" primaryText="Pending" />,
  <MenuItem key={2} value="Completed" primaryText="Completed" />
];

const styles = {
	textCenter: {
		textAlign: 'center',
		marginTop: 10
	},
	fields: {
		marginRight: 10
	}
}

export default class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wave: {},
			session: {},
			SessionBy: '',
			SessionOn: null,
			Status: ''
		}
		this.handleSessionByChange = this.handleSessionByChange.bind(this);
		this.handleSessionOnChange = this.handleSessionOnChange.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleWaveUpdate = this.handleWaveUpdate.bind(this);
	}

	componentWillMount() {
		this.setState({
			wave: this.props.wave,
			session: this.props.session
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			wave: nextProps.wave,
			session: nextProps.session
		})
	}

	handleSessionByChange(event) {
		this.setState({
			SessionBy: event.target.value
		})
	}

	handleSessionOnChange(event, date) {
		this.setState({
			SessionOn: date
		})
		this.handleWaveUpdate();
	}

	handleStatusChange(event, key, val) {
		this.setState({
			Status: val
		})
		this.handleWaveUpdate();
	}

	handleWaveUpdate() {
		let waveObj = this.state.wave;
		let sessions = this.state.session;
		sessions.SessionBy = this.state.SessionBy;
		sessions.SessionOn = this.state.SessionOn;
		sessions.Status = this.state.Status;
		waveObj.Sessions = sessions;
		console.log('Wave Obj', waveObj);
		this.props.handleWaveUpdate(waveObj);
	}

	render() {
		return(
			<Row style={styles.textCenter}>
				<Col md={1}>{this.state.session.Day}</Col>
				<Col md={2}>{this.state.session.Name}</Col>
				<Col md={2}>
					{
        		this.state.session.Skills.length == 0 ?
        		'NA' :
        		this.state.session.Skills
        	}
				</Col>
				<Col md={2} style={styles.fields}>
					<TextField
        		hintText="Who took session ?"
        		value={this.state.SessionBy}
        		onChange={this.handleSessionByChange}
        		onBlur={this.handleWaveUpdate}
			    />
				</Col>
				<Col md={2} style={styles.fields}>
					<DatePicker
			    	hintText="Session On"
			    	value={this.state.SessionOn}
			    	onChange={this.handleSessionOnChange}
			    />
				</Col>
				<Col md={2} style={styles.fields}>
					<SelectField
        		hintText="What's the status?"
        		value={this.state.Status}
        		onChange={this.handleStatusChange}
        	>
        		{status}
        	</SelectField>
				</Col>
			</Row>
		)
	}
}