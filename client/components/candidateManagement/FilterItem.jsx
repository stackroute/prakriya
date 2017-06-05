import React from 'react'
import AutoComplete from 'material-ui/AutoComplete';

export default class FilterItem extends React.Component {

	constructor(props) {
		super(props)
    this.state = {
      accordion: 'none',
      accordionType: '',
      values: [],
      selectedValue: ''
    }

    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.getAccordianValues = this.getAccordianValues.bind(this)
  }

	componentDidMount() {
		this.getAccordianValues(this.props.title)
	}

  toggleAccordion() {
    if(this.state.accordion == 'none') {
      this.setState({
        accordion: 'block'
      })
    } else {
      this.setState({
        accordion: 'none'
      })
    }
  }

  getAccordianValues(title) {
    let values = this.props.onGetAccordianValues(title)
    this.setState({
      values: values
    })
  }

  render() {
		let content
		if(this.props.type == 'AutoComplete') {
				content = <div style={{display: this.state.accordion}}>Coming Soon...</div>
		} else if(this.props.type == 'CheckBox') {
				content = <div style={{display: this.state.accordion}}>Coming Soon...</div>
		} else if(this.props.type == 'RadioButton') {
			content = <div style={{display: this.state.accordion}}>Coming Soon...</div>
		}
    return (
      <div style={{padding: '2px'}}>
        <div style={{border: '1px solid grey', backgroundColor: 'silver'}} onTouchTap={this.toggleAccordion}>{this.props.title}</div>
				{content}
      </div>
    )
  }
}
