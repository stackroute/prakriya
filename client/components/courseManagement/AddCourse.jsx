import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import app from '../../styles/app.json';
import dialog from '../../styles/dialog.json';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import CourseColumns from './CourseColumns.jsx';
import Request from 'superagent';
import Snackbar from 'material-ui/Snackbar';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover/Popover';
import {Menu} from 'material-ui/Menu';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const styles = {
  paper: {
    margin: '5px',
    padding: '5px',
    width: 'auto',
    height: '130px',
    borderRadius: '2px',
    overflowY: 'scroll'
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

export default class AddCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseColumns: false,
      showDialog: false,
      Name: '',
      Mode: 'Immersive',
      Duration: '',
      NameErrorText: '',
      ModeErrorText: '',
      DurationErrorText: '',
      SkillsErrorText: '',
      Skills: [],
      SkillsCredit: [],
      SkillName: '',
      snackbarOpen: false,
			snackbarMessage: '',
      snackbarAction: '',
      popIndex: -1,
      open: false
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.handleSkillDelete = this.handleSkillDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.validationSuccess = this.validationSuccess.bind(this);
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.onAddSkill = this.onAddSkill.bind(this);
    this.closeCourseColumns = this.closeCourseColumns.bind(this);
    this.hideSnackbar = this.hideSnackbar.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.snackbarAction = this.snackbarAction.bind(this);
    this.changeCredit = this.changeCredit.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentWillMount() {
    if (this.props.openDialog) {
      this.setState({showDialog: true, Name: this.props.course.Name, Mode: this.props.course.Mode, Duration: this.props.course.Duration.low, Skills: this.props.course.Skills, SkillsCredit: this.props.course.SkillsCredit});
    }
  }

  openSnackbar(message, action) {
		this.setState({
			snackbarMessage: message,
      snackbarAction: action,
			snackbarOpen: true
		});
	}

	hideSnackbar() {
		this.setState({
			snackbarMessage: '',
      snackbarAction: '',
			snackbarOpen: false
		});
	}

  snackbarAction() {
    let th = this;
    let skill = this.state.SkillName;
    let skills = this.state.Skills;
    let skillSet = this.props.skills;
    let skillsCredit = this.state.SkillsCredit;
    Request
    .post('/dashboard/createnewskill')
    .set({'Authorization': localStorage.getItem('token')})
    .send({skill: skill})
    .end(function(err, res) {
      if (err) {
        console.log(err);
      } else {
        skills.push(skill);
        skillSet.push(skill);
        skillsCredit.push(3);
        th.setState({
          Skills: skills,
          skillsCredit: skillsCredit,
          SkillSet: skillSet,
          SkillName: '',
          SkillsErrorText: '',
          anchorEl: ''
        });
        th.hideSnackbar();
        th.openSnackbar(skill + ' is added to the superset.', '');
      }
    });
  }

  onChangeName(e) {
    this.setState({Name: e.target.value, NameErrorText: ''});
  }

  onChangeMode(e, value) {
    this.setState({Mode: value, ModeErrorText: ''});
  }

  onChangeDuration(e) {
    this.setState({Duration: e.target.value, DurationErrorText: ''});
  }

  handleSkillChange(value) {
    this.setState({SkillName: value, SkillsErrorText: ''});
  }

  onAddSkill() {
    let th = this;
    if (this.state.SkillName.trim().length != 0) {
      let skillSet = this.props.skills;
      let skills = this.state.Skills;
      let skill = this.state.SkillName;
      let SkillsCredit = th.state.SkillsCredit;
      let duplicateFound = skills.some(function(s) {
        return s.toLowerCase() == skill.toLowerCase()
      });
      let matchFound = skillSet.some(function(s) {
        return s.toLowerCase() == skill.toLowerCase()
      });
      if(duplicateFound) {
        th.openSnackbar('Duplicate Skill! Try adding a new skill.', '');
      } else if (!matchFound){
        th.openSnackbar('New Skill! Wanna move it to the superset?', 'YES');
      } else {
        skills.push(skill);
        SkillsCredit.push(3);
        th.setState({Skills: skills, SkillName: '', SkillsCredit: SkillsCredit, SkillsErrorText: ''});
      }
    }
  }

  handleOpen() {
    this.resetFields();
    this.setState({showDialog: true});
  }

  handleClose(e, action) {
    if (action == 'ADD') {
      if (this.validationSuccess()) {
        this.setState({
          showDialog: false,
          courseColumns: true
        });
      }
    } else if (action == 'EDIT') {
      if (this.validationSuccess()) {
        this.handleUpdate()
        this.setState({showDialog: false})
        if (this.props.openDialog)
          this.props.handleClose()
        this.resetFields()
      }
    } else {
      this.setState({showDialog: false})
      if (this.props.openDialog)
        this.props.handleClose()
      this.resetFields()
    }
  }

  handleSkillDelete(perm) {
    let key = -1;
    let skill = this.state.Skills.filter(function(control, index) {
      if(perm == control) {
        key = index
      }
      return perm != control
    })
    let SkillsCredit = this.state.SkillsCredit.filter(function(credit, index) {
      return key != index
    })
    this.setState({Skills: skill})
  }

  resetFields() {
    this.setState({
      Name: '',
      Mode: '',
      Duration: '',
      Skills: [],
      SkillsCredit: [],
      SkillName: '',
      NameErrorText: '',
      ModeErrorText: '',
      DurationErrorText: '',
      SkillsErrorText: ''
    })
  }

  handleUpdate() {
    let th = this
    let course = {}
    course.ID = this.props.course.ID;
    course.Name = this.state.Name;
    course.Mode = this.state.Mode;
    course.Duration = this.state.Duration;
		course.Skills = this.state.Skills;
    course.SkillsCredit = this.state.SkillsCredit;
    course.Removed = false;
    course.History = '';
    this.props.handleUpdate(course, 'edit');
  }

  handleAdd(courseColumns) {
    let th = this;
    let course = {};
    course.ID = th.state.Name + '_' + th.state.Mode;
    course.Name = this.state.Name;
    course.Mode = this.state.Mode;
    course.Skills = this.state.Skills;
    course.SkillsCredit = this.state.SkillsCredit;
    course.Assignments = [];
    course.Schedule = [];
    course.Removed = false;
    course.Duration = this.state.Duration;
    course.History = '';
    course.FeedbackFields = courseColumns.FeedbackFields;
    course.EvaluationFields = courseColumns.EvaluationFields;
    this.props.handleAdd(course);
    this.setState({
      courseColumns: false
    });
  }

  validationSuccess() {
    let durationPattern = /[0-9]{1,}/
    if (this.state.Name.trim().length == 0) {
      this.setState({NameErrorText: 'This field cannot be empty.'})
    } else if (this.state.Mode.trim().length == 0) {
      this.setState({ModeErrorText: 'This field cannot be empty.'})
    } else if ((this.state.Duration + '').trim().length == 0) {
      this.setState({DurationErrorText: 'This field cannot be empty.'})
    } else if (!durationPattern.test(this.state.Duration)) {
      this.setState({DurationErrorText: 'Invalid input! Enter the number of weeks.'})
    } else if (this.state.Skills.length == 0) {
      this.setState({SkillsErrorText: 'Skillset cannot be empty. Add atleast one skill.'})
    } else {
      return true
    }
    return false
  }

  closeCourseColumns() {
    this.setState({
      courseColumns: false,
      showDialog: true
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
      popIndex: -1,
      anchorEl: ''
    });
  };

  changeCredit(event, index) {
    let th = this;
    th.setState({
      popIndex: index,
      open: true,
      anchorEl: event.currentTarget
    })
  }

  changeNewCredit(event, index) {
    let SkillsCredit = this.state.SkillsCredit;
    SkillsCredit[index] = parseInt(event.target.outerText, 10);
    this.setState({
      SkillsCredit: SkillsCredit
    })
    this.handleRequestClose();
  }

  render() {
    let th = this
      let actions,
        title
      if (this.props.openDialog) {
        actions = [ < FlatButton label = "Cancel" onTouchTap = {
            (e) => this.handleClose(e, 'CLOSE')
          }
          style = {
            dialog.actionButton
          } />, < FlatButton label = "Update Course" onClick = {
            (e) => this.handleClose(e, 'EDIT')
          }
          style = {
            dialog.actionButton
          } />
        ]
        title = 'EDIT COURSE'
      } else {
        actions = [ < FlatButton label = "Cancel" onTouchTap = {
            (e) => this.handleClose(e, 'CLOSE')
          }
          style = {
            dialog.actionButton
          } />, < FlatButton label = "Add Course" onClick = {
            (e) => this.handleClose(e, 'ADD')
          }
          style = {
            dialog.actionButton
          } />
        ]
        title = 'ADD COURSE'
      }
      return (
        <div>
          <FloatingActionButton mini={true} style={app.fab} onTouchTap={this.handleOpen}>
            <ContentAdd/>
          </FloatingActionButton>
          <Dialog bodyStyle={dialog.body} title={title} titleStyle={dialog.title} actionsContainerStyle={dialog.actionsContainer} open={this.state.showDialog} autoScrollBodyContent={true} actions={actions}>
            <div>
              <div style={dialog.box100}>
                <TextField style={{
                  width: '100%'
                }} hintText="Course Name" floatingLabelText="Name *" floatingLabelStyle={app.mandatoryField} value={this.state.Name} onChange={this.onChangeName} errorText={this.state.NameErrorText}/>
              </div>
            </div>
            <div>
              <div  style={dialog.box100}>
                <p>Mode</p>
                <RadioButtonGroup name='Mode'
                  defaultSelected={this.state.Mode} valueSelected={this.state.Mode}
                  onChange={this.onChangeMode}>
                    <RadioButton
                      value='Immersive'
                      label='Immersive'
                      style={{display: 'inline-block', width: '150px'}}
                    />
                    <RadioButton
                      value='Online'
                      label='Online'
                      style={{display: 'inline-block', width: '150px'}}
                    />
                    <RadioButton
                      value='Hybrid'
                      label='Hybrid'
                      style={{display: 'inline-block', width: '150px'}}
                    />
                </RadioButtonGroup>
              </div>
            </div>
            <div>
              <div style={dialog.box100}>
                <TextField style={{
                  width: '100%'
                }} hintText="Duration" floatingLabelText="Duration (in weeks) *" floatingLabelStyle={app.mandatoryField} value={this.state.Duration} onChange={this.onChangeDuration} errorText={this.state.DurationErrorText}/>
              </div>
            </div>
            <div>
              <div style={dialog.box100}>
                <AutoComplete
                  floatingLabelText="Add Skills *"
                  floatingLabelStyle={app.mandatoryField}
                  filter={AutoComplete.fuzzyFilter}
                  searchText={th.state.SkillName}
                  onUpdateInput={th.handleSkillChange}
                  onNewRequest={th.onAddSkill}
                  dataSource={th.props.skills}
                  errorText={th.state.SkillsErrorText}
                  maxSearchResults={5}
                />
                <Paper style={styles.paper} zDepth={1}>
                  <div style={styles.wrapper}>
                    {
                      this.state.Skills.map(function(skill, index) {
                        return (
                          <Chip onRequestDelete={() => th.handleSkillDelete(skill)} style={styles.chip} key={index}>
                            <span onClick={(event) => th.changeCredit(event, index)}>{skill} ({th.state.SkillsCredit[index]})
                              {
                                th.state.popIndex === index &&
                                <Popover
                                  open={th.state.open}
                                  anchorEl={th.state.anchorEl}
                                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                  onRequestClose={th.handleRequestClose}
                                  animation={PopoverAnimationVertical}
                                >
                                <Menu value = {th.state.SkillsCredit[index]} onClick = {(event) => th.changeNewCredit(event, index)}>
                                  <MenuItem primaryText="1" value = {1} checked = {th.state.SkillsCredit[index] == 1}/>
                                  <MenuItem primaryText="2" value = {2} checked = {th.state.SkillsCredit[index] == 2}/>
                                  <MenuItem primaryText="3" value = {3} checked = {th.state.SkillsCredit[index] == 3}/>
                                </Menu>
                              </Popover>
                              }
                            </span>
                          </Chip>
                        )
                      })
                   }
                  </div>
                </Paper>
                <p>The default creadit for each skill is 3. Please click on the skill to change it.<br/> Basic - 1, Intermediate - 2 and Advanced - 3</p>
              </div>
            </div>
          </Dialog>
          <CourseColumns
          open={this.state.courseColumns}
          onClose={this.closeCourseColumns}
          onConfirmCourseAddition={this.handleAdd}
          />
          <Snackbar
  					open={th.state.snackbarOpen}
  					message={th.state.snackbarMessage}
  					autoHideDuration={4000}
  					onRequestClose={th.hideSnackbar}
            action={th.state.snackbarAction}
            onActionTouchTap={th.snackbarAction}
  			 />
        </div>
      )
    }
  }
