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
import '../style/design.scss'
import localforage from 'localforage';
import {DeleteOutlined, LockOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import './layouting.css';
import inputNode from './CustomInputNode';
import defaultNode from './CustomDefaultNode';
import outputNode from './CustomOutputNode';
import { message,Modal,Form,Select,Row,Col, Input, Dropdown ,Layout,Menu,Button,Spin, Typography } from 'antd';
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
const initialElements = [
    
];
const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    // console.log('context menu:', node);
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
let node_numbers= []
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
    const [condition_set, setcondition_set] = useState("");
    const [firstedge_set, setfirstedge_set] = useState("");
    const [secondedge_set, setsecondedge_set] = useState("");
    const [edge_operator, setedge_operator] = useState("operator");
    let ands=[]
    
    const [s_count, sets_count] = useState(0);
    const [ss_count, setss_count] = useState([0]);
    const repeat=()=>{
        for (let index = 0; index <= s_count; index++) {

        }
    }
    const [source_set, setsource_set] = useState("");
    const [param_set, setparam_set] = useState("");

    //localforage.setItem("edge_data",[])
    //const [edge_data, setedge_data] = useState([]);
    const [target_set, settarget_set] = useState("");
    const [edge_id, setedge_id] = useState("");
    const [all_edges, setall_edges] = useState([]);
    const [visible_edge, setvisible_edge] = useState(false);
    const [visible_edge_edit, setvisible_edge_edit] = useState(false);
    function onAnd(st_index) {
        sets_count(s_count+1)
        setss_count((s)=>s.concat(s_count))
        ands.push("and")

        const secondcoditions = {operator: "operator",first_token: "token",first: "",second_token: "token",second: ""}
        statement.statements[st_index].conditions.push(secondcoditions)
        //alert(JSON.stringify(statement))
    }
    const onOr = () => {
        sets_count(s_count+1)
        setss_count((s)=>s.concat(s_count))
        ands.push("or")
        const secondcoditions = [{operator: "operator",first_token: "token",first: "",second_token: "token",second: ""}]
         const secondstatem= {conditions: secondcoditions}
        statement.statements.push(secondstatem)
        //alert(JSON.stringify(statement))

    };

    const edgeOk = () => {
        let s = "0"
        let t = "1"
        node_numbers.forEach(element => {
            if(element.first_id==source_set-1)
            {
                s = element.second_id
            }
            if(element.first_id==target_set-1)
            {
                t = element.second_id
            }
        });
        //alert(t)
        
        
        axios.post('http://37.152.180.213/api/edge/',{
        source: s, dist: t ,statements: statement.statements
        },{headers:{
        'Content-Type' : 'application/json',
        'Authorization' :`Token ${localStorage.getItem('token')}`
        }})
        .then((response)=>{
        if (response.status === 201){
          //message.success("Collection created successfully")
          const newelm= {id: response.data.id , source: s,dist: t}
          all_edges.push(newelm)
          //alert(JSON.stringify(all_edges))
          setElements((els) => addEdge(param_set, els));
          //alert(JSON.stringify(elements))
          message.success("The edge is created successfully")

        }
        else{
          message.error("Please fill all of the fields correctly!")
        }})
        const twocoditions = [{operator: "",first_token: '',
        first: "",second_token: '',second: ""}]
        const twostatem= {statements:[{conditions: twocoditions}]}
        setstatement(twostatem);
        const data={source: source_set ,target: target_set , condition: condition_set,
            first: firstedge_set, operator: edge_operator , second: secondedge_set}
        //const newone = localforage.getItem("edge_data")
        edge_data.push(data)
        //alert(JSON.stringify(edge_data))
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

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const [vis, setVis] = useState(false);
    const coditions = [{operator: "",first_token: "",
    first: "",second_token: "",second: ""}]
    const statem= {statements:[{conditions: coditions}]}
    const [statement, setstatement] = useState(statem);

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

    const [runningScenario, setRunningScenario] = useState(false);


    const [id, setID] = useState(0);
    const [loading, setisloading] = useState(false);

    const [firsttoken_set, setfirsttoke_set] = useState("token");
    function onChangeSelectFirstToken (cc,value){
        cc.first_token=value;
        //setfirsttoke_set(value);
    }
    const [secondtoken_set, setsecondtoke_set] = useState("token");
    function onChangeSelectSecondToken (cc, value){
        //setsecondtoke_set(value);
        cc.second_token=value
    }

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
        setparam_set(params)
        setsource_set(params.source)
        settarget_set(params.target)
        conditionEmpty();
        showModalEdge();
    
    }
    const conditionSet = (e) => {
        setcondition_set(e.target.value);
      };
    
    function firstEdgeSet (d,cc,e) {
        statement.statements[d].conditions[cc].first
        =e.target.value
        //setfirstedge_set(e.target.value);
    };
    function secondEdgeSet (cc,e) {
        cc.second=e.target.value

        //setsecondedge_set(e.target.value);
    };   
    function edgeOperatorSet(cc,value){
        cc.operator=value
        //setedge_operator(value);
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
    const onElementsRemove = (elementsToRemove) => {
            if(elementsToRemove[0].source>=0)
            {
                const e = elementsToRemove[0]
            try{

                let s1 = "0"
                let t1 = "1"
                node_numbers.forEach(element => {
                    if(element.first_id==e.source-1)
            {
                s1 = element.second_id
            }
            if(element.first_id==e.target-1)
            {
                t1 = element.second_id
            }
            let id= -1;
            all_edges.forEach(el => {
                if(el.source===s1&&el.dist===t1)
                {
                    id=el.id
                    axios.delete('http://37.152.180.213/api/edge/'+el.id,
                    {headers:{
              'Content-Type' : 'application/json',
              'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((resDimo)=>{
                message.success("Removed successfuly!");
            })
            .catch((err)=>{
            });

                }
            
            });
            
                });
                
                setElements((els) => removeElements(elementsToRemove, els));
                                
          }
          catch{}
            }

        
        try{if(elementsToRemove[0].id>=0)
        {

            var tempEl=[];
            var j;
            for(j=0;j<elements.length;j++){
                if(elements[j].id!=elementsToRemove[0].id){
                    tempEl.push(elements[j]);
                }
            }
            
            setElements(tempEl);
            let x=0
            node_numbers.forEach(element => {
                if(element.first_id==elementsToRemove[0].id-1)
                {
                x = element.second_id
                }
            
            });
            axios.delete('http://37.152.180.213/api/module/'+x,
            {headers:{
              'Content-Type' : 'application/json',
              'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((resDimo)=>{
                message.success("Removed!");
            })
            .catch((err)=>{
                message.error(err.message);
            });        }
        }
        catch{
            
        
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
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        setxPosition(event.clientX - reactFlowBounds.left);
        setyPosition(event.clientY - reactFlowBounds.top);
        setTypeReactFlow(event.dataTransfer.getData('application/reactflow'));
        setVis(true);
        ListOfReuqests();


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
            // console.log(myRequests);        
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
            //setnewModule(resDimo.data.id);
            let y = id
            if(loading)
            {
                y=id+1
            }
            const no_data = {first_id: y,second_id : resDimo.data.id}
            node_numbers.push(no_data)

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = typeReactFlow;
            const position = reactFlowInstance.project({
                x: xPosition,
                y: yPosition,
            });
            //alert(JSON.stringify(elements))
            let x=getId();
            if(loading)
            {
                x=parseInt(getId())+1

            }
            const newNode = {
                id: x.toString(),
                type,
                position,className: "dropnode",
                style: { width: '12vw',height: '12vw',borderRadius: '50px'},
                targetPosition :  'left',
                sourcePosition : 'right',
                data: { label: `${type} node` },
            };
           // alert(newNode.id)

            //alert(JSON.stringify(node_numbers))                                                         
            setID(parseInt(getId())) 
            setElements((es) => es.concat(newNode));
            //alert(JSON.stringify(elements))

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
        console.log(localStorage.getItem('token'));
        if(selectedScenario==(-1)){
            message.error("Please select a scenario or create new one!");
        } else{
            setScenarioModal(false);
            

            axios.get('http://37.152.180.213/api/scenario/'+selectedScenario+'/',
            {headers:{
            'Content-Type' : 'application/json',
            'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((resDimo)=>{
                message.success("Loaded Successfully");
                setScenarioModal(false);
                console.log(resDimo.data);
                var thisElements=[];
                var i;
                setisloading(true)
                var dict = {};
                var maxim=resDimo.data.nodes.length;
                var maximID=0;
                setall_edges(resDimo.data.edges)
                for (i = 0; i < resDimo.data.nodes.length; i++) {
                    dict[resDimo.data.nodes[i].id]=0;
                }
                for (i = 0; i < resDimo.data.edges.length; i++) {
                    if((resDimo.data.edges[i].dist) in dict){
                        dict[resDimo.data.edges[i].dist]++;
                    }
                    else{
                        dict[resDimo.data.edges[i].dist]=1;
                    }
                }
                console.log(dict);
                
                for(var key in dict) {
                    var value = dict[key];
                    if(value<maxim){
                        maximID=key;
                        maxim=value;
                    }
                }

                for (i = 0; i < resDimo.data.nodes.length; i++) {

                    const no_data = {first_id: i,second_id : resDimo.data.nodes[i].id}
                    node_numbers.push(no_data)
                 

                    if(resDimo.data.nodes[i].id==maximID){
                        const newNode1 = {
                            id: (i+1).toString(),
                            type: 'inputNode',
                            data: { label: 'input node' },className: "dropnode",
                            position: { x: resDimo.data.nodes[i].x_position, y: resDimo.data.nodes[i].y_position },
                            style: { width: '12vw',height: '12vw',borderRadius: '50px'},
                            targetPosition :  'left',
                            sourcePosition : 'right',
                        };
                        //alert(newNode1.id)
                        setID(parseInt(getId())) 

                        setElements((es) => es.concat(newNode1));
                    } else{
                        const newNode2 = {
                            id: (i+1).toString(),
                            type: 'defaultNode',
                            data: { label: 'input node' },className: "dropnode",
                            position: { x: resDimo.data.nodes[i].x_position, y: resDimo.data.nodes[i].y_position },
                            style: { width: '12vw',height: '12vw',borderRadius: '50px'},
                            targetPosition :  'left',
                            sourcePosition : 'right',
                        };
                        setID(parseInt(getId()))
                      //  alert(newNode2.id) 

                        setElements((es) => es.concat(newNode2));
                    }
                   // alert(newNode.id)


                        
                }

                for(i=0;i<resDimo.data.edges.length;i++){
                    let s1 = "0"
                    let t1 = "1"
                    const e = resDimo.data.edges[i]
                    node_numbers.forEach(element => {
                    if(element.second_id==e.source)
                    {
                        s1 = element.first_id+1
                        s1 = s1.toString()
                        //alert(s1)
                    }
                    if(element.second_id==e.dist)
                    {
                        t1 = element.first_id+1
                        t1 = t1.toString()
                        //alert(t1)
                    }
                    });
                    const reflow= "reactflow__edge-"+s1+"a-"+t1+"b"
                    const params = {
                        source: s1,
                        sourceHandle: 'a',
                        target: t1,
                        targetHandle: 'b',
                        animated: true,
                        arrowHeadType: 'arrow',
                        style: {strokeWidth:3},
                        // label:'Setting',
                        // labelStyle:{fill:'#fff',fontWeight: 800},
                        // labelShowBg:false,
                    }

                    setElements((els) => addEdge(params, els));

                }
                setID(resDimo.data.nodes.length-1)                

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
        var newScenarioName=document.getElementById('new_scenario_name').value;
        // alert(newScenarioName+"***"+localStorage.getItem('selectedCollection'));

        axios.post('http://37.152.180.213/api/scenario/',
        {
            "name":newScenarioName,
            "collection":localStorage.getItem('selectedCollection')
        },
        {headers:{
          'Content-Type' : 'application/json',
          'Authorization' :`Token ${localStorage.getItem('token')}`
        }}).then((resDimo)=>{
            setElements([]);

            setSelectedScenario(resDimo.data.id);
            localStorage.setItem('selectedScenario',resDimo.data.id);
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
        localStorage.setItem('selectedScenario',value);
    }
    const RunScenario=()=>{
        axios.get('http://37.152.180.213/api/scenario/'+selectedScenario,
            {headers:{
            'Content-Type' : 'application/json',
            'Authorization' :`Token ${localStorage.getItem('token')}`
            }}).then((resDimo)=>{
                var dict = {};
                var i;
                var maxim=resDimo.data.nodes.length;
                var maximID=0;
                
                for (i = 0; i < resDimo.data.nodes.length; i++) {
                    dict[resDimo.data.nodes[i].id]=0;
                }
                for (i = 0; i < resDimo.data.edges.length; i++) {
                    if((resDimo.data.edges[i].dist) in dict){
                        dict[resDimo.data.edges[i].dist]++;
                    }
                    else{
                        dict[resDimo.data.edges[i].dist]=1;
                    }
                }
                console.log(dict);
                
                for(var key in dict) {
                    var value = dict[key];
                    if(value<maxim){
                        maximID=key;
                        maxim=value;
                    }
                }
                console.log(maximID);
                axios.put('http://37.152.180.213/api/scenario/'+selectedScenario+"/",
                {
                    "starter_module":maximID
                },
                {headers:{
                'Content-Type' : 'application/json',
                'Authorization' :`Token ${localStorage.getItem('token')}`
                }}).then((resDimo)=>{
                    setRunningScenario(true);
                    axios.get('http://37.152.180.213/api/scenario/'+selectedScenario+"/execute",
                        {headers:{
                        'Content-Type' : 'application/json',
                        'Authorization' :`Token ${localStorage.getItem('token')}`
                        }}).then((runScenario)=>{
                            message.success("Ran successfully");
                            setRunningScenario(false);
                            // while(runningScenario){
                                // axios.get('http://37.152.180.213/api/scenario/history/'+runScenario.data.scenario_history+"/",
                                // {headers:{
                                // 'Content-Type' : 'application/json',
                                // 'Authorization' :`Token ${localStorage.getItem('token')}`
                                // }}).then((runScenario)=>{
                                //     message.success("Runned successfully");
                                //     setRunningScenario(false);
                                // })
                                // .catch((err)=>{
                                //     message.success("Failed to complete scenario");
                                //     setRunningScenario(false);
                                // });  
                            //     setTimeout(function(){ }, 1000);   
                            // }    
                            })  
                            .catch((err)=>{
                                message.success("Failed to complete scenario");
                            });  
                        })
                        .catch((err)=>{
                            message.success("Failed to complete scenario");
                        }); 
                    })  
                    .catch((err)=>{
                        message.success("Failed to complete scenario");
                    });  
          
    }
    return (
        <div STYLE="overflow-y: hidden;">
        <Modal
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
                <Col span={2}><Typography STYLE="margin:10px; font-weight: bold;">Or</Typography></Col>
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
                <Modal width={"36vw"}
                visible={visible_edge}
                title="Set condition"
                style={{height: '30vh'}}
                footer={[
                <Button key="ok" className="btn btn-primary" onClick={edgeOk} >Set
                </Button>
                ]}
            >
        <div //className="andor"
         style={{alignContent: 'center' ,marginLeft: 'auto',marginRight: 'auto',alignItems: 'center',textAlign: 'center'}}>
        
                
        {statement.statements.map(d=>(
                d.conditions.map(cc=>(
                    <div className="andor"
            style={{alignContent: 'center' ,marginLeft: 'auto',marginRight: 'auto',alignItems: 'center',textAlign: 'center'}}>
            <Row style={{width: '90%',marginLeft: '6%'}}>
                <Col span={12}>
                <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
               First Operand
           </h5>
           <Input
                   style={{width: '80%'}}
                     required
                     name="first"
                     placeholder="first set"
                     onChange={(e)=>{firstEdgeSet(statement.statements.indexOf(d),
                        d.conditions.indexOf(cc),e)}}
                   />
                </Col>
                <Col span={12}>
                <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
               Token's Type
           </h5>
           <Select className="select_modal" onChange={(e)=>{onChangeSelectFirstToken(cc,e)}}  style={{ width: '80%' ,textAlign: 'left'}}>
                            <Option value="str">string</Option>
                            <Option value="num">number</Option>
                            <Option value="timestamp">timestamp</Option>
                            <Option value="body">body</Option>
                            <Option value="status_code">status code</Option>

                        </Select>
                </Col>
            </Row>
            <h5 style={{textAlign: 'left',marginLeft: '11%',marginTop: '3%'}}>
               Operator
           </h5>
           <Select onChange={(e)=>{edgeOperatorSet(cc,e)}}  style={{ width: '81%' ,textAlign: 'left',marginLeft: '2%'}}>
                            <Option value="equal">equal</Option>
                            <Option value="exist">exist</Option>
                            <Option value="start_with">starts with</Option>
                            <Option value="contains">contains</Option>
                        </Select> 
         
            <Row style={{width: '90%',marginLeft: '6%'}}>
                <Col span={12}>
                <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
                    Second Operand
                </h5>
                <Input
                   style={{width: '80%'}}
                   required
                     name="second"
                     placeholder="second set"
                     
                     onChange={(e)=>{secondEdgeSet(cc,e)}}
                   />
                </Col>
                <Col span={12}>
                <h5 style={{textAlign: 'left',marginLeft: '10%',marginTop: '3%'}}>
               Token's Type
           </h5>
           <Select onChange={(e)=>{onChangeSelectSecondToken(cc,e)}} style={{ width: '80%' ,textAlign: 'left'}}>
                            <Option value="str">string</Option>
                            <Option value="num">number</Option>
                            <Option value="timestamp">timestamp</Option>
                            <Option value="body">body</Option>
                            <Option value="status_code">status code</Option>

                        </Select> 
                </Col>
            </Row>
          
           
                   <Row style={{marginTop: '4%'}}>
                       <Col span="6">
   
                       </Col>
                       <Col span="6">
                       <Button style={{backgroundColor: '#1890ff',color: 'white',
                   border: 'none',lineHeight: '0.5',width: '100%',height: '3vh'}} onClick={()=>{onAnd(statement.statements.indexOf(d))}}>AND</Button>
                       </Col>
                       <Col span="6">
                       <Button style={{backgroundColor: '#1890ff',color: 'white',
                   border: 'none',lineHeight: '0.5',width: '100%',height: '3vh',marginLeft: '10%'}}onClick={onOr}>OR</Button>
                       </Col>
                   </Row>
           </div>
                ))
                
            
            
        ))}
         
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
                >
                    <Select STYLE="width:100%; background-color:#ffffff;" onSelect={onSelect}>
                        {myRequests.map(d=><Option value={methodAndUrl(d)}>{d.name}</Option>)}
                    </Select>
                   
                </Form>
           
                </div>
                </Modal>

                <Col STYLE="width:100%;">
                <Row STYLE="height:85%;">
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
                </Row>
                <Row STYLE="height:15%;">
                    <a style={{height:'80%'}}>
                    <img style={{height:'80%'}} onClick={()=>RunScenario()} src="https://s4.uupload.ir/files/run_button_byw4.jpg"></img>
                    {(runningScenario)?<Spin STYLE="margin-top:15px; margin-left:15px;" size="large"></Spin>:<p></p>}
                    </a>
                    
                </Row>

                </Col>

                </div>
                </Col>
            </Row>
       
        </div>
    );
};

export default DnDFlow;