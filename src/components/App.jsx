import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseApp } from "../firebase";
import { Map, Scene } from "react-arcgis";

import * as esriLoader from "esri-loader";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-119.8132, 39.5387]
            }
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-119.8215, 39.4965]
            }
          }
        ]
      }
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  componentDidMount() {
    esriLoader
      .loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/layers/FeatureLayer",
        "esri/widgets/Home"
      ])
      .then(
        ([Map, MapView, GraphicsLayer, Graphic, Point, FeatureLayer, Home]) => {
          var map = new Map({
            basemap: "national-geographic"
          });

          var view = new MapView({
            map: map,
            container: "viewDiv",
            center: [-119.8138, 39.5296],
            zoom: 14
          });

          var graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            style: "circle",
            color: [0, 204, 102],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 1.5
            }
          };

          var homeButton = new Home({
            view: view
          });
          view.ui.add(homeButton, "top-left");

          this.state.data.features.forEach(function(feature) {
            var currentPoint = new Point(
              feature.geometry.coordinates,
              map.spatialReference
            );
            graphicsLayer.add(new Graphic(currentPoint, markerSymbol));
          });

          view.on("click", getClickedMarker);

          function getClickedMarker(event) {
            view.hitTest(event).then(function(response) {
              if (response.results.length > 0 && response.results[0].graphic) {
                // Add story function handler here
                // Using debug printouts for now
                console.log("graphic", response.results[0].graphic.symbol.id);
                alert(response.results[0].graphic.symbol.id);
              }
            });
          }
        }
      )

      .catch(err => {
        // handle any errors
        console.error(err);
      });
  }

  signOut() {
    firebaseApp.auth().signOut();
  }

  handleMapLoad(map, view) {
    this.setState({ map, view });
  }

  render() {
    return (
      <div>
        <div
          id="viewDiv"
          style={{ height: "700px" }}
          onLoad={this.handleMapLoad}
        >
          {" "}
        </div>
        <button className="btn btn-danger" onClick={() => this.signOut()}>
          Sign Out
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("state", state);
  return {};
}

export default connect(
  mapStateToProps,
  null
)(App);
