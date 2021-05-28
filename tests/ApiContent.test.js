import ApiContent from '../src/Dashboard/ApiPage/ApiContent';
import { shallow } from 'enzyme';

var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
enzyme.configure({ adapter: new Adapter() });

describe('API Component tests', () =>{
    let wrapper = shallow(<ApiContent />);

    it("Should render input field for url",()=>{
        expect(wrapper.find('Input')).toHaveLength(1);
        
        expect(wrapper.find('Input').prop('placeholder')).toBe('Url');

    })

    it("Should render dividers between components",()=>{
        expect(wrapper.find('Divider')).toHaveLength(2);
        
    })

    it("Should render key-value tables",()=>{
        expect(wrapper.find('Table')).toHaveLength(3);
        
    })

    it("Should change the state of url after typing",()=>{
        wrapper.find('Input').simulate('change', {target: {value: 'ramtin'}});
        expect(wrapper.state('url')).toEqual('ramtin');
        
    })

    it("Should change the state of loading after clicking send",()=>{
        wrapper.find('Input').simulate('change', {target: {value: ''}});
        wrapper.find('Button#send').simulate('click');
        expect(wrapper.state('isloading')).toEqual(true);
        
    })

    it("should handle send method",()=>{
        wrapper.find('Input').simulate('change', {target: {value: ''}});
        wrapper.instance().handleSend()
        expect(wrapper.state('isloading')).toEqual(true);
        
    })

    it("should update json result state if it's post method",()=>{
        wrapper.find('Input').simulate('change', {target: {value: ''}});
        wrapper.instance().onChangeSelect('post')
        wrapper.instance().handleSend()
        expect(wrapper.state('json')).not.toBe({});
        
    })

    it("should update json result state if it's get method",()=>{
        wrapper.find('Input').simulate('change', {target: {value: ''}});
        wrapper.instance().onChangeSelect('get')
        wrapper.instance().handleSend()
        expect(wrapper.state('json')).not.toBe({});
        
    })

    it("should update json result state if it's put method",()=>{
        wrapper.find('Input').simulate('change', {target: {value: ''}});
        wrapper.instance().onChangeSelect('put')
        wrapper.instance().handleSend()
        expect(wrapper.state('json')).not.toBe({});
        
    })

    it("should update json result state if it's delete method",()=>{
        wrapper.find('Input').simulate('change', {target: {value: ''}});
        wrapper.instance().onChangeSelect('delete')
        wrapper.instance().handleSend()
        expect(wrapper.state('json')).not.toBe({});
        
    })


    it("handle add should update count state",()=>{
        expect(wrapper.instance().state.count).toBe(1)
        wrapper.instance().handleAdd()
        expect(wrapper.instance().state.count).toBe(2)
        
    })

    it("should change the value of method type",()=>{
        wrapper.instance().onChangeSelect('post')
        expect(wrapper.state('method_tpye')).toBe('post');
        
    })

})