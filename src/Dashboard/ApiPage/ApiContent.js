import React, { useContext, useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Card, Col, Divider, Input,Form, Popconfirm, Row, Select, Table, Tabs, Spin, message } from 'antd';
import { Option } from 'antd/lib/mentions';
import './ApiContent.css'
import ReactJson from 'react-json-view';
import axios from 'axios';

const { TabPane } = Tabs;
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                    marginBottom:0
                }}
                name={dataIndex}
            >
                <Input style={{margin:0}} ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};



export default class ApiContent extends React.Component {
    constructor(props) {
        super(props);
        this.columnsParams = [
            {
                title: 'Key',
                dataIndex: 'the_key',
                width: '40%',
                editable: true,
            },
            {
                title: 'Value',
                dataIndex: 'value',
                width: '40%',
                editable: true,
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                render: (_, record) =>
                    this.state.dataSourceParams.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.columnsHeaders = [
            {
                title: 'Key',
                dataIndex: 'the_key',
                width: '40%',
                editable: true,
            },
            {
                title: 'Value',
                dataIndex: 'value',
                width: '40%',
                editable: true,
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                render: (_, record) =>
                    this.state.dataSourceHeaders.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete1(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.columnsBody = [
            {
                title: 'Key',
                dataIndex: 'the_key',
                width: '40%',
                editable: true,
            },
            {
                title: 'Value',
                dataIndex: 'value',
                width: '40%',
                editable: true,
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                render: (_, record) =>
                    this.state.dataSourceBody.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete2(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        
        this.state = {
            dataSourceParams: [
                {
                    key: '0',
                    the_key: '',
                    value: '',
                    enable:false,
                    description:''
                },
            ],
            dataSourceHeaders: [
                {
                    key: '0',
                    the_key: '',
                    value: '',
                    enable:false,
                    description:''
                },
            ],
            dataSourceBody: [
                {
                    key: '0',
                    the_key: '',
                    value: '',
                },
            ],
            count: 1,
            selectedRowsParams:[],
            selectedRowsHeaders:[],
            selectedRowsBody:[],
            json:{},
            url:'',
            id: props.id,
            method_tpye: '',
            params: {},
            headers: {},
            body:{},
            isloading: false,
            isloadingSave: false,
        };
    }
    componentDidMount(){
        const config = {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` },
          };
        axios.get(`http://37.152.188.83/api/request/${this.state.id}/`,config)
        .then((response)=>{
            console.log(response.data.http_method)
            let fields = response.data;
            let headers,body,params;
            console.log(response)
            headers = fields.headers;
            body = fields.body;
            params = fields.params;

            this.setState({headers:headers,body:body,params:params})
            let dataSourceHeaders= []
            headers.map((header, index)=>{
                dataSourceHeaders.push(
                    {
                        key: this.state.count,
                        the_key: header.key,
                        value: header.value,
                        enable:false,
                        description:''
                    })
                if(headers.length-1 === index ){
                    dataSourceHeaders.push({
                        key: this.state.count + 1,
                        the_key: '',
                        value: '',
                        enable:false,
                        description:''
                    })
                }
                this.setState({
                    dataSourceHeaders: [...dataSourceHeaders],
                    count: this.state.count + 2
                })
            })
            if(body !== undefined){
                let dataSourceBody= []
                Object.entries(body).map(([key,val],index)=>{
                    dataSourceBody.push(
                    {
                        key: this.state.count,
                        the_key: key,
                        value: val,
                    })
                    if(Object.entries(body).length-1 === index){
                        dataSourceBody.push({
                            key: this.state.count + 1,
                            the_key: '',
                            value: '',
                        })
                    }
                    this.setState({
                        dataSourceBody: [...dataSourceBody],
                        count: this.state.count + 2
                    })
                })
            }
            let dataSourceParams= []
            params.map((param, index)=>{
                dataSourceParams.push(
                    {
                        key: this.state.count,
                        the_key: param.key,
                        value: param.value,
                        enable:false,
                        description:''
                    })
                if(params.length-1 === index ){
                    dataSourceParams.push({
                        key: this.state.count + 1,
                        the_key: '',
                        value: '',
                        enable:false,
                        description:''
                    })
                }
                this.setState({
                    dataSourceParams: [...dataSourceParams],
                    count: this.state.count + 2
                })
            })
            this.setState({
                method_tpye:response.data.http_method,
                url:response.data.url,
            })
        })
    }
    rowSelectionParams = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowsParams: selectedRows})
            console.log(this.state.selectedRowsParams);
            let flag = false;
            let params = this.state.dataSourceParams;
            params.map((param)=>{
                selectedRowKeys.map((n)=>{
                    if (param.key === n){
                        param.enable = true
                        flag = true
                    }
                })
                if (!flag){
                    param.enable = false
                }
                flag = false
            })
            let url = this.state.url
            url = url.split('?')[0]
            selectedRows.map((row,index)=>{
                if (index === 0){
                    url += '?'
                }
                url += `${row.the_key}=${row.value}`
                if (index !== selectedRows.length-1){
                    url += '&'
                }
            })
            this.setState({url:url,dataSourceParams:params})
            console.log(this.state.url);
          },
          getCheckboxProps: (record) => ({
            disabled: record.the_key === '', disabled: record.value === '',
            // Column configuration not to be checked
            the_key: record.the_key,
          }),
    };
    rowSelectionHeaders = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowsHeaders: selectedRows})
            console.log(this.state.selectedRowsHeaders);
            let flag = false;
            let headers = this.state.dataSourceHeaders;
            headers.map((header)=>{
                selectedRowKeys.map((n)=>{
                    if (header.key === n){
                        header.enable = true
                        flag = true
                    }
                })
                if (!flag){
                    header.enable = false
                }
                flag = false
            })
            this.setState({dataSourceHeaders:headers})
          },
          getCheckboxProps: (record) => ({
            disabled: record.the_key === '', disabled: record.value === '',
            // Column configuration not to be checked
            the_key: record.the_key,
          }),
    };
    rowSelectionBody = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowsBody: selectedRows})
            console.log(this.state.selectedRowsBody);
          },
          getCheckboxProps: (record) => ({
            disabled: record.the_key === '', disabled: record.value === '',
            // Column configuration not to be checked
            the_key: record.the_key,
          }),
    };
    handleDelete = (key) => {
        const dataSource = [...this.state.dataSourceParams];
        let data = {}
        dataSource.map((item)=>{
            if (item.key !== key){
                data["value"] = item.value
                data["key"] = item.the_key
                data["enable"] = item.enable
                data["description"] = item.description
            }
        })
        this.setState({
            dataSourceParams: dataSource.filter((item) => item.key !== key),
            params: data
        });
    };
    handleDelete1 = (key) => {
        const dataSourceHeaders = [...this.state.dataSourceHeaders];
        let data = {}
        dataSourceHeaders.map((item)=>{
            if (item.key !== key){
                data["value"] = item.value
                data["key"] = item.the_key
                data["enable"] = item.enable
                data["description"] = item.description
            }
        })
        this.setState({
            dataSourceHeaders: dataSourceHeaders.filter((item) => item.key !== key),
            headers: data
        });
    };
    handleDelete2 = (key) => {
        const dataSourceBody = [...this.state.dataSourceBody];
        let data = {}
        dataSourceBody.map((item)=>{
            if (item.key !== key){
                data[item.the_key] = item.value
            }
        })
        this.setState({
            dataSourceBody: dataSourceBody.filter((item) => item.key !== key),
            body: data
        });
    };
    handleAdd = () => {
        const { count, dataSourceParams: dataSourceParams } = this.state;
        const newData = {
            key: count,
            the_key: ``,
            value: '',
            enable:false,
            description:''
        };
        this.setState({
            dataSourceParams: [...dataSourceParams, newData],
            count: count + 1,
        });
    };
    handleAdd1 = () => {
        const { count, dataSourceHeaders: dataSourceHeaders } = this.state;
        const newData = {
            key: count,
            the_key: ``,
            value: '',
            enable:false,
            description:''
        };
        this.setState({
            dataSourceHeaders: [...dataSourceHeaders, newData],
            count: count + 1,
        });
    };
    handleAdd2 = () => {
        const { count, dataSourceBody: dataSourceBody } = this.state;
        const newData = {
            key: count,
            the_key: ``,
            value: '',
        };
        this.setState({
            dataSourceBody: [...dataSourceBody, newData],
            count: count + 1,
        });
    };
    handleSave = (row) => {
        const newData = [...this.state.dataSourceParams];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        let data = this.state.params
        data[row.the_key] = row.value
        this.setState({
            dataSourceParams: newData,
            params: data
        });
    };
    handleSave1 = (row) => {
        const newData = [...this.state.dataSourceHeaders];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        let data = this.state.headers
        data[row.the_key] = row.value
        this.setState({
            dataSourceHeaders: newData,
            headers: data
        });
    };
    handleSave2 = (row) => {
        const newData = [...this.state.dataSourceBody];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        let data = this.state.body
        data[row.the_key] = row.value
        this.setState({
            dataSourceBody: newData,
            body: data
        });
    };

    handleSend = ()=>{
        this.onLodingChange(true)
        const config = {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        };
        axios.get(`http://37.152.188.83/api/request/${this.state.id}/execute/`,config)
        .then((response)=>{
            this.setState({json:response})
            this.onLodingChange(false)
        })
}
    handleSaveAPI = ()=>{
        this.onLodingChangeSave(true)
        let dataParams = []
        this.state.dataSourceParams.map((param)=>{
            if (param.the_key !== ""){
                const newdata = {
                    "enable": param.enable,
                    "key": param.the_key,
                    "value": param.value,
                    "description": "description",
                }
                dataParams.push(newdata)
            }
        })
        let dataHeader = []
        this.state.dataSourceHeaders.map((header)=>{
            if (header.the_key !== ""){
                const newdata = {
                    "enable": header.enable,
                    "key": header.the_key,
                    "value": header.value,
                    "description": "description",
                }
                dataHeader.push(newdata)
            }
        })
        let dataBody = {}
        Object.entries(this.state.body).map(([key,val],index)=>{
            if (key !== ""){
                dataBody[key] = val
            }
        })
        console.log(dataBody)
        console.log(dataParams)
        console.log(dataHeader)
        const config = {
            headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        };
        axios.put(`http://37.152.188.83/api/request/${this.state.id}/`,{
            http_method:this.state.method_tpye,
            url:this.state.url,
            body:this.state.body,
            headers:dataHeader,
            params:dataParams
        },config)
        .then((response)=>{
            console.log(response.data)
            this.onLodingChangeSave(false)
            message.success('Saved successfuly')
        })
        .catch((response)=>{
            message.error(response)
        })
    }

    onChangeInputUrl = (input)=>{
        this.setState({url:input.target.value})
    }

    onChangeSelect = value=>{
        this.setState({method_tpye:value})
    }

    onLodingChange = (value)=>{
        this.setState({ isloading: value });
    }

    onLodingChangeSave = (value)=>{
        this.setState({ isloadingSave: value });
    }

    render() {
        const { dataSourceParams: dataSourceParams } = this.state;
        const { dataSourceHeaders: dataSourceHeaders } = this.state;
        const { dataSourceBody: dataSourceBody } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columnsParams.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        const columnsH = this.columnsHeaders.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave1,
                }),
            };
        });
        const columnsB = this.columnsBody.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave2,
                }),
            };
        });
        
        return (
            <div>
                <Row align='middle'>
                    <Col lg={2} xs={2} sm={4} md={6}>
                        <Select onChange={this.onChangeSelect} value={this.state.method_tpye} style={{ width: 100 }}>
                            <Option value="post">POST</Option>
                            <Option value="get">GET</Option>
                            <Option value="delete">DELETE</Option>
                            <Option value="put">PUT</Option>
                        </Select>
                    </Col>
                    <Col lg={14} xs={18} sm={12} md={10}>
                        <Input value={this.state.url} defaultValue={this.state.url} placeholder='Url' onChange={this.onChangeInputUrl} />
                    </Col>
                    <Col lg={2} xs={2} sm={4} md={4}>
                        <Button htmlType="button" type='primary' onClick={this.handleSend} id='send'>
                            Send
                        </Button>
                    </Col>
                    <Col lg={6} xs={2} sm={4} md={4}>
                        <Button htmlType="button" type='default' onClick={this.handleSaveAPI}>
                            Save
                        </Button>
                    </Col>

                </Row>
                <Divider orientation='left'>Details</Divider>
                <Spin size='large' spinning={this.state.isloadingSave}>
                <Row justify='center' align='middle'>
                    <Col flex='auto'>
                        <Tabs defaultActiveKey="1" style={{ padding: 8 }}>
                            <TabPane tab="Params" key="1">
                                <Card style={{ minHeight: '100px' }} bodyStyle={{padding:0}}>
                                    <div>
                                        <Row>
                                        <Button
                                            onClick={this.handleAdd}
                                            type="primary"
                                            style={{
                                                marginBottom: 2,
                                            }}
                                        >
                                            Add a row
                                        </Button>
                                        </Row>
                                        <Row>
                                            <Col flex='auto'>
                                            <Table
                                            components={components}
                                            rowClassName={() => 'editable-row'}
                                            bordered
                                            dataSource={dataSourceParams}
                                            columns={columns}
                                            pagination={false}
                                            rowSelection={this.rowSelectionParams}
                                        />
                                            </Col>
                                        
                                        </Row>
                                        
                                    </div>
                                </Card>

                            </TabPane>
                            <TabPane tab="Body" key="2">
                                <Card style={{ minHeight: '100px' }} bodyStyle={{padding:0}}>
                                <div>
                                        <Row>
                                        <Button
                                            onClick={this.handleAdd2}
                                            type="primary"
                                            style={{
                                                marginBottom: 2,
                                            }}
                                        >
                                            Add a row
                                        </Button>
                                        </Row>
                                        <Row>
                                            <Col flex='auto'>
                                            <Table
                                            components={components}
                                            rowClassName={() => 'editable-row'}
                                            bordered
                                            dataSource={dataSourceBody}
                                            columns={columnsB}
                                            pagination={false}
                                            rowSelection={this.rowSelectionBody}
                                        />
                                            </Col>
                                        
                                        </Row>
                                        
                                    </div>
                                </Card>

                            </TabPane>
                            <TabPane tab="Headers" key="3">
                                <Card style={{ minHeight: '100px' }} bodyStyle={{padding:0}}>
                                <div>
                                        <Row>
                                        <Button
                                            onClick={this.handleAdd1}
                                            type="primary"
                                            style={{
                                                marginBottom: 2,
                                            }}
                                        >
                                            Add a row
                                        </Button>
                                        </Row>
                                        <Row>
                                            <Col flex='auto'>
                                            <Table
                                            components={components}
                                            rowClassName={() => 'editable-row'}
                                            bordered
                                            dataSource={dataSourceHeaders}
                                            columns={columnsH}
                                            pagination={false}
                                            rowSelection={this.rowSelectionHeaders}
                                        />
                                            </Col>
                                        
                                        </Row>
                                        
                                    </div>
                                </Card>

                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                </Spin>
                <Divider orientation='left'>Results</Divider>
                <Row>
                    <Col flex='auto'>
                        <Card style={{ height: '300px',overflow:'auto', marginBottom:'16px' }}>
                            <Spin size='large' spinning={this.state.isloading}>
                                <ReactJson theme='monokai' style={{textAlign:'start',minHeight: '250px'}} src={this.state.json}/>
                            </Spin>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}