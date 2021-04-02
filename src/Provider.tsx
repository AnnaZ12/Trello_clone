import React, { useState } from 'react'
import initialData from './utils/data';

export interface TasksProps {
  id: string,
  taskTitle: string,
  card?: any
}

export interface BoardsProps {
  id: string,
  name: string;
  img?: any;
  content: ContentProps[];
}
export interface ContentProps {
  id: string;
  listTitle?: string;
  tasks?: TasksProps[];
}
export interface TaskProps {
  id: string;
  taskTitle?: string;
  listId?: string;
}

export interface TaskPropsComponent {
  index: number;
  item: TaskProps;
  listId: string;
}

interface BoardContextProps {
  boards: BoardsProps[];
  addNewBoard: (newBoard: BoardsProps) => void;
  deleteBoard: (id: string) => void;
  addNewList: (id: string, newList: ContentProps) => void;
  deleteList: (boardId: string, listId: string) => void;
  editList: (boardId: string, listId: string, name: string) => void;
  editBoard: (boardId: string, name: string) => void;
  addTask: (boardId: string, listId: string, newTask: TaskProps) => void;
  deleteTask: (boardId: string, listId: string | undefined, taskId: string) => void;
  onDragEnd: (result: any, board: any) => void;
  editTask: (boardId: string, listId: string, taskId: string, name?: string) => void;
}

const initialState = {
  boards: initialData,
  addNewBoard: (newBoard: BoardsProps): void => { },
  deleteBoard: (id: string): void => { },
  addNewList: (id: string, newList: ContentProps): void => { },
  deleteList: (boardId: string, listId: string): void => { },
  editList: (boardId: string, listId: string, name: string): void => { },
  editBoard: (boardId: string, name: string): void => { },
  addTask: (boardId: string, listId: string, newTask: TaskProps): void => { },
  deleteTask: (boardId: string, listId: string | undefined, taskId: string): void => { },
  onDragEnd: (result: any, board: any): void => { },
  editTask: (boardId: string, listId: string, taskId: string, name?: string): void => { },
}



export const BoardContext = React.createContext<BoardContextProps>(initialState);
const { Provider } = BoardContext;

export const BoardProvider = ({ children }: any) => {

  const [boards, setBoards] = useState<BoardsProps[]>(initialData);

  // Done
  const addNewBoard = (newBoard: BoardsProps) => {
    const newBoardsList = [...boards, newBoard];
    setBoards(newBoardsList);
  }

  // Done
  const deleteBoard = (id: string) => {
    const newBoardsList = [...boards];
    let newBoards = newBoardsList.filter((item: any) => item.id !== id);
    setBoards(newBoards);
  }

  // Добработать. функция правильное. ввод в инпут по 1 символу
  //ввод только по 1 символу. Пофиксить
  const editBoard = (boardId: string, name: string) => {
    const currentBoard: any = boards.find(item => item.id === boardId);
    currentBoard.name = name;
    setBoards(boards);
  }

  // Добработать. функция правильное. ввод в инпут по 1 символу
  const addNewList = (id: string, newList: ContentProps) => {
    const currentBoard: any = boards.find(item => item.id === id);
    currentBoard?.content.push(newList);
    setBoards(boards);
  }

  // Done
  const deleteList = (boardId: string, listId: string) => {
    let newBoarsd = [...boards];
    const currentBoard: any = newBoarsd.find(item => item.id === boardId);
    const currentList = currentBoard.content.find((item: any) => item.id === listId)
    const idx = currentBoard.content.indexOf(currentList);
    idx >= 0 && currentBoard.content.splice(idx, 1);
    setBoards(newBoarsd);
  }

  // Done
  const editList = (boardId: string, listId: string, name: string) => {
    const currentBoard: any = boards.find(item => item.id === boardId);
    const currentList = currentBoard.content.find((item: any) => item.id === listId)
    currentList.listTitle = name;
    setBoards(boards);
  }

  // Done
  const addTask = (boardId: string, listId: string, newTask: TaskProps) => {
    const currentBoard: any = boards.find(item => item.id === boardId);
    const currentList = currentBoard.content.find((item: any) => item.id === listId);
    currentList.tasks.push(newTask);
    setBoards(boards)
  }

  // Done
  const deleteTask = (boardId: string, listId: string | undefined, taskId: string) => {
    let newBoarsd = [...boards];
    const currentBoard: any = newBoarsd.find(item => item.id === boardId);
    const currentList = currentBoard.content.find((item: any) => item.id === listId);
    console.log(`currentBoard ${currentBoard}`)
    console.log(`listId {listId}`)
    const currentTask = currentList.tasks.find((item: any) => item.id === taskId);
    const idx = currentList.tasks.indexOf(currentTask);
    idx >= 0 && currentList.tasks.splice(idx, 1);
    setBoards(newBoarsd);
  }

  const editTask = (boardId: string, listId: string, taskId: string, name?: string) => {
    const currentBoard: any = boards.find(item => item.id === boardId);
    const currentList = currentBoard.content.find((item: any) => item.id === listId);
    const currentTask = currentList.tasks.find((item: any) => item.id === taskId)
    currentTask.taskTitle = name;
    setBoards(boards);
  }

  // Done
  const onDragEnd = (result: any, board: any) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // откуда перетаскиваем (ИД листа) === куда перетаскиваем (ИД листа)
    if (source.droppableId === destination.droppableId) {
      // определяем лист, в котором происходит действие
      const currentList = board.content.find((item: any) => item.id === source.droppableId)
      // копируем его внутреннее состояние
      const copiedItems = [...currentList.tasks];
      //удаляем тот элемент, который переместили из текущего листа
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      let coppiedContent = [...board.content]
      let updatedContent = coppiedContent.map(item => {
        if (item.id === source.droppableId) {
          return { ...item, tasks: copiedItems }
        }
        return item
      })
      let coppiedBoards = [...boards];
      let updateBoards = coppiedBoards.map(item => {
        if (item.id === board.id) {
          return { ...item, content: updatedContent }
        }
        return item
      })
      setBoards(updateBoards)
    } else {
      const sourceList = board.content.find((item: any) => item.id === source.droppableId);
      const destList = board.content.find((item: any) => item.id === destination.droppableId);
      const sourceItems = [...sourceList.tasks];
      const destItems = [...destList.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      let coppiedContent = [...board.content]
      let updatedContent = coppiedContent.map(item => {
        let newArr = { ...item }
        if (item.id === source.droppableId) {
          newArr = { ...item, tasks: sourceItems }
        }
        if (item.id === destination.droppableId) {
          newArr = { ...item, tasks: destItems }
        }
        return newArr
      })

      let coppiedBoards = [...boards];
      let updateBoards = coppiedBoards.map(item => {
        if (item.id === board.id) {
          return { ...item, content: updatedContent }
        }
        return item
      })
      console.log(updateBoards)
      setBoards(updateBoards)
    }
  };

  console.log(boards)

  return (
    <div>
      <Provider value={{
        boards, addNewBoard, deleteBoard, addNewList, deleteList, editList, editBoard, addTask, deleteTask, onDragEnd, editTask
      }}>
        {children}
      </Provider>
    </div>
  )
}
