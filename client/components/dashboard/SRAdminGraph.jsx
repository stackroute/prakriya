import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import NVD3Chart from 'react-nvd3';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import WaveProgress from './WaveProgress.jsx';

//const Titems = ['Completed', 'InProgress']
export default class SRAdminGraph extends React.Component {
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
 // showProgress(waveObj) {
 //   let sdate = new Date(waveObj.StartDate);
 //   let edate = new Date(waveObj.EndDate);
 //   let total = edate - sdate;
 //   let prog = Date.now() - sdate;
 //   return Math.round(prog*100/total);
 // }

	render() {

    let sampledata = []
    this.state.activeWaves.map(function(activewave,i){
      console.log(activewave,"activewave")
           let myobj = {}
           myobj.waveid = activewave.CourseName + '(' + activewave.WaveID + ')';
          let sdate = new Date(activewave.StartDate);
       		let edate = new Date(activewave.EndDate);
       		let total = edate - sdate;
       		let prog = Date.now() - sdate;
       		    let progg = Math.round(prog*100/total);
           myobj.value = progg;
           sampledata.push(myobj);

console.log(myobj.waveid,myobj.value)
    })

console.log(sampledata,"myobj");
let Titems = [];
for(let i=0;i<sampledata.length;i++){
  Titems.push(sampledata[i].waveid)
}
console.log(Titems,"titems")


		let th = this;
var Tdatavalue = []
console.log(this.state.Tvalue,"Tvalue")
if (this.state.Tvalue != null) {
				for (var i = 0; i < sampledata.length; i++) {
						if (sampledata[i].waveid === this.state.Tvalue) {
								console.log(sampledata[i].waveid)
								Tdatavalue.push(sampledata[i])
						}
				}

}
console.log(Tdatavalue,"Tdatavalue")
  let displayvalue = []
  let myobj = {}
  let myobj1 = {}
          Tdatavalue.map(function(val,i){

             myobj.label= "completed";
             myobj.value = val.value;
             myobj.color = "#008DD5";
             myobj1.label = "Inprogess";
             myobj1.value = 100-val.value;
             myobj1.color = "#EE4266";
             console.log(myobj,"maaobj")
             console.log(myobj1,"wdbwejhf")
             displayvalue.push(myobj);
             displayvalue.push(myobj1);
          })


          console.log(displayvalue,"displayvalue")
		return (
			<div>
						<div style = {{width: '45%', float: 'right'}}>
							<SelectField value={this.state.Tvalue} onChange={this.handleTChange} floatingLabelText="Wave Training Status">
								{
									sampledata.map(function(item, key) {
										return <MenuItem key={key} value={item.waveid} primaryText={item.waveid}/>
									})
								}
							</SelectField>
							<NVD3Chart
								id="pieChart" type="pieChart" tooltip={{enabled: true}}
								datum={displayvalue} x="label" y="value" height={500} width={500}/>
							</div>


			</div>
		)
	}
}
