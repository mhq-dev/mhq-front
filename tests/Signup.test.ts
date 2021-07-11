import Signup from "../src/Signup/Signup";
describe('Signup_Submission',()=>{
    it('Not_Match_Password',()=>{
        expect(new Signup().CheckSubmission("","","thePass","ThePass")).toEqual("Wrong");
    });
    it('Match_Password',()=>{
        expect(new Signup().CheckSubmission("","","thePass","thePass")).toEqual("Correct");
    });
})
