import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3NuZXdsZWFybmVycyIsImEiOiJjbGJvenZpdXkwM3FmM3ByN2NjeHd4aDl2In0.3zPvnWJZGQNDzllbqR6gjg';

class Map extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.lng);
        console.log(this.props.lat);
        console.log(this.props.zoom);
        this.state = {
            lng: this.props.lng,
            lat: this.props.lat,
            zoom: this.props.zoom
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
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
    }

    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <div className="my-3">
                <div className="map-sidebar">
                    Longitude:&nbsp;{lng} | Latitude:&nbsp;{lat} | Zoom:&nbsp;{zoom}
                </div>
                <div ref={this.mapContainer} className="map-container" />
            </div>
        );
    }
}

export default Map;
