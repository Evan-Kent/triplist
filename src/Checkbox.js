import styled from "styled-components";
import React from "react";

const Icon = styled.svg`
  fill: none;
  stroke: lightgreen;
  stroke-width: 4px;
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #003b14;
  background: ${props => (props.checked ? "#13d454" : `#7d9685`)}
  border-radius: 3px;
  transition: all 150ms;
  margin: 4px 16px;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 2px #00cc45;
  }
  ${Icon} {
    visibility: ${props => (props.checked ? "visible" : "hidden")}
  }
`;

export const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);
