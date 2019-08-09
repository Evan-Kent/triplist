import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { DragDropContext } from "react-beautiful-dnd";
import initialData from "./initialData";
import Column from "./column";

import "./index.css";

/************************************************************
 * A simple task list app by Evan Kent
 * React app format guidelines from react-beautiful-dnd
 * four-lines icon courtesy of https://feathericons.com
 * checkbox tips from styled components https://www.styled-components.com
 * and https://medium.com/@colebemis
 */

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialData;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  onDragEnd = result => {
    const { destination, source } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId
      && destination.index === source.index)
    {
      return
    }

    const column = this.state.columns[source.droppableId];
    const newTaskIds = reorder(
      Array.from(column.taskOrder),
      result.source.index,
      result.destination.index
    );

    const newColumn = {
      ...column,
      taskOrder: newTaskIds,
    };

      this.setState({
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        }
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const newTask = {
      id: `${this.state.taskCount + 1}`,
      content: this.state.input
    };

    this.setState({
      input: '',
      taskCount: this.state.taskCount + 1,
      tasks: {
        ...this.state.tasks,
        [newTask.id]: newTask
      },
      columns: {
        ...this.state.columns,
        ["column-1"]: {
          ...this.state.columns["column-1"],
          taskOrder: [
            ...this.state.columns["column-1"].taskOrder,
            newTask.id
          ]
        }
      }
    });
  };

  handleChange = (event) => {
    this.setState({
      input: event.target.value
    });
  };


  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.state.columnOrder.map(columnId => {
          const column = this.state.columns[columnId];
          const tasks = column.taskOrder.map(taskId => this.state.tasks[taskId]);

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              submitHandler={this.handleSubmit}
              changeHandler={this.handleChange}
              input={this.state.input}
            />
          );
        })}
      </DragDropContext>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
