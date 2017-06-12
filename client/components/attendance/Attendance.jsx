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
import DatePicker from 'material-ui/DatePicker';
import Moment from 'moment';
import EventCalendar from 'react-event-calendar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import BigCalendar from 'react-big-calendar';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  content: {
    marginLeft: '25%'
  },
  row: {
    wordWrap: 'break-word'
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
      cadets: [],
      type: 'no',
      slideIndex: 0,
      result: 'rejected',
			WaveIds: [],
			cadetsOfWave: [],
      WaveID: '',
      Date: '',
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
    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.cancelLeave = this.cancelLeave.bind(this);
		this.getWaveId = this.getWaveId.bind(this);
		this.onWaveIdChange = this.onWaveIdChange.bind(this);
		this.getWaveSpecificCandidates = this.getWaveSpecificCandidates.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.updatePresent = this.updatePresent.bind(this);
    this.handlePresent = this.handlePresent.bind(this);
    this.updateAbsent = this.updateAbsent.bind(this);
  }

  componentWillMount() {
    this.getRole();
  }

  getRole() {
    let th = this
    Request.get('/dashboard/userrole').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({role: res.body})
        if (th.state.role === 'candidate') {
          th.getCadet();
        } else {
          th.getAbsentees();
        }
      }
    })
  }

  updatePresent(EmpID, details) {
    let th = this
    Request.post('/dashboard/present').set({'Authorization': localStorage.getItem('token')}).send({
      EmployeeID: EmpID,
      id: details,
      Date: th.state.Date
    }).end(function(err, res) {
      if (err)
        console.log(err);
      else {
          let cadet = th.state.cadetsOfWave.filter(function(cadet){
            return cadet.EmployeeID === EmpID;
          });
          cadet[0].DaysPresent.push(th.state.Date);
          cadet[0].DaysAbsent = cadet[0].DaysAbsent.filter(function(cadets, key) {
            return details != cadets._id
          })
          th.setState({
            cadet: cadet[0]
          })
        }
    })
  }

  updateAbsent(EmpID, date) {
    let th = this
    let details = {
      fromDate: th.state.Date,
      toDate: th.state.Date,
      approved: 'yes',
      leaveType: 'absent',
      reason: 'absent'
    }
    Request.post('/dashboard/absent').set({'Authorization': localStorage.getItem('token')}).send({
      EmployeeID: EmpID,
      details: details,
      Date: date
    }).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log(th.state.WaveId);
          th.getWaveSpecificCandidates(th.state.WaveId);
        }
    })
  }

	onWaveIdChange(e) {
            this.setState({
                WaveId: e.target.textContent
              })
            this.getWaveSpecificCandidates(e.target.textContent);
  }

	getWaveSpecificCandidates(waveId){
            let th = this;
            let candidateName = [];
            let candidateID = [];
            Request
                .get('/dashboard/wavespecificcandidates?waveID='+waveId)
                .set({'Authorization': localStorage.getItem('token')})
                .end(function(err, res){
									th.setState({
                    cadetsOfWave: res.body.data
                })
                })
            }

  getAbsentees() {
    let th = this
    Request.get('/dashboard/getabsentees').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({cadets: res.body})
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
        th.getCadet();
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

  handleChangeTab(value) {
    if (value == 1) {
      this.setState({slideIndex: value, type: 'rejected', result: 'closed'});
    } else if (value == 0) {
      this.setState({slideIndex: value, type: 'no', result: 'rejected'})
    } else {
      this.setState({slideIndex: value})
      if(this.state.role !== 'candidate')
			this.getWaveId();
    }
  };

	getWaveId() {
            let th = this
            Request
                .get('/dashboard/waveids')
                .set({'Authorization': localStorage.getItem('token')})
                .end(function(err, res){
                th.setState({
                    WaveIds: res.body.waveids
                })
                })
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

  updateAttendance(id, approval, cadet, detailID) {
    let th = this;
    Request.post('/dashboard/updateapproval').set({'Authorization': localStorage.getItem('token')}).send({id: id, approval: approval}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        let cadets = th.state.cadets;
        cadets[cadet].DaysAbsent[detailID].approved = approval;
        th.setState({cadets: cadets})
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

  cancelLeave(index, dateID) {
    let th = this
    Request.post('/dashboard/cancelleave').set({'Authorization': localStorage.getItem('token')}).send({id: dateID}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        let cadet = th.state.cadet;
        cadet.DaysAbsent = th.state.cadet.DaysAbsent.filter(function(cadets, key) {
          return index != key
        })
        th.setState({cadet: cadet})
      }
    })
  }

  handlePresent(EmpID) {
    let th = this
    Request.post('/dashboard/updatepresent').set({'Authorization': localStorage.getItem('token')}).send({
      EmployeeID: EmpID
    }).end(function(err, res) {
      if (err)
        console.log(err);
      else {
          let cadet = th.state.cadet;
          cadet.DaysPresent.push(new Date());
          th.setState({
            cadet: cadet
          })
        }
    })
  }

	handleDateChange(event, date) {
		let startDate = new Date(date);
		this.setState({
			Date: date
		})
	}


  render() {
    let th = this;
    if (this.state.role === 'candidate') {
      const {finished, stepIndex} = this.state;
      if (th.state.cadet != null) {
        let attendance = '';
        let today = this.formatDate(new Date());
        let todayAttendance = false;
        this.state.cadet.DaysPresent.map(function(date) {
          if(today === th.formatDate(date))
            todayAttendance = true;
        })
        this.state.cadet.DaysAbsent.map(function(details){
        if((new Date(details.fromDate)<= new Date()) && (new Date(details.toDate) >= new Date()) )
            attendance = (<h2>You are on leave.Please contact admin for further approval</h2>)
        })
        if(attendance === '') {
        if(todayAttendance) {
          attendance = (<h2>You have marked today's attendance... For updation contact StackRoute Admin</h2>)
        }
        else {
          attendance = (<div>
            <h2>Do you wish to mark today's attendance </h2>
            <FlatButton label="Yes" onTouchTap={this.handlePresent.bind(this, this.state.cadet.EmployeeID)} primary={true}/></div>
          )
        }}
        return (
          <div>
            <h1 style={styles.content}>ATTENDANCE</h1>
            <Tabs onChange={this.handleChangeTab} value={this.state.slideIndex}>
              <Tab label="Apply Leave" value={0}>
                <Stepper activeStep={stepIndex} orientation="vertical" style={styles.content}>
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
                )}</Tab>
              <Tab label="Cancel Leave" value={1}>
                <Table fixedHeader={true}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                      <TableHeaderColumn>From Date</TableHeaderColumn>
                      <TableHeaderColumn>To Date</TableHeaderColumn>
                      <TableHeaderColumn>Reason</TableHeaderColumn>
                      <TableHeaderColumn>Cancel</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {th.state.cadet.DaysAbsent.map(function(dates, index) {
                      if(new Date() < new Date(dates.fromDate)) {
                        if (dates.approved === 'no' || dates.approved === 'rejected' || dates.approved === 'closed')
                        return (
                          <TableRow>
                            <TableRowColumn>{th.formatDate(dates.fromDate)}</TableRowColumn>
                            <TableRowColumn>{th.formatDate(dates.toDate)}</TableRowColumn>
                            <TableRowColumn>{dates.reason}</TableRowColumn>
                            <TableRowColumn>
                              <IconButton tooltip="Cancel" onClick={th.cancelLeave.bind(this, index, dates._id)}>
                                <RejectIcon color={red500}/>
                              </IconButton>
                            </TableRowColumn>
                          </TableRow>
                        )
                      }
                    })
}
                  </TableBody>
                </Table>
              </Tab>
              <Tab label="Mark Attendance" value={2}>
                {attendance}
              </Tab>
            </Tabs>

          </div>
        )
      } else {
        return (
          <h3>Loading...</h3>
        )
      }
    } else {
      let leaveno = 1;
      let rowno = 0;
      let row = 0;
      let cadetsLength = th.state.cadets.length;
			let table = (
				<Table fixedHeader={true}>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn>Leave No</TableHeaderColumn>
							<TableHeaderColumn>Cadet Name</TableHeaderColumn>
							<TableHeaderColumn>Leave Type</TableHeaderColumn>
							<TableHeaderColumn>From Date</TableHeaderColumn>
							<TableHeaderColumn>To Date</TableHeaderColumn>
							<TableHeaderColumn>Reason</TableHeaderColumn>
							<TableHeaderColumn>Approve</TableHeaderColumn>
							<TableHeaderColumn>Reject</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false} showRowHover={true}>
						{this.state.cadets.map(function(cadets, index) {
							return (cadets.DaysAbsent.map(function(details, key) {
								if (details.approved === th.state.type) {
									return (
										<TableRow>
											<TableRowColumn>{leaveno++}</TableRowColumn>
											<TableRowColumn>{cadets.EmployeeName}</TableRowColumn>
											<TableRowColumn>{details.leaveType}</TableRowColumn>
											<TableRowColumn>{th.formatDate(details.fromDate)}</TableRowColumn>
											<TableRowColumn>{th.formatDate(details.toDate)}</TableRowColumn>
											<TableRowColumn style={styles.row}>
												<p title={details.reason}>{details.reason}</p>
											</TableRowColumn>
											<TableRowColumn>
												<IconButton tooltip="Approve" onClick={th.updateAttendance.bind(th, details._id, 'yes', index, key)}>
													<ApproveIcon color={green500}/>
												</IconButton>
											</TableRowColumn>
											<TableRowColumn>
												<IconButton tooltip="Reject" onClick={th.updateAttendance.bind(th, details._id, th.state.result, index, key)}>
													<RejectIcon color={red500}/>
												</IconButton>
											</TableRowColumn>
										</TableRow>
									)
								} else {
									rowno++;
									return false;
								}
							}))
						})}
					</TableBody>
				</Table>
			)
      if (cadetsLength > 0) {
        return (
          <div>
            <Tabs onChange={this.handleChangeTab} value={this.state.slideIndex}>
              <Tab label="Approve Leaves" value={0}> {table}</Tab>
              <Tab label="Rejected Leaves" value={1}> {table}</Tab>
              <Tab label="Update Attendance" value={2}>
              <DatePicker
                hintText="Date to be updated"
                floatingLabelText='Date'
                errorText={this.state.StartDateErrorText}
                value={this.state.Date}
                onChange={this.handleDateChange}
              />
							<SelectField
													onChange={th.onWaveIdChange}
													floatingLabelText="Select WaveID"
													value={th.state.WaveId}
											>
													{
															th.state.WaveIds.map(function(val, key) {
																	return <MenuItem key={key} value={val} primaryText={val} />
															})
													}
								</SelectField>
								<Table fixedHeader={true}>
									<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
										<TableRow>
											<TableHeaderColumn>EmployeeName</TableHeaderColumn>
											<TableHeaderColumn>Present</TableHeaderColumn>
											<TableHeaderColumn>Absent</TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody displayRowCheckbox={false} showRowHover={true}>
										{
											th.state.cadetsOfWave.map(function(cadet, index) {
                        let absent = true;
                        let present = false;
                        let date = '';
                        cadet.DaysAbsent.map(function(details) {
                          console.log((th.formatDate(new Date(details.fromDate))<= th.formatDate(new Date(th.state.Date))) && ((new Date(details.toDate) >= new Date(th.state.Date))|| (th.formatDate(new Date(details.fromDate)) === (th.formatDate(new Date(details.toDate))))))
                        if((th.formatDate(new Date(details.fromDate))<= th.formatDate(new Date(th.state.Date))) && ((new Date(details.toDate) >= new Date(th.state.Date))|| (th.formatDate(new Date(details.fromDate)) === (th.formatDate(new Date(details.toDate))))))
                          {
                             absent = false
                             present = true
                             date = details._id
                             console.log(details);
                          }
                        })
                        cadet.DaysPresent.filter(function(detail) {
                          if(th.formatDate(detail)===th.formatDate(th.state.Date))
                          {
                            present = false
                            absent = true
                            date = detail
                          }
                        })
											return (
												<TableRow>
												<TableRowColumn>
														{cadet.EmployeeName}
												</TableRowColumn>
												<TableRowColumn>
                          <IconButton tooltip="Present" disabled={absent} onClick = {th.updatePresent.bind(this, cadet.EmployeeID, date)}>
                             <ApproveIcon color={green500}/>
                           </IconButton>
												</TableRowColumn>
												<TableRowColumn>
                        <IconButton tooltip="Reject"  disabled={present} onClick = {th.updateAbsent.bind(this, cadet.EmployeeID, date)}>
                          <RejectIcon color={red500}/>
                        </IconButton>
                      	</TableRowColumn>
											</TableRow>
											)
										})
									}
									</TableBody>
									</Table>
							</Tab>
            </Tabs>

          </div>
        )
      } else {
        return ( < h3 > No pending leave approvals < /h3>)
	}
	}
	}
  }
