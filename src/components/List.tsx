import React, { useState, useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import plus from '../img/plus.svg';
import trash from '../img/trash.svg';
import close_black from '../img/close_black.svg';
import { useLocation } from "react-router-dom";
import { BoardContext } from '../Provider';

const { nanoid } = require('nanoid')

const List = ({ ...item }) => {
  const { deleteList, editList, addTask } = useContext(BoardContext);

  const location = useLocation();
  // ID текущей страницы взят из адреса
  let boardIdx = (location.pathname.slice(7)).toString();

  const { id, listTitle, tasks } = item;
  const listId = id;

  const [editText, setEditText] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [listEditableName, setListEditableName] = useState(listTitle);

  const onDeleteList = () => {
    deleteList(boardIdx, id)
  }

  const onEditList = () => {
    setEditText(true);
    editList(boardIdx, id, listEditableName);
  }

  const onAddTask = () => {
    addTask(boardIdx, id, { id: nanoid(), taskTitle: taskName });
    setTaskName('');
    setOpenCard(!openCard)
  }

  /** закрытие формы добавления нового листа при потере фокуса */
  const handleOnBlur = () => {
    setEditText(!editText);
    setListEditableName(listTitle);
  }

  return (
    <>
      <div className="lists-item">
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} key={id} style={{
              background: snapshot.isDraggingOver
                ? "lightblue"
                : "#f8f4f2",
            }}>
              <div className="lists-item__container" onDoubleClick={() => onEditList()}>
                {editText ? (
                  <input className="list__new_input"
                    value={listEditableName}
                    placeholder="Ввести заголовок списка"
                    onChange={(event) => setListEditableName(event.target.value)}
                    onKeyPress={(event: any) => {
                      const keyCode = event.keyCode ? event.keyCode : event.which;
                      if (keyCode === 13) {
                        editList(boardIdx, id, listEditableName);
                        setEditText(!editText);
                      }
                    }}
                    onBlur={handleOnBlur}
                  />
                ) : (
                  <>
                    <div className="lists-item__block">{listEditableName}</div>
                    <div className="icons-container">
                      <img src={trash} alt="trash" className="svg-hide" onClick={() => onDeleteList()} />
                    </div>
                  </>
                )
                }
              </div>
              {openCard ?
                (<div className="list__new_add" >
                  <input className="task__new_input"
                    type="text"
                    placeholder="Ввести название карточки"
                    value={taskName}
                    onChange={(event) => setTaskName(event.target.value)}
                    onKeyPress={(event: any) => {
                      const keyCode = event.keyCode ? event.keyCode : event.which;
                      keyCode === 13 && onAddTask();
                    }}
                  />
                  <div className="list__new_block">
                    <button className="list__new_btn"
                      onClick={onAddTask}
                    >Добавить карточку</button>
                    <img alt="close" src={close_black} className="list__new_close"
                      onClick={onAddTask}
                    />
                  </div>
                </div>)
                :
                (<div className="list__new" onClick={() => setOpenCard(!openCard)}>
                  <img src={plus} alt="plus" className="list__plus" />
                  <h2>Добавить карточку</h2>
                </div>)
              }
              {tasks.map((item: any, index: number, id: string) => {
                return (
                  <Task key={item.id} item={item} listId={listId} index={index} />
                )
              }
              )}
              {/* {provided.placeholder} */}
            </div>
          )}
        </Droppable>
      </div>
    </>
  )
};

export default List;
