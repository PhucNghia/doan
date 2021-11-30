(function () {
    'use strict';
    angular.module('erpApp')
        .controller('CategoryCreateController', CategoryCreateController);

    CategoryCreateController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'Category','ErrorHandle', 'FileService'];

    function CategoryCreateController($rootScope, $scope, $state, $http,$timeout,$window,
                                  AlertService, $translate, TableController, Common, AlertModalService, Category,ErrorHandle, FileService) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.category = {};
        
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#category_form");
            $('#category_form').parsley();
            if(!$scope.category_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();

            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                    $scope.category.image = data.data.fileName;
                    createCategory(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                createCategory(isClose);
            }
        };

        function createCategory(isClose){
            Category.create($scope.category).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('category'): $state.go('category-detail',{categoryId: data.id});
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
                $scope.category.image = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        };

        // ======================================
        var $formValidate = $('#category_form');
        // $formValidate.parsley({
        //     'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        // }).on('form:validated',function() {
        //     $scope.$apply();
        // }).on('field:validated',function(parsleyField) {
        //     if($(parsleyField.$element).hasClass('md-input')) {
        //         $scope.$apply();
        //     }
        // });
    }
})();
