(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Order', Order);

    Order.$inject = ['$http','HOST_GW'];

    function Order ($http,HOST_GW) {
        var service = {
            create: create,
            getPage: getPage,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            searchFull: searchFull
        };

        return service;

        function create(ot) {
            return $http.post(HOST_GW + '/api/order',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/order/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/order/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/order/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/order/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/order/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/order/'+ id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/order/search-full?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
