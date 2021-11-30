

(function () {
    'use strict';
    angular.module('erpApp').controller('ProductController', ProductController);

    ProductController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'Product', 'ErrorHandle', '$window'];

    function ProductController($rootScope, $scope, $state, $http,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                   Product, ErrorHandle, $window) {

    	// khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'name':'Text',
            'code':'Text',
            'description':'Text',
            'created':'DateTime',
            'categoryId': 'MultiNumber',
            'stockId': 'MultiNumber'
        };
        $scope.ComboBox = {};
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "products",               //table Id
            model: "products",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Product.searchFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_product_pager",   //phan trang
            page_id: "product_selectize_page", //phan trang
            page_number_id: "product_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var stockComboBox = {
            id: 'stockCbb',
            url: '/api/stocks',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['products'],
            column: 'stockId',
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: 'Tên kho',
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
            table: $scope.TABLES['products'],
            column: 'categoryId',
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: 'Tên loại',
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, categoryComboBox);

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
        	var ids = TableController.getSelectedRowIDs(tableConfig.tableId);
        	if(ids.includes(1)) {
        		AlertService.error($translate.instant("error.deviceType.cannotDeleteCamera"));
        	}else TableController.defaultDelete(tableConfig.tableId,Product.deleteRecord);
        }

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                Product.deleteOne(id).then(function () {
                    AlertModalService.popup("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(err){
                    ErrorHandle.handleOneError(err);
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });

        }
    }
})();
