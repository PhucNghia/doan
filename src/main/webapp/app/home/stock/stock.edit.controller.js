(function () {
    'use strict';
    angular.module('erpApp')
        .controller('StockEditController', StockEditController);

    StockEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'Stock','ErrorHandle', 'FileService'];

    function StockEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window,
                                  AlertService, $translate, TableController, Common, AlertModalService, Stock,ErrorHandle, FileService) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.stock = {};
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
        };
        Stock.getOne($stateParams.stockId).then(function (data) {
            $scope.stock = data;
        });

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#stock_form");
            $('#stock_form').parsley();
            if(!$scope.stock_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();

            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                    $scope.stock.image = data.data.fileName;
                    updateStock(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                updateStock(isClose);
            }
        };

        function updateStock(isClose){
            Stock.update($scope.stock).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('stock'): $state.go('stock-detail',{stockId: data.id});
                },1100);

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
                $scope.stock.image = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        };

        // ===================================
        if(angular.element('#stock_form').length){
            var $formValidate = $('#stock_form');
            $formValidate.parsley({
                'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
            }).on('form:validated',function() {
                $scope.$apply();
            }).on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });
        }

        $("#inputDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.stock.inputDate = value.getTime()
                }
            }
        });

        $("#outputDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.stock.outputDate = value.getTime()
                }
            }
        });
    }
})();
