import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

export default class Header extends React.Component {

	render() {
		const style = {
			marginLeft: -8,
			marginTop: -8
		}
		return(
			<div>
				<AppBar
					style={style}
	        title="Prakriya"
	        showMenuIconButton={false} 
	      />
	    </div>  
		)
	}

}