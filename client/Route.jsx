import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './views/App.jsx';
import Admin from './components/admin/index.jsx';
import Welcome from './components/welcome/index.jsx';

injectTapEventPlugin();

const muiTheme = getMuiTheme(baseTheme);

ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Router history={hashHistory}>
			<Route path="/" component={App} >
				<IndexRoute component={Welcome} />
				<Route path="/admin" component={Admin} />
			</Route>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root")
);