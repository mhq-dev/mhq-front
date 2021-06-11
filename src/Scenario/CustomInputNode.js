import {  ClockCircleTwoTone } from '@ant-design/icons';
import { Badge, Input, Select, Typography } from 'antd';
import React, { memo,useEffect,useState } from 'react';
import { Modal, TimePicker, DatePicker } from 'antd';
import moment from 'moment';

import { Handle } from 'react-flow-renderer';
import './CustomNode.scss'
import { Option } from 'antd/lib/mentions';
import axios from 'axios';

export default memo(({ data }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dateVisible, setDateVisible] = useState(true);
  const [timeVisible, setTimeVisible] = useState(false);
  const [minutesVisible, setMinutesVisible] = useState(true);
  const [daysVisible, setDaysVisible] = useState(true);
  const [daysOfTheMonthVisible, setDaysOfTheMonthVisible] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [type, setType] = useState("every_day");
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [daysSelect, setDaysSelect] = useState(null);
  const [daysOfTheMonthSelect, setDaysOfTheMonthSelect] = useState(null);

  const format = 'HH:mm';

  const showModal = () => {
    setVisible(true);
  };

  const days = [];
  days.push(<Option value="0" key={"Monday"}>{"Monday"}</Option>);
  days.push(<Option value="1" key={"Tuesday"}>{"Tuesday"}</Option>);
  days.push(<Option value="2" key={"Wednesday"}>{"Wednesday"}</Option>);
  days.push(<Option value="3" key={"Thursday"}>{"Thursday"}</Option>);
  days.push(<Option value="4" key={"Friday"}>{"Friday"}</Option>);
  days.push(<Option value="5" key={"Saturday"}>{"Saturday"}</Option>);
  days.push(<Option value="6" key={"Sunday"}>{"Sunday"}</Option>);

  const daysOfMonth = [];
  for (let index = 1; index < 32; index++) {
    daysOfMonth.push(<Option value={index.toString()} key={index.toString()}>{index.toString()}</Option>);
  }

  useEffect(()=>{
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    };
    const scenario_id = localStorage.getItem('selectedScenario');
    axios.get(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,config)
      .then((res)=>{
        console.log(res)
        setMinutes(res.data.minutes)
        setTime(res.data.time)
        setDate(res.data.date)
        setType(res.data.type)
        if(res.data.days !== null && res.data.type==='days_of_week'){
          setDaysSelect(res.data.days.split(","))
        }
        else if(res.data.type==='days_of_week'){
          setDaysSelect(res.data.days)
        }
        if(res.data.days !== null && res.data.type==='days_of_month'){
          setDaysOfTheMonthSelect(res.data.days.split(","))
        }
        else if(res.data.type==='days_of_month'){
          setDaysOfTheMonthSelect(res.data.days)
        }
        handleChangeSelect(res.data.type)
      })
  },[])

  const handleOk = () => {
    setConfirmLoading(true);
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    };
    const scenario_id = localStorage.getItem('selectedScenario');
    if(type === "intervals"){
      console.log(type)
      axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        minutes: parseInt(minutes),
        enable: false
      }, config)
      .then((res)=>{
        console.log(res)
      })
    }
    else if(type === "every_day"){
      console.log(type)
      axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time: time,
        enable: false
      }, config)
      .then((res)=>{
        console.log(res)
      })
    }
    else if(type === "once"){
      let datePlusTime = date + 'T' + time
      console.log(datePlusTime)
      axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        date: datePlusTime,
        enable: false
      }, config)
      .then((res)=>{
        console.log(res)
      })
    }
    else if(type === "days_of_week"){
      axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time:time,
        days: daysSelect.toString(),
        enable: false
      }, config)
      .then((res)=>{
        console.log(res)
      })
    }
    else if(type === "days_of_month"){
      axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time:time,
        days: daysOfTheMonthSelect.toString(),
        enable: false
      }, config)
      .then((res)=>{
        console.log(res)
      })
    }
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
      setDaysVisible(true)
      setDaysOfTheMonthVisible(true)
    }
    else if(value=="once"){
      setDateVisible(false)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(true)
    }
    else if (value=="intervals") {
      setDateVisible(true)
      setMinutesVisible(false)
      setTimeVisible(true)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(true)
    }
    else if (value=="days_of_week") {
      setDateVisible(true)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(false)
      setDaysOfTheMonthVisible(true)
    }
    else if (value=="days_of_month") {
      setDateVisible(true)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(false)
    }
  }
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
    setDate(dateString)
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  function onChangeTime(time, timeString) {
    setTime(timeString)
  }
  function handleChangeDays(value) {
    console.log(`selected ${value}`);
    setDaysSelect(value);
  }
  function handleChangeDaysOfMonth(value) {
    console.log(`selected ${value}`);
    setDaysOfTheMonthSelect(value);
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
        <Select value={type} style={{ width: '100%' }} onChange={handleChangeSelect}>
          <Option value="every_day">Every day</Option>
          <Option value="once">Once</Option>
          <Option value="intervals">At Regular Intervals</Option>
          <Option value="days_of_week">Days of the Week</Option>
          <Option value="days_of_month">Days of the Month</Option>
        </Select>
        <Typography style={{marginTop:16, marginBottom:16}}>Time:</Typography>
        <TimePicker value={time === null ? time : moment(time,'HH:mm:ss')} onChange={onChangeTime} disabled={timeVisible} style={{ width: '100%' }} format={format} />
        <Typography style={{marginTop:16, marginBottom:16}}>Date:</Typography>
        <DatePicker defaultValue={date === null ? date : moment(date,'YYYY-MM-DD')} disabled={dateVisible} disabledDate={disabledDate} style={{ width: '100%' }} onChange={onChangeDate} />
        <Typography style={{marginTop:16, marginBottom:16}}>Minutes:</Typography>
        <Input onChange={handleMinutesInputChange} value={minutes} disabled={minutesVisible} placeholder="Minutes" />
        <Typography style={{marginTop:16, marginBottom:16}}>Days:</Typography>
        <Select
        disabled={daysVisible}
        value={daysSelect}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={handleChangeDays}
        >
        {days}
      </Select>
      <Typography style={{marginTop:16, marginBottom:16}}>Days of the month:</Typography>
        <Select
        disabled={daysOfTheMonthVisible}
        value={daysOfTheMonthSelect}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={handleChangeDaysOfMonth}
        >
        {daysOfMonth}
        </Select>
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