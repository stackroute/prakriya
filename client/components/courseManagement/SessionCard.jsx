import React from 'react';
import {
  Card,
  CardHeader
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import SkillsIcon from 'material-ui/svg-icons/action/stars';

export default class SessionCard extends React.Component {
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
					width: '320px',
					background: bgColor
				}}>
					<CardHeader
					title={`${this.props.session.Name}`}
					avatar={
						<Avatar backgroundColor={bgIcon}>
							{this.props.session.Day}
						</Avatar>
					} />

					<IconButton tooltip="Skills">
						<SkillsIcon/>
					</IconButton>
					<span style={{color: '#0000aa', textDecoration: 'underline', cursor: 'pointer', verticalAlign: 'super'}} onTouchTap={()=>{console.log('Skills clicked...')}}>
						{this.props.session.Skills.length}&nbsp;skill(s)
					</span><br/>

				</Card>
			</div>
		)
	}
}
