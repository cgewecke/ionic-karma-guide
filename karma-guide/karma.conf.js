// Karma configuration
// Generated on Tue Mar 01 2016 19:11:54 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
       'node_modules/jquery/dist/jquery.min.js',
       'www/lib/ionic/js/ionic.bundle.js',
       'www/lib/angular-mocks/angular-mocks.js',
       'www/js/*.js',
       
       'tests/controllers/*.js',
       'tests/directives/*.js',
       'tests/services/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },

    // Which plugins to enable
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


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
