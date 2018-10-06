# TwainJS

Geo-stories & scavenger hunts

![img](https://user-images.githubusercontent.com/5317415/45006016-a823ff80-afab-11e8-80d1-70735af81906.png)
---

TwainJS is a web-based storytelling/experience sharing platform built with [ArcGIS](https://developers.arcgis.com/javascript/), and is in early development. Users will be able to create sequential storytelling nodes in & around their city and share those experiences with others, who can interact with those nodes once they go to the physical location marked on the map. Perhaps you want to give people a self-guided tour of your city's downtown, or maybe you want to create a scavenger hunt for your friends. Whatever the case, TwainJS has you covered.

#### [Interactive Demo](http://stevenalbers.com/react/twain/)


## Tools & Libraries

- [ArcGIS](https://developers.arcgis.com/javascript/)
- [npm](https://www.npmjs.com)
- [React-Redux](https://github.com/reduxjs/react-redux)
- [Firebase](https://firebase.google.com)
- [React-ArcGIS](https://www.npmjs.com/package/react-arcgis)
- [EsriLoader](https://github.com/Esri/esri-loader)
- [TypeScript](https://www.typescriptlang.org)

## About

Thus far the project comes bundled with two pre-made experiences and does not yet support user-generated content, though the framework is in place to eventually allow content creators to fill story nodes with their own content and share them with friends. Current story data is stored in React props that can be saved to & queried from Firebase. ArcGIS then takes these nodes and displays them on the map. Story nodes follow a progression which in this application show as bright/dimmed nodes, but for players only the current node would show on the map and be accessible once their device is close enough to it.

![img](https://user-images.githubusercontent.com/5317415/45007493-cf31ff80-afb2-11e8-98b1-685d3bb3c1bd.png)

## Installation

Grab all the required packages:

```npm install redux react-redux react-router@3 firebase react-arcgis esri-loader --save```

Then run:

```npm start```
