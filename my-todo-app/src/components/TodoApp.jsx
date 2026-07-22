import React, { useState } from 'react';
import TodoItem from './TodoItem';

function TodoApp() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  const handleAddItem = () => {
    if (inputValue.trim() === "") {
      return; 
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const handleDeleteItem = (idToRemove) => {
    const updatedTodos = todos.filter((todo) => todo.id !== idToRemove);
    setTodos(updatedTodos);
  };

  return (
    <div className="todo-container">
      <h2>My Todo List </h2>
      
      <div className="input-section">
        <input 
          type="text" 
          placeholder="Add a new task" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
        />
        
        <button className="add-btn" onClick={handleAddItem}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            deleteFunction={handleDeleteItem} 
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;