import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './views/App.jsx';
import Welcome from './views/Welcome.jsx';
import Login from './components/login/index.jsx';
import SignUp from './components/signup/index.jsx';
import Dashboard from './components/dashboard/index.jsx';
import Roles from './components/roleManagement/index.jsx';
import Users from './components/userManagement/index.jsx';
import Candidates from './components/candidateManagement/index.jsx';
import BulkUpload from './components/bulkupload/index.jsx';

injectTapEventPlugin();

const muiTheme = getMuiTheme(baseTheme);

function requireAuth (nextState, replace, callback) {
  const token = localStorage.getItem('token')
  if (!token) 
  	replace('/')
  return callback()
}

function alreadyLoggedIn (nextState, replace, callback) {
  const token = localStorage.getItem('token')
  if(token)
  	replace('/app')
  return callback()
}

ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Router history={hashHistory}>
			<Route path="/" component={Welcome} onEnter={alreadyLoggedIn} />
			<Route path="/login" component={Login} onEnter={alreadyLoggedIn} />
			<Route path="/app" component={App} onEnter={requireAuth} >
				<IndexRoute component={Dashboard} />
				<Route path="/roles" component={Roles} />
				<Route path="/users" component={Users} />
				<Route path="/candidates" component={Candidates} />
				<Route path="/bulkupload" component={BulkUpload} />
			</Route>
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root")
);