describe('<add-contact>', function(){

	// Locals
	var $scope, $compile, $cordovaContacts, scope, template;

    // Load app, cordova mocks, and ng-html2js pre-processed templates
    beforeEach(module('starter'));
    beforeEach(module('ngCordovaMocks'));
    beforeEach(module('templates'));

	// Inject services and compile directive
	beforeEach(inject(function(_$rootScope_, _$compile_, _$cordovaContacts_, _Chats_ ){
        
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $cordovaContacts = _$cordovaContacts_;
        
        //Get a chat to pass to the directive
        $rootScope.chat = _Chats_.all()[0];

        // Compile 
        template = angular.element('<add-contact contact="chat"></add-contact>');
        $compile(template)($rootScope);
        $rootScope.$digest();

        // Access directive's scope
        scope = template.isolateScope(); 

    }));

	it('should create a contact when user taps the plus button', function(){

		var button = template.find('button');
		var expected_contact = { displayName: $rootScope.chat.name };

		spyOn(scope, 'createContact').and.callThrough();
		spyOn($cordovaContacts, 'save').and.callThrough();

		button.triggerHandler('click');
		$rootScope.$digest();

		expect($cordovaContacts.save).toHaveBeenCalledWith(expected_contact);

	})

	it('should hide itself after adding a contact', function(){

		spyOn($cordovaContacts, 'save').and.callThrough();

		scope.createContact();
		$rootScope.$digest();

		expect(template.hasClass('ng-hide')).toBe(true);

	});

	it('should NOT hide itself if adding contact failed', function(){

		$cordovaContacts.throwsError = true;
		spyOn($cordovaContacts, 'save').and.callThrough();

		scope.createContact();
		$rootScope.$digest();

		expect(template.hasClass('ng-hide')).toBe(false);

	})
});



