import React from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Moment from 'moment';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import SkillsIcon from 'material-ui/svg-icons/action/stars';
import CourseSubCard from './CourseSubCard.jsx';
import AddCourse from './AddCourse.jsx';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import dialog from '../../styles/dialog.json';

export default class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      hide: 'inline',
      show: 'none',
      showDeleteDialog: false,
      openDialog: false,
			edit: false,
			showDetailDialog: false,
      showSkills: false
    }
    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleEditCourse = this.handleEditCourse.bind(this);
    this.handleUpdateCourse = this.handleUpdateCourse.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.formatDate = this.formatDate.bind(this);
		this.handleEditDetail = this.handleEditDetail.bind(this);
		this.openDetailDialog = this.openDetailDialog.bind(this);
		this.closeDetailDialog = this.closeDetailDialog.bind(this);
    this.assignment = this.assignment.bind(this);
    this.session = this.session.bind(this);
  }

  componentWillMount() {
    this.props.setCurrentCourse();
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
    if (this.state.expanded) {
      this.setState({expanded: false, hide: 'inline', show: 'none'});
    } else {
      this.setState({expanded: true, hide: 'none', show: 'inline'});
    }
  };

	handleEditDetail() {
		this.setState({
			edit: true
		})
	}

  handleEditCourse() {
    this.setState({openDialog: true})
  }

  handleClose() {
    this.setState({openDialog: false, showAddCategoryDialog: false})
  }

  openDeleteDialog() {
    this.setState({showDeleteDialog: true})
  }

  closeDeleteDialog() {
    this.setState({showDeleteDialog: false})
  }

	openDetailDialog() {
		this.setState({showDetailDialog: true})
	}

	closeDetailDialog() {
		this.setState({showDetailDialog: false})
	}

  handleUpdateCourse(course, edit) {
    course.History = this.props.course.History;
    this.props.updateCourse(course, edit);
  }

  handleDeleteCourse(course) {
    this.props.deleteCourse(this.props.course);
  }

  assignment() {
    console.log('here');
    this.props.setCurrentCourse();
    this.props.openAssignments();
  }

  session() {
      this.props.setCurrentCourse();
      this.props.openSchedule();
  }

  formatDate(date) {
    if (date) {
      return Moment(date).fromNow();
      // return Humanize.naturalDay(newdate,'H:i:s dS M, Y')
    } else
      return '-'
  }

  render() {
    const deleteDialogActions = [ < FlatButton label = "Cancel" onTouchTap = {
        this.closeDeleteDialog
      }
      style = {
        dialog.actionButton
      } />, < FlatButton label = "Delete" onTouchTap = {
        this.closeDeleteDialog
      }
      onClick = {
        this.handleDeleteCourse
      }
      style = {
        dialog.actionButton
      } />
    ]
    let th = this
    let history = this.props.course.History.split('\n');
    history = history[history.length - 2].split(' on ');
    if (history[1].includes(':')) {
      let date = history[1].split(' : ');
      history[1] = date[0];
    }
    let bgColor = this.props.bgColor;
    let bgIcon = this.props.bgIcon;
    return (
      <div>
        <Card style={{
          width: '300px',
          marginRight: '20px',
          marginBottom: '20px',
          background: bgColor
        }}>
          <CardHeader title={`${this.props.course.Name} - ${this.props.course.Mode}`} subtitle={`${history[0]} ${th.formatDate(history[1])}`} avatar={< Avatar backgroundColor = {
            bgIcon
          } > {
            this.props.course.Mode.charAt(0).toUpperCase()
          } < /Avatar>}/>

          <IconButton tooltip="Duration">
						<DateIcon/>
					</IconButton>
          <span style={{verticalAlign: 'super'}}>
            {this.props.course.Duration.low}&nbsp;week(s)
          </span><br/>

          <IconButton tooltip="Skills">
						<SkillsIcon/>
					</IconButton>
          <span style={{textDecoration: 'underline', cursor: 'pointer', verticalAlign: 'super'}} onTouchTap={()=>{th.setState({showSkills:!th.state.showSkills})}}>
            {this.props.course.Skills.length}&nbsp;skill(s)
          </span><br/>
          {
            th.state.showSkills && <ul>{th.props.course.Skills.map(function(skill){
              return (<li> {skill} </li>);
            })}</ul>
          }
          <IconButton tooltip="Schedule">
            <ScheduleIcon/>
          </IconButton>
          <span style={{textDecoration: 'underline', cursor: 'pointer', verticalAlign: 'super'}} onTouchTap={th.session}>
            {this.props.course.Schedule.length}&nbsp;session(s)
          </span><br/>

          <IconButton tooltip="Assignments">
						<AssignmentIcon/>
					</IconButton>
          <span style={{textDecoration: 'underline', cursor: 'pointer',  verticalAlign: 'super'}} onTouchTap={th.assignment}>
            {this.props.course.Assignments.length}&nbsp;assignment(s)
          </span><br/>

					<IconButton tooltip="Add Assessments or Schedule" style={{
            display: this.state.hide
          }} onClick={this.openDetailDialog}>
            <AddIcon/>
          </IconButton>

          <IconButton
          tooltip="Edit Course"
          onClick={this.handleEditCourse}
          style={{
            display: this.state.hide,
            marginLeft: '150px'
          }}>
            <EditIcon/>
          </IconButton>
          <IconButton tooltip="Delete Course" style={{
            display: this.state.hide
          }} onClick={this.openDeleteDialog}>
            <DeleteIcon/>
          </IconButton>
          {this.state.openDialog && <AddCourse course={this.props.course} openDialog={this.state.openDialog} skills={th.props.skills} handleUpdate={this.handleUpdateCourse} handleClose={this.handleClose}/>
}
					{this.state.showDetailDialog && <CourseSubCard skills={th.props.skills} course={this.props.course} openDialog={this.state.showDetailDialog} handleUpdate={this.handleUpdateCourse} handleClose={this.closeDetailDialog} title="ADD"/>}
        </Card>
        <Dialog bodyStyle={dialog.confirmBox} actionsContainerStyle={dialog.actionsContainer} actions={deleteDialogActions} modal={false} open={this.state.showDeleteDialog} onRequestClose={this.closeDeleteDialog}>
          Are you sure? You want to delete this course?
        </Dialog>
      </div>
    )
  }
}
