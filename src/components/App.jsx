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
            },
            id: 0,
            title: "SEM",
            text: "Engineering building"
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-119.8177, 39.5391]
            },
            id: 1,
            title: "Nye",
            text: "Dorms"
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-119.8215, 39.4965]
            },
            id: 2,
            title: "Washoe Golf Course",
            text: "Driving"
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
          //////////////////////////////////////////////////////////////////////
          //Initialize Map components///////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////

          var map = new Map({
            basemap: "national-geographic"
          });

          var view = new MapView({
            map: map,
            container: "viewDiv",
            center: [-119.8138, 39.5296],
            zoom: 14
          });

          // TODO: Have this function create an instance of a GraphicsLayer, not
          // use one global one
          var graphicsLayer;
          function addGraphicsLayer() {
            graphicsLayer = new GraphicsLayer({
              title: "The Haunted Campus",
              id: 1
            });
            map.add(graphicsLayer);
          }
          // Attach this to a "new story" handler when it's implemented
          addGraphicsLayer();

          var activeMarkerSymbol = {
            type: "simple-marker",
            style: "circle",
            size: 12,
            color: [0, 204, 102],
            outline: {
              color: [255, 255, 255],
              width: 1.5
            }
          };

          var inactiveMarkerSymbol = {
            type: "simple-marker",
            style: "circle",
            size: 8,
            color: [0, 153, 72],
            outline: {
              color: [230, 230, 230],
              width: 1
            }
          };

          this.state.data.features.forEach(function(feature) {
            var currentPoint = new Point(
              feature.geometry.coordinates,
              map.spatialReference
            );

            var markerStory = {
              title: feature.title,
              text: feature.text,
              id: feature.id
            };

            if (feature.id === 0) {
              graphicsLayer.add(
                new Graphic({
                  geometry: currentPoint,
                  symbol: activeMarkerSymbol,
                  attributes: markerStory
                })
              );
            } else {
              graphicsLayer.add(
                new Graphic({
                  geometry: currentPoint,
                  symbol: inactiveMarkerSymbol,
                  attributes: markerStory
                })
              );
            }
          });

          //////////////////////////////////////////////////////////////////////
          //Create story layers/////////////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////

          var storyLayers = new LayerList({
            //container: document.createElement("div"),
            view: view,
            listItemCreatedFunction: defineActions
          });

          function defineActions(event) {
            var item = event.item;

            if (item.title === "The Haunted Campus") {
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
              alert("Rename Placeholder");
            } else if (id === "delete-story") {
              alert("Story Deleted!");
              graphicsLayer.removeAll();
              map.remove(graphicsLayer);
            }
          });

          //////////////////////////////////////////////////////////////////////
          //Create UI components////////////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////

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

          view.on("click", handleEvent);

          //////////////////////////////////////////////////////////////////////
          //Handle map interactions/////////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////

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

          var currentActiveStory = 0;
          function showStoryMarkerData(event, response) {
            var clickedMarker = response.results[0];
            // Add story function handler here
            // Using debug printouts for now
            console.log("graphic", clickedMarker /*.graphic.symbol.id*/);
            alert(clickedMarker.graphic.attributes.title);
            alert(clickedMarker.graphic.attributes.text);
            if (clickedMarker.graphic.attributes.id === currentActiveStory) {
              currentActiveStory += 1;
              console.log("current story", currentActiveStory);
              console.log("current graphics", graphicsLayer.graphics);
              // Dim newly read node
              var tempGraphic = clickedMarker.graphic;
              graphicsLayer.add(
                new Graphic({
                  geometry: tempGraphic.geometry,
                  symbol: inactiveMarkerSymbol,
                  attributes: tempGraphic.attributes
                })
              );
              graphicsLayer.remove(clickedMarker.graphic);

              // Brighten next node in the story
              var nextGraphic = graphicsLayer.graphics.items.find(element => {
                if (element.attributes.id === currentActiveStory) {
                  return element;
                }
              });
              graphicsLayer.add(
                new Graphic({
                  geometry: nextGraphic.geometry,
                  symbol: activeMarkerSymbol,
                  attributes: nextGraphic.attributes
                })
              );
              graphicsLayer.remove(nextGraphic);
            }
          }

          function addStoryMarker(event) {
            if (event.mapPoint) {
              var point = event.mapPoint.clone();
              point.z = undefined;
              point.hasZ = false;

              graphicsLayer.add(new Graphic(point, activeMarkerSymbol));
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
