/* Todo app javascript */
console.log('🚀');
const ctaBtn = document.querySelector('#cta--submit');
const listArr = document.querySelector('.todo');
const doneListBTNs = document.querySelector('#todo__list--done');
const textFieldNode = document.querySelector('.form__textfield');
let uniqId = 3;
let state = {
  ongoing: [{
    fieldValue: 'Bake Hallongrottor',
    itemDone: false,
    id: 0,
  },
  {
    fieldValue: 'Shopping',
    itemDone: false,
    id: 3,
  }],
  done: [{
    fieldValue: 'Gaming',
    itemDone: true,
    id: 1,
  },
  {
    fieldValue: 'Sleep',
    itemDone: true,
    id: 2,
  }],
};
/* let uniqId = 0;
let state = {
  ongoing: [],
  done: [],
}; */
// CRUD ON NODE'S
const checkInput = (input) => !!input;

const moveStateBetweenList = (list, itemIndex) => {
  const stateList = list;
  state[stateList][itemIndex].itemDone = !state[stateList][itemIndex].itemDone;
  const removedObj = state[stateList].splice(itemIndex, 1)[0];
  if (stateList === 'ongoing') return state.done.push(removedObj);
  return state.ongoing.push(removedObj);
};

const clearChildNodes = (parentnode) => {
  while (parentnode.hasChildNodes()) {
    parentnode.removeChild(parentnode.lastChild);
  }
};
const clearLists = (ongoing, done) => {
  clearChildNodes(ongoing);
  clearChildNodes(done);
};

const createListItems = (nodes) => {
  return nodes.map((item) => {
    const divnode = document.createElement('DIV');
    divnode.className += 'todo__list__item';
    const node = document.createElement('LI');
    node.id = item.id;
    node.appendChild(document.createTextNode(item.fieldValue));
    divnode.appendChild(node);
    return divnode;
  });
};
const addClasses = (parentNodde, createItemsFn) => {
  const { ongoing, done } = state;
  console.log(state);
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
};
// STATE LOGIC
const renderState = () => {
  console.log('render', state);
  const ongoingList = document.querySelector('#todo__list--notDone');
  const doneList = document.querySelector('#todo__list--done');
  clearLists(doneList, ongoingList);
  addClasses(ongoingList, createListItems);
  addClasses(doneList, createListItems);
 // saveToLocalStorage();
};
const addState = (key, value) => {
  uniqId += 1;
  state.ongoing.push(
    {
      [key]: value,
      done: false,
      id: uniqId,
    },
  );
  renderState();
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
};
const removeItemFromList = (id) => {
  const itemID = parseInt(id, 10);
  const indexItem = findItemIndex(itemID, 'done');
  if (indexItem >= 0 && state.done[indexItem].itemDone) {
    state.done = state.done.filter((item) => item.id !== itemID);
  }
  renderState();
};

// FIELD ACTION
ctaBtn.addEventListener('click', (e) => {
  // Stop default behaviot aka submit and realoading th page
  e.preventDefault();
  const textfieldValue = document.querySelector('#todo__item');
  checkInput(textfieldValue.value);
  addState('fieldValue', textfieldValue.value);
  textfieldValue.value = '';
});

// Event listener  on parent, using event bubbling.
listArr.addEventListener('click', (e) => {
  const item = e.target;
  if (e.target.tagName === 'LI') {
    if (item.classList[0] === 'todo__list__item--unchecked') {
      item.classList.remove('todo__list__item--unchecked');
      item.classList.add('todo__list__item--checked');
    } else {
      item.classList.add('todo__list__item--unchecked');
      item.classList.remove('todo__list__item--checked');
    }
    changeState(item.id);
  }
});
// Listen for event triggered on Remove btn
doneListBTNs.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const { id } = e.target.previousSibling;
    console.log(id);
    removeItemFromList(id);
  }
});
textFieldNode.addEventListener('click', () => {
  textFieldNode.value = '';
});
const getFromLocalStorage = () => {
  return JSON.parse(window.localStorage.getItem('todoState'));
};
const setState = (replaceState) => {
  console.log(replaceState);
  state = { ...replaceState };
};
const init = () => {
 /*  if (window.localStorage.getItem('todoState')) {
    setState(getFromLocalStorage());
  } else {
    setState({
      ongoing: [],
      done: [],
    });
  } */
  renderState();
};
const saveToLocalStorage = () => {
  window.localStorage.setItem('todoState', JSON.stringify(state));
};
window.onload = renderState;
