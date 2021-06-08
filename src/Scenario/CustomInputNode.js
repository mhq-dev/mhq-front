import {  ClockCircleTwoTone } from '@ant-design/icons';
import { Badge, Input, Select, Typography } from 'antd';
import React, { memo,useState } from 'react';
import { Modal, TimePicker, DatePicker } from 'antd';
import moment from 'moment';

import { Handle } from 'react-flow-renderer';
import './CustomNode.scss'
import { Option } from 'antd/lib/mentions';

export default memo(({ data }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dateVisible, setDateVisible] = useState(true);
  const [timeVisible, setTimeVisible] = useState(false);
  const [minutesVisible, setMinutesVisible] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [type, setType] = useState("");

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

  const handleMinutesInputChange = (value) => {
    setMinutes(value.target.value)
  }

  function handleChangeSelect(value) {
    console.log(`selected ${value}`);
    setType(value)
    if(value=="every_day"){
      setDateVisible(true)
      setMinutesVisible(true)
      setTimeVisible(false)
    }
    else if(value=="once"){
      setDateVisible(false)
      setMinutesVisible(true)
      setTimeVisible(false)
    }
    else if (value=="intervals") {
      setDateVisible(true)
      setMinutesVisible(false)
      setTimeVisible(true)
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
        <Select defaultValue="every_day" style={{ width: '100%' }} onChange={handleChangeSelect}>
          <Option value="every_day">Every day</Option>
          <Option value="once">Once</Option>
          <Option value="intervals">At Regular Intervals</Option>
        </Select>
        <Typography style={{marginTop:16, marginBottom:16}}>Time:</Typography>
        <TimePicker disabled={timeVisible} style={{ width: '100%' }} format={format} />
        <Typography style={{marginTop:16, marginBottom:16}}>Date:</Typography>
        <DatePicker disabled={dateVisible} disabledDate={disabledDate} style={{ width: '100%' }} onChange={onChangeDate} />
        <Typography style={{marginTop:16, marginBottom:16}}>Minutes:</Typography>
        <Input onChange={handleMinutesInputChange} value={minutes} disabled={minutesVisible} placeholder="Minutes" />
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