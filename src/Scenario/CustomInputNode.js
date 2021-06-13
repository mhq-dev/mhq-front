import {  ClockCircleTwoTone } from '@ant-design/icons';
import { Badge, Select } from 'antd';
import React, { memo,useState } from 'react';
import { Modal, TimePicker, DatePicker } from 'antd';
import moment from 'moment';

import { Handle } from 'react-flow-renderer';
import './CustomNode.scss'
import { Option } from 'antd/lib/mentions';

export  default memo(({ data }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dateVisible, setDateVisible] = useState(true);

  const format = 'HH:mm';

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  function handleChangeSelect(value) {
    console.log(`selected ${value}`);
    if(value=="Everyday"){
      setDateVisible(true)
    }
    else{
      setDateVisible(false)
    }
  }
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  return (
    <>
      <Modal
        title="Schedule setting"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Run Scenario:</p>
        <Select defaultValue="Everyday" style={{ width: '100%' }} onChange={handleChangeSelect}>
          <Option value="Everyday">Every day</Option>
          <Option value="Once">Once</Option>
        </Select>
        <p style={{marginTop:16}}>Time:</p>
        <TimePicker style={{ width: '100%' }} format={format} />
        <p style={{marginTop:16}}>Date:</p>
        <DatePicker disabled={dateVisible} disabledDate={disabledDate} style={{ width: '100%' }} onChange={onChangeDate} />
      </Modal>
      <a onClick={showModal}>
      <Badge count={<ClockCircleTwoTone style={{fontSize:'250%' ,color: 'blue' }}/>}/>
      </a>
      <div style={{margin: 0,position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)'}}>
        Input Node
      </div>
      <Handle
        type="source"
        position="right"
        id="a"
        style={{ background: '#0091ff', width: '12px', height: '12px' }}
      />
    </>
  );
});