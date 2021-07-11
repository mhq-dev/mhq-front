import {  ClockCircleTwoTone } from '@ant-design/icons';
import { Badge } from 'antd';
import React, { memo } from 'react';

import { Handle } from 'react-flow-renderer';
import './CustomNode.scss'

export default memo(({ data }) => {
  return (
    <>
      {/* <a>
      <Badge count={<ClockCircleTwoTone style={{fontSize:'250%' ,color: 'blue' }}/>}/>
      </a> */}
      <div style={{margin: 0,position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)'}}>
        Output Node
      </div>
      <Handle
        type="target"
        position="left"
        id="a"
        style={{ background: '#ff0047', width: '12px', height: '12px' }}
      />
    </>
  );
});