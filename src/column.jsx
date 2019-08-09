import React from "react";
import Task from "./task";
import styled from "styled-components";
import {Droppable} from "react-beautiful-dnd";

const ListContainer = styled.div`
  margin: 20px;
  border: 1px solid grey;
  border-radius: 10px;
  background-color: #4d5647;
`;

const Title = styled.h2`
  margin: 0;
  line-height: 1em;
  font-size: 4em;
  color: #e4e1ea;
  padding-left: 16px;
`;

const TaskList = styled.ul`
  padding: 16px;
`;

const Input = styled.input`
  width: 95%;
  border: 1px solid #96958A;
  border-radius: 5px;
  margin: 2.5%;
  height: 37px;
`;

export default class Column extends React.Component {
  render() {
    return (
      <ListContainer id="ListContainer">
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <TaskList ref={provided.innerRef} {...provided.droppableProps}>
              {
                this.props.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index}/>
                ))
              }
              {provided.placeholder}
              <NewTask
                input={this.props.input}
                submitHandler={this.props.submitHandler}
                changeHandler={this.props.changeHandler}
              />
            </TaskList>
          )}
        </Droppable>
      </ListContainer>
    );
  }
}

export class NewTask extends React.Component {
  //const  = "Add an item!";

  render() {
    return (
      <form
        onSubmit={this.props.submitHandler}
      >
        <Input
          type="text"
          onChange={this.props.changeHandler}
          value={this.props.input}
          //placeholder={placeholder}
        />
      </form>
    );
  }
}