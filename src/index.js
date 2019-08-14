import React from "react";
import ReactDOM from "react-dom";
import {DragDropContext} from "react-beautiful-dnd";
//import { ApiRequest, fetchWrapper } from "./api";
import Column from "./Column";
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
      backgroundImage: "",
      location: 'Yellowstone'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.state.backgroundImage === "")
      this.setBackgroundImage();
    this.getStarterList();
  }

  setBackgroundImage = () => {
    // fetchWrapper(ApiRequest.unsplash).then(data => {
    //   this.setState({
    //     backgroundImage: data.urls.regular
    //   });
    // });

    this.setState({
      backgroundImage: 'bg-trees.jpg'
    })
  };

  getStarterList = () => {
    db.collection("lists")
      .doc(this.props.listName)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.readState(doc.data());
          console.log(`${this.props.listName} read from the database.`)
        } else {
          console.log(`${this.props.listName} does not exist in the database!`);
        }
      });
  };

  readState = initialState => {
    if (initialState.tasks &&
      initialState.columns &&
      initialState.columnOrder &&
      initialState.taskCount) {
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
    }
  };

  writeState = () => {
    const document = {
      tasks: this.state.tasks,
      columns: this.state.columns,
      columnOrder: this.state.columnOrder,
      taskCount: this.state.taskCount
    };
    if (document) {
      db.collection("lists").doc(this.props.listName)
        .set(document).then(() => {
          console.log("List written to database.");
      }).catch((error) => {
          console.error("Error writing to database: ", error);
      });
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
    }, () => {
      this.writeState();
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
    }, () => {
      this.writeState();
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
      this.writeState();
    });
  };

  render() {
    return (
      <div>
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
                editHandler={this.handleEdit}
                deleteHandler={this.handleDelete}
                input={this.state.input}
              />
            );
          })}
        </DragDropContext>
        <img alt="background" id="bg" src={`${this.state.backgroundImage}`}/>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App listName={"initialData"}/>, rootElement);
