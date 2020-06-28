const state = window.localStorage.getItem('todoState');

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
export {
  moveStateBetweenList,
  clearChildNodes,
  clearLists,
  createListItems,
  addClasses,
};
