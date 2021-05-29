import React, { useState, useRef, useCallback, useEffect  } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
} from 'react-flow-renderer';
import axios from 'axios';
import ConnectionLine from './ConnectionLine';
import './dnd.css';
import '../style/design.scss'
import Sidebar from './Sidebar';
import localforage from 'localforage';
import {DeleteOutlined, LockOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import './layouting.css';
import inputNode from './CustomInputNode';
import defaultNode from './CustomDefaultNode';
import outputNode from './CustomOutputNode';
import { message,Modal,Form,Select,Row,Col, Input, Dropdown ,Layout,Menu,Button } from 'antd';
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
  
let edge_data= []

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
  
    const [condition_set, setcondition_set] = useState("");
    const [firstedge_set, setfirstedge_set] = useState("");
    const [secondedge_set, setsecondedge_set] = useState("");
    const [edge_operator, setedge_operator] = useState("");

    const [source_set, setsource_set] = useState("");
    //localforage.setItem("edge_data",[])
    //const [edge_data, setedge_data] = useState([]);
    const [target_set, settarget_set] = useState("");
    const [edge_id, setedge_id] = useState("");
    const [visible_edge, setvisible_edge] = useState(false);
    const [visible_edge_edit, setvisible_edge_edit] = useState(false);
    const edgeOk = () => {
    const data={source: source_set ,target: target_set , condition: condition_set,
        first: firstedge_set, operator: edge_operator , second: secondedge_set}
    //const newone = localforage.getItem("edge_data")
    edge_data.push(data)
    alert(JSON.stringify(edge_data))
    setvisible_edge(false) ;
    setsource_set("");
    settarget_set("");
    setcondition_set("");
    setedge_operator("");
    setfirstedge_set("");
    setsecondedge_set("");
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
    
    const getId = () => `${id+1}`;

    const onConnect = (params) => {
        console.log(params);
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
        axios.post('http://37.152.180.213/api/edge/',{
        source: params.source, dist: params.target
        },{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
        }})
        .then((response)=>{
        if (response.status === 201){
          //message.success("Collection created successfully")
          setedge_id(response.id)
          showModalEdge();
          setElements((els) => addEdge(params, els));
        }
        else{
            message.error("Please try again")
          }})
          alert(params.target)
          showModalEdge();
          setElements((els) => addEdge(params, els));
      }
      const conditionSet = (e) => {
          setcondition_set(e.target.value);
        };
      const firstEdgeSet = (e) => {
          setfirstedge_set(e.target.value);
      };
      const secondEdgeSet = (e) => {
          setsecondedge_set(e.target.value);
      };   
      const edgeOperatorSet = (e) => {
          setedge_operator(e.target.value);
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
        var tempEl=[];
        var j;
        for(j=0;j<elements.length;j++){
            if(elements[j].id!=elementsToRemove[0].id){
                tempEl.push(elements[j]);
            }
        }
        
        setElements(tempEl);

        axios.delete('http://37.152.180.213/api/module/'+elementsToRemove[0].id,
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            message.success("Removed!");
        })
        .catch((err)=>{
            message.error(err.message);
        });   
        
        //setElements((els) => removeElements(elementsToRemove, els));
    
    }

        // setElements((els) => removeElements(elementsToRemove, els));
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
        setVis(true);
        ListOfReuqests();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
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
            
            axios.get('http://37.152.180.213/api/scenario/all_modules/'+selectedScenario,
            {headers:{
            'Content-Type' : 'application/json',
            'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((resDimo)=>{
                message.success("Loaded Successfully");
                console.log(resDimo);
                setScenarioModal(false);
                var thisElements=[];

                var i;
                for (i = 0; i < resDimo.data.length; i++) {
                    thisElements.push(
                        {
                            id: resDimo.data[i].id,
                            type: 'defaultNode',
                            data: { label: 'input node' },
                            style: { width: '100px',height: '100px',borderRadius: '50px', backgroundColor:'white'},
                            targetPosition :  'left',
                            sourcePosition : 'right',
                            position: { x: resDimo.data[i].x_position, y: resDimo.data[i].y_position },
                        }
                    );           
                }
                setElements(thisElements);

                var dndflow=document.getElementById('dndflow');
                if(!dndflow.classList.contains('visib')){                
                    dndflow.classList.toggle('visib');
                    var noScenario=document.getElementById('no-scenario');
                    noScenario.classList.toggle('hidden');
                }
            })
            .catch((err)=>{
                message.error(err.message);
            });   
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
       <div>
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
        </Modal>
        </div>
        


            
            
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
            
            <Modal width={"24vw"}
                visible={visible_edge}
                title="Set condition"
                style={{height: '36vh'}}
                footer={[
                <Button key="ok" className="btn btn-primary" onClick={edgeOk} >Set
                </Button>
                ]}
            >
        <div style={{alignContent: 'center' ,marginLeft: 'auto',marginRight: 'auto',alignItems: 'center',textAlign: 'center'}}>
        <h5 style={{textAlign: 'left',marginLeft: '10%'}}>
            Statement
        </h5>
        <Input
        style={{width: '80%'}}
                  required
                  name="Statement"
                  placeholder="statement"
                  value={condition_set}
                  onChange={conditionSet}
                />
        <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
            First Set
        </h5>
        <Input
                style={{width: '80%'}}
                  required
                  name="first"
                  placeholder="first set"
                  value={firstedge_set}
                  onChange={firstEdgeSet}
                />
        <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
            Operator
        </h5>
        <Input
                 style={{width: '80%'}}
                 required
                  name="Operator"
                  placeholder="operator"
                  value={edge_operator}
                  onChange={edgeOperatorSet}
                />
        <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
            Second Set
        </h5>
        <Input
                style={{width: '80%'}}
                required
                  name="second"
                  placeholder="second set"
                  value={secondedge_set}
                  onChange={secondEdgeSet}
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
                    <Sidebar onSave={onSave} onRestore={onRestore} showModalEdgeEdit={showModalEdgeEdit}/>
                    <div className="controls">
                    </div>
                </ReactFlowProvider>
                
                </div>
                </Col>
            </Row>
       
        </div>
    );
export default DnDFlow;