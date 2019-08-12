import React from "react";
import Task from "./Task";
import styled from "styled-components";
import {Droppable} from "react-beautiful-dnd";

const ListContainer = styled.div`
  margin: 20px auto;
  border: 1px solid grey;
  border-radius: 10px;
  background-color: rgba(83, 100, 89, .65);
  max-width: 900px;
  
`;

const Title = styled.h2`
  margin: -4px 0 0 -18px;
  letter-spacing: .05em;
  font-family: 'Amatic SC', cursive;
  font-weight: bold;
  line-height: 1em;
  font-size: 4em;
  color: #e4e1ea;
  padding-left: 16px;
`;

const TaskList = styled.ul`
  padding: 16px;
`;

const Input = styled.input`
  font-family: "Open Sans", Arial, sans-serif;
  width: 98%;
  margin: 1%;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #96958A;
  border-radius: 5px;
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
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    editHandler={this.props.editHandler}
                    deleteHandler={(e) => this.props.deleteHandler(e, this.props.column.id, index)}
                  />
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
  render() {
    return (
      <form
        onSubmit={this.props.submitHandler}
      >
        <Input
          type="text"
          onChange={this.props.changeHandler}
          value={this.props.input}
          placeholder={"Add an item!"}
        />
      </form>
    );
  }
}