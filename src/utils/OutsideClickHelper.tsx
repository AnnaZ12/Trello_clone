import { RefObject } from 'react';

interface Subscription {
  ref: RefObject<any>;
  handler(e: any): any;
}

export interface IOutsideClickHelper {
  addSubscription(ref: RefObject<any>, handler: (e: any) => any): any;
  removeSubscription(e: any): any;
}

/**
 * Универсальный обработчик клика снаружи. Вешает click и touchstart на document
 *
 * Важно! При условных конструкциях в JSX может возникнуть следующая ситуация:
 * {condition && <div onclick="handler"></div>},
 * где handler - обработчик, который делает condition = false.
 * При этом элемент уберется из DOM и НЕ дойдет до нативного обработчика на документе (в target), т.к. реакт отработает раньше.
 * Два пути решения проблемы
 * 1) Заменить {condition && ...} на стиль с display: none
 * 2) В handler написать  e.nativeEvent.stopImmediatePropagation()
 *
 * @constructor
 */
export default function OutsideClickHelper(): IOutsideClickHelper {
  let subscriptions: Subscription[] = [];

  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    document.addEventListener('touchstart', checkIfClickedOutside);
    document.addEventListener('click', checkIfClickedOutside);
  }

  /** Добавляем в список подписок */
  function addSubscription(ref: RefObject<any>, handler: (e: any) => any) {
    subscriptions.push({ ref, handler });
  }

  /** Убираем из списка подписок */
  function removeSubscription(handler: (e: any) => any) {
    subscriptions = subscriptions.filter(subs => subs.handler !== handler);
  }

  /**
   * Обрабатывает клик снаружи и вызывает нужные подписки
   * @param e
   */
  function checkIfClickedOutside(e: MouseEvent | TouchEvent): void {
    subscriptions.forEach((subs: Subscription) => {
      const { ref, handler } = subs;
      if (ref && ref.current && e.target && !ref.current.contains(e.target)) {
        handler(e);
      }
    });
  }

  return {
    addSubscription,
    removeSubscription,
  };
}
