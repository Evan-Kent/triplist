import React from "react";
import styled from "styled-components";
import {Draggable} from "react-beautiful-dnd";
import {Checkbox} from './Checkbox';

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

const ButtonContainer = styled.span`
  margin-left: auto;
  cursor: pointer;
`;

const Button = styled.svg`
  fill: #13d454;
  stroke: #003b14;
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
                {/*<Button*/}
                {/*  id={"Edit"}*/}
                {/*  viewBox={"0 0 24 24"}*/}
                {/*  width={"18"}*/}
                {/*  height={"18"}*/}
                {/*  onClick={(e) => this.props.editHandler(e, this.props.task.id)}*/}
                {/*>*/}
                {/*  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />*/}
                {/*</Button>*/}
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

