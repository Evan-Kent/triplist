import React from "react";
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";

const Container = styled.li`
  border: 1px solid #96958A;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 5px;
  list-style-type: none;
  flex-grow: 1;
  background-color: ${props => (
  props.isDragging ?
    "#85A0B7" :
    (props.index % 2 ? "#a6a0a4" : "#858B71")
)};
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const HiddenCheckbox = styled.input.attrs({type: 'checkbox'})`
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
  background: ${props => props.checked ? 'red' : 'yellow'}
  border-radius: 3px;
  transition: all 150ms;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px pink;
  }
  ${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'}
  }
`;

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    }
  }

  handleChecked = e => {
    console.log("checked!");
    this.setState({
      checked: e.target.checked
    });
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <Checkbox
          checked={this.state.checked}
          onChange={this.handleChecked}
        />
        <Draggable draggableId={this.props.task.id} index={this.props.index}>
          {(provided, snapshot) => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              index={this.props.index}
              className={this.state.checked ? "done" : ""}
            >
              {this.props.task.content}
            </Container>
          )}
        </Draggable>
      </div>
    );
  }
}

const Checkbox = ({className, checked, ...props}) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"/>
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);