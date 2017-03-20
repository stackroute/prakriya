import React from 'react';

export default class Footer extends React.Component {

	render() {
		const containerStyle = {
			zIndex: 2,
			fontFamily: 'sans-serif',
			backgroundColor: 'rgb(0, 188, 212)',
			color: '#fff',
			textAlign: 'center',
			position: 'fixed',
			left: 0,
			bottom: 0,
	    height: "40px",
	    width: "100%",
		}
		const textStyle = {
			fontSize: "14px",
			marginTop: "12px",
			marginBottom: "10px"
		}
		return(
			<div>
				<div style={containerStyle}>
					<h4 style={textStyle}>&copy; Prakriya 2017</h4>
				</div>
			</div>
		)
	}

}