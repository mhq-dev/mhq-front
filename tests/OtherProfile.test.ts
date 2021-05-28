import OtherProfile from "../src/Profile/OtherProfile";
describe('OtherProfile_Submission',()=>{
    const otherProfile=new OtherProfile();
    it('ToggleFollow',()=>{
        expect(otherProfile.sumbitButton()).toEqual("Unfollow");
    });
})