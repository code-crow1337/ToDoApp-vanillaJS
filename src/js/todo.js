/* Todo app javascript */
// TODO make whole area clickable dosent works
console.log('🚀');
const ctaBtn = document.querySelector('#cta--submit');
const listArr = document.querySelector('.todo');
const textFieldNode = document.querySelector('.form__textfield');
let state = {
  uniqId: 1,
  ongoing: [],
  done: [],
};

// STATE LOGIC
const getFromLocalStorage = () => JSON.parse(window.localStorage.getItem('todoState'));

const setState = (replaceState) => {
  state = { ...replaceState };
};
const saveToLocalStorage = () => {
  window.localStorage.setItem('todoState', JSON.stringify(state));
};
// CRUD ON NODE'S
const moveStateBetweenList = (list, itemIndex) => {
  const stateList = list;
  state[stateList][itemIndex].itemDone = !state[stateList][itemIndex].itemDone;
  const removedObj = state[stateList].splice(itemIndex, 1)[0];
  if (stateList === 'ongoing') return state.done.push(removedObj);
  return state.ongoing.push(removedObj);
};

const clearChildNodes = (parentnode) => {
  if (parentnode.children === 0) return '';
  while (parentnode.hasChildNodes()) {
    parentnode.removeChild(parentnode.lastChild);
  }
  return '';
};
const clearLists = (ongoing, done) => {
  clearChildNodes(ongoing);
  clearChildNodes(done);
};

const createListItems = (nodes) => nodes.map((item) => {
  const divnode = document.createElement('DIV');
  divnode.className += 'todo__list__item';
  const node = document.createElement('LI');
  node.id = item.id;
  node.appendChild(document.createTextNode(item.fieldValue));
  divnode.appendChild(node);
  return divnode;
});
const addClasses = (parentNodde, createItemsFn) => {
  const { ongoing, done } = state;
  if (ongoing.length === 0 && done.length === 0) return '';
  if (/\bnotDone\b$/gi.test(parentNodde.id)) {
    createItemsFn(ongoing).forEach((li) => {
      const node = li;
      node.className += '--unchecked';
      return parentNodde.appendChild(li);
    });
  } else {
    createItemsFn(done).forEach((li) => {
      const node = li;
      node.className += '--checked';
      const btn = document.createElement('BUTTON');
      const btnText = document.createTextNode('Delete');
      btn.appendChild(btnText);
      btn.className += 'todo__list__btn';
      node.appendChild(btn);
      return parentNodde.appendChild(li);
    });
  }
  return '';
};

const renderState = () => {
  const ongoingList = document.querySelector('#todo__list--notDone');
  const doneList = document.querySelector('#todo__list--done');
  clearLists(doneList, ongoingList);
  addClasses(ongoingList, createListItems);
  addClasses(doneList, createListItems);
};
const findItemIndex = (id, list) => {
  const itemID = parseInt(id, 10);
  return state[list].findIndex((listItem) => listItem.id === itemID);
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

const checkInput = (input) => !!(input && typeof input === 'string');

// FIELD ACTION
ctaBtn.addEventListener('click', (e) => {
  // Stop default behaviot aka submit and realoading th page
  e.preventDefault();
  const textfieldValue = document.querySelector('#todo__item');
  if (!checkInput(textfieldValue.value)) return '';
  addState('fieldValue', textfieldValue.value);
  textfieldValue.value = '';
  return '';
});

// Event listener  on parent, using event bubbling.
listArr.addEventListener('click', (e) => {
  if (e.target.tagName === 'DIV') {
    changeState(e.target.querySelector('li').id);
  } else if (e.target.tagName === 'LI') {
    changeState(e.target.id);
  } else if (e.target.className === 'todo__list__btn') {
    removeItemFromList(e.target.previousSibling.id);
  }
});
// Clear textfield when interacted
textFieldNode.addEventListener('click', () => {
  textFieldNode.value = '';
});

const init = () => {
  if (window.localStorage.getItem('todoState')) {
    setState(getFromLocalStorage('todoState'));
  } else {
    setState({
      uniqId: 0,
      ongoing: [],
      done: [],
    });
  }
  renderState();
};
window.onload = init;
