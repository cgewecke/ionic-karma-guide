describe('Tab-chats template', function(){

	// Locals
	var $scope, $compile, compileProvider, template, ctrl;

    // Load app & ng-html2js pre-processed templates
    beforeEach(module('starter'));
    beforeEach(module('templates'));

    // Get $compileProvider
    beforeEach(module(function($compileProvider) {  
        compileProvider = $compileProvider;
    }));

	// Inject services and spin up the template as a directive
	beforeEach(inject(function(_$rootScope_, _$compile_ ){
        
        $scope = _$rootScope_;
        $compile = _$compile_;

        compileProvider.directive('chatsCtrlTest', function(){
            return {
                controller: 'ChatsCtrl',
                templateUrl: 'templates/tab-chats.html'
            }
        });

        // Compile it and bind to $scope.
        template = angular.element('<chats-ctrl-test></chats-ctrl-test>');
        $compile(template)($scope);
        $scope.$digest();

        // If the Ionic starter app used 'controller as' syntax
        // and bound its controller variables to 'this', we could get the controller 
        // instance like this:
        ctrl = template.controller();

    }));

    // Tests
	it('should show a list of chats', function(){

		var list = template.find('ion-item');
		var number_of_chats = $scope.chats.length;

		expect(list.length).toEqual(number_of_chats);

	});

	it('should remove a chat when user taps its delete button', function(){

		var first_item = template.find('ion-item').first();
		var first_chat = $scope.chats[0];
		var button = first_item.find('ion-option-button');

		spyOn($scope, 'remove');
		button.triggerHandler('click');
		$scope.$digest();

		expect($scope.remove).toHaveBeenCalledWith(first_chat);

	});

	it('should link each chat to the correct detail view', function(){
		var first_item = template.find('ion-item').first();
		var first_chat = $scope.chats[0];
		var expected_link = '#/tab/chats/' + first_chat.id;

		expect(first_item.attr('href')).toEqual(expected_link);
	})

});