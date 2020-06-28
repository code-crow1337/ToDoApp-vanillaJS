import {
  changeState,
  addState,
  removeItemFromList,
}
  from './state';

const ctaBtn = document.querySelector('#cta--submit');
const listArr = document.querySelector('.todo');
const textFieldNode = document.querySelector('.form__textfield');

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
