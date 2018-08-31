import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import { firebaseApp } from './firebase';
import App from './components/App.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import reducer from './reducers';
import { logUser } from './actions';

const store = createStore(reducer);

firebaseApp.auth().onAuthStateChanged(user => {
	if(user) {
		console.log('user logged in', user);
		const { email } = user;
		store.dispatch(logUser(email));
		browserHistory.push('/app'); 
	}
	else
	{		
		console.log('user not logged in', user);
		browserHistory.replace('/signin'); 
	}
})

ReactDOM.render(
	<Provider store={store}>
	<Router path="/" history={browserHistory}>
		<Route path="/app" component={App} />
		<Route path="/signin" component={SignIn} />
		<Route path="/signup" component={SignUp} />
	</Router>
	</Provider>, document.getElementById('root')

)