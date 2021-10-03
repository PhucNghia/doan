(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ScreenplayHomeController',ScreenplayHomeController);

    ScreenplayHomeController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','User',
        'AlertService','$translate','variables','ErrorHandle', '$window','TableController','ComboBoxController','Screenplay'];
    function ScreenplayHomeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, User,
                                   AlertService,$translate, variables, ErrorHandle, $window,TableController,ComboBoxController,Screenplay) {
        var loadFunction = Screenplay.getScreenplay;
        $scope.ComboBox = []
        // khai báo column
        var columns = {
            'id':'Number',
            'created': 'DateTime',
            'createdBy': 'Text',
            'updated': 'DateTime',
            'updatedBy': 'Text',
            'active': 'Number',
            'name': 'Text',
            'brightness': 'Number',
            'saturation': 'Number',
            'tempColor': 'Number',
            'color': 'Text',
            'deviceTypeId': 'Number',
            'deviceTypeCode': 'Text',
            'deviceModelIds': 'Text',
            'deviceModelCodes': 'Text',
            'deviceModelNames': 'Text',
            'deviceTypeName': 'Text',
            'avatar': 'Text',
        };

        var tableConfig = {
            tableId: "screenplayId",               //table Id
            model: "screenplays",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_screenplay_pager",   //phan trang
            page_id: "screenplay_selectize_page", //phan trang
            page_number_id: "screenplay_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var deviceTypeComboBox = {
            id: 'deviceTypeCbb',
            url: '/api/device-types',
            originParams: "code==LD",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['screenplayId'],
            column: 'deviceTypeId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: "Tìm kiếm",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceTypeComboBox);

        var deviceModelComboBox = {
            id: 'deviceModelCbb',
            url: '/api/device-models',
            originParams: "code==CCT,code==RGBCCT,code==GRCCT,code==GRRGBCCT",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['screenplayId'],
            column: 'deviceModelIds',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: "Tìm kiếm",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceModelComboBox);
        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,Screenplay.deleteRecord);
        }
        $scope.search = function(){
            TableController.reloadPage(tableConfig.tableId);
        }
    }
})();