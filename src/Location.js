import React from "react";
import styled from "styled-components";
import {ButtonContainer, Button} from './Button';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import ApiConfig from "./security";
import {fetchWrapper, ApiRequest} from "./api";
const Api = require('./security');

const LocationContainer = styled.div`
  padding: 0 16px;
  cursor: pointer;
`;

const LocationInput = styled.input.attrs(props => ({
  type: 'text'
}))`
  width: 50%;
`;

const LocationText = styled.span`
  margin: 0 5px 0 18px;
  font-weight: bold;
  color: white;
  text-decoration: underline;
`;

export default class Location extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      coords: {
        lat: 44.4280,
        lng: -110.5885
      },
      mapVisibility: "hide",
    };
  }

  componentDidMount() {
    this.setState({
      controls: this.closed('Click to enter a location!')
    });
    this.geocodeThenLoadMap(this.state.location);
  }

  geocodeThenLoadMap = (location) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${ApiConfig.maps.apiKey}`;
    fetchWrapper({
      url: geocodeUrl,
      options: ApiRequest.maps.options
    }).then(data => {
      console.log("Geocode status ", data.status);
      if (data.status === "OK") {
        this.setState({
          coords: data.results[0].geometry.location
        });
      }
    })
  };

  closed = (location) => {
    return ([
      <LocationText key={"text"} onClick={this.toggleMap}>
        {location}
      </LocationText>,
      <ButtonContainer key={"edit"}>
        <Button
          id={"Edit"}
          viewBox={"0 0 24 24"}
          width={"15"}
          height={"15"}
          onClick={this.openEditor}>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </Button>
      </ButtonContainer>
    ]);
  };

  editing = () => {
    return ([
      <LocationInput
        key={"input"}
        placeholder={"Add your location here"}
        value={this.state.input}
        onChange={this.updateEditor}
        onSubmit={(e) => e.preventDefault()}
      />,
      <ButtonContainer key={"save"}>
        <Button
          id={"Save"}
          viewBox={"0 0 24 24"}
          width={"15"}
          height={"15"}
          onClick={this.saveEdit}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </Button>
      </ButtonContainer>
    ]);
  };

  toggleMap = () => {
    this.setState({
      mapVisibility: (this.state.mapVisibility === "show") ? "hide" : "show"
    });
  };

  updateEditor = (event) => {
    this.setState({
      input: event.target.value
    });
  };

  saveEdit = (event) => {
    event.preventDefault();
    this.setState({
      location: this.state.input,
      controls: this.closed(this.state.input)
    }, () => this.geocodeThenLoadMap(this.state.location));
  };

  openEditor = () => {
    console.log('opening location editor');
    this.setState({
      input: this.state.location,
      controls: this.editing()
    });
  };

  render() {
    console.log("location", this.state.location);
    return (
      <LocationContainer>
        {this.state.controls}
        <LoadScript
          id="script-loader"
          googleMapsApiKey={Api.maps.apiKey}
        >
          <GoogleMap
            id='map'
            zoom={8}
            center={this.state.coords}
            mapContainerClassName={this.state.mapVisibility}
          >
            <Marker position={this.state.coords} />
          </GoogleMap>
        </LoadScript>
      </LocationContainer>
    );
  }
}