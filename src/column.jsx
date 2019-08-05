import React from "react";
import Task from "./task";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";

const ListContainer = styled.div`
  margin: 20px;
  border: 1px solid grey;
  border-radius: 10px;
`;

const Title = styled.h2`
  padding: 16px;
`;

const TaskList = styled.ul`
  padding: 16px;
`;

export default class Column extends React.Component {
  render() {
    return (
      <ListContainer>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <TaskList ref={provided.innerRef} {...provided.droppableProps}>
              {this.props.tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </ListContainer>
    );
  }
}
