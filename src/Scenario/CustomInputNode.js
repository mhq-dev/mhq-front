import {  ClockCircleTwoTone } from '@ant-design/icons';
import { Badge, Col, Input, Row, Select, Typography } from 'antd';
import React, { memo,useEffect,useState } from 'react';
import { Modal, TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import Bg from './input.jpg'

import { Handle } from 'react-flow-renderer';
import './CustomNode.scss'
import { Option } from 'antd/lib/mentions';
import axios from 'axios';
import '../style/design.scss'

export  default memo(({ data }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dateVisible, setDateVisible] = useState(true);
  const [timeVisible, setTimeVisible] = useState(false);
  const [minutesVisible, setMinutesVisible] = useState(true);
  const [daysVisible, setDaysVisible] = useState(true);
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [monthsVisible, setMonthsVisible] = useState(true);
  const [daysOfTheMonthVisible, setDaysOfTheMonthVisible] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [type, setType] = useState("every_day");
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [daysSelect, setDaysSelect] = useState(null);
  const [monthsSelect, setMonthsSelect] = useState(null);
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

  const months = [];
  months.push(<Option value="0" key={"January"}>{"January"}</Option>);
  months.push(<Option value="1" key={"February"}>{"February"}</Option>);
  months.push(<Option value="2" key={"March"}>{"March"}</Option>);
  months.push(<Option value="3" key={"April"}>{"April"}</Option>);
  months.push(<Option value="4" key={"May"}>{"May"}</Option>);
  months.push(<Option value="5" key={"June"}>{"June"}</Option>);
  months.push(<Option value="6" key={"July"}>{"July"}</Option>);
  months.push(<Option value="7" key={"August"}>{"August"}</Option>);
  months.push(<Option value="8" key={"September"}>{"September"}</Option>);
  months.push(<Option value="9" key={"October"}>{"October"}</Option>);
  months.push(<Option value="10" key={"November"}>{"November"}</Option>);
  months.push(<Option value="11" key={"December"}>{"December"}</Option>);

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
        setStartDate(res.data.start_date_time)
        setEndDate(res.data.expired_date_time)
        setType(res.data.type)
        if(res.data.days !== null && res.data.type==='days_of_week'){
          setDaysSelect(res.data.days.split(","))
        }
        else if(res.data.type==='days_of_week'){
          setDaysSelect(res.data.days)
        }
        if(res.data.days !== null && (res.data.type==='days_of_month' || res.data.type==='specified_dates')){
          setDaysOfTheMonthSelect(res.data.days.split(","))
        }
        else if(res.data.type==='days_of_month' || res.data.type==='specified_dates'){
          setDaysOfTheMonthSelect(res.data.days)
        }
        if(res.data.months !== null){
          setMonthsSelect(res.data.months.split(","))
        }
        else{
          setMonthsSelect(res.data.months)
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
      if(startDate !== "" && endDate !== "" && endDate !== null && startDate !== null){
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
        {
          type: type,
          minutes: parseInt(minutes),
          enable: true,
          start_date_time: startDate.replace(" ","T"),
          expired_date_time: endDate.replace(" ","T")
        }, config)
        .then((res)=>{
          console.log(res)
        })
      }
      else{
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
        {
          type: type,
          minutes: parseInt(minutes),
          enable: true,
        }, config)
        .then((res)=>{
          console.log(res)
        })
      }
    }
    else if(type === "every_day"){
      console.log(type)
      if(startDate !== "" && endDate !== "" && endDate !== null && startDate !== null){
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
        {
          type: type,
          time: time,
          enable: true,
          start_date_time: startDate.replace(" ","T"),
          expired_date_time: endDate.replace(" ","T")
        }, config)
        .then((res)=>{
          console.log(res)
        })
      }
      else{
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time: time,
        enable: true
      }, config)
      .then((res)=>{
        console.log(res)
      })
      }
    }
    else if(type === "once"){
      let datePlusTime = date + 'T' + time
      console.log(datePlusTime)
      axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        date: datePlusTime,
        enable: true
      }, config)
      .then((res)=>{
        console.log(res)
      })
    }
    else if(type === "days_of_week"){
      if(startDate !== "" && endDate !== "" && endDate !== null && startDate !== null){
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
        {
          type: type,
          time:time,
          days: daysSelect.toString(),
          enable: true,
          start_date_time: startDate.replace(" ","T"),
          expired_date_time: endDate.replace(" ","T")
        }, config)
        .then((res)=>{
          console.log(res)
        })
      }
      else{
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time:time,
        days: daysSelect.toString(),
        enable: true
      }, config)
      .then((res)=>{
        console.log(res)
      })
      }
    }
    else if(type === "days_of_month"){
      if(startDate !== "" && endDate !== "" && endDate !== null && startDate !== null){
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
        {
          type: type,
          time:time,
          days: daysOfTheMonthSelect.toString(),
          enable: true,
          start_date_time: startDate.replace(" ","T"),
          expired_date_time: endDate.replace(" ","T")
        }, config)
        .then((res)=>{
          console.log(res)
        })
      }
      else{
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time:time,
        days: daysOfTheMonthSelect.toString(),
        enable: true
      }, config)
      .then((res)=>{
        console.log(res)
      })
      }
    }
    else if(type === "specified_dates"){
      if(startDate !== "" && endDate !== "" && endDate !== null && startDate !== null){
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
        {
          type: type,
          time:time,
          days: daysOfTheMonthSelect.toString(),
          months: monthsSelect.toString(),
          enable: true,
          start_date_time: startDate.replace(" ","T"),
          expired_date_time: endDate.replace(" ","T")
        }, config)
        .then((res)=>{
          console.log(res)
        })
      }
      else{
        axios.put(`http://37.152.180.213/api/scenario/${scenario_id}/schedule/`,
      {
        type: type,
        time:time,
        days: daysOfTheMonthSelect.toString(),
        months: monthsSelect.toString(),
        enable: true
      }, config)
      .then((res)=>{
        console.log(res)
      })
      }
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
      setMonthsVisible(true)
      setStartDateVisible(false)
      setEndDateVisible(false)
    }
    else if(value=="once"){
      setDateVisible(false)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(true)
      setMonthsVisible(true)
      setStartDateVisible(true)
      setEndDateVisible(true)
    }
    else if (value=="intervals") {
      setDateVisible(true)
      setMinutesVisible(false)
      setTimeVisible(true)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(true)
      setMonthsVisible(true)
      setStartDateVisible(false)
      setEndDateVisible(false)
    }
    else if (value=="days_of_week") {
      setDateVisible(true)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(false)
      setDaysOfTheMonthVisible(true)
      setMonthsVisible(true)
      setStartDateVisible(false)
      setEndDateVisible(false)
    }
    else if (value=="days_of_month") {
      setDateVisible(true)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(false)
      setMonthsVisible(true)
      setStartDateVisible(false)
      setEndDateVisible(false)
    }
    else if (value=="specified_dates") {
      setDateVisible(true)
      setMinutesVisible(true)
      setTimeVisible(false)
      setDaysVisible(true)
      setDaysOfTheMonthVisible(false)
      setMonthsVisible(false)
      setStartDateVisible(false)
      setEndDateVisible(false)
    }
  }
  function onChangeDate(date, dateString) {
    console.log(date, dateString);
    setDate(dateString)
  }
  function onChangeStartDate(date, dateString) {
    console.log(date, dateString);
    setStartDate(dateString)
  }
  function onChangeEndDate(date, dateString) {
    console.log(date, dateString);
    setEndDate(dateString)
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
  function handleChangeMonth(value) {
    console.log(`selected ${value}`);
    setMonthsSelect(value);
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
          <Option value="specified_dates">Specified Dates</Option>
        </Select>
        <Row gutter={8}>
          <Col span={12}><Typography style={{marginTop:16, marginBottom:16}}>Time:</Typography>
        <TimePicker value={time === null ? time : moment(time,'HH:mm:ss')} onChange={onChangeTime} disabled={timeVisible} style={{ width: '100%' }} format={format} />
        </Col>
          <Col span={12}>
          <Typography style={{marginTop:16, marginBottom:16}}>Date:</Typography>
        <DatePicker defaultValue={date === null ? date : moment(date,'YYYY-MM-DD')} disabled={dateVisible} disabledDate={disabledDate} style={{ width: '100%' }} onChange={onChangeDate} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
          <Typography style={{marginTop:16, marginBottom:16}}>Minutes:</Typography>
          <Input style={{backgroundColor:'#414141', color:'white'}} onChange={handleMinutesInputChange} value={minutes} disabled={minutesVisible} placeholder="Minutes" />
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
          <Typography style={{marginTop:16, marginBottom:16}}>Months:</Typography>
          <Select
          disabled={monthsVisible}
          value={monthsSelect}
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={handleChangeMonth}
          >
          {months}
          </Select>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Typography style={{marginTop:16, marginBottom:16}}>Start:</Typography>
            <DatePicker showTime defaultValue={startDate === null ? startDate : moment(startDate.replace("T"," "),'YYYY-MM-DD HH:mm:ss')} disabled={startDateVisible} disabledDate={disabledDate} style={{ width: '100%' }} onChange={onChangeStartDate} />
          </Col>
          <Col span={12}>
            <Typography style={{marginTop:16, marginBottom:16}}>End:</Typography>
            <DatePicker showTime defaultValue={endDate === null ? endDate : moment(endDate.replace("T"," "),'YYYY-MM-DD HH:mm:ss')} disabled={endDateVisible} disabledDate={disabledDate} style={{ width: '100%' }} onChange={onChangeEndDate} />
          </Col>
        </Row>
        
      </Modal>
      <a onClick={showModal}>
      <Badge count={<ClockCircleTwoTone style={{fontSize:'250%' ,color: 'blue' }}/>}/>
      </a>
      <div style={{margin: 0,position: 'absolute',width: '12vw',height: '12vw',borderRadius: '50px',display: 'flex',backgroundSize: '100% 100%'
    ,backgroundImage: "url(" + Bg +")"}}>
      </div>
      <Handle
        type="source"
        className="handlegrow"
        position="right"
        id="a"
        style={{ background: '#0091ff',left: '93%' }}
      />
    </>
  );
});