import React from 'react';

function TodoItem({ todo, deleteFunction }) {
  return (
    <li className="todo-item">
      <span>{todo.text}</span>
      
      <button 
        className="delete-btn" 
        onClick={() => deleteFunction(todo.id)}
      >
        delete
      </button>
    </li>
  );
}

export default TodoItem;