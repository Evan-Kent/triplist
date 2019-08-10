import React from "react";
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";

const Container = styled.li`
  border: 1px solid #96958A;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 5px;
  list-style-type: none;
  display: flex;
  flex-grow: 1;
  align-items:center;
  ${props => (
  props.checked ? crossedout :
    props.isDragging ? dragging :
      (props.index % 2) ? evens : odds
)};
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

const crossedout = `
  text-decoration: line-through;
  background-color: #989c8e;
  color: grey;
`;
const dragging = `
  background-color: #85A0B7;
`;
const evens = `
  background-color: #e7efcd;
`;
const odds = `
  background-color: #a09574;
`;

const Icon = styled.svg`
  fill: none;
  stroke: darkgreen;
  stroke-width: 4px;
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
  border: 1px solid #2a5800;
  background: ${props => props.checked ? 'seagreen' : '#cad15e'}
  border-radius: 3px;
  transition: all 150ms;
  margin: 4px 16px;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 2px #4a7820;
  }
  ${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'}
  }
`;

const ButtonContainer = styled.span`
  margin-left: auto;
  cursor: pointer;
`;

const Button = styled.svg`
  fill: #cad15e;
  stroke: #2a5800;
  stroke-width: 1px;
  margin-right: 5px;
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
      <div style={{display: "flex"}}>
        <Draggable draggableId={this.props.task.id} index={this.props.index}>
          {(provided, snapshot) => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              checked={this.state.checked}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              index={this.props.index}
              className={this.state.checked ? "done" : ""}
            >
              <label>
                <Checkbox
                  checked={this.state.checked}
                  onChange={this.handleChecked}
                />
              </label>
              {this.props.task.content}
              <ButtonContainer>
                <Button
                  id={"Edit"}
                  viewBox={"0 0 24 24"}
                  width={"18"}
                  height={"18"}
                  onClick={(e) => this.props.editHandler(e, this.props.task.id)}
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </Button>
                <Button
                  id={"Delete"}
                  viewBox={"0 0 24 24"}
                  width={"18"}
                  height={"18"}
                  onClick={this.props.deleteHandler}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </Button>
              </ButtonContainer>
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