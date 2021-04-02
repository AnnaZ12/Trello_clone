import React, { useContext } from 'react'
import { Switch, Route } from "react-router-dom";
import HomePage from './HomePage';
import Board from './components/Board';
import { BoardProvider } from './Provider';
import { BoardContext, BoardsProps } from './Provider';

const App: React.FC = () => {

  const { boards } = useContext(BoardContext);

  return (
    <div>
      <Switch>
        <BoardProvider>
          <Route exact path='/'><HomePage /></Route>
          <Route path='/board'><Board /></Route>
        </BoardProvider>
      </Switch>
    </div>
  )
}

export default App;