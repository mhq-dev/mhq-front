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
import {DeleteOutlined, LockOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import './layouting.css';
import inputNode from './CustomInputNode';
import defaultNode from './CustomDefaultNode';
import outputNode from './CustomOutputNode';
import { message,Modal,Form,Select,Row,Col, Input, Dropdown ,Layout,Menu,Button } from 'antd';
import axios from 'axios';
import {  Link, NavLink } from 'react-router-dom';
import SearchUser from '../Search/SearchUser';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

const menu = (
    <Menu>
      <Menu.Item >
        <h5>New</h5>
      </Menu.Item>
      <Menu.Item >
        <h5 target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        Edit 
        </h5>
      </Menu.Item>
      <Menu.Item >
        <h5 target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        Delete
        </h5>
      </Menu.Item >
      <Menu.Item >Search</Menu.Item>
    </Menu>
  
  );
console.log(localStorage.getItem('token'));
const initialElements = [
    
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

const initialCols=[];
axios.get('http://37.152.180.213/api/collection/user/'+localStorage.getItem('username'),
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            var i;        
            for (i = 0; i < resDimo.data.length; i++) {
                initialCols.push(resDimo.data[i]);
            }
        })
        .catch((err)=>{
            message.error(err.message);
        });


const DnDFlow = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const [vis, setVis] = useState(false);
    const [scenarioModal, setScenarioModal] = useState(false);
    const [myRequests, setmyRequests] = useState([]);
    const [myCols, setmyCols] = useState(initialCols);
    const [myScenarios, setmyScenarios] = useState([]);
    const [selectedScenario, setSelectedScenario] = useState(-1);
    const [selectedRequest, setSelectedRequest] = useState(-1);
    const [newModule, setnewModule] = useState(-1);
    const [xPosition, setxPosition] = useState(-1);
    const [yPosition, setyPosition] = useState(-1);
    const [typeReactFlow, setTypeReactFlow] = useState(null);
    let [id, setID] = useState(0);
    const componentDidMount=()=>{
        alert("hiii");
      } 
    const getId = () => `${id+1}`;
    const onConnect = (params) => {
        console.log(params);
        params = {
            ...params,
            animated: true,
            arrowHeadType: 'arrow',
            style: {strokeWidth:3},
            // label:'Setting',
            // labelStyle:{fill:'#fff',fontWeight: 800},
            // labelShowBg:false,
        }
        console.log(params);

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
        setVis(true);
        ListOfReuqests();

        setxPosition(event.clientX - reactFlowBounds.left);
        setyPosition(event.clientY - reactFlowBounds.top);
        setTypeReactFlow(event.dataTransfer.getData('application/reactflow'));
        
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

    

    const ListOfReuqests = () => {
        axios.get('http://37.152.180.213/api/collection/user/'+localStorage.getItem('username'),
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            var i;        
            setmyRequests([]); 
            for (i = 0; i < resDimo.data.length; i++) {
                axios.get("http://37.152.180.213/api/request/collection/"+resDimo.data[i].id,
                {headers:{
                'Content-Type' : 'application/json',
                'Authorization' :`Token ${localStorage.getItem('token')}`
                }}).then((res)=>{  
                    var j;
                    for (j = 0; j < res.data.length; j++) { 
                        setmyRequests((es) => es.concat(res.data[j]));
                    }
                })
                .catch((err)=>{
                    message.error("errssssss");
                })
            }
            console.log(myRequests);        
        })
        .catch((err)=>{
            message.error(err.message);
        })
    };

    const methodAndUrl = (d) =>{
        return d.id+"_"+d.http_method+"_"+d.url;
    }

    const onSelect = value=>{
        var splitedValue=value.split("_");
        setSelectedRequest(parseInt(splitedValue[0]));
        var x="";
        var j;
        for (j = 2; j < splitedValue.length; j++) { 
            x=x+splitedValue[j]+"_";
        }
        x=x.substring(0,x.length-1);
        document.getElementById("scenario_method").value = splitedValue[1];
        document.getElementById("scenario_url").value = x;

    }
    const doneNodeModal = ()=>{       
        axios.post('http://37.152.180.213/api/module/',
        {
            "x_position":parseInt(xPosition),
            "y_position":parseInt(yPosition),
            "scenario":parseInt(selectedScenario),
            "request":parseInt(selectedRequest)
        },
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            message.success("Added");
            setnewModule(resDimo.data.id);

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = typeReactFlow;
            const position = reactFlowInstance.project({
                x: xPosition,
                y: yPosition,
            });
            
            const newNode = {
                id: resDimo.data.id,
                type,
                position,
                style: { width: '100px',height: '100px',borderRadius: '50px', backgroundColor:'white'},
                targetPosition :  'left',
                sourcePosition : 'right',
                data: { label: `${type} node` },
            };                        

            setElements((es) => es.concat(newNode));
        })
        .catch((err)=>{
            message.error(err.message);
        });    
        setVis(false);

    }
    const cancelNodeModal=()=>{
        setVis(false);
        var tempElements=[];
        var j;
        for (j = 0; j < elements.length-1; j++) { 
            tempElements.push(elements[j]);            
        }
        setElements(tempElements);
        
        
    }
    const ClickedMenuForCol=(theID)=>{
        localStorage.setItem('selectedCollection',theID);
        axios.get('http://37.152.180.213/api/scenario/collection/'+theID,
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            var i;        
            setmyScenarios([]);
            for (i = 0; i < resDimo.data.length; i++) {
                setmyScenarios((es) => es.concat(resDimo.data[i]));                
            }
            setSelectedScenario(-1);
            setScenarioModal(true);
        })
        .catch((err)=>{
            message.error(err.message);
        });       
    }
    const cancelScenarioModal=()=>{
        setScenarioModal(false);
    }
    const doneScenarioModal=()=>{
        if(selectedScenario==(-1)){
            message.error("Please select a scenario or create new one!");
        } else{
            setScenarioModal(false);
           
            const type = 'inputNode';
            const position = reactFlowInstance.project({
                x: 100,
                y: 100,
            });
            setElements([]);
            const newNode = {
                id: 0,
                type,
                position,
                style: { width: '100px',height: '100px',borderRadius: '50px', backgroundColor:'white'},
                targetPosition :  'left',
                sourcePosition : 'right',
                data: { label: `${type} node` },
            };            
            setElements((es) => es.concat(newNode));

            const type1 = 'inputNode'; 
            var x,y;
            const position1 = reactFlowInstance.project({
                x: 200,
                y: 200,
            });
            const newNode1 = {
                id: 1,
                type1,
                position1,
                style: { width: '100px',height: '100px',borderRadius: '50px', backgroundColor:'white'},
                targetPosition :  'left',
                sourcePosition : 'right',
                data: { label: `${type1} node` },
            };
            setElements((es) => es.concat(newNode1));
            // params = {
            //     ...params,
            //     animated: true,
            //     arrowHeadType: 'arrow',
            //     style: {strokeWidth:3},
            //     // label:'Setting',
            //     // labelStyle:{fill:'#fff',fontWeight: 800},
            //     // labelShowBg:false,
            // }
            // console.log(params);
    
            // setElements((els) => addEdge(params, els));
            var dndflow=document.getElementById('dndflow');
            if(!dndflow.classList.contains('visib')){                
                dndflow.classList.toggle('visib');
                var noScenario=document.getElementById('no-scenario');
                noScenario.classList.toggle('hidden');
            }
            

            // axios.get('http://37.152.180.213/api/scenario/'+localStorage.getItem('selectedCollection')+"/"+selectedScenario,
            // {headers:{
            // 'Content-Type' : 'application/json',
            // 'Authorization' :`Token ${localStorage.getItem('token')}`
            // }}).then((resDimo)=>{
            //     message.success("Loaded Successfully");
            //     console.log(resDimo);
            //     setScenarioModal(false);
                
            //     var dndflow=document.getElementById('dndflow');
            //     if(!dndflow.classList.contains('visib')){                
            //     dndflow.classList.toggle('visib');
            //     var noScenario=document.getElementById('no-scenario');
            //     noScenario.classList.toggle('hidden');
            //     }
            // })
            // .catch((err)=>{
            //     message.error(err.message);
            // });   
        }
    }
    const createScenarioModal=()=>{
        console.log(localStorage.getItem('token'));
        var newScenarioName=document.getElementById('new_scenario_name').value;
        // alert(newScenarioName+"***"+localStorage.getItem('selectedCollection'));
        axios.post('http://37.152.180.213/api/scenario/create_scenario',
        {
            "name":newScenarioName,
            "collection":localStorage.getItem('selectedCollection')
        },
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            setSelectedScenario(resDimo.data.id);
            message.success("Created Successfully");
            setScenarioModal(false);
            var dndflow=document.getElementById('dndflow');        
            dndflow.classList.toggle('visib');
            var noScenario=document.getElementById('no-scenario');
            noScenario.classList.toggle('hidden');
        })
        .catch((err)=>{
            message.error(err.message);
        });       

        
    }
    const onSelectScenario = value=>{
        setSelectedScenario(value);
    }
    return (
        <div STYLE="overflow-y: hidden;">
        <Modal
        className='signup-card'
        visible={scenarioModal}
        title="Select a scenario or create new one!"
        closable={false}
        footer={[
            <button className="cancel-account-button" key="cancel" type="secondary" onClick={cancelScenarioModal}>
                Cancel
            </button>,
            <button className="done-scenario-button" key="Done" type="primary" onClick={doneScenarioModal}>
                Done
            </button>
        ]}>
        <div>
        
        <Form
            name="normal_singup"
            STYLE="background-color:#fcfcfc;"
        >
        <Row>
            <Col span={20}>
                <Input id="new_scenario_name" placeholder="New scenario's name"></Input>
            </Col>
            <Col span={4}>
                <button className="create-scenario-button" key="Create" type="primary" onClick={createScenarioModal}>
                Create
                </button>
            </Col>                
        </Row>
            <Row>
                <Col span={11}></Col>
                <Col span={2}><p STYLE="margin:10px; font-weight: bold;">Or</p></Col>
                <Col span={11}></Col>
            </Row>
            <Select STYLE="width:100%; background-color:#ffffff;" onSelect={onSelectScenario}>
                {myScenarios.map(d=><Option value={d.id}>{d.name}</Option>)}
            </Select>
            
        </Form>
   
        </div>
        </Modal>


            <Header  style={{width:'100%', height: '8vh',backgroundColor: 'transparent',padding: '0px',borderBottom: '1px solid rgb(204 204 204)',lineHeight: '3.75'}}>
            <Row justify="start" style={{width: '100%',marginLeft: '-1%'}}>
            <Col span={2}>
            <Link to="/dashboard"><h4 >Home</h4></Link>
            </Col>
            <Col span={3} >
            <Link to="/profile"><h4 >Profile</h4></Link>
            </Col>
            <Col span={3}>
            <Link to="/scenario"><h4 >Scenario</h4></Link>
            </Col>
            <Col span={2} >
            <Dropdown overlay={menu}>
            <h4 className="ant-dropdown-link" onClick={e => e.preventDefault()}style={{color: 'black'}} >
            Workspaces <DownOutlined />
            </h4>
            </Dropdown>
            </Col>
            <Col span={4} style={{float: 'right' , marginLeft: '40%'}}>
            <SearchUser/>
            </Col>
            </Row>
            </Header>
            
            <Row >
                <Col flex={2}>
            <Sider theme={"dark"}  collapsible style={{width: '20%' ,minHeight: '90vh'}} 
            STYLE="text-align:left; color:#ffffff; font-weight: bold; background-color:#282828; margin-right:-550px;">
                <Menu
                    mode="inline"
                    theme={"dark"}
                    style={{ position: "sticky",height: '20vh' }}
                    STYLE="text-align:left; color:#78c622; font-weight: bold; background-color:#282828; padding-right:-500px;">
                
                    {myCols.map(d=>
                        <Menu.Item onClick={()=>ClickedMenuForCol(d.id)} STYLE="text-align:left; color:#ffffff; font-weight: bold; background-color:#282828;">
                        {d.name}
                        </Menu.Item>    
                        )}
                    
                </Menu>
            </Sider>
        </Col>
                <Col flex={8}>
                <p className="no-scenario" id="no-scenario">Please Select A Scenario!</p>
                <div className="dndflow" id="dndflow">
                <Modal
                className='signup-card'
                visible={vis}
                title="Enter your api information"
                closable={false}
                footer={[
                    <button className="cancel-account-button" key="cancel" type="secondary" onClick={cancelNodeModal}>
                        Cancel
                    </button>,
                    <button className="done-scenario-button" key="Done" type="primary" onClick={doneNodeModal}>
                        Done
                    </button>
                ]}>
                <div>
                
                <Form
                    name="normal_singup"
                    STYLE="background-color:#fcfcfc;"
                >
                    <Select STYLE="width:100%; background-color:#ffffff;" onSelect={onSelect}>
                        {myRequests.map(d=><Option value={methodAndUrl(d)}>{d.name}</Option>)}
                    </Select>
                    <Row STYLE="margin-top:10px;">
                        <Col span={6}>
                            <p STYLE="margin-right:5px;">Method</p>
                        </Col>
                        <Col span={18}>
                            <p STYLE="margin-left:5px;">URL</p>
                        </Col>                
                    </Row>
                    <Row STYLE="margin-top:-15px;">
                        <Col span={6}>
                            <Input id="scenario_method" disabled={true} STYLE="margin-right:5px;"></Input>
                        </Col>
                        <Col span={18}>
                            <Input id="scenario_url" disabled={true} STYLE="margin-left:5px;" ></Input>
                        </Col>                
                    </Row>
                </Form>
           
                </div>
                </Modal>
                
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
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
                </Col>
            </Row>
       
        </div>
    );
};

export default DnDFlow;