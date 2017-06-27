import React from 'react';
import {
  Card,
  CardHeader
} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import SkillsIcon from 'material-ui/svg-icons/action/stars';
import DateIcon from 'material-ui/svg-icons/action/date-range';

export default class AssignmentCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		let th = this
		let bgColor = this.props.bgColor;
    let bgIcon = this.props.bgIcon;
		return(
			<div style={{
				display: 'inline-block',
				padding: '10px'
			}}>
				<Card style={{
					width: '310px',
					background: bgColor
				}}>
					<CardHeader
					title={`${this.props.assignment.Name}`}
					avatar={
						<Avatar backgroundColor={bgIcon}>
							{this.props.assignment.Week}
						</Avatar>
					} />

					<IconButton tooltip="Duration">
						<DateIcon/>
					</IconButton>
					<span style={{verticalAlign: 'super'}}>
						{this.props.assignment.Duration}&nbsp;day(s)
					</span><br/>

          <Paper style={{
            margin: '5px',
            padding: '5px',
            width: '92%',
            margin: 'auto',
            borderRadius: '2px',
            boxSizing: 'border-box'}}>
            <span style={{textAlign: 'jusitfy'}}>
              <b style={{color: bgIcon}}>Skills: </b>
              {
                this.props.assignment.Skills.length == 0 ?
                'NA' :
                this.props.assignment.Skills.map(function(skill, index) {
                  if(index == th.props.assignment.Skills.length - 1)
                    return skill;
                  return skill + ', ';
                })
              }
            </span>
          </Paper><br/>

          <Paper style={{
            margin: '5px',
            padding: '5px',
            width: '92%',
            margin: 'auto',
            borderRadius: '2px',
            boxSizing: 'border-box'}}>
            <span style={{textAlign: 'jusitfy'}}>
              <b style={{color: bgIcon}}>Description: </b>{this.props.assignment.Description}
            </span>
          </Paper><br/>

				</Card>
			</div>
		)
	}
}
