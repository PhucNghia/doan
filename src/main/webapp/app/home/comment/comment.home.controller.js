(function(){
    'use strict';
    angular.module('erpApp')
        .controller('CommentHomeController',CommentHomeController);

    CommentHomeController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','User',
        'AlertService','$translate','variables','ErrorHandle', '$window','TableController','ComboBoxController','Comment'];
    function CommentHomeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, User,
                                    AlertService,$translate, variables, ErrorHandle, $window,TableController,ComboBoxController,Comment) {
        var loadFunction = Comment.getComment;
        $scope.ComboBox = []
        // khai báo column
        var columns = {
            'id':'Number',
            'userId':'Number',
            'areaId':'MultiNumber',
            'userCode': 'Text',
            'phone': 'Text',
            'email': 'Text',
            'areaName': 'Text',
            'commentContent': 'Text',
            'imageUrl': 'Text',
            'created': 'DateTime',
            'createdBy': 'Text',
            'updated': 'DateTime',
            'updatedBy': 'Text',
            'active': 'Number'
        };

        var tableConfig = {
            tableId: "commentId",               //table Id
            model: "comments",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_comment_pager",   //phan trang
            page_id: "comment_selectize_page", //phan trang
            page_number_id: "comment_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var areaCbx = {
            id: 'area',
            url: '/api/areas',
            originParams: "id>1;type==0",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['commentId'],
            column: 'areaId',
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "Tìm kiếm",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbx);
        $scope.refresh = function(){
            $state.go($state.current,{},{reload:true})
        }
    }
})();