(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProductEditController', ProductEditController);

    ProductEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'Product','ErrorHandle', 'FileService', 'ComboBoxController'];

    function ProductEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window,
                                  AlertService, $translate, TableController, Common, AlertModalService, Product,ErrorHandle, FileService, ComboBoxController) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.product = {};
        $scope.ComboBox = {};
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
        };
        Product.getOne($stateParams.productId).then(function (data) {
            $scope.product = data;
            stockComboBox.options = [data.stock];
            categoryComboBox.options = [data.category];

            ComboBoxController.init($scope, stockComboBox);
            ComboBoxController.init($scope, categoryComboBox);
        });

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#product_form");
            $('#product_form').parsley();
            if(!$scope.product_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();

            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                    $scope.product.image = data.data.fileName;
                    updateProduct(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                updateProduct(isClose);
            }
        };

        function updateProduct(isClose){
            Product.update($scope.product).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('product'): $state.go('product-detail',{productId: data.id});
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
                $scope.product.image = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        };

        // ===================================
        if(angular.element('#product_form').length){
            var $formValidate = $('#product_form');
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

        var stockComboBox = {
            id: 'stockCbb',
            url: '/api/stocks',
            originParams: null,
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
        ComboBoxController.init($scope, stockComboBox);

        var categoryComboBox = {
            id: 'categoryCbb',
            url: '/api/category',
            originParams: null,
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
        ComboBoxController.init($scope, categoryComboBox);
    }
})();
