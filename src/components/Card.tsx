import React, { useRef, useEffect } from 'react'

interface CardProps {
  togglePopup(): any;
  taskTitle?: string;
}

const Card: React.FC<CardProps> = ({ togglePopup, taskTitle }) => {

  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  // закрытие окна по щелчку вне элемента
  function useOutsideClick(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          togglePopup();
        }
      }
      // привязываем слушатель события
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // отвязываем слушатель события, очищаем
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  return (
    <div className='popup'>
      <div className="popup__content" ref={wrapperRef} style={{ border: 'solid red 1px' }}>
        <h1>{taskTitle}</h1>
      </div>
    </div>
  )
}

export default Card;
