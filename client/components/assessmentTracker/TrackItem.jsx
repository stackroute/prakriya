import React from 'react';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';

export default class TrackItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
      track: {
        candidateID: '',
        candidateName: '',
        candidateEmail: '',
				categories: [],
        comments: []
      }
		}
	}

  componentDidMount() {
    this.setState({
      track: this.props.track
    })
  }

	render() {
		let th = this;

		return (
			<div>
				<Card>
					<CardHeader
			      title={this.state.track.candidateName}
			      subtitle={"ID: " + this.state.track.candidateID + ". Email: " + this.state.track.candidateEmail}
			    >
			    </CardHeader>
          {
              this.state.track.comments.map(function(comment, index) {
                return (
                  <CardText key={index}>
                    <p>{this.state.categories[index]}</p>
                    <p>{comment}</p>
                  </CardText>
                )
              })
          }
			  </Card>
			</div>
		);
	}
}
