import React, { Component } from 'react';
import Leaflet from 'leaflet';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.leaflet = Leaflet;
    this.map = null;
  }
  componentDidMount() {
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


    const pinIcon = this.leaflet.icon({
      iconUrl:
        'http://www.clker.com/cliparts/N/Z/Y/y/P/w/map-pin-with-shadow-th.png',
      // iconRetinaUrl: 'http://www.clker.com/cliparts/Y/x/h/R/y/I/blue-google-map-pin-md.png',
      iconSize: [53, 60],
      iconAnchor: [3, 57],
      popupAnchor: [10, -59],
    });

    this.markers = [
      {
        coords: [55.7591755, 37.6188279],
        title: 'Drova Headquarter',
      },
      {
        coords: [56.304098, 43.8974711],
        title: 'Merchant1',
        icon: pinIcon,
        games: ['GM1', 'GM2', 'GM3'],
      },
      {
        coords: [56.8571999, 35.909169],
        title: 'Merchant2',
        icon: pinIcon,
        games: ['GM2', 'GM3'],
      },
      {
        coords: [56.141765,40.4103817],
        title: 'Merchant3',
        icon: pinIcon,
        games: ['GM1', 'GM2', 'GM3'],
      },
      {
        coords: [55.3828335,39.0347418],
        title: 'Merchant4',
        icon: pinIcon,
        games: ['GM2'],
      },
      {
        coords: [55.3957117,43.8069784],
        title: 'Merchant5',
        icon: pinIcon,
        games: ['GM1'],
      },
      {
        coords: [54.932779,43.3296275],
        title: 'Merchant6',
        icon: pinIcon,
        games: ['GM3'],
      },
    ];
    this.filterMarkers();
  }

  createPopup = marker => {
    const games = marker.games && `<ul>${marker.games.map(gm =>`<li>${gm}</li>`).join('')}</ul>`
    return `<h2>${marker.title}</h2>${games || ''}`
  }

  filterMarkers = search => {
    this.markers
      .filter(mkr => {
        if (!search) return true;
        if (!mkr.games) return true;
        return mkr.games.includes(search);
      })
      .forEach(mkr => {
        mkr.marker = this.leaflet
          .marker(mkr.coords, mkr.icon && { icon: mkr.icon })
          .bindPopup(this.createPopup(mkr));

        mkr.marker.addTo(this.map);
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
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Leaflet & OpenStreetMap</h1>
        </header>
        <div
          id="mapid"
          style={{ height: 440, border: '1px solid #AAA', marginBottom: 16 }}
        />
        <button onClick={this.switchMarkes()} style={btnStyle}>All</button>
        <button onClick={this.switchMarkes('GM1')} style={btnStyle}>GM1</button>
        <button onClick={this.switchMarkes('GM2')} style={btnStyle}>GM2</button>
        <button onClick={this.switchMarkes('GM3')} style={btnStyle}>GM3</button>
        <br/>
        <a href="https://github.com/UsulPro/leaflet-sample" target="_blank">repo</a>
      </div>
    );
  }
}

export default App;
