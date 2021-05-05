import EditProfile from "../src/Profile/EditProfile";
import axios from 'axios';
describe('EditProfile_Submission',()=>{
    it('Bio Updating',()=>{
        axios.post('http://37.152.188.83/api/auth/token/login/',{
            password: "mmmmmmm3",
            username: "mmd"
        })
        .then((response)=>{
            if (response.status === 200){
                let token = response.data.auth_token;
                expect(new EditProfile().sumbitButton("BioTest",token)).toEqual("Updated");
            }
            else{
                expect("true").toEqual("false");
            }
        })
        .catch((error)=>{
            expect("true").toEqual("false");
        })
        
    });
    
})