import React, { useState, useContext } from 'react';
import List from './List';
import home from '../img/home.svg';
import { Link } from 'react-router-dom';
import plus from '../img/plus.svg';
import close_black from '../img/close_black.svg';
import { BoardsProps, BoardContext } from '../Provider';
import { useLocation } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';

const { nanoid } = require('nanoid');

const Board = ({ ...item }) => {
  const { boards, addNewList, editBoard, onDragEnd } = useContext(BoardContext);
  const { name, id, img, content } = item;

  const location = useLocation();
  // ID текущей страницы взят из адреса
  let boardIdx = (location.pathname.slice(7)).toString();

  let myBoard: BoardsProps | undefined = boards.find((item: BoardsProps) => item.id === boardIdx);


  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState('');
  const [editText, setEditText] = useState(false);
  const [listEditableName, setListEditableName] = useState(myBoard!.name);

  const addList = (id: string) => {
    addNewList(id, { listTitle: listName, id: nanoid(), tasks: [] })
    setListName('');
    setOpen(false);
  }

  const onEditBoard = () => {
    editBoard(boardIdx, listEditableName)
    setEditText(!editText);
  }

  return (
    <div key={nanoid()}>
      <div className="board-item" style={{ background: myBoard!.img, backgroundSize: 'cover' }}></div>
      <div className="board-text">
        <div className="board-item__header">
          <Link to={`/`}>
            <img alt="home" src={home} className="board-item__home" />
          </Link>
          <div className="list__editable">
            {editText ? (
              <input className="list__new_input"
                value={listEditableName}
                placeholder="Ввести заголовок доски"
                onChange={(event) => setListEditableName(event.target.value)}
                onKeyPress={(event: any) => {
                  const keyCode = event.keyCode ? event.keyCode : event.which;
                  if (keyCode === 13) {
                    editBoard(boardIdx, listEditableName);
                    setEditText(!editText)
                  }
                }}
              />
            ) : (
              <div onDoubleClick={() => onEditBoard()} >
                <h3>{listEditableName}</h3>
              </div>
            )}
          </div>

        </div>


        <div className="board-item__body">
          <div className="list">
            {open ? (
              <>
                <div className="list__new_add" >
                  <input className="list__new_input"
                    type="text"
                    placeholder="Ввести заголовок списка"
                    value={listName}
                    onChange={(event) => setListName(event.target.value)}
                    onKeyPress={(event: any) => {
                      const keyCode = event.keyCode ? event.keyCode : event.which;
                      keyCode === 13 && addList(myBoard!.id);
                    }}
                  />
                  <div className="list__new_block">
                    <button className="list__new_btn" onClick={() => addList(myBoard!.id)}
                    >Добавить список</button>
                    <img alt="close" src={close_black} className="list__new_close" onClick={() => setOpen(!open)} />
                  </div>
                </div>
              </>
            ) : (
              <div className="list__new" onClick={() => setOpen(!open)}>
                <img src={plus} alt="plus" className="list__plus" />
                <h2>Добавить</h2>
              </div>
            )
            }
          </div>
          <div className="lists">
            <DragDropContext onDragEnd={result => onDragEnd(result, myBoard)}>
              {myBoard && myBoard!.content.map((item, index) => {
                const { id } = item;
                return (
                  <List key={id} {...item} />
                )
              })
              }
            </DragDropContext>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Board;
