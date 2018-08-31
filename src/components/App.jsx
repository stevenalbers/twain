import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseApp } from '../firebase';
import { Map } from 'react-arcgis';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			view: null
		}
		
		this.handleMapLoad = this.handleMapLoad.bind(this);
	}

	signOut() {
		firebaseApp.auth().signOut();
	}
	render() {
		return (
			<div>
			<h3>Twain</h3>
			<Map style = {{height: '700px'}} onLoad={this.handleMapLoad} />
				<button 
				className="btn btn-danger" 
				onClick={() => this.signOut()}>
					Sign Out
				</button>
			</div>
		)
	}

	handleMapLoad(map, view) {
        this.setState({ map, view });
    }

}

function mapStateToProps(state) {
	console.log('state', state);
	return {}
}


export default connect(mapStateToProps, null)(App);