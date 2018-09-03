import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseApp } from "../firebase";
import { Map, Scene } from "react-arcgis";

import * as esriLoader from "esri-loader";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Read in stories from external source AND/OR enable user-generated storytelling
      data: {
        type: "FeatureCollection",
        features: [
          [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8132, 39.5387]
              },
              storyId: 0,
              storyOrder: 0,
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
              storyId: 0,
              storyOrder: 1,
              title: "Nye",
              text: "Dorms"
            }
          ],
          [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8215, 39.4965]
              },
              storyId: 1,
              storyOrder: 0,
              title: "Washoe Golf Course",
              text: "Driving"
            }
          ]
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
          ////////////////////////////////////////////////////////////////////
          //Initialize local variables////////////////////////////////////////
          ////////////////////////////////////////////////////////////////////

          var storyLayer0, storyLayer1;
          var currentActiveStory0,
            currentActiveStory1 = 0;

          var storyFeatures0 = this.state.data.features[0];
          var storyFeatures1 = this.state.data.features[1];

          ////////////////////////////////////////////////////////////////////
          //Initialize Map components/////////////////////////////////////////
          ////////////////////////////////////////////////////////////////////

          var map = new Map({
            basemap: "national-geographic"
          });

          var view = new MapView({
            map: map,
            container: "viewDiv",
            center: [-119.8138, 39.5296],
            zoom: 14
          });

          // TODO: Make marker colors configurable
          var activeMarkerSymbol0 = {
            type: "simple-marker",
            style: "circle",
            size: 12,
            color: [0, 102, 204],
            outline: {
              color: [255, 255, 255],
              width: 1.5
            }
          };

          var inactiveMarkerSymbol0 = {
            type: "simple-marker",
            style: "circle",
            size: 8,
            color: [0, 76, 153],
            outline: {
              color: [230, 230, 230],
              width: 1
            }
          };

          var activeMarkerSymbol1 = {
            type: "simple-marker",
            style: "circle",
            size: 12,
            color: [0, 204, 102],
            outline: {
              color: [255, 255, 255],
              width: 1.5
            }
          };

          var inactiveMarkerSymbol1 = {
            type: "simple-marker",
            style: "circle",
            size: 8,
            color: [0, 153, 76],
            outline: {
              color: [230, 230, 230],
              width: 1
            }
          };

          // TODO: Have this function create an instance of a GraphicsLayer, not use predefined ones
          function addStoryLayers() {
            storyLayer0 = new GraphicsLayer({
              title: "The Haunted Campus",
              storyId: 0
            });
            storyLayer1 = new GraphicsLayer({
              title: "Other Story",
              storyId: 1
            });
            map.add(storyLayer0);
            map.add(storyLayer1);
          }
          // TODO: Attach this to a "new story" handler when it's implemented
          addStoryLayers();

          function initializeStories() {
            // TODO: Make an initializeStory(ID) to init stories one by one, use this to loop and initializeStory(ID) each
            storyLayer0.removeAll();
            currentActiveStory0 = 0;

            storyFeatures0.forEach(function(feature) {
              var currentPoint = new Point(
                feature.geometry.coordinates,
                map.spatialReference
              );

              var markerStory = {
                title: feature.title,
                text: feature.text,
                storyId: feature.storyId,
                storyOrder: feature.storyOrder
              };

              var markerSymbol =
                feature.storyOrder === 0
                  ? activeMarkerSymbol0
                  : inactiveMarkerSymbol0;

              storyLayer0.add(
                new Graphic({
                  geometry: currentPoint,
                  symbol: markerSymbol,
                  attributes: markerStory
                })
              );
            });

            storyFeatures1.forEach(function(feature) {
              var currentPoint = new Point(
                feature.geometry.coordinates,
                map.spatialReference
              );

              var markerStory = {
                title: feature.title,
                text: feature.text,
                storyId: feature.storyId,
                storyOrder: feature.storyOrder
              };

              var markerSymbol =
                feature.storyOrder === 0
                  ? activeMarkerSymbol1
                  : inactiveMarkerSymbol1;

              storyLayer1.add(
                new Graphic({
                  geometry: currentPoint,
                  symbol: markerSymbol,
                  attributes: markerStory
                })
              );
            });
          }
          initializeStories();

          ////////////////////////////////////////////////////////////////////
          //Create story layers///////////////////////////////////////////////
          ////////////////////////////////////////////////////////////////////

          var storyLayers = new LayerList({
            view: view,
            listItemCreatedFunction: defineActions
          });

          function defineActions(event) {
            var item = event.item;

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

          storyLayers.on("trigger-action", function(event) {
            // Capture the action id
            var id = event.action.id;

            // TODO: get story layer by id instead of title
            var storyLayer =
              event.item.title === "The Haunted Campus"
                ? storyLayer0
                : storyLayer1;
            console.log("event", event);
            if (id === "reset-story") {
              alert("Story Reset!");
              initializeStories();
            } else if (id === "delete-story") {
              alert("Story Deleted!");
              storyLayer.removeAll();
              map.remove(storyLayer);
            }
          });

          ////////////////////////////////////////////////////////////////////
          //Create UI components//////////////////////////////////////////////
          ////////////////////////////////////////////////////////////////////

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

          ////////////////////////////////////////////////////////////////////
          //Handle map interactions///////////////////////////////////////////
          ////////////////////////////////////////////////////////////////////

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
            console.log("marker", clickedMarker);
            // Display story
            alert(clickedMarker.graphic.attributes.text);

            // Check which story is active & set properties
            // TODO: Overhaul this big time. Once stories can be instantiated simply utilize their properties directly
            var currentActiveStory = currentActiveStory0;
            var storyLayer = storyLayer0;
            var activeMarkerSymbol = activeMarkerSymbol0;
            var inactiveMarkerSymbol = inactiveMarkerSymbol0;

            if (clickedMarker.graphic.attributes.storyId === 1) {
              currentActiveStory = currentActiveStory1;
              storyLayer = storyLayer1;
              activeMarkerSymbol = activeMarkerSymbol1;
              var inactiveMarkerSymbol = inactiveMarkerSymbol1;
            }

            if (
              clickedMarker.graphic.attributes.storyOrder === currentActiveStory
            ) {
              currentActiveStory += 1;

              // Dim newly read node
              var tempGraphic = clickedMarker.graphic;
              storyLayer.add(
                new Graphic({
                  geometry: tempGraphic.geometry,
                  symbol: inactiveMarkerSymbol,
                  attributes: tempGraphic.attributes
                })
              );
              storyLayer.remove(clickedMarker.graphic);

              // Brighten next node in the story
              var nextGraphic = storyLayer.graphics.items.find(element => {
                if (element.attributes.storyOrder === currentActiveStory) {
                  return element;
                }
              });
              storyLayer.add(
                new Graphic({
                  geometry: nextGraphic.geometry,
                  symbol: activeMarkerSymbol,
                  attributes: nextGraphic.attributes
                })
              );
              storyLayer.remove(nextGraphic);
            }

            // Sync current story back up here
            if (clickedMarker.graphic.attributes.storyId === 0) {
              currentActiveStory0 = currentActiveStory;
            } else {
              currentActiveStory1 = currentActiveStory;
            }
          }

          // Currently a debug function. Eventually want to implement user-generated markers/stories
          function addStoryMarker(event) {
            if (event.mapPoint) {
              var point = event.mapPoint.clone();
              point.z = undefined;
              point.hasZ = false;

              storyLayer0.add(new Graphic(point, activeMarkerSymbol0));
              console.log("Point", point);
            }
          }
        }
      )

      ////////////////////////////////////////////////////////////////////////
      //Error handling////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////

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
