// Homework: Write a class to implement
// the Todo list from last week:

class TodoList {
  // constructor: pass in an array of objects which 
  // is set into an instance variable
  constructor(data) {
    this.todos = data;
  }

  // addTask( description )
  //  push a new task object onto the array of tasks
  addTask(description) {
    const newTask = {
      description: description,
      completed: false
    };
    this.todos.push(newTask);
  }

  // removeTask( index )
  //   remove a task from the array, and return it
  removeTask(index) {
    if (index >= 0 && index < this.todos.length) {
      return this.todos.splice(index, 1)[0]; // return the removed task
    } else {
      console.log('Invalid index. No task removed.');
      return null;
    } 
  }

  // moveTask( oldIndex, newIndex )
  //  maybe you can use removeTask() to accomplish this?

  // setCompletedStatus( index, completed=true )

  // updateDescription( index, newDescription )

  // allCompleted()
  //   returns true if all tasks have completed: true,
  //   false otherwise... use .every() ???

  // findMatchingTasks( text )
  //   returns an array of all the tasks whose
  //   descriptions include the given text


  // ADVANCED:

  // onAllCompleted( callbackFn )
  //   run the provided callback function when
  //   the last incomplete task is completed (or removed?)


  // Try out some getters and setters, i.e. hide the 
  // internals of this class from direct outside access

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

mainList.addTask( 'Master JS classes' );

console.log(mainList.removeTask( 0 ));
console.log(mainList.todos);
// mainList.moveTask( 2, 0 );
// mainList.setCompletedStatus( 0 );
// mainList.setCompletedStatus( 1, false );