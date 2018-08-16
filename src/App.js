import React, { Component } from 'react';
import Leaflet from 'leaflet';
import './App.css';
import { geoData } from './geoData';
import { processData } from './process-map'

class App extends Component {
  constructor(props) {
    super(props);
    this.leaflet = Leaflet;
    this.map = null;
    this.state = {
      center: null,
      zoom: null,
    };
  }
  componentDidMount() {
    processData(geoData);

    this.map = this.leaflet.map('mapid', {
      center: [55.74, 37.4],
      minZoom: 2,
      zoom: 6,
    });
    this.leaflet
      .tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c'],
      })
      .addTo(this.map);

    this.map.on('zoomend', () => {
      this.setState({ center: this.map.getCenter(), zoom: this.map.getZoom() });
      this.switchMarkes();
    });
    this.map.on('moveend', () => {
      this.setState({ center: this.map.getCenter(), zoom: this.map.getZoom() });
    });
    this.setState({ center: this.map.getCenter(), zoom: this.map.getZoom() });

    const pinIcon = this.leaflet.icon({
      iconUrl:
        'http://www.clker.com/cliparts/N/Z/Y/y/P/w/map-pin-with-shadow-th.png',
      iconSize: [53, 60],
      iconAnchor: [3, 57],
      popupAnchor: [10, -59],
    });
    this.divIcon = count =>
      this.leaflet.divIcon({
        className: 'my-div-icon',
        html: `<div class="my-marker">${count}</div>`,
        iconSize: [32, 32],
      });

    // this.markers = [
    //   {
    //     coords: [55.7591755, 37.6188279],
    //     title: 'Drova Headquarter',
    //     icon: divIcon,
    //     count: 128,
    //   },
    //   {
    //     coords: [55.891967387457, 37.4450969696],
    //     title: 'Khimki gamers',
    //     icon: divIcon,
    //     count: 4,
    //   },
    //   {
    //     coords: [56.304098, 43.8974711],
    //     title: 'Merchant1',
    //     icon: divIcon,
    //     games: ['GM1', 'GM2', 'GM3'],
    //     count: 16,
    //   },
    //   {
    //     coords: [56.8571999, 35.909169],
    //     title: 'Merchant2',
    //     icon: divIcon,
    //     games: ['GM2', 'GM3'],
    //     count: 3,
    //   },
    //   {
    //     coords: [56.141765, 40.4103817],
    //     title: 'Merchant3',
    //     icon: divIcon,
    //     games: ['GM1', 'GM2', 'GM3'],
    //     count: 24,
    //   },
    //   {
    //     coords: [55.3828335, 39.0347418],
    //     title: 'Merchant4',
    //     icon: divIcon,
    //     games: ['GM2'],
    //     count: 43,
    //   },
    //   {
    //     coords: [55.3957117, 43.8069784],
    //     title: 'Merchant5',
    //     icon: divIcon,
    //     games: ['GM1'],
    //     count: 19,
    //   },
    //   {
    //     coords: [54.932779, 43.3296275],
    //     title: 'Merchant6',
    //     icon: divIcon,
    //     games: ['GM3'],
    //     count: 7,
    //   },
    // ];
    this.filterMarkers();
  }

  createTooltip = marker => {

    return `<span>${marker.count.online}</span>`;
  };

  filterMarkers = () => {
    const zoom = this.state.zoom;
    geoData
      .filter(mkr => {
        const zooms = mkr.zooms;
        if (zooms && zooms.length) {
          const zLvl = zooms.find(z => z.minLvl <= zoom);
          if (zLvl) {
            return zLvl.cluster;
          }
        }
        return true;
      })
      .forEach((mkr, ind) => {
        this.leaflet
          .marker(mkr.coords, { icon: this.divIcon(ind /* mkr.count.online */) })
          .bindTooltip(this.createTooltip(mkr))
          .addTo(this.map);
      });
  };

  switchMarkes = search => () => {
    this.markers.forEach(mkr => {
      mkr.marker.remove();
    });
    this.filterMarkers(search);
  };

  render() {
    const btnStyle = {
      margin: 5,
    };
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Leaflet & OpenStreetMap</h1>
        </header>
        <div
          id="mapid"
          style={{ height: 440, border: '1px solid #AAA', marginBottom: 16 }}
        />
        <button onClick={this.switchMarkes()} style={btnStyle}>
          All
        </button>
        <button onClick={this.switchMarkes('GM1')} style={btnStyle}>
          GM1
        </button>
        <button onClick={this.switchMarkes('GM2')} style={btnStyle}>
          GM2
        </button>
        <button onClick={this.switchMarkes('GM3')} style={btnStyle}>
          GM3
        </button>
        <span style={btnStyle}>zoom: {this.state.zoom}</span>
        <span style={btnStyle}>
          center: {JSON.stringify(this.state.center)}
        </span>
        <br />
        <a href="https://github.com/UsulPro/leaflet-sample" target="_blank">
          repo
        </a>

        <br />
      </div>
    );
  }
}

export default App;
