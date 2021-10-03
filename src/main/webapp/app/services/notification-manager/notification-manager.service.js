(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('NotificationManager', NotificationManager);

    NotificationManager.$inject = ['$http','HOST_GW'];

    function NotificationManager ($http,HOST_GW) {
        var service = {
            getFull: getFull,
            getOne: getOne,
            create: create,
            deleteRecord: deleteRecord,
            update: update,
            active: active
        };
        return service;
        function getFull(params) {
            return $http.get(HOST_GW + '/api/notification_manager/search-full?' + params).then(function(response) {
                return response;
            });
        }
        function getOne(id) {
            return $http.get(HOST_GW + '/api/notification_manager/' +id).then(function (response) {
                return response.data;
            });
        }
        function active(id) {
            return $http.get(HOST_GW + '/api/notification_manager/activate/?id=' +id).then(function (response) {
                return response.data;
            });
        }
        function create(ot) {
            return $http.post(HOST_GW + '/api/notification_manager',ot).then(function(response) {
                return response.data;
            });
        }
        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/notification_manager/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }
        function update(ot) {
            return $http.put(HOST_GW + '/api/notification_manager/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }
    }
})();
