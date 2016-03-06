/*  Tests for ChatsCtrl and it's template: tab-chats.html */

describe('ChatsCtrl', function(){

    var $scope, $controller, Chats, ctrl;

    // Load app
    beforeEach(module('starter'));

    // Disable Ionic cache and route provider
    beforeEach(module(function($provide, $urlRouterProvider) {  
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
    }));

    // Inject services and spin up the controller
    beforeEach(inject(function(_$rootScope_, _$controller_, _Chats_){
        
        $scope = _$rootScope_;
        $controller = _$controller_;
        Chats = _Chats_;

        ctrl = $controller('ChatsCtrl', {$scope, Chats});

    }));

    // Tests
    it('should bind all chats to the scope', function(){
        expect($scope.chats).toEqual(Chats.all());
    });

    it('should have a remove method that wraps Chats.remove', function(){
        
        var chat = { sender: 'me', receiver: 'you', message: 'hi!'};
        spyOn(Chats, 'remove');
        $scope.remove(chat);

        expect(Chats.remove).toHaveBeenCalledWith(chat);
    });
});


