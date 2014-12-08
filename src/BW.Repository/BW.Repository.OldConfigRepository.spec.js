describe('new BW.Repository.OldConfigRepository', function () {
    var facade;
    var repository;

    var config = {
        baseLayerList: [],
        overlayList: []
    };

    beforeEach(function () {
        facade = new BW.Facade.ServerConfigFacade();
        repository = new BW.Repository.OldConfigRepository(facade);
    });

    it('should return its public methods', inject( function () {
        expect(repository.GetMapConfig).not.toBe(undefined);
    }));

    it('calls the facade to get config', function () {
        spyOn(facade, 'GetMapConfig').and.callThrough();
        repository.GetMapConfig();
        expect(facade.GetMapConfig).toHaveBeenCalled();
    });

    it ('calls a callback function', function () {
        var fn = jasmine.createSpy('callback');
        spyOn(facade, 'GetMapConfig').and.callFake(function (resourceUrl, fn) { fn(config); });
        repository.GetMapConfig('testUrl', fn);
        expect(fn).toHaveBeenCalled();
    });

});
