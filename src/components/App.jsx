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
                coordinates: [-119.8139, 39.5378]
              },
              storyId: 0,
              storyOrder: 0,
              title: "Morrill Hall",
              text:
                "Strange happenings have been afoot all around campus. You’re the only one around here who believes me; who’s seen what I’ve seen. You’ll help me get to the bottom of this, won’t you? Good. It’s not like you had a choice or anything. Morrill Hall is the oldest building here, so if there’s any place to start, I’d say it’s here. Go check out the second floor, I’ll be down here if you need me. <br /><br />....<br /><br />Nothing yet, huh? Maybe we should check somewhere else. Head over to Scrugham Engineering & I’ll meet you there. My gut’s telling me to look around here a little more."
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8132, 39.5387]
              },
              storyId: 0,
              storyOrder: 1,
              title: "Scrugham Engineering & Mines",
              text:
                "You’ll never believe what just happened to me! Right as you left I heard a crash upstairs so I went to go check it out. As I got there, I could have sworn I saw someone - a girl, I think - slam a closet door shut, but when I opened it… Empty. Now more than ever I’m sure there’s something going on around here.<br /><br />....<br /><br />I don’t think there’s anything here. I’ve heard reports of screams coming from the engineering lab late at night, but I’m pretty sure those are just students working on their semester projects. Lincoln Hall’s up next. Let’s go!"
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8163, 39.5394]
              },
              storyId: 0,
              storyOrder: 2,
              title: "Lincoln Hall",
              text:
                "People have been reporting that their phones start wigging out when they walk past here, so I know we’re close. Take a look around and let me know if you find anything.<br /><br />....<br /><br />Whoa, is that an old rifle? Well, part of one anyway… I wonder if that belonged to James Champagne. Word on the street is that a hundred years ago he shot himself while cleaning his rifle - I’d be shocked if that wasn’t his. Great find! Hey, while we were walking past the quad I thought I saw something back at Morrill. I’ma head back there really quick, but hit me up if anything weird happens. Whatever you do, don’t go anywhere."
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8176, 39.5402]
              },
              storyId: 0,
              storyOrder: 3,
              title: "Construction Site",
              text:
                "There you are! Sheesh, it took me hours to find you. I told you not to move! Why’d you come here, and where’d you get that shovel? You’re telling me the gun possessed you? I mean, I believe you but why here? Oh well, let’s start digging, I guess.<br /><br />....<br /><br />I don’t believe it… Are these… Human remains? They’re everywhere down here! How did nobody come across this before? You know what - I think I’ve figured it out. The school’s built on an ancient burial ground, and recently we’ve been angering the spirits. I’ve heard of this happening before but I never thought our own campus would actually have evil spirits roaming around right under our noses. That about wraps it up. Thanks for the help! I couldn’t have done it without ya!"
            }
          ],
          [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8161, 39.524]
              },
              storyId: 1,
              storyOrder: 0,
              title: "Wingfield Park",
              text:
                "There’s a band performing here at 3:00PM. Pay attention to their setlist: Unscramble the first letter of each song title to find out where to go next."
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8326, 39.5208]
              },
              storyId: 1,
              storyOrder: 1,
              title: "Idlewild Park",
              text:
                "I’ve hidden the next clue somewhere in the rose garden. That band’s name should give you a hint as to where you should be looking."
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-119.8266, 39.5465]
              },
              storyId: 1,
              storyOrder: 2,
              title: "Rancho San Rafael",
              text:
                "You made it to the final step! No more puzzles here: the first one to bring me a rock from the “N” at the top of the mountain is the winner!"
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
              title: "Scavenger Hunt",
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

              console.log("marker story", markerStory);

              var markerSymbol =
                feature.storyOrder === 0
                  ? activeMarkerSymbol0
                  : inactiveMarkerSymbol0;

              // TODO: Unify graphic creation
              storyLayer0.add(
                new Graphic({
                  geometry: currentPoint,
                  symbol: markerSymbol,
                  attributes: markerStory,
                  popupTemplate: {
                    title: feature.title,
                    content: [
                      {
                        type: "text",
                        text: feature.text
                      }
                    ]
                  }
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
                  attributes: markerStory,
                  popupTemplate: {
                    title: feature.title,
                    content: [
                      {
                        type: "text",
                        text: feature.text
                      }
                    ]
                  }
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
              // Create a new node if right clicked
              else if (event.button === 2) {
                addStoryMarker(event);
              }
            });
          }

          function showStoryMarkerData(event, response) {
            var clickedMarker = response.results[0];
            console.log("marker", clickedMarker);

            // Check which story is active & set properties
            // TODO: Overhaul this big time. Once stories can be instantiated simply utilize their properties directly
            var currentActiveStory = currentActiveStory0;
            var storyLayer = storyLayer0;
            var activeMarkerSymbol = activeMarkerSymbol0;
            var inactiveMarkerSymbol = inactiveMarkerSymbol0;
            var storyFeatures = storyFeatures0;

            if (clickedMarker.graphic.attributes.storyId === 1) {
              currentActiveStory = currentActiveStory1;
              storyLayer = storyLayer1;
              activeMarkerSymbol = activeMarkerSymbol1;
              inactiveMarkerSymbol = inactiveMarkerSymbol1;
              storyFeatures = storyFeatures1;
            }

            if (
              clickedMarker.graphic.attributes.storyOrder === currentActiveStory
            ) {
              currentActiveStory += 1;

              // Dim newly read node
              var tempGraphic = clickedMarker.graphic;

              console.log("tempgraphic", tempGraphic);
              storyLayer.add(
                new Graphic({
                  geometry: tempGraphic.geometry,
                  symbol: inactiveMarkerSymbol,
                  attributes: tempGraphic.attributes,
                  popupTemplate: tempGraphic.popupTemplate
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
                  attributes: nextGraphic.attributes,
                  popupTemplate: nextGraphic.popupTemplate
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

          // TODO: Need to attach a mechanism for keeping track of story order. This would be a good time to turn addStoryMarker into a generator function
          var submitStory = {
            title: "Submit Story Node",
            id: "submit-story"
          };
          var addStoryPopupTemplate = {
            title: "feature.title",
            content: [
              {
                type: "text",
                // TODO: Potentially add more input fields for order? Or just do that programmatically once we pull the story down from firebase
                text:
                  "Enter story here:<br /><input type='text', id='submit-story' />"
              }
            ],
            actions: [submitStory]
          };

          // Currently a debug function. Eventually want to implement user-generated markers/stories
          function addStoryMarker(event) {
            if (event.mapPoint) {
              var point = event.mapPoint.clone();
              point.z = undefined;
              point.hasZ = false;

              var graphic = new Graphic({
                geometry: point,
                symbol: activeMarkerSymbol0,
                popupTemplate: addStoryPopupTemplate
              });

              storyLayer0.add(graphic);
              console.log("graphic", storyLayer0);

              // Log the written story to firebase with story order
              view.popup.on("trigger-action", function(event) {
                if (event.action.id === "submit-story") {
                  console.log(
                    "Story:",
                    document.getElementById("submit-story").value
                  );
                }
              });
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
      <div style={{ height: "100%" }}>
        <h1 style={{ margin: "2%" }}>TwainJS</h1>
        <div id="viewDiv" style={{ height: "90%" }} onLoad={this.handleMapLoad}>
          {" "}
        </div>
        <button
          className="btn btn-danger"
          style={{ margin: "2%" }}
          onClick={() => this.signOut()}
        >
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
