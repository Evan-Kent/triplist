import React from "react";
import ReactDOM from "react-dom";
import {DragDropContext} from "react-beautiful-dnd";
//import initialData from "./initialData";
import Column from "./column";
import "./styles.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";

const ApiConfig = require("./security.json");


/************************************************************
 * A simple task list app by Evan Kent
 * React app format guidelines from react-beautiful-dnd
 * four-lines icon courtesy of https://feathericons.com
 * checkbox tips from styled components https://www.styled-components.com
 * and https://medium.com/@colebemis
 */


firebase.initializeApp(ApiConfig.firestore);
const db = firebase.firestore();

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      editing: false,
      tempContent: "",
      input: "",
      columns: {},
      tasks: {},
      columnOrder: [],
      taskCount: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.finishEdit = this.finishEdit.bind(this);
  }

  componentDidMount() {
    this.getStarterList();
  }

  getStarterList = () => {
    db.collection("lists")
      .doc("initialData")
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(this.state);
          this.setInitialState(doc.data());
        } else {
          console.log("initialData does not exist!");
        }
      });
  };

  setInitialState = initialState => {
    if (initialState.tasks &&
      initialState.columns &&
      initialState.columnOrder &&
      initialState.taskCount) {
      console.log("we good!");
      this.setState({
        tasks: initialState.tasks,
        columns: initialState.columns,
        columnOrder: initialState.columnOrder,
        taskCount: initialState.taskCount,
      }, () => {
        this.setState({
          loading: false,
        })
      });
      console.log(this.state);
    }
  };

  onDragEnd = result => {
    const {destination, source} = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId
      && destination.index === source.index) {
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
        "column-1": {
          ...this.state.columns["column-1"],
          taskOrder: [
            ...this.state.columns["column-1"].taskOrder,
            newTask.id
          ]
        }
      }
    });
  };

  setTaskState = (task) => {
    this.setState({
      tasks: {
        ...this.state.tasks,
        [task.id]: task
      }
    });
  };

  handleChange = (event) => {
    this.setState({
      input: event.target.value
    });
  };

  finishEdit = (event, task) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event, task);
  };

  handleEdit = (event, taskId) => {
    if (this.state.editing) return;

    this.setState({
      editing: true
    });

    const task = this.state.tasks[taskId];
    task.content = <TaskInput
      type={"text"}
      value={task.content}
      handleChange={(e) => this.setState({tempContent: e.target.value})}
      handleSubmit={(e) => this.finishEdit(e, task)}
    />;
    console.log(task);
    this.setTaskState(task);
  };

  handleDelete = (event, columnId, index) => {
    const column = this.state.columns[columnId];
    const taskOrder = column.taskOrder.slice(0, index).concat(
      column.taskOrder.slice(index + 1));

    this.setState({
      columns: {
        ...this.state.columns,
        [columnId]: {
          ...this.state.columns["column-1"],
          taskOrder: taskOrder
        }
      }
    }, () => {
      console.log(this.state.columns);
    });
  };

  render() {
    console.log("rendering!", this.state.loading);
    return (
      <>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const tasks = column.taskOrder.map(taskId => this.state.tasks[taskId]);
            // console.log("order of taskIds", column.taskOrder);
            // console.log("tasks passed to column: ", tasks);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                submitHandler={this.handleSubmit}
                changeHandler={this.handleChange}
                editHandler={this.handleEdit}
                deleteHandler={this.handleDelete}
                input={this.state.input}
              />
            );
          })}
        </DragDropContext>
      </>
    );
  }
}
const TaskInput = ({...props}) => (
  <form>
    <input
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      onSubmit={props.handleSubmit}
    />
  </form>
);
const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
