(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Screenplay', Screenplay);

    Screenplay.$inject = ['$http','HOST_GW'];

    function Screenplay ($http,HOST_GW) {
        var service = {
            getScreenplay: getScreenplay,
            getOne: getOne,
            create: create,
            deleteRecord: deleteRecord,
            update: update
        };
        return service;
        function getScreenplay(params) {
            return $http.get(HOST_GW + '/api/scenes/search-full?' + params).then(function(response) {
                return response.data.data;
            });
        }
        function getOne(id) {
            return $http.get(HOST_GW + '/api/scenes/' +id).then(function (response) {
                return response.data;
            });
        }
        function create(ot) {
            return $http.post(HOST_GW + '/api/scenes',ot).then(function(response) {
                return response.data;
            });
        }
        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/scenes/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }
        function update(ot) {
            return $http.put(HOST_GW + '/api/scenes/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }
    }
})();
