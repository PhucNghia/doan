(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Comment', Comment);

    Comment.$inject = ['$http','HOST_GW'];

    function Comment ($http,HOST_GW) {
        var service = {
            getComment: getComment
        };
        return service;
        function getComment(params) {
            return $http.get(HOST_GW + '/api/comments/search-full?' + params).then(function(response) {
                return response;
            });
        }
    }
})();
