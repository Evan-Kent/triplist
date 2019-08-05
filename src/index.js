import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { DragDropContext } from "react-beautiful-dnd";
import initialData from "./initialData";
import Column from "./column";

import "./styles.css";

class App extends React.Component {
    state = initialData;

    onDragEnd = result => {
        //TODO: reorder our column
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {this.state.columnOrder.map(columnId => {
                    const column = this.state.columns[columnId];
                    const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

                    return <Column key={column.id} column={column} tasks={tasks} />;
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
