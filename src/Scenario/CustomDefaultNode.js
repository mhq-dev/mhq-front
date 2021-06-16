import { SettingTwoTone, ToolTwoTone } from '@ant-design/icons';
import { Badge } from 'antd';
import React, { memo } from 'react';
import Bg from './default.jpg'
import { Handle } from 'react-flow-renderer';
import './CustomNode.scss'
import '../style/design.scss'
export default memo(({ data }) => {
  return (
    <>
      {/* <a>
      <Badge count={<SettingTwoTone style={{fontSize:'250%' ,color: 'blue' }}/>}/>
      </a> */}
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
      <Handle
        type="target"
        className="handlegrowleft"

        position="left"
        id="b"
        style={{ background: '#ff0047',left: '-5%' }}
      />
    </>
  );
});