import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import close from './img/close.svg';
import close_black from './img/close_black.svg';
import trash from './img/trash.svg';
import ellipsis from './img/ellipsis.svg'
import left_arrow from './img/left_arrow.svg';
import { createApi } from 'unsplash-js';
import { BoardContext } from './Provider'


const unsplash = createApi({
  accessKey: "H0_3Wawx7o3SOwFAN4PEmPHRg158Faun30h8Jk3UM8w"
});

const { nanoid } = require('nanoid')

const HomePage = () => {

  const { boards, addNewBoard, deleteBoard } = useContext(BoardContext);

  const colorPalette = [
    '#f47373', '#2ccce4', '#dce775', '#ba68c8', '#555555', '#d9e3f0', '#ab149e', '#0062b1', '#194d33'
  ];

  const [newBoard, setNewBoard] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [initialMenu, setInitialMenu] = useState(true);
  const [selectCover, setSelectCover] = useState('lightgrey');
  const [openBgMenu, setOpenBgMenu] = useState(false);
  const [openBigColorMenu, setOpenBigColorMenu] = useState(false);
  const [openBigImgMenu, setOpenBigImgMenu] = useState(false);
  const [photosResponse, setPhotosResponse] = useState(null);

  useEffect(() => {
    unsplash.search
      .getPhotos({
        query: "work", orientation: "landscape", page: 2, perPage: 30,
      })
      .then((result: any) => {
        setPhotosResponse(result);
      })
      .catch(() => {
        console.log("something went wrong!");
      });
  }, []);

  const setFotos = (photosResponse: any) => {
    if (photosResponse === null) {
      console.log('Фото не пришли по АПИ')
    } else {
      const photoArray = photosResponse.response.results.map((photo: any) => photo.urls.regular);
      console.log('Фото пришли по АПИ')
      return photoArray;
    }
  };

  const initialImgPalette = setFotos(photosResponse);

  const closeBoard = () => {
    setOpenModal(false);
    setNewBoard('');
  };

  const addBoard = (event: any, board: any) => {
    event.preventDefault();
    addNewBoard({
      name: board,
      id: Date.now().toString(),
      img: selectCover,
      content: []
    })

    setNewBoard('');
    setOpenModal(false);
    setOpenBgMenu(false);
    setOpenBigColorMenu(false);
    setOpenBigImgMenu(false);
    setInitialMenu(true);
    setSelectCover('lightgrey');
  };

  const onDeleteBoard = (id: string) => {
    deleteBoard(id);
    console.log('onDeleteBoard')
  }

  const changeTask = (event: any) => {
    setNewBoard(event.target.value);
  };

  const chooseBoardBackground = (event: any, img: string) => {
    let res;
    if (img.length > 7) {
      res = `url(${img})`;
      setSelectCover(res);
    } else {
      res = img;
      setSelectCover(res);
    }
    setSelectCover(res);
    return res;
  };

  const inputClassname = newBoard.length > 1 ? "board__create_active" : "board__create";


  return (
    <>
      <div className="homePage">
        <button className="board__button" onClick={() => setOpenModal(true)}>
          <h1>Создать доску</h1>
        </button>

        {openModal && (
          <div className="wrapper">
            <div>
              <div className="board__new" >
                <div>
                  <div className="board__new-box" style={{ background: selectCover }} >
                    <input className="board__input"
                      type="text"
                      placeholder="Добавить заголовок доски"
                      value={newBoard}
                      onChange={(event) => changeTask(event)}
                    />
                    <img alt="close" src={close} className="board__close" onClick={closeBoard} />
                  </div>

                  <button className={inputClassname} onClick={(event) => addBoard(event, newBoard)}>Создать доску</button>
                </div>
                {initialMenu && (
                  <div className="board__palette">
                    {initialImgPalette.slice(0, 4).map((img: string) => (
                      <div key={nanoid()}
                        onClick={(event) => chooseBoardBackground(event, img)}
                        className="board__palette-item" >
                        <div style={{ backgroundImage: `url(${img})`, width: '100%', height: '100%', backgroundSize: 'cover' }}>
                        </div>
                      </div>

                    ))}
                    {colorPalette.slice(0, 4).map((img: string) => (
                      <div key={nanoid()} onClick={(event) => chooseBoardBackground(event, img)} className="board__palette-item" style={{ backgroundColor: img }}></div>
                    ))}
                    <div className="board__palette-item">
                      <img alt="ellipsis" src={ellipsis} style={{ width: '15px' }} onClick={() => {
                        setOpenBgMenu(true);
                        setInitialMenu(false);
                      }} />
                    </div>
                  </div>
                )}

                {openBgMenu && (
                  <div className="bgMenu">
                    <div className="bgMenu__wrapper">
                      <h5>Фон доски</h5>
                      <img alt="close" src={close_black} className="board__close" onClick={() => {
                        setOpenBgMenu(false);
                        setInitialMenu(true);
                      }} />
                    </div>
                    <div className="bgMenu__list">
                      <div className="bgMenu__photo">
                        <p className="bgMenu__photo-title">Фотографии</p>
                        <p className="bgMenu__photo-link" onClick={() => {
                          setOpenBgMenu(false);
                          setOpenBigImgMenu(true);
                        }}>Подробнее</p>
                      </div>
                      <div className="bgMenu-palette">
                        {initialImgPalette.slice(0, 6).map((img: string) => (
                          <div onClick={(event) => chooseBoardBackground(event, img)}
                            className="bgMenu-item" >
                            <div style={{ backgroundImage: `url(${img})`, width: '100%', height: '100%', backgroundSize: 'cover' }}>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bgMenu__list">
                      <div className="bgMenu__photo">
                        <p className="bgMenu__photo-title">Цвета</p>
                        <p className="bgMenu__photo-link" onClick={() => {
                          setOpenBgMenu(false);
                          setOpenBigColorMenu(true);
                        }}
                        >Подробнее</p>
                      </div>
                      <div className="bgMenu-palette">
                        {colorPalette.slice(0, 6).map((img: string) => (
                          <div onClick={(event) => chooseBoardBackground(event, img)} className="bgMenu-item" style={{ backgroundColor: img }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {openBigColorMenu && (
                  <div className="bgMenu">
                    <div className="bgMenu__wrapper">
                      <img alt="arrow" src={left_arrow} className="board__arrow" onClick={() => {
                        setOpenBigColorMenu(false);
                        setOpenBgMenu(true);
                      }} />
                      <h5>Цвета</h5>
                      <img alt="close" src={close_black} className="board__close" onClick={() => {
                        setOpenBigColorMenu(false);
                        setInitialMenu(true);
                      }} />
                    </div>
                    <div className="bgMenu__list">
                      <div className="bgMenu-palette">
                        {colorPalette.map((img: string) => (
                          <div key={nanoid()} onClick={(event) => chooseBoardBackground(event, img)} className="bgMenu-item" style={{ backgroundColor: img }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {openBigImgMenu && (
                  <div className="bgMenu">
                    <div className="bgMenu__wrapper">
                      <img alt="arrow" src={left_arrow} className="board__arrow" onClick={() => {
                        setOpenBigImgMenu(false);
                        setOpenBgMenu(true);
                      }} />
                      <h5>Фотографии</h5>
                      <img alt="close" src={close_black} className="board__close" onClick={() => {
                        setOpenBigImgMenu(false);
                        setInitialMenu(true);
                      }} />
                    </div>
                    <div className="bgMenu__list">
                      <div className="bgMenu-palette">
                        {initialImgPalette.map((img: string) => (
                          <div key={nanoid()} onClick={(event) => chooseBoardBackground(event, img)}
                            className="bgMenu-item" >
                            <div style={{ backgroundImage: `url(${img})`, width: '100%', height: '100%', backgroundSize: 'cover' }}>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        }

        {
          boards.length > 0 && (
            boards.map((board: any) => (
              <div key={nanoid()}>
                <div>
                  <img src={trash} alt="trash" className="board__item-svg" onClick={() => onDeleteBoard(board.id)}
                  />
                  <Link to={`/board/${board.id}`}>
                    <div key={board.id}
                      className="board__item"
                      style={{ background: board.img, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                    >

                      <div className="board__item-bg">
                        <p>{board.name}</p>
                      </div>
                    </div>
                  </Link>
                </div>

              </div>
            ))
          )
        }

      </div >
    </>
  )
}

export default HomePage;
