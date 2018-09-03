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
            text:
              "SEM\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas metus nec velit imperdiet varius. Praesent feugiat ac enim in porttitor. Nam ut sollicitudin leo. Maecenas in lacus non urna iaculis mattis vel eu odio. Aenean tincidunt ipsum a lacus semper, in laoreet magna tempus. Maecenas et turpis vel ipsum tristique feugiat. Etiam dapibus erat id varius finibus."
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
          //Initialize local variables//////////////////////////////////////////
          //////////////////////////////////////////////////////////////////////

          var graphicsLayer;
          var storyFeatures = this.state.data.features;
          var currentActiveStory = 0;

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

          // TODO: Have this function create an instance of a GraphicsLayer, not
          // use one global one
          function addGraphicsLayer() {
            graphicsLayer = new GraphicsLayer({
              title: "The Haunted Campus",
              id: 1
            });
            map.add(graphicsLayer);
          }
          // Attach this to a "new story" handler when it's implemented
          addGraphicsLayer();

          function initializeStories() {
            graphicsLayer.removeAll();
            currentActiveStory = 0;

            storyFeatures.forEach(function(feature) {
              var currentPoint = new Point(
                feature.geometry.coordinates,
                map.spatialReference
              );

              var markerStory = {
                title: feature.title,
                text: feature.text,
                id: feature.id
              };

              var markerSymbol =
                feature.id === 0 ? activeMarkerSymbol : inactiveMarkerSymbol;

              graphicsLayer.add(
                new Graphic({
                  geometry: currentPoint,
                  symbol: markerSymbol,
                  attributes: markerStory
                })
              );
            });
          }
          initializeStories();

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
                    title: "Reset Story",
                    className: "esri-icon-beginning",
                    id: "reset-story"
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
            if (id === "reset-story") {
              alert("Story Reset!");
              initializeStories();
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

          function showStoryMarkerData(event, response) {
            var clickedMarker = response.results[0];

            // Display story
            alert(clickedMarker.graphic.attributes.text);

            if (clickedMarker.graphic.attributes.id === currentActiveStory) {
              currentActiveStory += 1;

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
              console.log("Point", point);
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
