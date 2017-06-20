import React from 'react';
import Request from 'superagent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Moment from 'moment';

export default class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waveObject: {},
      WaveIds: [],
      WaveId: '',
      cadetsOfWave: [],
      Cadet: {},
      CadetName: ''
    }
    this.waveDetails = this.waveDetails.bind(this);
    this.onWaveIdChange = this.onWaveIdChange.bind(this);
    this.getWaveId = this.getWaveId.bind(this);
    this.getWaveSpecificCandidates = this.getWaveSpecificCandidates.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.format = this.format.bind(this);
    this.formatMonth = this.formatMonth.bind(this);
    this.onCadetChange = this.onCadetChange.bind(this);
  }

  componentWillMount() {
    this.getWaveId();
  }

  getWaveId() {
    let th = this
    Request.get('/dashboard/waveids').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({WaveIds: res.body.waveids})
    })
  }

  onWaveIdChange(e) {
    this.setState({WaveId: e.target.textContent,Cadet: {}});
    this.waveDetails(e.target.textContent);
    this.getWaveSpecificCandidates(e.target.textContent);
  }

  onCadetChange(e, prop, value) {
    let th = this
    value = value.split('(');
    value = value[1].split(')');
    let cadet = th.state.cadetsOfWave.filter(function(cadet) {
      return cadet.EmployeeID == value[0]
    })
    this.setState({
      Cadet: cadet,
      CadetName: e.target.textContent
    })
  }

  waveDetails(waveid) {
    let th = this;
    Request.get(`/dashboard/waveobject/${waveid}`).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({waveObject: res.body.waveObject})
    })
  }

  getWaveSpecificCandidates(waveId) {
    let th = this;
    let candidateName = [];
    let candidateID = [];
    Request.get('/dashboard/wavespecificcandidates?waveID=' + waveId).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({cadetsOfWave: res.body.data})
    })
  }

  formatMonth(date) {
    return Moment(date).format("MMM");
  }

  formatDate(date) {
    return Moment(date).format("DD")
  }

  format(date) {
    return Moment(date).format("MMM Do YYYY");
  }

  render() {
    let th = this;
    let week = [];
    let dayName = [];
    let name = [];
    if (th.state.waveObject != null) {
      let now = Moment(th.state.waveObject.EndDate);
      let daysOfYear = [];
      let day = new Date(th.state.waveObject.StartDate).getDay();
      dayName = [ <TableHeaderColumn><b style={{fontSize:'20px'}}  disabled='true'>Sunday</b></TableHeaderColumn>,
              <TableHeaderColumn><b style={{fontSize:'20px'}}>Monday</b></TableHeaderColumn>,
              <TableHeaderColumn><b style={{fontSize:'20px'}}>Tuesday</b></TableHeaderColumn>,
              <TableHeaderColumn><b style={{fontSize:'20px'}}>Wednesday</b></TableHeaderColumn>, <TableHeaderColumn><b style={{fontSize:'20px'}}>Thursday</b></TableHeaderColumn>,
              <TableHeaderColumn><b style={{fontSize:'20px'}}>Friday</b></TableHeaderColumn>, <TableHeaderColumn><b style={{fontSize:'20px'}}>Saturday</b></TableHeaderColumn>]
              name = []
      for( let i = day; name.length < dayName.length;) {
        if(i === 6)
        {
          name.push(dayName[i]);
          i=0;
        }
        else {
          name.push(dayName[i]);
          i++;
        }
      }
      for (let d = Moment(th.state.waveObject.StartDate); d <= now; d.add('days',1)) {
        let color = 'white';
        if(th.state.Cadet[0] != undefined) {
        th.state.Cadet[0].DaysPresent.map(function(date){
            if(th.format(date) === th.format(d)) {
              color = '#ccff99'
            }
        })
        this.state.Cadet[0].DaysAbsent.map(function(details) {
          if ((new Date(details.fromDate) <= new Date(d)) && (new Date(details.toDate) >= new Date(d))) {
            color = '#f4b2ad';
          }
        })
        }
        if(new Date(d).getDay() === 0 || new Date(d).getDay() === 6 )
        {
          color = '#F5F5F5'
        }
        if(daysOfYear.length === 0)
        {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px'}}><sup>{th.formatMonth(d)}</sup>{th.formatDate(d)}</TableRowColumn>);
        }
        else if(th.formatDate(d) == "01")
        {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px'}}><sup>{th.formatMonth(d)}</sup>{th.formatDate(d)}</TableRowColumn>);
        }
        else {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px'}}>{th.formatDate(d)}</TableRowColumn>);
        }
      }
      for (let j = 0; j < ((daysOfYear.length / 7) + 1); j++) {
        week.push(
          <TableRow>
            {daysOfYear.filter(function(date, index) {
              return (index < (7 * (j + 1)) && index >= (7 * j));
            })
}
          </TableRow>
        )
      }
    }
    return (
      <div>
        <SelectField onChange={th.onWaveIdChange} floatingLabelText="Select WaveID" value={th.state.WaveId}>
          {th.state.WaveIds.map(function(val, key) {
            return <MenuItem key={key} value={val} primaryText={val}/>
          })
}
        </SelectField>
        &nbsp;&nbsp;
        <SelectField onChange={th.onCadetChange} floatingLabelText="Select Cadet" value={th.state.CadetName}>
          {th.state.cadetsOfWave.map(function(val, key) {
            return <MenuItem key={key} value={val.EmployeeName + "("+val.EmployeeID+")"} primaryText={val.EmployeeName + "("+val.EmployeeID+")"}/>
          })
}
        </SelectField>
        <Table fixedHeader={true} height='300px'>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{backgroundColor:'#EFEBE9'}}>
            <TableRow>
              {name}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {week}
          </TableBody>
        </Table>
      </div>
    )
  }
}
