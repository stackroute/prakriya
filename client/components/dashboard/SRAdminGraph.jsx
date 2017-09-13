import React from 'react';
import NVD3Chart from 'react-nvd3';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import WaveProgress from './WaveProgress.jsx';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';

const styles = {
  container: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#C6D8D3',
		width: '48%',
		float: 'right'
  }
}

export default class SRAdminGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Tvalue: '',
      activeWaves: [],
      waves: [],
			toggle: 'none',
			toggleLabel: 'Show Details'
    }
    this.handleTChange = this.handleTChange.bind(this);
    this.getWaves = this.getWaves.bind(this);
		this.toggleGraph = this.toggleGraph.bind(this);
	}
  componentWillMount() {
    this.getWaves();
  }
  handleTChange(event, key, values) {
    if(values){
    this.setState({Tvalue: values})
  }
  }

	toggleGraph() {
		if(this.state.toggle === 'none') {
			this.setState({
				toggle: 'block',
				toggleLabel: 'Hide Details',
        Tvalue: ''
			})
		}
		else {
			this.setState({
				toggle: 'none',
				toggleLabel: 'Show Details'
			})
		}
	}

  getWaves() {
    let th = this;
    Request.get('/dashboard/wavesDuration').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err)
      else {
        let activeWaves = []
        res.body.map(function(wave, key) {
          let sdate = new Date(parseInt(wave.StartDate, 10));
          let edate = new Date(parseInt(wave.EndDate, 10));
          console.log(sdate, "sadate")
          if (sdate < Date.now() && edate > Date.now())
            activeWaves.push(wave);
          }
        )
        th.setState({activeWaves: activeWaves, waves: res.body})
      }
    })
  }
  render() {

    let sampledata = []
    this.state.activeWaves.map(function(activewave, i) {
      let myobj = {}
      myobj.waveid = activewave.CourseName + '(' + activewave.WaveID + ')';
      let sdate = new Date(parseInt(activewave.StartDate, 10));
      let edate = new Date(parseInt(activewave.EndDate, 10));
      let total = edate - sdate;
      let total1 = total / 1000;
      total1 = Math.floor(total1 / 86400) + 1;
      let prog = Date.now() - sdate;
      let progg = prog / 1000;
      progg = Math.floor(progg / 86400) + 1;
      myobj.value = progg;
      myobj.total = total1;
      myobj.duration = activewave.Duration;
      sampledata.push(myobj);
    })
    let Titems = [];
    for (let i = 0; i < sampledata.length; i++) {
      Titems.push(sampledata[i].waveid)
    }

    let th = this;
    var Tdatavalue = []
    if (this.state.Tvalue != null) {
      for (var i = 0; i < sampledata.length; i++) {
        if (sampledata[i].waveid === this.state.Tvalue) {
          console.log(sampledata[i].waveid)
          Tdatavalue.push(sampledata[i])
        }
      }

    }
    let displayvalue = []
    let myobj = {}
    let myobj1 = {}
    Tdatavalue.map(function(val, i) {
      myobj.label = "Days completed";
      myobj.value = val.value;
      myobj.color = "#008DD5";
      myobj1.label = "Days yet to go";
      myobj1.value = val.total - val.value;
      myobj1.color = "#EE4266";
      displayvalue.push(myobj);
      displayvalue.push(myobj1);
    })
    return (
      <div>
				<Paper style = {styles.container}>
					<h3> Wave progress Graph</h3>
          <Toggle
						onToggle={this.toggleGraph}
						title={this.state.toggleLabel}
						defaultToggled={false}
						style={{marginLeft: '90%', marginTop: '-10%'}}
					/>
          {this.state.toggle === 'block' && <div>
            <SelectField value={this.state.Tvalue} onChange={this.handleTChange} floatingLabelText="Wave Training Status">
              {sampledata.map(function(item, key) {
                return <MenuItem key={key} value={item.waveid} primaryText={item.waveid}/>
              })
}
            </SelectField>
            <NVD3Chart id="pieChart" type="pieChart" tooltip={{
              enabled: true
            }} datum={displayvalue} x="label" y="value" height={500} width={500}/>
					</div>
        }
					</Paper>
      </div>
    )
  }
}
