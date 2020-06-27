/* Todo app javascript */
console.log('🚀');
/*
4. add remov button to cards marked as "DONE"
5. when that btn is clicked the card shall be removed from the board

9.optial local storage

TIPS
Modular small function, single responsibility
 Modern js
naming self documenting
dont mix camelCase and hyphens
semantic html
css reseet or normaliz

OPTIONAL
Mobile first
all filees exlude node_modulees
*/

/*
item contain value but also if it checked or not
*/
const ctaBtn = document.querySelector('#cta--submit');
const listArr = document.querySelector('.todo');
const doneListBTNs = document.querySelector('#todo__list--done');
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

// STATE LOGIC
const renderState = () => {
  console.log('render', state);
  const { ongoing, done } = state;
  const ongoingList = document.querySelector('#todo__list--notDone');
  const doneList = document.querySelector('#todo__list--done');
  clearLists(doneList, ongoingList);
  createListItems(ongoing).forEach((li) => {
    const node = li;
    node.className += '--unchecked';
    ongoingList.appendChild(li);
  });
  createListItems(done).forEach((li) => {
    const node = li;
    node.className += '--checked';
    const btn = document.createElement('BUTTON');
    const btnText = document.createTextNode('Remove Item');
    btn.appendChild(btnText);
    btn.className += 'todo__list__btn';
    node.appendChild(btn);
    doneList.appendChild(li);
  });
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
  console.log('trigger');
  console.log(id);
  const itemID = parseInt(id, 10);
  const indexItem = findItemIndex(itemID, 'done');
  console.log('obj', state.done.filter((item) => item.id !== itemID));
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
window.onload = renderState;
