(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ScreenplayEditController', ScreenplayEditController);

    ScreenplayEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceType','ErrorHandle', 'FileService','Screenplay','ComboBoxController'];

    function ScreenplayEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window,
                                      AlertService, $translate, TableController, Common, AlertModalService, DeviceType,ErrorHandle, FileService, Screenplay,ComboBoxController) {
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
            deviceModels:[]
        };
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
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
        ComboBoxController.init($scope, deviceTypeComboBox)

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

        Screenplay.getOne($stateParams.screenplayId).then(function (data) {
            $scope.screenplay = data.data;

            var deviceType = {id: data.data.deviceTypeId, name: data.data.deviceTypeName, code: data.data.deviceTypeCode};
            deviceModelComboBox.options= [];
            if($scope.screenplay.deviceModels){
                for(var i=0; i<$scope.screenplay.deviceModels.length; i++ ){
                    var deviceModel = {id: $scope.screenplay.deviceModels[i].id, name: $scope.screenplay.deviceModels[i].name, code: $scope.screenplay.deviceModels[i].code};
                    deviceModelComboBox.options.push(deviceModel);
                }
            }
            deviceTypeComboBox.options = [deviceType];
            ComboBoxController.init($scope, deviceTypeComboBox);
            ComboBoxController.init($scope, deviceModelComboBox);
        });

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#screenplay_form");
            $('#screenplay_form').parsley();
            if(!$scope.screenplay_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if($scope.screenplay.tempColor==null && $scope.screenplay.saturation==null && ($scope.screenplay.color==null || $scope.screenplay.color == "") && $scope.screenplay.brightness==null){
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
                    updateScreenplay(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                updateScreenplay(isClose);
            }

        };
        function updateScreenplay(isClose){

            Screenplay.update($scope.screenplay).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
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

        $scope.updateDeviceTypeCbb = function() {
            var deviceTypeId = $scope.screenplay.deviceTypeId;
            if(deviceTypeId !=null){
                $timeout(function () {
                    $scope.screenplay.deviceTypeCode = $scope.selectedCbb.deviceType[0].code;
                    $scope.screenplay.deviceTypeName = $scope.selectedCbb.deviceType[0].name;
                    deviceModelComboBox.options = [""];
                    deviceModelComboBox.resetScroll = true;
                    deviceModelComboBox.originParams = 'deviceTypeId==' + deviceTypeId;
                });
            }
        };
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
        };
    }
})();
