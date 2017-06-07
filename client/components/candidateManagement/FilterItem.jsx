import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';

export default class FilterItem extends React.Component {

	constructor(props) {
		super(props)
    this.state = {
      accordion: 'none',
      accordionType: '',
      values: [],
      selectedValue: ''
    };
		this.toggleAccordion = this.toggleAccordion.bind(this);
		this.addFilter = this.addFilter.bind(this);
    this.getAccordianValues = this.getAccordianValues.bind(this);
  }

  toggleAccordion() {
    if(this.state.accordion == 'none') {
			this.getAccordianValues()
      this.setState({
        accordion: 'block'
      });
    } else {
      this.setState({
        accordion: 'none',
				selectedValue: ''
      });
    }
  }

  getAccordianValues() {
    let values = this.props.onGetAccordianValues();
		console.log('values: ', values);
    this.setState({
      values: values
    });
  }

	addFilter(value) {
		this.setState({
			selectedValue: value
		});
		console.log('Selected Value: ', this.state.selectedValue);
		this.props.onAddFilter(value);
	}

  render() {
		let th = this;
		let content;
		if(this.props.type == 'AutoComplete') {
				content = (
					<div style={{display: this.state.accordion}}>
						<AutoComplete
							filter={AutoComplete.fuzzyFilter}
							dataSource={this.state.values}
							searchText={this.state.selectedValue}
							onNewRequest={this.addFilter}
							style={{width: '100%', border: '2px solid silver', padding: '3px'}}
							listStyle={{backgroundColor: '#eeeeee', border: '5px solid silver'}}
							/>
					</div>
				);
		} else if(this.props.type == 'CheckBox') {
				content = (
					<div style={{display: this.state.accordion, width: '100%', border: '2px solid silver', padding: '3px'}}>
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
				);
		} else if(this.props.type == 'RadioButton') {
			content = (
				<div style={{display: this.state.accordion}}>
					<RadioButtonGroup
						style={{width: '100%', border: '2px solid silver', padding: '3px'}}
						onChange={(e)=>{e.persist(); th.addFilter(e.target.value);}}
					>
						{
							this.state.values.map(function(value, index) {
								return (
									<RadioButton
										style={{width: '50%', display: 'inline-block', boxSizing: 'border-box'}}
										value={value}
										label={value}
										key={index}
									/>
								)
							})
						}
					</RadioButtonGroup>
				</div>
			);
		}
    return (
      <div>
        <div style={{border: '1px solid #eeeeee', backgroundColor: 'silver', padding: '5px', width: '100%'}}>
					<div style={{width: '90%', display: 'inline-block'}}>{this.props.title}</div>
					<div style={{display: 'inline-block'}} onTouchTap={this.toggleAccordion}>
						{this.state.accordion == 'none' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
					</div>
				</div>
				{content}
      </div>
    )
  }
}
