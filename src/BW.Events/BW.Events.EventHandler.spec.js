describe('BW.Events.EventHandler is triggered', function() {
    var eventHandler, val;

    beforeEach(function(){
        eventHandler = new BW.Events.EventHandler();

        val = 0;

        eventHandler.RegisterEvent("TestEvent", function(newVal){
            val = newVal;
        });

        eventHandler.TriggerEvent("TestEvent", 10);
    });

    it('should run its callback', inject( function() {
        expect(val).toEqual(10);
    }));
});