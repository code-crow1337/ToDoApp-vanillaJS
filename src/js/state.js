import {
  clearLists, addClasses, createListItems, moveStateBetweenList,
} from './nodeOpertions';

let state = {
  uniqId: 1,
  ongoing: [],
  done: [],
};

const getFromLocalStorage = () => JSON.parse(window.localStorage.getItem('todoState'));

const setState = (replaceState) => {
  state = { ...replaceState };
};
const saveToLocalStorage = () => {
  window.localStorage.setItem('todoState', JSON.stringify(state));
};
const renderState = () => {
  const ongoingList = document.querySelector('#todo__list--notDone');
  const doneList = document.querySelector('#todo__list--done');
  clearLists(doneList, ongoingList);
  addClasses(ongoingList, createListItems);
  addClasses(doneList, createListItems);
};
const addState = (key, value) => {
  state.uniqId += 1;
  state.ongoing.push(
    {
      [key]: value,
      done: false,
      id: state.uniqId,
    },
  );
  renderState();
  saveToLocalStorage();
};
const findItemIndex = (id, list) => {
  const itemID = parseInt(id, 10);
  return state[list].findIndex((listItem) => listItem.id === itemID);
};
const changeState = (id) => {
  const itemID = parseInt(id, 10);
  let indexListitem = findItemIndex(itemID, 'ongoing');
  if (indexListitem >= 0) {
    moveStateBetweenList('ongoing', indexListitem);
  } else {
    indexListitem = findItemIndex(itemID, 'done');
    moveStateBetweenList('done', indexListitem);
  }
  renderState();
  return saveToLocalStorage();
};
const removeItemFromList = (id) => {
  const itemID = parseInt(id, 10);
  const indexItem = findItemIndex(itemID, 'done');
  if (indexItem >= 0 && state.done[indexItem].itemDone) {
    state.done = state.done.filter((item) => item.id !== itemID);
  }
  renderState();
  return saveToLocalStorage();
};
export {
  changeState,
  renderState,
  setState,
  getFromLocalStorage,
  addState,
  removeItemFromList,
  state,
};
