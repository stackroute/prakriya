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
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import Paper from 'material-ui/Paper';

const backgroundColors = [
	'#F5DEBF',
	'#DDDBF1',
	'#CAF5B3',
	'#C6D8D3'
	]

  const styles = {
  	container: {
  		padding: 20,
  		borderRadius: 5,
  		backgroundColor: '#efebe9'
  	}
  }

export default class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CadetEmail: '',
      Cadet: {},
      startDate: '',
      endDate: '',
      pointer: 'pointer',
      Billability: '',
      AssetID: '',
      Skills: []
    }
    this.formatDate = this.formatDate.bind(this);
    this.format = this.format.bind(this);
    this.formatMonth = this.formatMonth.bind(this);
    this.getCadet = this.getCadet.bind(this);
    this.handlePresent = this.handlePresent.bind(this);
    this.getUser = this.getUser.bind(this);
    this.knowSkills = this.knowSkills.bind(this);
  }

  componentWillMount() {
    this.getCadet();
    this.getUser();
    this.knowSkills();
  }

  getCadet() {
    let th = this;
    Request.get('/dashboard/getwaveofcadet').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log(res.body);
        th.setState({
            CadetEmail: res.body.data.EmailID,
            Billability: res.body.data.Billability,
            AssetID: res.body.data.AssetID,
            startDate: res.body.data.Wave.StartDate,
            endDate: res.body.data.Wave.EndDate
          })
      }
    })
  }

  getUser() {
    let th = this;
    Request.get('/dashboard/cadet').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log(res.body);
        th.setState({
            Cadet: res.body
          })
      }
    })
  }

  knowSkills() {
    let th = this;
    Request.get('/dashboard/cadetskills').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log(res.body);
        th.setState({
            Skills: res.body
          })
      }
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


  handlePresent(EmailID) {
      let th = this
      Request.post('/dashboard/updatepresent').set({'Authorization': localStorage.getItem('token')}).send({email: EmailID}).end(function(err, res) {
        if (err)
          console.log(err);
        else {
          let cadet = th.state.Cadet;
          cadet.DaysPresent.push(new Date());
          th.setState({Cadet: cadet})
        }
      })
  }


  render() {
    let th = this;
    let week = [];
    let dayName = [];
    let name = [];
    console.log(this.state.Cadet)
    if (th.state.startDate != '') {
      let now = Moment(th.state.endDate);
      let daysOfYear = [];
      let day = new Date(th.state.startDate).getDay();
      dayName = [ <TableHeaderColumn style={{width: '5px'}}><b style={{fontSize:'17px', marginLeft:'-5px'}} disabled='true'>S</b></TableHeaderColumn>,
              <TableHeaderColumn style={{width: '5px'}}><b style={{fontSize:'20px'}}>M</b></TableHeaderColumn>,
              <TableHeaderColumn style={{width: '5px'}}><b style={{fontSize:'20px'}}>T</b></TableHeaderColumn>,
              <TableHeaderColumn style={{width: '5px'}}><b style={{fontSize:'20px'}}>W</b></TableHeaderColumn>, <TableHeaderColumn style={{width: '5px'}}><b style={{fontSize:'20px'}}>T</b></TableHeaderColumn>,
              <TableHeaderColumn style={{width: '5px'}}><b style={{fontSize:'20px'}}>F</b></TableHeaderColumn>, <TableHeaderColumn style={{width: '20px'}}><b style={{fontSize:'17px'}}>S</b></TableHeaderColumn>]
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
      for (let d = Moment(th.state.startDate); d <= now; d.add('days',1)) {
        let color = 'white';
        if(th.state.Cadet != undefined) {
        th.state.Cadet.DaysPresent.map(function(date){
            if(th.format(date) === th.format(d)) {
              color = '#ccff99'
            }
        })
        this.state.Cadet.DaysAbsent.map(function(details) {
          if ((new Date(details.fromDate) <= new Date(d)) && (new Date(details.toDate) >= new Date(d))) {
            color = '#f4b2ad';
          }
        })
        }
        if((new Date(d).getDay() === 0 || new Date(d).getDay() === 6) && color === 'white')
        {
          color = '#F5F5F5'
        }
        if(daysOfYear.length === 0)
        {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px', width:'5px'}}><sup style={{marginLeft:'-25px'}}>{th.formatMonth(d)}</sup>{th.formatDate(d)}</TableRowColumn>);
        }
        else if((th.format(d) === th.format(new Date())) && color === 'white')
        {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px', width:'5px', border: '2px dotted violet'}}><u style={{cursor: 'pointer'}} onClick={this.handlePresent.bind(this, this.state.Cadet.email)}>{th.formatDate(d)}</u></TableRowColumn>);
        }
        else if(th.formatDate(d) == "01")
        {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px', width:'5px'}}><sup style={{marginLeft:'-25px'}}>{th.formatMonth(d)}</sup>{th.formatDate(d)}</TableRowColumn>);
        }
        else {
            daysOfYear.push(<TableRowColumn style={{backgroundColor:color,fontSize:'17px', width:'5px'}}>{th.formatDate(d)}</TableRowColumn>);
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
    let date = new Date(this.state.endDate) >= new Date();
    let colspan = 12
    if(date) {
      colspan = 6
    }
    return (
      <div>
        <Grid>
          <Row>
            {date && <Col md={colspan}>
        <h3>Attendance:- </h3><p>( Click on today's date to mark attendance for today...<br/>&nbsp;&nbsp;For further updation contact SRAdmin )</p>
        <Table fixedHeader={true} height='300px'>
          <TableHeader colspan='12' displaySelectAll={false} adjustForCheckbox={false} style={{backgroundColor:'#EFEBE9'}}>
            <TableRow>
              {name}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {week}
          </TableBody>
        </Table>
      </Col>}
      <Col md={colspan}>
        <br/><br/><br/><br/><br/><br/>
        <Paper style={styles.container}>
          <p><b>Billability:</b>
          {
            this.state.Billability.split('since').length > 1 &&
              <span> since {this.format(this.state.Billability.split('since')[1])}</span>
          }
          </p>
        <p><b>AssetID:</b> {this.state.AssetID}</p></Paper>
        <br/>
        <Paper style={styles.container}>
        <h3>Skills Known:</h3>
        <p>{this.state.Skills.map(function(skill, key) {
          return <Avatar size='75' backgroundColor={backgroundColors[key%4]} color='black' style={{marginLeft:'20px'}}>
            <span style={{fontSize:'17px'}}>{skill}</span>
          </Avatar>
        })}</p></Paper>
      </Col>
    </Row>
  </Grid>
      </div>
    )
  }
}
