import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import app from '../../styles/app.json';
import select from '../../styles/select.json';
import dialog from '../../styles/dialog.json';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';

const styles = {
  dialog: {
    backgroundColor: '#DDDBF1',
    borderBottom: '10px solid teal',
    borderRight: '10px solid teal',
    borderLeft: '10px solid teal'
  },
  deleteDialog: {
    backgroundColor: '#DDDBF1',
    border: '10px solid teal'
  },
  dialogTitle: {
    fontWeight: 'bold',
    backgroundColor: 'teal',
    color: '#DDDBF1',
    textAlign: 'center'
  },
  actionsContainer: {
    backgroundColor: 'teal',
    borderTop: '0px',
    marginTop: '0px'
  },
  actionButton: {
    backgroundColor: '#DDDBF1',
    width: '50%',
    color: 'teal',
    border: '1px solid teal',
    height: '100%'
  },
  link: {
      wordWrap: 'break-word'
  },
  paper: {
    margin: '5px',
    padding: '5px',
    width: 'auto',
    height: '120px',
    borderRadius: '2px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: '4px',
    background: '#eee'
  }
}

export default class CourseCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      openDialog: false,
      type: 'Assignment',
      Name: '',
      NameErrorText: '',
      Description: '',
      DescriptionErrorText: '',
      Skills: [],
      SkillErrorText: '',
      Week: '',
      WeekErrorText: '',
      Duration: '',
      DurationErrorText: '',
      searchPerm: '',
      Day: '',
      DayErrorText: ''
		}
  this.handleClose = this.handleClose.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.onChangeType = this.onChangeType.bind(this);
  this.resetFields = this.resetFields.bind(this);
  this.validationSuccess = this.validationSuccess.bind(this);
  this.onChangeName = this.onChangeName.bind(this);
  this.onChangeDescription = this.onChangeDescription.bind(this);
  this.onChangeDuration = this.onChangeDuration.bind(this);
  this.onChangeWeek = this.onChangeWeek.bind(this);
  this.onChangeDay = this.onChangeDay.bind(this);
  this.handleUpdateInputPerm = this.handleUpdateInputPerm.bind(this);
  this.handleAddNewPerm = this.handleAddNewPerm.bind(this);
  this.handleSkillDelete = this.handleSkillDelete.bind(this);
	}

  componentWillMount() {
    this.setState({
      openDialog: this.props.openDialog
    })
  }

  handleClose(e, action) {
    if (action == 'ADD') {
      if (this.validationSuccess()) {
        this.handleSubmit()
        this.setState({openDialog: false})
        this.resetFields()
      }
    } else {
      this.setState({openDialog: false})
      if (this.props.openDialog)
        this.props.handleClose()
      this.resetFields()
    }
  }

  resetFields() {
    this.setState({
      type: 'Assignment',
      Name: '',
      Description: '',
      Skills: [],
      Week: '',
      Duration: '',
      Day: ''
    })
  }

  validationSuccess() {
    let durationPattern = /[0-9]{1,}/
    if(this.state.type === 'Assignment') {
      if (this.state.Name.trim().length == 0) {
        this.setState({NameErrorText: 'This field cannot be empty.'})
      } else if (this.state.Description.trim().length == 0) {
        this.setState({DescriptionErrorText: 'This field cannot be empty.'})
      } else if ((this.state.Duration + '').trim().length == 0) {
        this.setState({DurationErrorText: 'This field cannot be empty.'})
      } else if (!durationPattern.test(this.state.Duration)) {
        this.setState({DurationErrorText: 'Invalid input! Enter the number of days.'})
      } else if ((this.state.Week + '').trim().length == 0) {
        this.setState({WeekErrorText: 'This field cannot be empty.'})
      } else if (!durationPattern.test(this.state.Week)) {
        this.setState({DurationErrorText: 'Invalid input! Enter the week number.'})
      } else if (this.state.Skills.length == 0) {
        this.setState({SkillErrorText: 'This field cannot be empty.'})
      } else {
        return true
      }
    }
    else {
      if (this.state.Name.trim().length == 0) {
        this.setState({NameErrorText: 'This field cannot be empty.'})
      } else if (this.state.Description.trim().length == 0) {
        this.setState({DescriptionErrorText: 'This field cannot be empty.'})
      } else if ((this.state.Day + '').trim().length == 0) {
        this.setState({DayErrorText: 'This field cannot be empty.'})
      } else if (!durationPattern.test(this.state.Day)) {
        this.setState({DayErrorText: 'Invalid input! Enter the number of weeks.'})
      } else {
        return true
      }
    }
    return false
  }

  onChangeType(e, key, value) {
    console.log('mode e: ', e)
    this.setState({type: value})
  }

  onChangeName(e) {
    this.setState({Name: e.target.value, NameErrorText: ''})
  }

  onChangeDescription(e) {
    this.setState({Description: e.target.value, DescriptionErrorText: ''})
  }

  onChangeDuration(e) {
    this.setState({Duration: e.target.value, DurationErrorText: ''})
  }

  onChangeWeek(e) {
    this.setState({Week: e.target.value, WeekErrorText: ''})
  }

  onChangeDay(e) {
    this.setState({Day: e.target.value, DayErrorText: ''})
  }

  handleSubmit() {
    let th = this
    if(th.state.type === 'Assignment') {
      let course = this.props.course;
      let assignment = {};
      assignment.Name = th.state.Name;
      assignment.Description = th.state.Description;
      assignment.Week = th.state.Week;
      assignment.Skills = th.state.Skills;
      assignment.Duration = th.state.Duration;
      course.Assignments.push(assignment);
      this.props.handleUpdate(course);
      this.props.handleClose();
    }
    else {
      let course = this.props.course;
      let schedule = {};
      schedule.Name = th.state.Name;
      schedule.Description = th.state.Description;
      schedule.Skills = th.state.Skills;
      schedule.Day = th.state.Day;
      course.Schedule.push(schedule);
      this.props.handleUpdate(course);
      this.props.handleClose();
    }
  }

  handleUpdateInputPerm(searchPerm) {
		this.setState({
			searchPerm: searchPerm
		})
	}

	handleAddNewPerm() {
		let perms = this.state.Skills
		perms.push(this.state.searchPerm)
		this.setState({
			Skills: perms,
			searchPerm: '',
      SkillErrorText: ''
		})
	}

  handleSkillDelete(perm) {
    let skill = this.state.Skills.filter(function(control) {
      return perm != control
    })
    this.setState({Skills: skill})
  }

  render() {
    let th = this
    let label = "Add " + this.state.type
    let title = `ADD ${this.state.type.toUpperCase()}`
  	let actions = [
        <FlatButton
          label="Cancel"
          style={styles.actionButton}
          onTouchTap={(e) => this.handleClose(e, 'CLOSE')}
        />,
        <FlatButton
          label={label}
          onClick={(e) => this.handleClose(e, 'ADD')}
          style={styles.actionButton}
        />
      ]
      let duration = ''
      if(th.state.type === 'Assignment') {
        duration = (
          <div><div>
            <div style={dialog.box100}>
              <TextField style={{
                width: '100%'
              }} hintText="Duration" floatingLabelText="Duration (in days) *" floatingLabelStyle={app.mandatoryField} value={this.state.Duration} onChange={this.onChangeDuration} errorText={this.state.DurationErrorText}/>
            </div>
          </div>
          <div>
            <div style={dialog.box100}>
              <TextField style={{
                width: '100%'
              }} hintText="eg: 1 (denotes 1st week)" floatingLabelText="Week *" floatingLabelStyle={app.mandatoryField} value={this.state.Week} onChange={this.onChangeWeek} errorText={this.state.WeekErrorText}/>
            </div>
          </div></div>
        )
      }
      else {
        duration = (
          <div>
          <div>
            <div style={dialog.box100}>
              <TextField style={{
                width: '100%'
              }} hintText="eg: 14 (denotes the day on which session happened)" floatingLabelText="Day *" floatingLabelStyle={app.mandatoryField} value={this.state.Day} onChange={this.onChangeDay} errorText={this.state.DayErrorText}/>
            </div>
          </div></div>
        )
      }
      return (
        <Dialog bodyStyle={styles.dialog}
          title={title}
          titleStyle={styles.dialogTitle}
          modal={false}
          open={this.props.openDialog}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
          actionsContainerStyle={styles.actionsContainer}
          actions={actions}>
          <SelectField style={{width: '100%'}} hintText="Category" floatingLabelText='Category' value={this.state.type} onChange={this.onChangeType} menuItemStyle={select.menu} listStyle={select.list} selectedMenuItemStyle={select.selectedMenu} maxHeight={600}>
            <MenuItem key='1' value='Assignment' primaryText='Assignment'/>
            <MenuItem key='2' value='Schedule' primaryText='Schedule'/>
          </SelectField>
          <div>
            <div style={dialog.box100}>
              <TextField style={{
                width: '100%'
              }} hintText="Name" floatingLabelText="Name *" floatingLabelStyle={app.mandatoryField} value={th.state.Name} onChange={th.onChangeName} errorText={th.state.NameErrorText}/>
            </div>
          </div>
          <div>
            <div style={dialog.box100}>
              <TextField style={{
                width: '100%'
              }} hintText="Description" floatingLabelText="Description *" floatingLabelStyle={app.mandatoryField} value={th.state.Description} onChange={th.onChangeDescription} errorText={th.state.DescriptionErrorText}/>
            </div>
          </div>
          {duration}
          <AutoComplete
            floatingLabelText="Add Skills"
            filter={AutoComplete.fuzzyFilter}
            searchText={this.state.searchPerm}
            onUpdateInput={this.handleUpdateInputPerm}
            onNewRequest={this.handleAddNewPerm}
            dataSource={this.props.course.Skills}
            errorText={th.state.SkillErrorText}
            maxSearchResults={5}
          />
          <Paper style={styles.paper} zDepth={1}>
            <div style={styles.wrapper}>
              {this.state.Skills.map(function(skill, index) {
                return (
                  <Chip onRequestDelete={() => th.handleSkillDelete(skill)} style={styles.chip} key={index}>
                    <span>{skill}</span>
                  </Chip>
                )
              })
            }
            </div>
          </Paper>
        </Dialog>)
  }
}
