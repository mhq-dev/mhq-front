import React, { useState, useRef, useCallback  } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
} from 'react-flow-renderer';
import ConnectionLine from './ConnectionLine';
import './dnd.css';
import Sidebar from './Sidebar';
import localforage from 'localforage';
import {SettingTwoTone, ToolOutlined} from '@ant-design/icons';
import './layouting.css';
import inputNode from './CustomInputNode';
import defaultNode from './CustomDefaultNode';
import outputNode from './CustomOutputNode';


const initialElements = [
    {
        id: '0',
        type: 'inputNode',
        data: { label: 'input node' },
        style: { width: '100px',height: '100px',borderRadius: '50px', backgroundColor:'white'},
        targetPosition :  'left',
        sourcePosition : 'right',
        position: { x: 250, y: 5 },
    },
];
const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    console.log('context menu:', node);
};
const onNodeMouseEnter = (event, node) => console.log('mouse enter:', node);
const onNodeMouseMove = (event, node) => console.log('mouse move:', node);
const onNodeMouseLeave = (event, node) => console.log('mouse leave:', node);


const nodeTypes = {
    inputNode: inputNode,
    defaultNode: defaultNode,
    outputNode: outputNode,
  };

const flowKey = 'example-flow';
const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    let [id, setID] = useState(1);
    const getId = () => `${id+1}`;
    const onConnect = (params) => {
        params = {
            ...params,
            animated: true,
            arrowHeadType: 'arrow',
            style: {strokeWidth:3},
            // label:'Setting',
            // labelStyle:{fill:'#fff',fontWeight: 800},
            // labelShowBg:false,
        }
        console.log(params)

        setElements((els) => addEdge(params, els));
    }
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));

        const onLoad = (_reactFlowInstance) =>{
        setReactFlowInstance(_reactFlowInstance);

        }

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event) => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
            id: getId(),
            type,
            position,
            style: { width: '100px',height: '100px',borderRadius: '50px', backgroundColor:'white'},
            targetPosition :  'left',
            sourcePosition : 'right',
            data: { label: `${type} node` },
        };
        setID(parseInt(getId()))
        console.log(id)

        setElements((es) => es.concat(newNode));
    };
    const onSave = useCallback(() => {
        if (reactFlowInstance) {
          const flow = reactFlowInstance.toObject();
          localforage.setItem(flowKey, flow);
          console.log(flow)
        }
      }, [reactFlowInstance]);

      function isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) &&
               !isNaN(parseFloat(str))
      }
    
    const onRestore = useCallback(() => {
        //localforage.clear()
        const restoreFlow = async () => {
          const flow = await localforage.getItem(flowKey);
    
          if (flow) {
            let num = 0;
            const [x = 0, y = 0] = flow.position;
            setElements(flow.elements || []);
            flow.elements.map((el)=>{
                if(parseInt(el.id) > id && isNumeric(el.id))
                    num = parseInt(el.id)
            })
            setID(num+1)
            console.log(num+1)
          }
          
        };
        restoreFlow();
    }, [setElements]);

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        style = {{height:'550px'}}
                        elements={elements}
                        onConnect={onConnect}
                        onElementsRemove={onElementsRemove}
                        onLoad={onLoad}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeContextMenu={onNodeContextMenu}
                        connectionLineComponent={ConnectionLine}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                    </ReactFlow>
                </div>
                <Sidebar onSave={onSave} onRestore={onRestore} />
                <div className="controls">
        </div>
            </ReactFlowProvider>
        </div>
        
    );
};

export default DnDFlow;