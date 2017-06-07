import React from 'react';

const styles = {
  text: {
		marginTop:'2px',
		marginBottom: '0px',
		paddingTop: '14px'
  },
	footer: {
		// position: 'absolute',
	 //  bottom: 0,
		width: '100%',
		fontFamily: 'sans-serif',
		backgroundColor: 'rgb(0, 188, 212)',
		color: '#fff',
		textAlign: 'center',
		height: 50
	}
};

export default class Footer extends React.Component {

	render() {
		return(
			<div style={styles.footer}>
				<h4 style={styles.text}>&copy; Prakriya 2017</h4>
			</div>
		)
	}

}
