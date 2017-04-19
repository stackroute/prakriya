import React from 'react';

export default class Footer extends React.Component {

	render() {
		const containerStyle = {
			zIndex: 2,
			fontFamily: 'sans-serif',
			backgroundColor: 'rgb(0, 188, 212)',
			color: '#fff',
			textAlign: 'center',
			height: '50px',
	    width: '100%',
	    marginBottom: 0
		}
		const textStyle = {
			marginTop:'12px',
			marginBottom: '0px',
			paddingTop: '14px'
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