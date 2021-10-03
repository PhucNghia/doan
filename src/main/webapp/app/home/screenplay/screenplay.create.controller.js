(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ScreenplayCreateController', ScreenplayCreateController);

    ScreenplayCreateController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel', 'DeviceType', 'ErrorHandle', 'ComboBoxController','FileService', 'Screenplay'];

    function ScreenplayCreateController($rootScope, $scope, $state, $http, $timeout, $window,
                                         AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType, ErrorHandle, ComboBoxController,FileService,Screenplay) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.ComboBox = {};
        $scope.selectedCbb ={
            deviceType:[],
            deviceModel:[]
        }
        $scope.screenplay = {
            deviceTypeId: null,
            deviceModelIds: []
        };
        var deviceTypeComboBox = {
            id: 'deviceTypeCbb',
            url: '/api/device-types',
            originParams: "code==LD",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceTypeComboBox);

        var deviceModelComboBox = {
            id: 'deviceModelCbb',
            url: '/api/device-models',
            originParams: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceModelComboBox);

        $scope.changeDeviceTypeCbb = function() {
            var deviceModelId = $scope.screenplay.deviceTypeId;
            // var providerId = $scope.screenplay.providerId;
            if(deviceModelId !=null ){
                $timeout(function () {
                    $scope.screenplay.deviceTypeCode = $scope.selectedCbb.deviceType[0].code;
                    $scope.screenplay.deviceTypeName = $scope.selectedCbb.deviceType[0].name;
                    deviceModelComboBox.options = [""];
                    deviceModelComboBox.resetScroll = true;
                    deviceModelComboBox.originParams = 'deviceTypeId==' + deviceModelId;
                    ComboBoxController.init($scope, deviceModelComboBox);
                });

            }
            // var deviceModelId = $scope.screenplay.deviceTypeId;
            // var providerId = $scope.screenplay.providerId;
            // if(deviceModelId != null && providerId != null) {
            //     deviceModelComboBox.options = [""];
            //     deviceModelComboBox.resetScroll = true;
            //     deviceModelComboBox.originParams = 'deviceTypeId==' + deviceModelId + ';providerId==' + providerId;
            //     ComboBoxController.init($scope, deviceModelComboBox);
            // }
        };
        $scope.submit = function(isClose){
            if($scope.btnDisable) return;
            var $form = $("#screenplay_form");
            $('#screenplay_form').parsley();
            if(!$scope.screenplay_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            if($scope.screenplay.tempColor==null && $scope.screenplay.saturation==null && $scope.screenplay.color==null && $scope.screenplay.brightness==null){
                AlertService.error("error.scenes.inputScenes");
                return;
            }
            $scope.blockUI();
            $scope.btnDisable = true;
            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                    $scope.screenplay.avatar = data.data.fileName;
                    createScreenplay(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                createScreenplay(isClose);
            }

        }
        function createScreenplay(isClose){
            Screenplay.create($scope.screenplay).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('screenplays'): $state.go('screenplay-detail', {screenplayId: data.data.id});
                },1100);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }
        $scope.deleteAvatar = function () {
            UIkit.modal.confirm($translate.instant("global.messages.deleteAvatar"), function () {
                // xóa image dã chọn trong input
                $('#user-input-form-file').val("");
                $scope.screenplay.avatar = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
    }
})();