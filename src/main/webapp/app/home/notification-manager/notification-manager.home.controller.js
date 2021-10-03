(function(){
    'use strict';
    angular.module('erpApp')
        .controller('NotificationHomeController',NotificationHomeController);

    NotificationHomeController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','User',
        'AlertService','$translate','variables','ErrorHandle', '$window','TableController','ComboBoxController','NotificationManager'];
    function NotificationHomeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, User,
                                      AlertService,$translate, variables, ErrorHandle, $window,TableController,ComboBoxController,NotificationManager) {
        var loadFunction = NotificationManager.getFull;
        // khai báo column
        var columns = {
            'id':'Number',
            'name': 'Text',
            'content': 'Text',
            'reason': 'Text',
            'created': 'DateTime',
            'createdBy': 'Text',
            'updated': 'DateTime',
            'updatedBy': 'Text',
            'active': 'Number',
            'type': 'Number',
            'typeContent': 'Text'
        };

        var tableConfig = {
            tableId: "notificationManagerId",               //table Id
            model: "notificationManager",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_notification_pager",   //phan trang
            page_id: "notification_selectize_page", //phan trang
            page_number_id: "notification_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };
        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        $scope.notification_type_config= {
            plugins: {
                'remove_button': {
                    label: ''
                }
            },
            placeholder : 'Tìm kiếm...',
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
        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,NotificationManager.deleteRecord);
        }
        $scope.search = function(){
            $scope.TABLES['notificationManagerId'].customParams = ""
            if($scope.notification.type != null){
                $scope.TABLES['notificationManagerId'].customParams += "type == "+ $scope.notification.type;
            }
            TableController.reloadPage(tableConfig.tableId);
        }
    }
})();