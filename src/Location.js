import React from "react";
import styled from "styled-components";
import {ButtonContainer, Button} from './Button';
//import Map from "./Map";
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import ApiConfig from "./security";
import {fetchWrapper} from "./api";
const Api = require('./security');

const LocationContainer = styled.div`
  padding: 0 16px;
  cursor: pointer;
`;

const LocationText = styled.span`
  margin: 0 5px 0 18px;
  font-weight: bold;
  color: white;
  text-decoration: underline;
`;

const location = {
  OPEN: 'open',
  CLOSED: 'closed',
  EDITING: 'editing',
};


export default class Location extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: location.CLOSED,
      url: '',
      coords: {
        lat: 44.4280,
        lng: -110.5885
      },
      mapVisibility: "hide",
    };

    this.state.location = this.props.location ?
      this.props.location : 'Hot Springs National Park';
  }

  componentDidMount() {
    this.closed();
    this.geocodeThenLoadMap(this.state.location);
  }

  geocodeThenLoadMap = (location) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${ApiConfig.maps.apiKey}`;
    fetchWrapper({url}).then(data => {
      console.log("Geocode status", data.status);
      if (data.status === "OK") {
        console.log(data.results[0].geometry.location);
        this.setState({
          coords: data.results[0].geometry.location
        });
      }
    })
  };

  toggleMap = () => {
    this.setState({
      mapVisibility: (this.state.mapVisibility === "show") ? "hide" : "show"
    });
  };

  closed = () => {
    const controls = [
      <LocationText key={"text"} onClick={this.toggleMap}>
        {this.state.location === '' ? 'Click to enter a location!' : this.state.location}
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
    ];
    this.setState({
      controls: controls,
    });
  };

  editing = () => {
    const children = [
      <LocationText key={"text"}>
        {this.state.location === '' ? 'Click to enter a location!' : this.state.location}
      </LocationText>,
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
    ];
    this.setState({
      children: children,
    });
  };


  closeMap = () => {
    this.setState({
      children: {
        ...this.state.children,
        map: '',
      }
    });
  };

  openMap = () => {

  };

  handleClick = () => {
    if (this.state.open)
      this.closeMap();
    else if (this.state.location === '')
      this.openEditor();
    else
      this.openMap();
  };

  openEditor = () => {
    this.setState({
      status: location.EDITING,
    });

    return (
      <input type={"text"}/>
    )
  };

  render() {
    console.log(this.state.status, this.state.children);
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