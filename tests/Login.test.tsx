import Login from '../src/Login/Login';
import { shallow } from 'enzyme';

var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
enzyme.configure({ adapter: new Adapter() });

describe('Login Component tests', () =>{
    let wrapper = shallow(<Login />);

    it("Should render submit button",()=>{
        expect(wrapper.find('Button')).toHaveLength(1);
        
        expect(wrapper.find('Button').prop('type')).toBe('primary');

        expect(wrapper.find('Button').text()).toEqual('Log in')
    })
})