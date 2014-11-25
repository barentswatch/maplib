describe('new BW.Facade.ServerConfigFacade', function () {

    var facade;

    var config = {
        baseLayerList: [],
        overlayList: []
    };


    beforeEach(function () {
        facade = new BW.Facade.ServerConfigFacade();
    });

    it('should return its public methods', function () {
        expect(facade.getMapConfig).not.toBe(undefined);
    });

    it('should call server to get JSON', function () {
        spyOn($, "getJSON").and.returnValue({success: function(c){c(data);}});
        facade.getMapConfig();
        expect($.getJSON).toHaveBeenCalled();
    });

    it('calls the callback', function () {
       var url = 'testUrl';
        var fn = jasmine.createSpy('callback');
        spyOn($, "getJSON").and.callFake(function(url, fn){fn(config);});
        facade.getMapConfig(url, fn);
        expect(fn).toHaveBeenCalled();
    });

});
