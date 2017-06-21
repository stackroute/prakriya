import React from 'react';
import WaveDetails from './WaveDetails.jsx';
import PieChart from "react-svg-piechart";


export default class WiproAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	            expandedSector:''
	        }

	        this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)
	    }
			handleMouseEnterOnSector(sector) {
			 this.setState({
				 expandedSector: sector,

			 })

	 }




	render() {
		const data = [
            {label: "Billable", value: 100, color: "#F9CB40"},
            {label: "Non-billable", value: 60, color: "#FF715B"},
            {label: "Free", value: 30, color: "#BCED09"},
            {label: "Support", value: 20, color: "#2F52E0"}
        ]


console.log(this.state.expandedSector,'expandedSector')

		return (
			<div>
			<h2>Billability status</h2>
			<PieChart
                    data={ data }
                    expandedSector={this.state.expandedSector}
                    onSectorHover={this.handleMouseEnterOnSector}
                    sectorStrokeWidth={2}
                    expandOnHover={true}
                    />

							 {
									 data.map((element, i) => (
											 <div key={i}>
													 <span style={{backgroundColor: element.color, height:'16px', width:'16px', display:'inline-block'}}> </span>
													 <span style={{fontWeight: this.state.expandedSector === i ? "bold" : null}}>
															&nbsp;&nbsp;{element.label} : {element.value}
													 </span>

											 </div>
									 ))
							 }



				<WaveDetails />
			</div>
		)
	}
}
