import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3NuZXdsZWFybmVycyIsImEiOiJjbGJvenZpdXkwM3FmM3ByN2NjeHd4aDl2In0.3zPvnWJZGQNDzllbqR6gjg';

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lng: this.props.lng,
            lat: this.props.lat,
            zoom: this.props.zoom,
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        this.LoadLocationList();
    }

    LoadLocationList() {

        axios({
            // need change localhost to the publicIP
            url: "http://localhost:8080/location",
            method: "POST",
        })
        .then((r) => {    
            const { lng, lat, zoom } = this.state;
            const map = new mapboxgl.Map({
                container: this.mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom
            });

            map.on('move', () => {
                this.setState({
                    lng: map.getCenter().lng.toFixed(4),
                    lat: map.getCenter().lat.toFixed(4),
                    zoom: map.getZoom().toFixed(2)
                });
            });

            map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('mapbox-map')}));
            
            for (let i of r.data) {
                new mapboxgl.Marker()
                .setLngLat([i.longitude, i.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`<h5>${i.name}</h5><h6>Event Number: ${i.programme.length}</h6>`))
                .addTo(map);
            }

        })
        .catch((err) => {
            console.log("Internal server error");
        });
    }

    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <div className="my-3">
                <div className="map-sidebar">
                    Longitude:&nbsp;{lng} | Latitude:&nbsp;{lat} | Zoom:&nbsp;{zoom}
                </div>
                <div id="mapbox-map" ref={this.mapContainer} className="map-container">
                </div>
            </div>
        );
    }
}

export default Map;
