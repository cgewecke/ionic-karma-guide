/*  Karma tests for ChatsCtrl and it's template: tab-chats.html */
var debug;

describe('Controllers and their Templates', function(){

	// Load app & ng-html2js pre-processed templates
	beforeEach(module('starter'));
	beforeEach(module('templates'));

	// Disable Ionic cache and route provider
    beforeEach(module(function($provide, $urlRouterProvider) {  
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
    }));

    // Inject $compileProvider so we can spin up directives from the templates
    // and test the DOM 
    beforeEach(module(function($compileProvider) {
      compileProvider = $compileProvider;
    }));

    describe('ChatsCtrl and the template: chats-view', function(){

    	// Locals
    	var $scope, $compile, $templateCache, Chats, template, ctrl;

    	// Inject services and spin up the template as a directive
    	beforeEach(inject(function(_$rootScope_, _$compile_, _$templateCache_, _Chats_){
            
            $scope = _$rootScope_;
            $compile = _$compile_;
            $templateCache = _$templateCache_;
            Chats = _Chats_;

            // Inject tab-chats.html as a directive, using $templateCache
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
            // and bound controller variables to 'this', we could get the controller 
            // instance like this:
            ctrl = template.controller();

        }));

    	// Mirrors the controller code exactly.  
        it('should bind all chats to the scope', function(){
        	expect($scope.chats).toEqual(Chats.all());
        });

        describe('method: remove()', function(){

        	it('should call the Chats.remove method', function(){
        		
        		var chat = { sender: 'me', receiver: 'you', message: 'hi!'};
        		spyOn(Chats, 'remove');

        		$scope.remove(chat);

        		expect(Chats.remove).toHaveBeenCalledWith(chat);
        	});
        });

        // The template logic IS worth having a good description of:
        describe('template: tab-chats', function(){

        	it('should show a list of chats, if there are chats', function(){

        		var list = template.find('ion-item');
        		var number_of_chats = $scope.chats.length;

        		expect(number_of_chats).toBeGreaterThan(0);
        		expect(list.length).toEqual(number_of_chats);

        	});

        	it('should call the remove method correctly when user deletes an item', function(){

        		var first_item = angular.element(template.find('ion-item')[0]);
        		var first_chat = $scope.chats[0];
        		var button = first_item.find('ion-option-button');

        		spyOn($scope, 'remove');
        		button.triggerHandler('click');
        		$scope.$digest();

        		expect($scope.remove).toHaveBeenCalledWith(first_chat);

        	});

        	it('should link each item to the correct detail view', function(){
        		var first_item = angular.element(template.find('ion-item')[0]);
        		debug = first_item;
        		var first_chat = $scope.chats[0];
        		var expected_link = '#/tab/chats/' + first_chat.id;

        		expect(first_item.attr('href')).toEqual(expected_link);
        	})
        });

    });

})