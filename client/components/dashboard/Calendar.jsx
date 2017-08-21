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
import HorizontalTimeline from 'react-horizontal-timeline';
import Toggle from 'material-ui/Toggle';

const backgroundColors = [
	'#F5DEBF',
	'#DDDBF1',
	'#CAF5B3',
  '#efebe9'
	]

  const styles = {
  	container: {
  		padding: 20,
  		borderRadius: 5,
  		backgroundColor: '#C6D8D3'
  	}
  }

let VALUES = []

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
      Skills: [],
      Wave: '',
      Course: '',
      value: 0,
      previous: 0,
      Assignments: [],
      Schedule: [],
      minEventPadding: 20,
      maxEventPadding: 120,
      linePadding: 100,
      labelWidth: 100,
      fillingMotionStiffness: 150,
      fillingMotionDamping: 25,
      slidingMotionStiffness: 150,
      slidingMotionDamping: 25,
      stylesBackground: '#f8f8f8',
      stylesForeground: '#7b9d6f',
      stylesOutline: '',
      isTouchEnabled: true,
      isKeyboardEnabled: true,
      onCalendarDiv: 'none',
      onCalendarLabel: 'show details',
			onSkillLabel: 'show details',
			onSkillDiv: 'none',
      onTimelineLabel: 'show details',
			onTimelineDiv: 'none'
    }
    this.formatDate = this.formatDate.bind(this);
    this.format = this.format.bind(this);
    this.formatMonth = this.formatMonth.bind(this);
    this.getCadet = this.getCadet.bind(this);
    this.handlePresent = this.handlePresent.bind(this);
    this.getUser = this.getUser.bind(this);
    this.knowSkills = this.knowSkills.bind(this);
    this.formatProgress = this.formatProgress.bind(this);
    this.fetchAssessments = this.fetchAssessments.bind(this);
    this.fetchSessions = this.fetchSessions.bind(this);
    this.toggleSkill = this.toggleSkill.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.toggleTimeline = this.toggleTimeline.bind(this);
  }

  componentWillMount() {
    this.getCadet();
    this.getUser();
    this.knowSkills();
  }

  getCadet() {
    let th = this;
    let value = 0;
    Request.get('/dashboard/getwaveofcadet').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        VALUES = [];
        for (let d = Moment(new Date(parseInt(res.body.data.Wave.StartDate, 10))); d <= Moment(new Date(parseInt(res.body.data.Wave.EndDate, 10))); d.add('days', 7)) {
          VALUES.push(th.formatProgress(d));
        }
        VALUES.map(function (date, key) {
          if(key !== VALUES.length - 1) {
            if(new Date(date) <= new Date() && new Date(VALUES[key + 1]) > new Date()) {
              value = key;
            }
          }
        })
        th.setState({
            CadetEmail: res.body.data.EmailID,
            Billability: res.body.data.Billability,
            AssetID: res.body.data.AssetID,
            startDate: new Date(parseInt(res.body.data.Wave.StartDate, 10)),
            endDate: new Date(parseInt(res.body.data.Wave.EndDate, 10)),
            Wave: res.body.data.Wave.WaveID,
            Course: res.body.data.Wave.CourseName,
            value: value
          })

        th.fetchAssessments();
        th.fetchSessions();
      }
    })
  }


  fetchAssessments() {
      let th = this
      let wave = th.state.Wave;
      let course = th.state.Course;
      Request.get(`/dashboard/assessment?waveid=${wave}&course=${course}`).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
        th.setState({Assignments: res.body.data})
      })
  }

  fetchSessions() {
    let th = this
    let wave = th.state.Wave;
    let course = th.state.Course;
    Request.get(`/dashboard/waveobject/${wave}/${course}`).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({Schedule: res.body.waveObject.result, open: th.props.open})
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

  formatProgress(date) {
    return Moment(date).format("YYYY-MM-DD");
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

  toggleCalendar() {
		let th = this;
		if(th.state.onCalendarDiv === 'block') {
			th.setState({
				onCalendarLabel: 'show details',
				onCalendarDiv: 'none'
			})
		}
		else {
			th.setState({
				onCalendarLabel: 'hide details',
				onCalendarDiv: 'block'
			})
		}
	}

    toggleSkill() {
  		let th = this;
  		if(th.state.onSkillDiv === 'block') {
  			th.setState({
  				onSkillLabel: 'show details',
  				onSkillDiv: 'none'
  			})
  		}
  		else {
  			th.setState({
  				onSkillLabel: 'hide details',
  				onSkillDiv: 'block'
  			})
  		}
  	}

    toggleTimeline() {
  		let th = this;
  		if(th.state.onTimelineDiv === 'block') {
  			th.setState({
  				onTimelineLabel: 'show details',
  				onTimelineDiv: 'none'
  			})
  		}
  		else {
  			th.setState({
  				onTimelineLabel: 'hide details',
  				onTimelineDiv: 'block'
  			})
  		}
  	}

  render() {
    let th = this;
    let week = [];
    let dayName = [];
    let name = [];
    let timelineSpan = 12;
    console.log(VALUES)
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
    let colspan1 = 12;
    let colspan2 = 12;
    if(date) {
      colspan1 = 7
      colspan2 = 5
    }
    if(th.state.onCalendarDiv === 'none' && th.state.onSkillDiv === 'none') {
      colspan1 = 12;
      colspan2 = 12;
    }
    let assignment = 0;
    let session = 0;
    return (
      <div>
        <Grid>
          <Row>
            {date && <Col md={colspan1}>
              <Paper style={styles.container}>
                <div style={{float:'right'}}><Toggle
        					onToggle={th.toggleCalendar}
        					title={this.state.onCalendarLabel}
        					style={{marginRight: '0px'}}
        		    /></div>
              <h3>Attendance:- </h3><div style={{display:this.state.onCalendarDiv}}><p>( Click on today's date to mark attendance for today...<br/>&nbsp;&nbsp;For further updation contact SRAdmin )</p>
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
              </div>
            </Paper>
            </Col>}
      <Col md={colspan2}>
        {colspan2 === 12 && <br/>}
        <Paper style={styles.container}>
          <p><b>Billability:</b>
          {
            this.state.Billability.split('since').length > 1 &&
              <span>{this.state.Billability.split('since')[0]} since {this.format(this.state.Billability.split('since')[1])}</span>
          }
          </p>
        <p><b>AssetID:</b> {this.state.AssetID}</p></Paper>
        <br/>
        <Paper style={styles.container}>
          <div style={{float:'right'}}><Toggle
            onToggle={th.toggleSkill}
            title={this.state.onSkillsLabel}
            style={{marginRight: '0px'}}
          /></div><h3>Skills Known:</h3>
        <div style={{display:this.state.onSkillDiv}}>{this.state.Skills.map(function(skill, key) {
          return <Avatar size='75' backgroundColor={backgroundColors[key%4]} color='black' style={{marginLeft:'20px'}}>
            <span style={{fontSize:'17px'}}>{skill}</span>
          </Avatar>
        })}</div></Paper>
      </Col>
    </Row>
    <Row>
      <Col md={timelineSpan}>
        <br/>
        <Paper style={styles.container}>
          <div style={{float:'right'}}><Toggle
            onToggle={th.toggleTimeline}
            title={this.state.onTimelineLabel}
            style={{marginRight: '0px'}}
          /></div>
          <h3>Wave Details</h3>
          <div style={{display:this.state.onTimelineDiv}}>
        <div style={{width: '100%', height: '100px', margin: '0 auto'}}>
          <HorizontalTimeline
          index = {this.state.value}
          indexClick={(index) => {
            assignment = 0;
            session = 0;
            this.setState({value: index, previous: this.state.value});
          }}
          values={ VALUES }
          isOpenEnding= 'true'
          isOpenBeginning= 'true'
          labelWidth={th.state.labelWidth}
          linePadding={th.state.linePadding}
          maxEventPadding={th.state.maxEventPadding}
          minEventPadding={th.state.minEventPadding}
          slidingMotion={{ stiffness: th.state.slidingMotionStiffness, damping: th.state.slidingMotionDamping }}
          styles={{
            background: th.state.stylesBackground,
            foreground: th.state.stylesForeground,
            outline: th.state.stylesOutline
          }}
          isOpenEnding={th.state.isOpenEnding}
          isOpenBeginning={th.state.isOpenBeginning} />
        </div>
      <div className='text-center'>
        <h3>Week {this.state.value + 1}</h3>
        <b>Assignments</b>
        <ul>
          {
              th.state.Assignments.map(function (assg) {
                if(assg.Week.low === (th.state.value + 1)) {
                  assignment = assignment + 1;
                  return <li>{assg.Name}</li>
                }
              })
            }
            {
                assignment === 0 && <li>No Assignments for the week</li>
            }
        </ul>
        <b>Sessions</b>
        <ul>
          {
            th.state.Schedule.map(function (sess) {
              let week = (parseInt(sess.Day.low / 7));
              if((th.state.value) <= week && week < (th.state.value + 1)) {
                session = session + 1;
                if(sess.Status) {
                    return <li>{sess.Name} - {sess.Status}</li>
                }
                return <li>{sess.Name} - Yet to start</li>
              }
            })
          }
          {
              session === 0 && <li>No Sessions scheduled for the week</li>
          }
        </ul>
      </div>
    </div>
    </Paper>
      </Col>
    </Row>
  </Grid>
      </div>
    )
  }
}
