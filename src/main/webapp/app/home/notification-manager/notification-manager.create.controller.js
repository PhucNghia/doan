(function () {
    'use strict';
    angular.module('erpApp')
        .controller('NotificationManagerCreateController', NotificationManagerCreateController);

    NotificationManagerCreateController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel', 'DeviceType', 'ErrorHandle', 'ComboBoxController','FileService', 'NotificationManager'];

    function NotificationManagerCreateController($rootScope, $scope, $state, $http, $timeout, $window,
                                        AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType, ErrorHandle, ComboBoxController,FileService,NotificationManager) {
        $scope.blockModal = null;
        $scope.ComboBox = {};
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.notification = {

        };

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
        $scope.submit = function(isClose){
            if($scope.btnDisable) return;
            var $form = $("#notification_form");
            $('#notification_form').parsley();
            if(!$scope.notification_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            $scope.blockUI();
            $scope.btnDisable = true;
            // upload Avatar first
            NotificationManager.create($scope.notification).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
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
        }
    }
})();