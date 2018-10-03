import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Router, Route } from "react-router-dom";
import { firebaseApp } from "./firebase";
import App from "./components/App.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import reducer from "./reducers";
import { logUser } from "./actions";
import history from './history';

const store = createStore(reducer);

firebaseApp.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("user logged in", user);
    const { email } = user;
    store.dispatch(logUser(email));
      console.log(this.props);
        history.push('/app')
  } else {
    console.log("user not logged in", user);
        history.push('/signin')
  }
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} basepath="/react/twain">
    <div>
      <Route path="/app" component={App} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
);
