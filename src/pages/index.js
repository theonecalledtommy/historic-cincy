import React from 'react';
import { Helmet } from 'react-helmet';
import { Marker, Popup } from 'react-leaflet';

import { promiseToFlyTo } from 'lib/map';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 39.1196,
  lng: -84.5108,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 5;
const ZOOM = 12;

const timeToZoom = 2000;

const markers = [];

let config = require('./../assets/geojson/photos.json');

for (var idx in config) {
  var item = config[idx];
  markers.push({
    name: item.properties.name,
    title: item.properties.title,
    url: item.properties.url,
    lat: item.properties.lat,
    lng: item.properties.lng,
    imageUrl: item.properties.imageURL,
    streetViewUrl: item.properties.streetviewURL
  });
}

const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */
  async function mapEffect({ leafletElement } = {}) {
    if ( !leafletElement ) return;

    setTimeout( async () => {
      await promiseToFlyTo( leafletElement, {
        zoom: ZOOM,
        center: [LOCATION.lat, LOCATION.lng],
      });
    }, timeToZoom );
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Historic Cincy</title>
      </Helmet>
      
      <Map {...mapSettings}>
        {markers.map(marker => { return (
          <Marker key={marker.url} position={[marker.lat, marker.lng] }>
            <Popup maxWidth="250">
              <div className="popup-gatsby">
                <div className="popup-gatsby-image">
                  <img className="gatsby-astronaut" src={marker.imageUrl} alt=""/>
                </div>
                <div className="popup-gatsby-content">
                  <h3>{marker.name}</h3>
                  <a target="_blank" rel="noreferrer" href={marker.imageUrl}>Image</a>
                  <a target="_blank" rel="noreferrer" href={marker.url}>UC Library</a>
                  <a target="_blank" rel="noreferrer" href={marker.streetViewUrl}>Street View</a>
                </div>
              </div>
            </Popup>
          </Marker>
        )})}
      </Map>

      <Container type="content" className="text-center home-start">
        <a target="blank_" rel="noreferrer" href="https://drc.libraries.uc.edu/handle/2374.UC/702759">Cincinnati Subway and Street Improvements - University of Cincinnati Digital Resource Commons</a>
      </Container>
    </Layout>
  );
};

export default IndexPage;
