angular.module('starter')
  .directive("addContact", AddContact);

// @directive: <add-contact user='someUserProfile'></add-contact>
// @params: user (the profile object of the user to be added). 
//
function AddContact($cordovaContacts, $timeout, $auth){
    return {
       restrict: 'E',   
       replace: true,
       scope: {user: '='},
       template: 
        
        '<ion-footer-bar align-title="left" class="bar-energized directive-footer"' +
                        'ng-show="!contactAdded">' +
          '<h1 class="title" >' +
            '<span> Add {{user.firstName}} to contacts</span>' +
          '</h1>' +
          '<div class="buttons">' +
            '<button class="button button-clear button-light icon ion-ios-plus-outline" ng-click="createContact()"></button>' +
          '</div>' +
        '</ion-footer-bar>',

       link: function(scope, elem, attrs){

          scope.currentUserId = Meteor.user().username; // user.username === LinkedIn profile 'id'
          scope.contactAdded = hasContact(); // Boolean determines visibility of this directive

          // @function: hasContact
          // @return: boolean
          // Determines if currentUser has already added this profile. 
          function hasContact(){
            if (!Meteor.user()) return false;

            var contacts = Meteor.user().profile.contacts;
            for(var i = 0; i < contacts.length; i++){
                if (contacts[i] === scope.user.id){
                  return true;
                }
            }
            return false;
          }; 
    
       		// @function: createContact
          // Adds profile to native contacts, calls meteor to push this contact id
          // onto the users list of added contacts
          scope.createContact = function(){
          
            var contactInfo ={ "displayName": scope.user.name };
            
            $cordovaContacts.save(contactInfo).then(function(result) {
                 
                scope.contactAdded = true;
                Meteor.call('addContact', scope.user.id); 
                    
            }, function(error) { });    
          }
        }
    };
 };