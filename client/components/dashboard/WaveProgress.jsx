import React from 'react';
import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Moment from 'moment';
import HorizontalTimeline from 'react-horizontal-timeline';
import Request from 'superagent';

const VALUES = []

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
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
      stylesOutline: '#dfdfdf',
      isTouchEnabled: true,
      isKeyboardEnabled: true
    }
    this.handleClose = this.handleClose.bind(this);
    this.format = this.format.bind(this);
    this.fetchAssessments = this.fetchAssessments.bind(this);
    this.fetchSessions = this.fetchSessions.bind(this);
  }

  componentWillMount() {
    let th = this;
    this.fetchAssessments();
    this.fetchSessions();
    for (let d = Moment(th.props.wave.StartDate); d <= Moment(th.props.wave.EndDate); d.add('days', 7)) {
      VALUES.push(th.format(d));
    }
  }

  fetchAssessments() {
      let th = this
      let wave = th.props.wave.WaveID;
      let course = th.props.wave.CourseName
      Request.get(`/dashboard/assessment?waveid=${wave}&course=${course}`).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
        th.setState({Assignments: res.body.data})
      })
  }

  fetchSessions() {
    let th = this
    let wave = th.props.wave.WaveID;
    let course = th.props.wave.CourseName
    Request.get(`/dashboard/waveobject/${wave}/${course}`).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({Schedule: res.body.waveObject.result, open: th.props.open})
    })
  }

  handleClose = () => {
    this.setState({open: false});
    this.props.waveDetails('');
  };

  format(date) {
    return Moment(date).format("YYYY-MM-DD");
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];
    let th = this;

    let title = 'Detais of ' + this.props.wave.WaveID + '-' +this.props.wave.CourseName;
    let assignment = 0;
    let session = 0;

    return (
      <Dialog
          title={title}
          actions={actions}
          modal={true}
          open={this.state.open}
        >
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
      </Dialog>
    );
  }
}
