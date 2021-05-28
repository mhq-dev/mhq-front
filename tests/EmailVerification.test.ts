import EmailConfirmation from "../src/Signup/EmailVerification";
describe('EmailConfirmation_Submission',()=>{
    it('Token Founding',()=>{
        expect(new EmailConfirmation().getToken("http/domain/uid/token")).toEqual("token");
    });
    it('Uid Founding',()=>{
        expect(new EmailConfirmation().getUid("http/domain/uid/token")).toEqual("uid");
    });
})