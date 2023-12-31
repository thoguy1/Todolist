// Homework: Write a class to implement
// the Todo list from last week:

class TodoList {
  // constructor: pass in an array of objects which 
  // is set into an instance variable
  constructor(data) {
    this.todos = data;
  }

  //  push a new task object onto the array of tasks
  addTask(description) {
    const newTask = {
      description: description,
      completed: false
    };
    this.todos.push(newTask);
  }

  // remove a task from the array, and return it
  removeTask(index) {
    if(index >= 0 && index < this.todos.length) {
      return this.todos.splice(index, 1)[0]; // return the removed task
    } else {
      console.log('Invalid index. No task removed.');
      return null;
    } 
  }

  //  maybe you can use removeTask() to accomplish this?
  moveTask(oldIndex, newIndex) {
    if(oldIndex >= 0 && oldIndex < this.todos.length && newIndex >= 0 && newIndex < this.todos.length) {
      const taskToMove = this.removeTask(oldIndex); // get the task object that we want to move
      this.todos.splice(newIndex, 0, taskToMove); // insert the removed task object into the new Index.
    } else {
      console.log('Invalid index. Task not moved.');
    }
  }


  // if completed status is not passed as a paramenter, completed will be true by default
  setCompletedStatus( index, completed=true ){
    if(index >= 0 && index < this.todos.length) {
      this.todos[index].completed = completed;
    } else {
      console.log('Invalid index. No task completed status changed.');
      return null;
    } 
  }

  // Update task description by passing the index of the task and the new description
  updateDescription( index, newDescription ) {
    if(index >= 0 && index < this.todos.length) {
      this.todos[index].description = newDescription;
    } else {
      console.log('Invalid index. No task description updated.');
      return null;
    }
  }

  //   returns true if all tasks have completed: true,
  //   false otherwise... use .every() ???
  allCompleted() {
    return this.todos.every(task => task.completed === true);
  }

  //   returns an array of all the tasks whose
  //   descriptions include the given text
  findMatchingTasks( text ) {
    const results = [];
    for(const task of this.todos){
      if(task.description === text) {
        results.push(task);
      }
    }
    return results;
  }

  // ADVANCED:

  //   run the provided callback function when
  //   the last incomplete task is completed (or removed?)
  onAllCompleted( callbackFn ) {
    if(this.allCompleted()) {
      callbackFn();
    }
  }

  // Try out some getters and setters, i.e. hide the 
  // internals of this class from direct outside access
  #coolDescription = 'Dancing at a nightclub';

  get taskDescription() {
    return this.#coolDescription;
  }

  set simpleDescription(newDescription) {
    if(newDescription.trim().length === 0) {
      throw new Error('No empty strings allowed');
    }
    this.#coolDescription = newDescription;
  }

  // BONUS: use this class in the Todo-list app
  // from last week, i.e. connect it to the DOM
}

// Example of using the class:

//mainList.addTask( 'Master JS classes' );

// console.log(mainList.removeTask( 0 ));

// mainList.moveTask( 2, 0 );

// mainList.setCompletedStatus( 0 );
// mainList.setCompletedStatus( 1, false );

// mainList.updateDescription(2, 'Introduction to React');
// console.log(mainList.todos);

// console.log(mainList.allCompleted());

// console.log(mainList.findMatchingTasks('Look at JS OOP'));

// mainList.onAllCompleted(() => {
//   console.log('All tasks have been completed.')
// });
//mainList.taskDescription = '';
// mainList.simpleDescription = 'Cleaning the house';

// console.log(mainList.taskDescription);


// If localstorage has a todoListData array, then use it
// Otherwise use the default todoListData.
let todoListData;
//Retrieve localStorage
const savedTodos = JSON.parse(localStorage.getItem('todos'));
if(Array.isArray(savedTodos)){
  todoListData = savedTodos;
} else { // Initial data
  todoListData = [
    {
      description: 'Make amazing Todo list app',
      completed: true,
    },
    {
      description: 'Understand JS ES6 functional array methods',
      completed: false,
    },
    {
      description: 'Look at JS OOP',
      completed: false,
    },
  ];
}
// Create an instance of class TodoList
const mainList = new TodoList(todoListData);
// Grab the elements on screen and put them as global variables
const itemTextNode = document.querySelector('#itemText');
const olParent = document.querySelector('#list');
const errorMessageNode = document.querySelector('#errorMessage');
const completedMessage = document.querySelector('#allCompletedMessage');
const addForm = document.querySelector('#addForm');

// UI
// Render the todo list array on the screen
const renderTodoList = function(){
  // Clear the existing list before re-rendering
  olParent.innerHTML = '';
  for(let i = 0; i < mainList.todos.length; i++){
    let checkedString = '';
    let completedClass = '';
    if( mainList.todos[i].completed ){
      checkedString = 'checked';
      completedClass = 'completed'
    }
    // Render and assign an index to each button so we know which one is clicked
    const newLi = `
      <li class="todo ${completedClass}" data-index="${i}" draggable="true">
        <label>
          <input type="checkbox" ${checkedString}>
          ${mainList.todos[i].description}
        </label>
        <button class="editButton" data-index="${i}">Edit</button>
        <button class="deleteButton" data-index="${i}">Delete</button>
      </li>
    `;
    olParent.innerHTML += newLi; // append to list!
  }

  handleEditButtons();
  handleDeleteButtons();
  addDragListeners();
}; // renderTodoList()

// UI
// Activate all the edit buttons on the screen
const handleEditButtons = function() {
  const editButtons = document.querySelectorAll('.editButton');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const taskIndex = parseInt(this.dataset.index); 
      // get the task index from the clicked button and passed that index to edit the task
      editTaskDescription(taskIndex);  
    });
  });
}; // handleEditButtons()

// Activate all the delete buttons on the screen
const handleDeleteButtons = function() {
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(){
      const taskIndex = parseInt(this.dataset.index);
      mainList.removeTask(taskIndex);
      renderTodoList();
      
      saveTodosToLocalStorage();
    });
  });
}; // handleDeleteButtons()

// Edit the task based on the selected index in the parameter
const editTaskDescription = function(index){
  const taskDescription = mainList.todos[index].description;
  const newDescription = prompt('Edit the task description:', taskDescription);
  if(newDescription.trim().length > 0) {
    mainList.updateDescription(index, newDescription);
    renderTodoList();

    saveTodosToLocalStorage();
  }
}; // editTaskDescription()

// Save todo list to local storage with 'todos' as key name
const saveTodosToLocalStorage = function(){
  localStorage.setItem('todos', JSON.stringify(mainList.todos));
}; // saveTodosToLocalStorage()

let draggedTask = null; // No task is being dragged

const handleDragStart = function(ev){
  draggedTask = ev.target; // identify the dragged task
}; // handleDragStart()

const handleDragOver = function(ev){
  ev.preventDefault();
}; // handleDragOver()

const handleDrop = function(ev) {
  ev.preventDefault();
  // Identify the drop location which is the closest location where the task is dropped
  const dropTarget = ev.target.closest('.todo');
  const dropIndex = parseInt(dropTarget.dataset.index);
  const dragIndex = parseInt(draggedTask.dataset.index);

  mainList.moveTask(dragIndex, dropIndex);

  renderTodoList();
  saveTodosToLocalStorage();
  // Reset draggedTask to null after drop
  draggedTask = null;
}; // handleDrop()

// add drag event listeners to each li element
const addDragListeners = function(){
  const todoItems = document.querySelectorAll('.todo');
  todoItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
  });
}; // addDragListeners()

renderTodoList();

// Add even handler to the list by adding and removing a class when it's checked or unchecked
olParent.addEventListener('change', function(ev){
  const liParent = ev.target.closest('li.todo');
  if(ev.target.checked){
    liParent.classList.add('completed');
  } else {
    liParent.classList.remove('completed');
  }
  const listIndex = parseInt(liParent.dataset.index);
  mainList.setCompletedStatus(listIndex, ev.target.checked);
  if(mainList.allCompleted()) {
    completedMessage.innerHTML = 'Congratulation! All tasks have been completed.';
  } else {
    completedMessage.innerHTML = '';
  }

  renderTodoList(); 
  saveTodosToLocalStorage();
});

// Handle the submission of user input for task description inside the text input field
addForm.addEventListener('submit', function(ev) {
  ev.preventDefault();
  const newItemText = itemTextNode.value;
  
  if(newItemText.trim().length === 0) {
    errorMessageNode.innerHTML = 'Please enter a description for your task.';
    return; // early return
  }

  mainList.addTask(newItemText);

  renderTodoList();
  itemTextNode.value = '';
  itemTextNode.focus();

  saveTodosToLocalStorage();
}); 

// When user start typing on the input field, the previous error message disappear
itemTextNode.addEventListener('input', function(ev){
  if(ev.target.value.trim().length > 0){
    errorMessageNode.innerHTML = '';
  }
});



