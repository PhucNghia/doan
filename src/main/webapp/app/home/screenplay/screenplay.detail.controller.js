(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ScreenplayDetailController', ScreenplayDetailController);

    ScreenplayDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'DeviceType', '$window','Screenplay'];

    function ScreenplayDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                        AlertService, $translate, TableController, ComboBoxController, AlertModalService, DeviceType, $window,Screenplay) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.screenplay = {};
        $scope.reload =function (){
            Screenplay.getOne($stateParams.screenplayId).then(function (data) {
                $scope.screenplay = data.data;
            })
        }

        $scope.reload();

    }
})();
