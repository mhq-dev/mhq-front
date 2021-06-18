import React from 'react';
import './layouting.css';
import '../style/design.scss'

const Sidebar =  (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description"><h4>You can drag these nodes to the pane on the right.</h4></div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable>
        <h5>Input Node</h5>
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'defaultNode')} draggable>
       <h5>Default Node</h5> 
      </div>
    </aside>
  );
};

export default Sidebar;