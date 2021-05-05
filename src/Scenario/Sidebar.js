import React from 'react';
import './layouting.css';

const Sidebar =  (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'inputNode')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'defaultNode')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'outputNode')} draggable>
        Output Node
      </div>
      <div className="save__controls">
          <button onClick={props.onSave}>save</button>
          <button onClick={props.onRestore}>restore</button>
        </div>
    </aside>
  );
};

export default Sidebar;