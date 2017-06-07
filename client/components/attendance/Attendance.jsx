import React from 'react';
import Request from 'superagent';
import {DateRange} from 'react-date-range';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RejectIcon from 'material-ui/svg-icons/navigation/close';
import ApproveIcon from 'material-ui/svg-icons/navigation/check';
import {red500, green500} from 'material-ui/styles/colors';
import Moment from 'moment';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

const styles = {
  content: {
    marginLeft: '25%'
  }
}

export default class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveType: 'Personal Leave',
      fromDate: '',
      toDate: '',
      stepIndex: 0,
      finished: false,
      reason: '',
      submit: true,
      days: 0,
      cadet: null,
      role: 'candidate',
      cadets: []
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReasonChange = this.handleReasonChange.bind(this);
    this.renderStepActions = this.renderStepActions.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.getCadet = this.getCadet.bind(this);
    this.updateabsentees = this.updateabsentees.bind(this);
    this.getRole = this.getRole.bind(this);
    this.getAbsentees = this.getAbsentees.bind(this);
    this.updateAttendance = this.updateAttendance.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  componentDidMount() {
    this.getRole();
  }

  getRole() {
    let th = this
    Request.get('/dashboard/userrole').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({role: res.body})
        console.log(res.body);
        if (th.state.role === 'candidate') {
          th.getCadet();
        } else {
          th.getAbsentees();
        }
      }
    })
  }

  getAbsentees() {
    let th = this
    Request.get('/dashboard/getabsentees').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({cadets: res.body})
        console.log(res.body);
      }
    })
  }

  getCadet() {
    let th = this;
    Request.get('/dashboard/cadet').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({cadet: res.body})
      }
    })
  }

  updateabsentees() {
    let th = this;
    let fromDate = th.state.fromDate;
    fromDate.setDate(fromDate.getDate() + 1);
    Request.post('/dashboard/updateabsentees').set({'Authorization': localStorage.getItem('token')}).send({
      details: {
        fromDate: th.state.fromDate,
        toDate: th.state.toDate,
        approved: 'no',
        leaveType: th.state.leaveType,
        reason: th.state.reason
      },
      absentee: th.state.cadet.EmployeeID
    }).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log('Successfully updated leave');
      }
    })
  }

  handleSelect(range) {
    let day = range.endDate._d - range.startDate._d;
    day = day / 1000;
    day = Math.floor(day / 86400) + 1;
    this.setState({fromDate: range.startDate._d, toDate: range.endDate._d, days: day})
  }

  handleChange(event, index, value) {
    this.setState({leaveType: value});
  }

  handleReasonChange(event) {
    this.setState({reason: event.target.value, submit: false})
  }

  handleNext() {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2
    });
    if (stepIndex >= 2) {
      this.updateabsentees();
    }
  };

  updateAttendance(id, approval) {
    let th = this;
    Request.post('/dashboard/updateapproval').set({'Authorization': localStorage.getItem('token')}).send({
      id: id,
			approval: approval
    }).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log('Successfully updated leave');
      }
    })
  }

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({
        stepIndex: stepIndex - 1
      });
    }
  };

  formatDate(date) {
    return Moment(date).format("MMM Do YYYY");
  }

  renderStepActions(step) {
    const {stepIndex} = this.state;
    return (
      <div style={{
        margin: '12px 0'
      }}>
        <RaisedButton label={stepIndex === 2
          ? 'Submit'
          : 'Next'} disableTouchRipple={true} disableFocusRipple={true} primary={true} disabled={this.state.submit} onTouchTap={this.handleNext} style={{
          marginRight: 12
        }}/> {step > 0 && (<FlatButton label="Back" disabled={stepIndex === 0} disableTouchRipple={true} disableFocusRipple={true} onTouchTap={this.handlePrev}/>)}
      </div>
    );
  }

  render() {
    let th = this;
    if (this.state.role === 'candidate') {
      const {finished, stepIndex} = this.state;
      return (
        <div style={styles.content}>
          <h1>ATTENDANCE</h1>
          <Stepper activeStep={stepIndex} orientation="vertical">
            <Step>
              <StepLabel>Leave Details and Reason</StepLabel>
              <StepContent>
                <SelectField floatingLabelText="Leave Type" value={this.state.leaveType} onChange={this.handleChange}>
                  <MenuItem value={'Personal Leave'} primaryText="Personal Leave"/>
                  <MenuItem value={'Sick Leave'} primaryText="Sick Leave"/>
                </SelectField>
                <br/>
                <h5>Reason:</h5>
                <TextField hintText="Reason for leave" multiLine={true} value={this.state.reason} onChange={this.handleReasonChange}/> {this.renderStepActions(0)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Select DateRange</StepLabel>
              <StepContent>
                <DateRange onInit={this.handleSelect} onChange={this.handleSelect}/>
                <h3>Number of Days:{this.state.days}</h3>
                {this.renderStepActions(1)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Approval</StepLabel>
              <StepContent>
                <h4>Sure to submit for Approval?</h4>
                {this.renderStepActions(2)}
              </StepContent>
            </Step>
          </Stepper>
          {finished && (
            <p style={{
              margin: '20px 0',
              textAlign: 'center'
            }}>
              Leave submitted wait for Approval
            </p>
          )}
        </div>
      )
    } else {
      let leaveno = 1;
      if (this.state.cadets) {
        return (
          <div>
            <h3>Admin</h3>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Leave No</TableHeaderColumn>
                  <TableHeaderColumn>Cadet Name</TableHeaderColumn>
                  <TableHeaderColumn>Leave Type</TableHeaderColumn>
                  <TableHeaderColumn>From Date</TableHeaderColumn>
                  <TableHeaderColumn>To Date</TableHeaderColumn>
                  <TableHeaderColumn>Reason</TableHeaderColumn>
                  <TableHeaderColumn>Approved</TableHeaderColumn>
                  <TableHeaderColumn>Rejected</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.cadets.map(function(cadets, index) {
                  return (cadets.DaysAbsent.map(function(details, index) {
                    if (details.approved === 'no')
                      return (
                        <TableRow>
                          <TableRowColumn>{leaveno++}</TableRowColumn>
                          <TableRowColumn>{cadets.EmployeeName}</TableRowColumn>
                          <TableRowColumn>{details.leaveType}</TableRowColumn>
                          <TableRowColumn>{th.formatDate(details.fromDate)}</TableRowColumn>
                          <TableRowColumn>{th.formatDate(details.toDate)}</TableRowColumn>
                          <TableRowColumn>{details.reason}</TableRowColumn>
                          <TableRowColumn>
                            <IconButton tooltip="Approve" onClick={th.updateAttendance.bind(th, details._id, 'yes')}>
                              <ApproveIcon color={green500}/>
                            </IconButton>
                          </TableRowColumn>
                          <TableRowColumn>
                            <IconButton tooltip="Reject" onClick={th.updateAttendance.bind(th, details._id, 'no')}>
                              <RejectIcon color={red500}/>
                            </IconButton>
                          </TableRowColumn>
                        </TableRow>
                      )
                  }))
                })}
              </TableBody>
            </Table>
          </div>
        )
      } else { < h3 > No pending leave approvals < /h3>
	}
	}
	}
  }
