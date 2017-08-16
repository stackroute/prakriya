import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import WaveDetails from './WaveDetails.jsx';
import GetFeedback from './GetFeedback.jsx';
import NVD3Chart from 'react-nvd3';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const Titems = ['Completed', 'InProgress']
export default class SRAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		    Tvalue: [],
	      activeWaves: [],
	      waves: []

	}
	this.handleTChange = this.handleTChange.bind(this);
	this.getWaves = this.getWaves.bind(this);
}
componentWillMount() {
		 this.getWaves();
 }
 handleTChange(event, key, values) {
		 this.setState({Tvalue: values})
 }

  getWaves() {
		 let th = this;
		 Request.get('/dashboard/waves').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
				 if (err)
						 console.log(err)
				 else {
						 let activeWaves = []
						 console.log(res.body)
						 res.body.map(function(wave, key) {
								 let sdate = new Date(wave.StartDate);
								 let edate = new Date(wave.EndDate);
								 if (sdate < Date.now() && edate > Date.now())
										 activeWaves.push(wave);
								 }
						 )
						 th.setState({activeWaves: activeWaves, waves: res.body})
						 console.log(th.state.activeWaves)
						 console.log(th.state.waves)
				 }
		 })
 }

	render() {
		let th = this;
let Tdata = [
		{
				label: 'Completed',
				value: th.state.waves.length - th.state.activeWaves.length,
				color: "#EE4266"

		}, {
				label: 'InProgress',
				value: th.state.activeWaves.length,
				color: "#008DD5"
		}
]
var Tdatavalue = []
console.log(this.state.Tvalue)
if (this.state.Tvalue != null) {
		this.state.Tvalue.map(function(val, k) {
				for (var i = 0; i < Tdata.length; i++) {
						if (Tdata[i].label === val) {
								console.log(Tdata[i].label)
								Tdatavalue.push(Tdata[i])
						}
				}
		})
}
		return (
			<div>
						<div style = {{width: '45%', float: 'right'}}>
							<SelectField value={this.state.Tvalue} onChange={this.handleTChange} multiple={true} floatingLabelText="Wave Training Status">
								{
									Titems.map(function(item, key) {
										return <MenuItem key={key} value={item} primaryText={item}/>
									})
								}
							</SelectField>
							<NVD3Chart
								id="pieChart" type="pieChart" tooltip={{enabled: true}}
								datum={Tdatavalue} x="label" y="value" height={500} width={500}/>
							</div>
							<br/><br/>
							<WaveDetails /> <br />
							<GetFeedback />

			</div>
		)
	}
}
