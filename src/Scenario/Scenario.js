import React, { useState, useRef, useCallback, useEffect  } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
} from 'react-flow-renderer';
import ConnectionLine from './ConnectionLine';
import './dnd.css';
import '../style/design.scss'
import Sidebar from './Sidebar';
import localforage from 'localforage';
import {SettingTwoTone, ToolOutlined} from '@ant-design/icons';
import './layouting.css';
import inputNode from './CustomInputNode';
import defaultNode from './CustomDefaultNode';
import outputNode from './CustomOutputNode';
import { Input ,Modal,Button,Row,Col,message} from 'antd';


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
  
let edge_data= []

const flowKey = 'example-flow';
const DnDFlow = () => {
  
    const [condition_set, setcondition_set] = useState("");
    const [source_set, setsource_set] = useState("");
    //localforage.setItem("edge_data",[])
    //const [edge_data, setedge_data] = useState([]);
    const [target_set, settarget_set] = useState("");
    const [visible_edge, setvisible_edge] = useState(false);
    const [visible_edge_edit, setvisible_edge_edit] = useState(false);
    const edgeOk = () => {
    const data={source: source_set ,target: target_set , condition: condition_set}
    //const newone = localforage.getItem("edge_data")
    edge_data.push(data)
    alert(JSON.stringify(edge_data))
    setvisible_edge(false) ;
    setsource_set("");
    settarget_set("");
    setcondition_set("");
    };
    const edgeEditOk = () => {
        setvisible_edge_edit(false) ;
    };
    const showModalEdge = () => {
        
    setvisible_edge(true);
    };
    const showModalEdgeEdit = useCallback(() => {
            setvisible_edge_edit(true);
        
      });

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
            id: params.source+","+params.target,
            style: {strokeWidth:3},
            
            // label:'Setting',
            // labelStyle:{fill:'#fff',fontWeight: 800},
            // labelShowBg:false,
        };
        setsource_set(params.source)
        settarget_set(params.target)
        conditionEmpty();
        showModalEdge();
        setElements((els) => addEdge(params, els));
    }
    const conditionSet = (e) => {
        setcondition_set(e.target.value);
      };
    
    function editCondition(edge,e){
        const x=edge
        const index = edge_data.indexOf(edge);
        edge_data.splice(index,1)
        const new_data = {source: x.source , target: x.target , condition : e.target.value}
        edge_data.push(new_data)
      };
    const conditionEmpty = () => {
        setcondition_set("");
      };  

  const onEdge = (params) => {

  }
   
    const prevent = (e) => {
        e.preventDefault()
        }
    const onElementsRemove = (elementsToRemove) =>{
        elementsToRemove.forEach(e=>{
            try{

                const new_source = e.source
                const new_target = e.target
                edge_data.forEach(element => {
                    if(element.source===new_source && element.target===new_target)
                    {
                      const ind = edge_data.indexOf(element);
                      edge_data.splice(ind,1)
                    }
                });
          }
          catch{}
        })
        
        setElements((els) => removeElements(elementsToRemove, els));
    
    }

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
            <Modal
                visible={visible_edge}
                title="Set condition"
                style={{height: '36vh'}}
                footer={[
                <Button key="ok" className="btn btn-primary" onClick={edgeOk} >Set
                </Button>
                ]}
            >
        <div style={{alignContent: 'center' ,marginLeft: 'auto',marginRight: 'auto',alignItems: 'center',textAlign: 'center'}}>
        <Input
                  required
                  name="condition"
                  placeholder="condition for set"
                  onChange={conditionSet}
                />
        </div>
      </Modal>
      <Modal
                visible={visible_edge_edit}
                title="Edit Edges"
                style={{height: '36vh'}}
                footer={[
                <Button key="ok" className="btn btn-primary" onClick={edgeEditOk} >Done
                </Button>
                ]}
            >
        <div style={{alignContent: 'center' ,marginLeft: 'auto',marginRight: 'auto',alignItems: 'center',textAlign: 'center'}}>
        {edge_data.length===0?
        <h5>There is no edge in this scenario</h5>:
        edge_data.map(e=>(
            <Row>
                <Col span={4}><h5>Source : {e.source}</h5></Col>
                <Col span={4}><h5>Target : {e.target}</h5></Col>
                <Col span={4}><h5>Condition : </h5></Col>

                <Col span = {8}><Input
                  required
                  name="edit_condition"
                  defaultValue={e.condition}
                  onChange={(er) => editCondition(e,er)}
                  style={{height: '3vh'}}
                />
                </Col>
                <Col span={4}><Button style={{backgroundColor: '#1890ff',color: 'white',
                border: 'none',lineHeight: '0.5',width: '90%',height: '3vh'}}>Edit</Button></Col>
                
            </Row>
        ))
        }
        </div>
      </Modal>
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                
                    <ReactFlow
                        style = {{height:'550px'}}
                        elements={elements}
                        onConnect={onConnect}
                        onDoubleClick={prevent}
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
                
                <Sidebar onSave={onSave} onRestore={onRestore} showModalEdgeEdit={showModalEdgeEdit}/>
                <div className="controls">
        </div>
            </ReactFlowProvider>
        </div>
        
    );
};

export default DnDFlow;