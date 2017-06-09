import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SaveIcon from 'material-ui/svg-icons/content/save';

const styles = {
	container: {
		marginTop: 10
	},
	radioBtn: {
		display: 'flex', 
		width: 100
	}
}

export default class CadetItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadet: {},
			showDetail: false
		}
		this.handleRemarksChange = this.handleRemarksChange.bind(this);
		this.handleSelectedChange = this.handleSelectedChange.bind(this);
		this.handleRemarksUpdate = this.handleRemarksUpdate.bind(this);
		this.handleShowDetail = this.handleShowDetail.bind(this);
		this.testing = this.testing.bind(this);
	}
	componentWillMount() {
		this.setState({
			cadet: this.props.cadet
		})
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			cadet: nextProps.cadet
		})
	}
	handleRemarksChange(event) {
		let cadet = this.state.cadet;
		cadet.Remarks = event.target.value;
		this.setState({
			cadet: cadet
		})
	}
	handleSelectedChange(event, value) {
		let cadet = this.state.cadet;
		cadet.Selected = value;
		this.setState({
			cadet: cadet
		})
		this.handleRemarksUpdate();
	}
	handleRemarksUpdate() {
		this.props.handleRemarksUpdate(this.state.cadet);
	}
	handleShowDetail() {
		this.setState({
			showDetail: !this.state.showDetail
		})
	}
	testing() {
		console.log('hit the on blur');
	}

	render() {
		let color = this.state.cadet.Selected == 'Yes' ? '#9effa6' : '#ffd1d1'
		if(this.state.cadet.Selected == 'Yes')
			color = '#f0ff93'
		else if(this.state.cadet.Selected == 'DS')
			color = '#9effa6'
		else
			color = '#ffd1d1'
		return(
			<div style={styles.container}>
				<Row style={{display: 'flex', alignItems: 'center', backgroundColor: color}} >
					<Col md={1} mdOffset={1}>
						{this.state.cadet.DigiThonScore}
					</Col>
					<Col md={2}>
						<span
							style={{cursor: 'pointer'}}
							onClick={this.handleShowDetail}
						>
							{this.state.cadet.EmployeeName}
						</span>
					</Col>
					<Col md={4}>
						<TextField
				      floatingLabelText="Provide Remarks"
				      multiLine={true}
				      rows={2}
				      rowsMax={3}
				      fullWidth={true}
				      value={this.state.cadet.Remarks}
				      onChange={this.handleRemarksChange}
				      onBlur={this.handleRemarksUpdate}
				    />
					</Col>
					<Col md={3}>
						<RadioButtonGroup
							name="selected"
							onChange={this.handleSelectedChange}
							valueSelected={this.state.cadet.Selected}
							style={styles.radioBtn}
						>
							<RadioButton
				        value="Yes"
				        label="Yes"
				      />
				      <RadioButton
				        value="No"
				        label="No"
				      />
							<RadioButton
				        value="DS"
				        label="DS"
				      />
						</RadioButtonGroup>
					</Col>
					<Col md={4} mdOffset={2}>
						{
							this.state.showDetail &&
							<div style={{fontSize: 13, marginBottom: 10}}>
								<strong>Cadet ID: </strong>
								{this.state.cadet.EmployeeID}
								<br/>
								<strong>Work Exp: </strong>
								{this.state.cadet.WorkExperience}
							</div>
						}
					</Col>
				</Row>
			</div>
		)
	}
}
