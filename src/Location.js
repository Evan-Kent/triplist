import React from "react";
import styled from "styled-components";

const LocationContainer = styled.div`
  padding-left: 16px;
`

export default class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      location: '',
      url: ''
    }
  }

  render() {
    return(
      <LocationContainer id={"#map"}>
          {this.state.location === '' ? 'Click to enter a location!' : this.state.location}
      </LocationContainer>
    );
  }
}