(function () {
    'use strict';
    angular.module('erpApp').controller('OrderController', OrderController);

    OrderController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'Order', 'ErrorHandle', '$window'];

    function OrderController($rootScope, $scope, $state, $http,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                   Order, ErrorHandle, $window) {

    	// khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'name':'Text',
            'quantity':'Number',
            'created':'DateTime',
        };
        $scope.ComboBox = {};
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "orders",               //table Id
            model: "orders",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Order.searchFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_order_pager",   //phan trang
            page_id: "order_selectize_page", //phan trang
            page_number_id: "order_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
        	var ids = TableController.getSelectedRowIDs(tableConfig.tableId);
        	if(ids.includes(1)) {
        		AlertService.error($translate.instant("error.deviceType.cannotDeleteCamera"));
        	}else TableController.defaultDelete(tableConfig.tableId,Order.deleteRecord);
        }

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                Order.deleteOne(id).then(function () {
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
