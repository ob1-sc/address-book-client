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

                    // post call to delete new contact
                    $http({
                        method: 'DELETE',
                        url: rootUrl + "/" + contact.id,
                    }).then(

                        function(created) {

                            // just resolve
                            defer.resolve();

                            if ( silent !== true ) {
                                // tell the user
                                growl.addSuccessMessage('Deleted contact ' + contact.name, {ttl: 2000});

                                // tell the app
                                $rootScope.$broadcast('contactDeleted', contact);
                            }
                        }
                    );

                    return defer.promise;
                },

                // creates a new contact - returns the REST result
                createContact: function(contact) {

                    var defer = $q.defer();

                    // post call to create new contact
                    $http({
                        method: 'POST',
                        url: rootUrl,
                        data: contact
                    }).then(

                        function(created) {
                            defer.resolve(created.data);

                            // tell the user
                            growl.addSuccessMessage('Created new contact ' + contact.name, {ttl: 2000});

                            // tell the app
                            $rootScope.$broadcast('contactCreated', created.data);
                        },

                        function(error) {
                            defer.reject(error);
                        }
                    );

                    return defer.promise;
                },

                // updates the details for a contact - accepts the updated object and returns the updated result from the rest call
                updateContact: function(contact) {

                    var defer = $q.defer();

                    // post call to update the contact
                    $http({
                        method: 'POST',
                        url: rootUrl + "/" + contact.id,
                        data: contact
                    }).then(

                        function(updated) {
                            defer.resolve(updated.data);

                            // tell the user
                            growl.addSuccessMessage('Updated details for ' + contact.name, {ttl: 2000});

                            // tell the app
                            $rootScope.$broadcast('contactUpdated', updated.data);
                        },

                        function(error) {
                            defer.reject(error);
                        }
                    );

                    return defer.promise;
                },

                // adds a contact to a group - returns the updated contact
                addToGroup: function(contact, group) {

                    var defer = $q.defer();

                    contact.groups.push(group);

                    // post call to update the contact groups
                    $http({
                        method: 'POST',
                        url: rootUrl + "/" + contact.id,
                        data: contact
                    }).then(

                        function(updated) {
                            defer.resolve(updated.data);

                            // tell the user
                            growl.addSuccessMessage('Added ' + contact.name + ' to ' + group + ' group', {ttl: 2000});

                            // tell the app
                            $rootScope.$broadcast('contactGroupChange', contact, updated.data);
                        },

                        function(error) {
                            defer.reject(error);
                        }
                    );

                    return defer.promise;
                },

                // removes a contact from a group - returns the updated contact
                removeFromGroup: function(contact, group) {

                    var defer = $q.defer();

                    // find the index
                    var index;
                    for ( var i=0; i<contact.groups.length; i++ ) {
                        if ( contact.groups[i] == group ) {
                            index = i;
                            break;
                        }
                    }

                    contact.groups.splice(index, 1);

                    // post call to update the contact groups
                    $http({
                        method: 'POST',
                        url: rootUrl + "/" + contact.id,
                        data: contact
                    }).then(

                        function(updated) {

                            defer.resolve(updated.data);

                            // tell the user
                            growl.addSuccessMessage('Removed ' + contact.name + ' from ' + group + ' group', {ttl: 2000});

                            // tell the app
                            $rootScope.$broadcast('contactGroupChange', updated.data, group);
                        },

                        function(error) {
                            defer.reject(error);
                        }
                    );

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

                    return defer.promise;
                },

                // gets contacts within a specific group
                getContactsByGroup: function(group) {

                    var defer = $q.defer();

                    // make the http call
                    $http({
                        method: 'GET',
                        url: rootUrl,
                        params: ( group !== undefined ? {group: group} : undefined)

                    }).then(

                        function(response) {
                            defer.resolve(response.data);
                        },

                        function(error) {
                            defer.reject(error);
                        }
                    );

                    return defer.promise;
                }
            };

            return service;
        }
    ]);
})();