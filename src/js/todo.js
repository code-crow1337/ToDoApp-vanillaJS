/* Todo app javascript */
console.log('🚀');
const ctaBtn = document.querySelector('#cta--submit');
const listArr = document.querySelector('.todo');
const textFieldNode = document.querySelector('.form__textfield');
let state = {
  uniqId: 1,
  items: [],
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
const changeDoneState = (itemID) => {
  const updatedList = state.items.map((item) => {
    const temp = item;
    if (item.id === itemID) {
      temp.done = !temp.done;
    }
    return temp;
  });
  state.items = updatedList;
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
  let btn = '';
  let btnText = '';
  node.id = item.id;
  node.appendChild(document.createTextNode(item.fieldValue));
  if (!item.done) {
    node.className += 'todo__list__item--unchecked';
    btnText = document.createTextNode('✓ Done');
    btn = document.createElement('BUTTON');
    btn.appendChild(btnText);
    btn.className += 'todo__list__btn--done';
    node.appendChild(btn);
  } else {
    node.className += 'todo__list__item--checked';
    btn = document.createElement('BUTTON');
    btnText = document.createTextNode('✖ Delete');
    btn.appendChild(btnText);
    btn.className += 'todo__list__btn--remove';
    node.appendChild(btn);
  }
  divnode.appendChild(node);
  return divnode;
});
const addClasses = (createItemsFn) => {
  const ongoingList = document.querySelector('#todo__list--notDone');
  const doneList = document.querySelector('#todo__list--done');
  if (state.items.length === 0) return '';
  createItemsFn(state.items.filter((item) => item.done))
    .forEach((li) => doneList.appendChild(li));
  createItemsFn(state.items.filter((item) => !item.done))
    .forEach((li) => ongoingList.appendChild(li));

  return '';
};

const renderState = () => {
  const ongoingList = document.querySelector('#todo__list--notDone');
  const doneList = document.querySelector('#todo__list--done');
  clearLists(doneList, ongoingList);
  addClasses(createListItems);
};

const removeItemFromList = (id) => {
  const itemID = parseInt(id, 10);
  state.items = state.items.filter((item) => item.id !== itemID);
  renderState();
  return saveToLocalStorage();
};

const addState = (key, value) => {
  state.uniqId += 1;
  state.items.push(
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
  changeDoneState(itemID);
  renderState();
  return saveToLocalStorage();
};

const checkInput = (input) => {
  if (input === 'Come on! You can\'t have empty task') {
    return false;
  }
  return !!(input && typeof input === 'string');
};

// FIELD ACTION
ctaBtn.addEventListener('click', (e) => {
  // Stop default behaviot aka submit and realoading th page
  e.preventDefault();
  const textfieldValue = document.querySelector('#todo__item');
  if (checkInput(textfieldValue.value)) {
    addState('fieldValue', textfieldValue.value);
    textfieldValue.value = '';
    return '';
  }
  textfieldValue.value = 'Come on! You can\'t have empty task';
  return '';
});

// Event listener  on parent, using event bubbling.
listArr.addEventListener('click', (e) => {
  if (e.target.parentElement.className === 'todo__list__item--checked') {
    removeItemFromList(e.target.parentElement.id);
  } else if (e.target.parentElement.tagName === 'LI') {
    changeState(e.target.parentElement.id);
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
      items: [],
    });
  }
  renderState();
};
window.onload = init;
