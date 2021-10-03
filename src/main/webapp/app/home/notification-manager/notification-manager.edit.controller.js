(function () {
    'use strict';
    angular.module('erpApp')
        .controller('NotificationManagerEditController', NotificationManagerEditController);

    NotificationManagerEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceType','ErrorHandle', 'FileService','NotificationManager','ComboBoxController'];

    function NotificationManagerEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window,
                                      AlertService, $translate, TableController, Common, AlertModalService, DeviceType,ErrorHandle, FileService, NotificationManager,ComboBoxController) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.notification = {};
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
        };

        NotificationManager.getOne($stateParams.notificationId).then(function (data) {
            $scope.notification = data;
        });

        $scope.notification_type_config= {
            plugins: {
                'remove_button': {
                    label: ''
                }
            },
            maxItems: 1,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false
        };

        $scope.notification_type_options = [
            {id: 15, name: "Thông báo lịch bảo trì hệ thống"},
            {id: 16, name: "Thông báo phát hành phiên bản mới"},
            {id: 17, name: "Thông báo khác"}
        ];
        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#notification_form");
            $('#notification_form').parsley();
            if(!$scope.notification_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            $scope.blockUI();
            $scope.btnDisable = true;
            NotificationManager.update($scope.notification).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('notificationManager'): $state.go('notification-manager-detail', {notificationId: data.id});
                },1100);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        };
    }
})();
