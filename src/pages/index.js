import React from 'react';
import axios from 'axios';

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


class IndexPage extends React.Component {
  constructor() {
    super();
    this.state = {
      markers: [],
      apiEndpoint: "https://aqhseigkci.execute-api.us-east-2.amazonaws.com/dev/photos",
      mapSettings: {
        center: CENTER,
        defaultBaseMap: 'OpenStreetMap',
        zoom: DEFAULT_ZOOM,
        mapEffect: this.mapEffect
      }
    };
  }

  componentDidMount() {
    setTimeout(async () => {
      let photos = await this.getPhotos().then(res => res.data);
      this.setState({markers: photos})
    }, 1000);
  }

  /**
   * getPhotos
   * @description Retrieve a list of photos to place on the map
   */
  async getPhotos() {
    return axios.get(this.state.apiEndpoint);
  }

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   */
  mapEffect({ leafletElement } = {}) {
    if ( !leafletElement ) return;

    setTimeout( async () => {
      await promiseToFlyTo( leafletElement, {
        zoom: ZOOM,
        center: [LOCATION.lat, LOCATION.lng],
      });
    }, timeToZoom );
  }

  render() {
    return (
      <Layout pageName="home">
        <Helmet>
          <title>Historic Cincy</title>
        </Helmet>

        <Map {...this.state.mapSettings}>
          {this.state.markers.map(marker => { return (
            <Marker key={marker.properties.url} position={[marker.properties.lat, marker.properties.lng] }>
              <Popup maxWidth="250">
                <div className="popup-gatsby">
                  <div className="popup-gatsby-image">
                    <img className="gatsby-astronaut" alt="" src={marker.properties.imageURL}/>
                  </div>
                  <div className="popup-gatsby-content">
                    <h3>{marker.properties.name}</h3>
                    <a target="_blank" rel="noreferrer" alt="" href={marker.properties.imageURL}>Image</a>
                    <a target="_blank" rel="noreferrer" alt="" href={marker.properties.url}>UC Library</a>
                    <a target="_blank" rel="noreferrer" alt="" href={marker.properties.streetviewURL}>Street View</a>
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
  }
};

export default IndexPage;
