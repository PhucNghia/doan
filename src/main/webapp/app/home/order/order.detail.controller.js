(function () {
    'use strict';
    angular.module('erpApp')
        .controller('OrderDetailController', OrderDetailController);

    OrderDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Order', '$window'];

    function OrderDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, Order, $window) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.order = {};
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
        }
        $scope.reload =function (){
            debugger
            Order.getOne($stateParams.orderId).then(function (data) {
                debugger
                $scope.order = data;
            })
        }

        $scope.reload();

        /*$scope.showRefresh = true;
        $scope.refresh = function(){
            $scope.blockUI();
            $scope.showRefresh = false;
            DeviceType.getOne($scope.deviceType.id).then(function (data) {
                $scope.deviceType = data;
            });
            $timeout(function () {
                $scope.showRefresh = true;
                if($scope.blockModal != null) $scope.blockModal.hide();
            },2000);
        }*/
    }
})();
