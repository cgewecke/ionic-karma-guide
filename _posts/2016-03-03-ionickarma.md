---
layout: post
title: "A Short Guide to Testing Ionic App Templates & Directives"
---

### Using Karma for quick low-level integration testing
This guide follows [Volta Jina's approach](https://github.com/vojtajina/ng-directive-testing) to testing Angular code, where Karma specs are written for logic embedded in the templates and validation is done by checking element behavior. Some nice examples of this method can be found at the [Angular Material](https://github.com/angular/material/blob/master/src/components/button/button.spec.js) project.  

We will be using the [ionic 'tabs' starter](http://ionicframework.com/docs/cli/start.html) as a base. Testing Ionic apps has its idiosyncrasies: ui-router and ionicTemplateCache trigger lots of 'unexpected get' errors from the test runner, so they have to be disabled. This means accessing templates and their controllers is tricky. There are other issues too: how should you test code that runs in a cordova plugin callback? What about directives that get their templates by url?  

### Table of Contents


[Setting up the test environment](#setup)   
[Testing a controller and its template](#chatsctrl)   
[Testing a directive](#directive)   
[Testing with cordova plugins](#cordova)   


## <a name="setup"></a> The Test Environment

[karma](http://karma-runner.github.io/0.13/intro/installation.html): the test runner    
[jasmine](https://github.com/karma-runner/karma-jasmine): the testing framework    
[chrome-launcher](https://github.com/karma-runner/karma-chrome-launcher): for event and debugging support (instead of phantom.js)    
[ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor): to consume templates as javascript strings   
[mocha-reporter](https://www.npmjs.com/package/karma-mocha-reporter): for nice test reports.    
[jQuery](https://www.npmjs.com/package/jquery): for finding elements.    
[angular-mocks](https://docs.angularjs.org/api/ngMock): for mocking services like $timeout and $http

_(None of these packages will ship with your app - they are part of the development environment)_

At the command line in your project directory run:

{% highlight bash %}
$ npm install karma --save-dev
$ npm install -g karma-cli
$ npm install jasmine-core --save-dev
$ npm install karma-jasmine@2_0 --save-dev
$ npm install karma-chrome-launcher --save-dev
$ npm install karma-ng-html2js-preprocessor --save-dev
$ npm install karma-mocha-reporter --save-dev
$ npm install jquery --save-dev
$ bower install angular-mocks --save-dev
{% endhighlight %}

Create a karma config file by running:

{% highlight bash %}
$ karma init
{% endhighlight %}

Karma  will ask you a series of questions about which frameworks to use (jasmine), what browsers to launch (chrome) and what files to watch. Skip through this, pressing return after everything. There's a section below on modifying the config file manually once it's generated. 

Add the following task to your project's gulpfile.js:

{% highlight javascript %}
var Server = require('karma').Server;

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start()
});
{% endhighlight %}

Ultimately, when you're ready to test you'll run:

{% highlight bash %}
$ gulp test
{% endhighlight %}

### Make some folders for your tests
In the project's root directory:

{% highlight bash %}
$ mkdir tests
$ mkdir tests/controllers
$ mkdir tests/directives
$ mkdir tests/services
{% endhighlight %}

### Edit karma.config.js
(The full config for this project can be found [here](https://github.com/cgewecke/ionic-karma-guide/blob/master/karma-guide/karma.conf.js).) 

List jQuery **first** in the files array, _then_ the ionic bundle and angular-mocks, _then_ your html files, _then_ add all the other js files you've declared in index.html and your test files. 

{% highlight python %}
files: [
   
   'node_modules/jquery/dist/jquery.min.js',
   'www/lib/ionic/js/ionic.bundle.js',
   'www/lib/angular-mocks/angular-mocks.js',
   ...
   'www/templates/*.html'
   ...
   'www/js/*.js',
   ...    
   'tests/controllers/*.js',
   'tests/directives/*.js',
   'tests/services/*.js'
],        
{% endhighlight %}    

Define your custom launcher, enumerate your plugins, specify your pre-processors, and select your reporter, as below. 

{% highlight python %}
customLaunchers: {
  Chrome_without_security: {
     base: 'Chrome',
     flags: ['--disable-web-security']
  }
},

plugins: [
  "karma-chrome-launcher",
  "karma-jasmine",
  "karma-mocha-reporter",
  "karma-ng-html2js-preprocessor"
],

preprocessors: {
  'www/templates/*.html': ['ng-html2js']
},

ngHtml2JsPreprocessor: {
   moduleName: 'templates',
   stripPrefix: 'www/'
},

reporters: ['mocha'],
{% endhighlight %}

Now Karma will launch in chrome, pre-fetch your templates and print intelligible color-coded reports. Lets write some tests.

## <a name="chatsctrl"></a> Testing ChatsCtrl

{% highlight javascript %}
.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
});
{% endhighlight %}

That's ChatsCtrl: an archetypically 'thin' controller whose sole purpose is to expose service methods to the DOM on $scope. We want some tests that describe the way its wired into the html. Here's the template: it ng-repeats a list. Each item is ng-clickable and has a dynamically generated link. 

{% highlight html %}
<ion-view view-title="Chats">
  <ion-content>
    <ion-list>
      <ion-item class="etc" ng-repeat="chat in chats" href="#/tab/chats/{% raw %}{{chat.id}}{% endraw %}">
        <img ng-src="{{chat.face}}">
        <h2>{{chat.name}}</h2>
        <p>{{chat.lastText}}</p>
        <i class="icon ion-chevron-right icon-accessory"></i>

        <ion-option-button class="button-assertive" ng-click="remove(chat)">
          Delete
        </ion-option-button>
      </ion-item>
    </ion-list>
  </ion-content>
</ion-view>
{% endhighlight %}

Here's the test set up:

{% highlight javascript %}
describe('ChatsCtrl and the template: chats-view', function(){

    // Locals
    var $scope, $compile, $templateCache, compileProvider, Chats, template, ctrl;

    // Load app & ng-html2js pre-processed templates
    beforeEach(module('starter'));
    beforeEach(module('templates'));

    // Disable Ionic cache and route provider, inject $compileProvider
    beforeEach(module(function($provide, $urlRouterProvider, $compileProvider) {  
        $provide.value('$ionicTemplateCache', function(){} );
        $urlRouterProvider.deferIntercept();
        compileProvider = $compileProvider;
    }));

    // Inject services, 
    // Spin up the template as a directive with ChatsCtrl as its controller
    beforeEach(inject(function(_$rootScope_, _$compile_, _$templateCache_, _Chats_){
        
        $scope = _$rootScope_;
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        Chats = _Chats_;

        // Use $templateCache.get to fetch the template as a string
        // (urlRouting is disabled)
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

        // If the Ionic starter app used 'controller as' syntax and bound its 
        // variables to 'this', we could get the controller instance like this:
        ctrl = template.controller();
    }));
    ...
    // Tests 
    ...
});
{% endhighlight %}

Now we have clean access to both ChatsCtrl (through $scope) and the tab-chats template (through 'template'). Traditional unit tests for ChatsCtrl with $scope would look like this:

{% highlight javascript %}
describe('controller: ', function(){

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
{% endhighlight %}

Let's make sure chats are actually getting listed, the delete button works, and each chat item links to the right view: 

{% highlight javascript %}
describe('template: tab-chats', function(){

   it('should show a list of chats', function(){

      var list = template.find('ion-item');
      var number_of_chats = $scope.chats.length;

      expect(list.length).toEqual(number_of_chats);

   });

   it('should call the remove method when delete is tapped', function(){

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

{% endhighlight %}

Run `$ gulp test` and here's the report:

![Test Report for ChatsCtrl]({{site.url}}/assets/chatstest1.png){: .center-image }
