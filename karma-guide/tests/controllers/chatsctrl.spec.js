/*  Tests for ChatsCtrl and it's template: tab-chats.html */

describe('ChatsCtrl', function(){

	// Locals
	var $scope, $compile, $templateCache, compileProvider, Chats, template, ctrl;

    // Load app & ng-html2js pre-processed templates
    beforeEach(module('starter'));
    beforeEach(module('templates'));

    // Disable Ionic cache and route provider, get $compileProvider
    beforeEach(module(function($provide, $urlRouterProvider, $compileProvider) {  
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
        compileProvider = $compileProvider;
    }));


	// Inject services and spin up the template as a directive
	beforeEach(inject(function(_$rootScope_, _$compile_, _$templateCache_, _Chats_){
        
        $scope = _$rootScope_;
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        Chats = _Chats_;

        // Use $templateCache to fetch the template as a string.
        compileProvider.directive('chatsCtrlTest', function(){
            return {
                controller: 'ChatsCtrl',
                template: $templateCache.get('templates/tab-chats.html')
            }
        });

        // Compile it and bind to $scope.
        template = angular.element('<chats-ctrl-test></chats-ctrl-test>');
        $compile(template)($scope);
        $scope.$digest();

        // If the Ionic starter app used Pappas style 'controller as' syntax
        // and bound its controller variables to 'this', we could get the controller 
        // instance like this:
        ctrl = template.controller();

    }));

    describe('controller', function(){
        it('should bind all chats to the scope', function(){
            expect($scope.chats).toEqual(Chats.all());
        });


        it('should have a remove method that wraps Chats.remove', function(){
            
            var chat = { sender: 'me', receiver: 'you', message: 'hi!'};
            spyOn(Chats, 'remove');

            $scope.remove(chat);

            expect(Chats.remove).toHaveBeenCalledWith(chat);
        });
    })


    describe('template: tab-chats', function(){

    	it('should show a list of chats, if there are chats', function(){

    		var list = template.find('ion-item');
    		var number_of_chats = $scope.chats.length;

    		expect(number_of_chats).toBeGreaterThan(0);
    		expect(list.length).toEqual(number_of_chats);

    	});

    	it('should call the remove method correctly when user deletes an item', function(){

    		var first_item = template.find('ion-item').first();
    		var first_chat = $scope.chats[0];
    		var button = first_item.find('ion-option-button');

    		spyOn($scope, 'remove');
    		button.triggerHandler('click');
    		$scope.$digest();

    		expect($scope.remove).toHaveBeenCalledWith(first_chat);

    	});

    	it('should link each item to the correct detail view', function(){
    		var first_item = template.find('ion-item').first();
    		var first_chat = $scope.chats[0];
    		var expected_link = '#/tab/chats/' + first_chat.id;

    		expect(first_item.attr('href')).toEqual(expected_link);
    	})
    });

});
