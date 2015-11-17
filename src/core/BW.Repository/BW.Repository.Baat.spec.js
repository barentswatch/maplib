describe('BW.Repository.Baat', function() {
    var baat = new BW.Repository.Baat({token: "12345"});

    it('Expect getToken to return configured token', function(){
        expect(baat.getToken).not.toBeUndefined();
        expect(baat.getToken()).toBe("12345");
    });
});