(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProductDetailController', ProductDetailController);

    ProductDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Product', '$window'];

    function ProductDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, Product, $window) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.product = {};
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
        }
        $scope.reload =function (){
            Product.getOne($stateParams.productId).then(function (data) {
                $scope.product = data;
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
