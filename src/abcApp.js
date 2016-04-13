/**
 * Created by Darren Tarrant on 12/04/2016.
 */
(function() {
    "use strict";

    // the main angular app module - all modules tie into or are injected into this
    var app = angular.module('abcApp', [
        'angular-growl',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'abcTemplates'
    ]);

    // the constant used for the available group names
    app.constant('GROUP_NAMES', ['Friends', 'Family', 'Work']);

    /*
     Set default headers on all http requests...
     */
    app.config([ '$httpProvider', function ( $httpProvider ) {
        /*jshint -W069 */
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/vnd.emc.documentum+json; application/json; charset=utf-8';
        /*jshint -W069 */
        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/vnd.emc.documentum+json; application/json; charset=utf-8';
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        /*jshint -W069 */
        $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';
    } ]);


})();