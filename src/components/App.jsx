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
        "esri/widgets/LayerList",
        "esri/widgets/Home",
        "esri/widgets/Expand"
      ])
      .then(
        ([
          Map,
          MapView,
          GraphicsLayer,
          Graphic,
          Point,
          FeatureLayer,
          LayerList,
          Home,
          Expand
        ]) => {
          var map = new Map({
            basemap: "national-geographic"
          });

          var view = new MapView({
            map: map,
            container: "viewDiv",
            center: [-119.8138, 39.5296],
            zoom: 14
          });

          // TODO: Make this a collection of GraphicsLayers that we can add/remove
          var graphicsLayer = new GraphicsLayer({
            title: "Story 1"
          });
          map.add(graphicsLayer);

          var markerSymbol = {
            type: "simple-marker",
            style: "circle",
            color: [0, 204, 102],
            outline: {
              color: [255, 255, 255],
              width: 1.5
            }
          };

          var storyLayers = new LayerList({
            //container: document.createElement("div"),
            view: view,
            listItemCreatedFunction: defineActions
          });

          function defineActions(event) {
            var item = event.item;

            if (item.title === "Story 1") {
              item.actionsSections = [
                [
                  {
                    title: "Rename Story",
                    className: "esri-icon-edit",
                    id: "rename-story"
                  }
                ],
                [
                  {
                    title: "Delete Story",
                    className: "esri-icon-erase",
                    id: "delete-story"
                  }
                ]
              ];
            }
          }

          storyLayers.on("trigger-action", function(event) {
            // Capture the action id.
            var id = event.action.id;
            console.log("layers", storyLayers);
            if (id === "rename-story") {
              alert("Rename");
            } else if (id === "delete-story") {
              alert("Story Deleted!");
              graphicsLayer.removeAll();
            }
          });

          var homeButton = new Home({
            view: view
          });
          view.ui.add(homeButton, "top-left");

          var expandButton = new Expand({
            expanded: true,
            view: view,
            content: storyLayers
          });
          view.ui.add(expandButton, "bottom-right");

          this.state.data.features.forEach(function(feature) {
            var currentPoint = new Point(
              feature.geometry.coordinates,
              map.spatialReference
            );
            graphicsLayer.add(new Graphic(currentPoint, markerSymbol));
          });

          view.on("click", handleEvent);

          function handleEvent(event) {
            view.hitTest(event).then(function(response) {
              // If existing node is clicked
              if (response.results.length > 0 && response.results[0].graphic) {
                showStoryMarkerData(event, response);
              }
              // Otherwise create a new node
              else {
                addStoryMarker(event);
              }
            });
          }

          function showStoryMarkerData(event, response) {
            // Add story function handler here
            // Using debug printouts for now
            console.log("graphic", response.results[0].graphic.symbol.id);
            alert(response.results[0].graphic.symbol.id);
          }

          function addStoryMarker(event) {
            if (event.mapPoint) {
              var point = event.mapPoint.clone();
              point.z = undefined;
              point.hasZ = false;

              graphicsLayer.add(new Graphic(point, markerSymbol));
            }
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
