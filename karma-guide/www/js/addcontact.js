angular.module('starter')
  .directive("addContact", AddContact);

// @directive: <add-contact contact='someUser'></add-contact>
// @params: user (the profile object of the user to be added). 
//
function AddContact($cordovaContacts){
    return {
       restrict: 'E',   
       replace: true,
       scope: {contact: '='},
       templateUrl: 'templates/addContact.html',
      
       link: function(scope, elem, attrs){

          scope.contactAdded = false; // Boolean determines visibility of this directive

          // Adds to native contacts
          scope.createContact = function(){

            var contactInfo ={ "displayName": contact.name };
            
            $cordovaContacts.save(contactInfo).then(function(result) {     
                scope.contactAdded = true;
                    
            });    
          }
        }
    };
 };