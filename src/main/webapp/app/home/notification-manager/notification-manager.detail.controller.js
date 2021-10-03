(function () {
    'use strict';
    angular.module('erpApp')
        .controller('NotificationManagerDetailController', NotificationManagerDetailController);

    NotificationManagerDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'DeviceType', '$window','NotificationManager'];

    function NotificationManagerDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                        AlertService, $translate, TableController, ComboBoxController, AlertModalService, DeviceType, $window,NotificationManager) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.notification = {};
        $scope.browse = function () {
            UIkit.modal.confirm($translate.instant("Bạn chắc chắn muốn Duyệt thông báo này"), function () {
                    $scope.blockUI();
                NotificationManager.active($scope.notification.id).then(function () {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    AlertModalService.popup("Duyệt thành công");
                    $timeout(function () {
                        $state.go($state.current,{},{reload:true});
                    },2000);
                    $scope.btnDisable = false;
                    }).catch(function (err) {
                        ErrorHandle.handleOneError(err);
                        if ($scope.blockModal != null) $scope.blockModal.hide();
                    })
                }, {
                labels: {
                    'Ok': $translate.instant("global.tooltip.start"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
        $scope.reload =function (){
            NotificationManager.getOne($stateParams.notificationId).then(function (data) {
                $scope.notification = data;
            })
        }
        $scope.reload();


    }
})();
