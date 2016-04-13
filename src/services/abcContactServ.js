/**
 * Created by Darren Tarrant on 13/04/2016.
 */
(function() {

    var app = angular.module('abcApp');

    app.service('abcContactServ', [
        '$http',
        '$q',
        '$timeout',
        '$uibModal',
        'growl',
        '$rootScope',
        function($http, $q, $timeout, $uibModal, growl, $rootScope) {

            var rootUrl = 'http://localhost:8080/api/contacts';

            var service = {

                // deletes a contact
                deleteContact: function(contact, silent) {

                    var defer = $q.defer();

                    $timeout(function() {

                        // just resolve
                        defer.resolve();

                        if ( silent !== true ) {
                            // tell the user
                            growl.addSuccessMessage('Deleted contact ' + contact.name, {ttl: 2000});

                            // tell the app
                            $rootScope.$broadcast('contactDeleted', contact);
                        }

                    }, 500);

                    return defer.promise;
                },

                // creates a new contact - returns the REST result
                createContact: function(contact) {

                    var defer = $q.defer();

                    // example post call
                    //$http({
                    //    method: 'POST',
                    //    url: rootUrl,
                    //    data: contact
                    //}).then(
                    //
                    //    function(created) {
                    //        defer.resolve(created);
                    //    },
                    //
                    //    function(error) {
                    //        defer.reject(error);
                    //    }
                    //);

                    // just resolve with the object
                    $timeout(function() {

                        defer.resolve(contact);

                        // tell the user
                        growl.addSuccessMessage('Created new contact ' + contact.name, {ttl: 2000});

                        // tell the app
                        $rootScope.$broadcast('contactCreated', contact);

                    }, 500);

                    return defer.promise;
                },

                // updates the details for a contact - accepts the updated object and returns the updated result from the rest call
                updateContact: function(contact) {

                    var defer = $q.defer();

                    // example post call
                    //$http({
                    //    method: 'POST',
                    //    url: rootUrl + contact.id,
                    //    data: contact
                    //}).then(
                    //
                    //    function(updated) {
                    //        defer.resolve(updated);
                    //    },
                    //
                    //    function(error) {
                    //        defer.reject(error);
                    //    }
                    //);

                    // just resolve with the updated object
                    $timeout(function() {

                        defer.resolve(contact);

                        // tell the user
                        growl.addSuccessMessage('Updated details for ' + contact.name, {ttl: 2000});

                        // tell the app
                        $rootScope.$broadcast('contactUpdated', contact);

                    }, 500);

                    return defer.promise;
                },

                // adds a contact to a group - returns the updated contact
                addToGroup: function(contact, group) {

                    var defer = $q.defer();

                    // call to add to this group
                    $timeout(function() {

                        contact.groups.push(group);

                        defer.resolve(contact);

                        // tell the user
                        growl.addSuccessMessage('Added ' + contact.name + ' to ' + group + ' group', {ttl: 2000});

                        // tell the app
                        $rootScope.$broadcast('contactGroupChange', contact, group);

                    }, 300);

                    return defer.promise;
                },

                // removes a contact from a group - returns the updated contact
                removeFromGroup: function(contact, group) {

                    var defer = $q.defer();

                    // call to add to this group
                    $timeout(function() {

                        // find the index
                        var index;
                        for ( var i=0; i<contact.groups.length; i++ ) {
                            if ( contact.groups[i] == group ) {
                                index = i;
                                break;
                            }
                        }
                        if ( angular.isDefined(index) ) {
                            contact.groups.splice(index, 1);

                            // tell the user
                            growl.addSuccessMessage('Removed ' + contact.name + ' from ' + group + ' group', {ttl: 2000});

                            // tell the app
                            $rootScope.$broadcast('contactGroupChange', contact, group);
                        }

                        defer.resolve(contact);

                    }, 300);

                    return defer.promise;
                },

                // displays a contact in a modal
                showContact: function(contact, startEdit, isNew) {

                    // show a modal with this contact
                    $uibModal.open({
                        templateUrl: 'abcContactDetails/abcContactDetails-tpl.html',
                        controller: 'abcContactDetailsCtrl',
                        windowClass: 'abc-modals',
                        resolve: {
                            data: function() {
                                return {
                                    contact: contact,
                                    edit: ( startEdit !== undefined ? startEdit : false),
                                    isNew: ( isNew !== undefined ? isNew : false)
                                };
                            }
                        }
                    });

                },

                // opens the mini modal for a new contacts name, creates it locally and then opens it for edit
                startCreateContact: function() {

                    // open a modal to get the name for it
                    var m = $uibModal.open({
                        templateUrl: 'abcCreateContact/abcCreateContact-tpl.html',
                        controller: 'abcCreateContactCtrl',
                        windowClass: 'abc-modals abc-create'
                    });

                    m.result.then(function (name) {

                        // create a dummy contact and then open the edit dialog with it
                        $timeout(function() {

                            var contact = {
                                name: name,
                                id: 'new',
                                email: undefined,
                                telephone: undefined,
                                groups: []
                            };

                            service.showContact(contact, true, true);

                        }, 300);

                    });
                },

                // gets contacts - either all or by searching
                getContacts: function(searchWith) {

                    var defer = $q.defer();

                    // make the http call
                    $http({
                        method: 'GET',
                        url: rootUrl,
                        params: ( searchWith !== undefined ? {name: searchWith} : undefined)

                    }).then(

                        function(response) {
                            defer.resolve(response.data);
                        },

                        function(error) {
                            defer.reject(error);
                        }
                    );

                    //$timeout(function() {
                    //
                    //    defer.resolve([{
                    //        name: 'John Smith',
                    //        telephone: '07823 4567821',
                    //        id: 'con1',
                    //        email: 'john.smith@gmail.com',
                    //        groups: ['Friends', 'Work']
                    //    },{
                    //        name: 'Hannah Banana',
                    //        telephone: '04420 75462367',
                    //        id: 'con2',
                    //        email: 'hannahb@gmail.com',
                    //        groups: []
                    //    }]);
                    //
                    //}, 500);
                    return defer.promise;
                },

                // gets contacts within a specific group
                getContactsByGroup: function(group) {

                    var defer = $q.defer();

                    $timeout(function() {

                        defer.resolve([{
                            name: 'John Smith',
                            telephone: '07823 4567821',
                            id: 'con1',
                            email: 'john.smith@gmail.com',
                            groups: ['Friends']
                        }]);

                    }, 500);

                    return defer.promise;
                }
            };

            return service;
        }
    ]);
})();