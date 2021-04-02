import React, { useState, useContext } from 'react';
import { TaskPropsComponent } from '../Provider';
import draw from '../img/draw.svg';
import trash from '../img/trash.svg';
import { BoardContext } from '../Provider';
import { useLocation } from "react-router-dom";
import { Draggable } from 'react-beautiful-dnd';
import Card from './Card'

const Task: React.FC<TaskPropsComponent> = ({ item, index, listId }: TaskPropsComponent) => {
  const { id, taskTitle } = item;
  const { deleteTask, editTask } = useContext(BoardContext);

  const [editTaskTitle, setEditTaskTitle] = useState(false);
  const [taskEditableName, setTaskEditableName] = useState(taskTitle);
  const [openTask, setOpenTask] = useState(false);

  const location = useLocation();
  // ID текущей страницы взят из адреса
  let boardIdx = (location.pathname.slice(7)).toString();

  const onDelete = () => {
    console.log(listId)
    deleteTask(boardIdx, listId, id);
  }

  const handleOnBlur = () => {
    setEditTaskTitle(false);
    setTaskEditableName(taskTitle);
  }

  const onEditTask = () => {
    setEditTaskTitle(true);
    editTask(boardIdx, listId, id, taskEditableName);
  }

  const togglePopup = () => {
    setOpenTask(!openTask);
    console.log('open')
  }

  return (
    <Draggable draggableId={id} index={index} key={id}>
      {provided => (
        <div {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="task" >
            {editTaskTitle ? (
              <input className="list__new_input"
                value={taskEditableName}
                placeholder="Ввести заголовок списка"
                onChange={(event) => setTaskEditableName(event.target.value)}
                onKeyPress={(event: any) => {
                  const keyCode = event.keyCode ? event.keyCode : event.which;
                  if (keyCode === 13) {
                    editTask(boardIdx, listId, id, taskEditableName);
                    setEditTaskTitle(false);
                  }
                }}
                onBlur={handleOnBlur}
              />
            ) : (
              <>
                <div onClick={() => togglePopup()} className="task__title" style={{ cursor: 'pointer' }}>{taskEditableName}</div>
                <div className="icons-container">
                  <img src={draw} alt="draw" className="svg-hide"
                    onClick={() => onEditTask()}
                  />
                  <img src={trash} alt="trash" className="svg-hide"
                    onClick={onDelete}
                  />
                </div>
              </>
            )}
            {openTask &&
              <Card
                taskTitle={taskTitle}
                togglePopup={() => togglePopup()}
              />
            }
          </div>
        </div>
      )}
    </Draggable>

  )
}

export default Task;
