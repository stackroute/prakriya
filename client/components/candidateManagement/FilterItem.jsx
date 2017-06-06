import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';

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
		// this.getAccordianValues()
	}

  toggleAccordion() {
    if(this.state.accordion == 'none') {
			this.getAccordianValues()
      this.setState({
        accordion: 'block'
      })
    } else {
      this.setState({
        accordion: 'none'
      })
    }
  }

  getAccordianValues() {
		console.log('child func called')
    let values = this.props.onGetAccordianValues()
		console.log('values: ', values)
    this.setState({
      values: values
    })
  }

  render() {
		let content
		if(this.props.type == 'AutoComplete') {
				content = (
					<div style={{display: this.state.accordion}}>
						<AutoComplete
							filter={AutoComplete.fuzzyFilter}
							dataSource={this.state.values}
							/>
					</div>
				)
		} else if(this.props.type == 'CheckBox') {
				content = (
					<div style={{display: this.state.accordion}}>
						{
							this.state.values.map(function(value, key) {
								<Checkbox
									label={value}
									value={value}
									key={key}
								/>
							})
						}
					</div>
				)
		} else if(this.props.type == 'RadioButton') {
			content = <div style={{display: this.state.accordion}}>Coming Soon...</div>
		}
    return (
      <div>
        <div style={{border: '1px solid #eeeeee', backgroundColor: 'silver', padding: '5px', width: '100%'}} onTouchTap={this.toggleAccordion}>{this.props.title}</div>
				{content}
      </div>
    )
  }
}
