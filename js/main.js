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

// Initial data
const todoListData = [
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

const mainList = new TodoList( todoListData );

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

const itemTextNode = document.querySelector('#itemText');
const olParent = document.querySelector('#list');
const errorMessageNode = document.querySelector('#errorMessage');

// When page loads, loop through the initial todo items ( todoList )
// and add each of them to the parent <ol> as new <li> children
// with checkbox, label, description etc

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

    const newLi = `
      <li class="todo ${completedClass}" data-index="${i}">
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
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(){
      const taskIndex = parseInt(this.dataset.index);
      mainList.removeTask(taskIndex);
      renderTodoList();
    });
  });
}; // renderTodoList()

olParent.addEventListener('change', function(ev){
  const liParent = ev.target.closest('li.todo');
  if(ev.target.checked){
    liParent.classList.add('completed');
  } else {
    liParent.classList.remove('completed');
  }
  const listIndex = parseInt(liParent.dataset.index);
  mainList.setCompletedStatus(listIndex, ev.target.checked);
});

const addForm = document.querySelector('#addForm');

addForm.addEventListener('submit', function(ev) {

  ev.preventDefault();

  const newItemText = itemTextNode.value;
  
  if(newItemText.trim().length === 0) {
    errorMessageNode.innerHTML = 'Please enter a description for your task.';
    itemTextNode.classList.add('error');
    return; // early return
  }

  mainList.addTask(newItemText);

  renderTodoList();
  itemTextNode.value = '';
  itemTextNode.focus();
});  // add task button handler

itemTextNode.addEventListener('input', function(ev){
  if(ev.target.value.trim().length > 0){
    errorMessageNode.innerHTML = '';
    itemTextNode.classList.remove('error');
  }
});


renderTodoList();