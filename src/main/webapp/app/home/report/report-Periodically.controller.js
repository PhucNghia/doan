(function () {
    'use strict';
    angular.module('erpApp').controller('ReportPeriodicallyController', ReportPeriodicallyController);

    ReportPeriodicallyController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', 'ErrorHandle', 'HOST_GW',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Report', 'DeviceImport','$filter'];

    function ReportPeriodicallyController($rootScope, $scope, $state, $http, $timeout, ErrorHandle, HOST_GW,
                                     AlertService, $translate, TableController, ComboBoxController, AlertModalService, Report, DeviceImport,$filter) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        var currentUser = $rootScope.currentUser

        function genDateTime(time) {
            var date = $filter('date')(time, 'dd/MM/yyyy');
            return date
        }

        var today = new Date();

        $scope.todayTime = genDateTime(today.getTime());

        $scope.searchInfo ={
            deviceTypeIds: [],
            hasActive: 2,
            modelCodes: null,
            areaCodes: null,
            importStartDate: null,
            importEndDate: null,
            activeStartDate: null,
            activeEndDate: null,
            contractName: null
        }

        var deviceTypeCbb = {
            id: 'deviceType',
            url: '/api/device-types',
            originParams: "",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "nhập loại thiết bị...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceTypeCbb);

        var deviceModelCbb = {
            id: 'deviceModel',
            url: '/api/device-models',
            originParams: "",
            valueField: 'code',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "nhập dòng thiết bị...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceModelCbb);

        var areaCodeList = "";
        var areaCodes = [];
        if(!currentUser.areaIds.includes(1)) {
            currentUser.areas.forEach(function (area) {
                areaCodes.push(area.areaCodes);
            })
            if(areaCodes.length > 0) {
                areaCodeList = areaCodes.join(',');
            }
        }
        var areaCbb = {
            id: 'area',
            url: '/api/areas',
            originParams: "type==0",
            valueField: 'areaCode',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: areaCodes,
            placeholder: "nhập khu vực...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbb);

        $("#activeStartDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.activeStartDate = value.getTime()
                } else {
                    $scope.searchInfo.activeStartDate = null;
                }
            }
        });
        $("#activeEndDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.activeEndDate = value.getTime()
                } else {
                    $scope.searchInfo.activeEndDate = null;
                }
            }
        });

        $("#importStartDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.importStartDate = value.getTime()
                } else {
                    $scope.searchInfo.importStartDate = null;
                }
            }
        });


        $("#importEndDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.importEndDate = value.getTime()
                } else {
                    $scope.searchInfo.importEndDate = null;
                }
            }
        });
        //Default là ngày hiện tại
        var importEndDatePicker = $("#importEndDatePicker").data("kendoDatePicker");
        importEndDatePicker.value($scope.todayTime);
        importEndDatePicker.trigger("change");

        // Default là ngày hiện tại
        var activeEndDatePicker = $("#activeEndDatePicker").data("kendoDatePicker");
        activeEndDatePicker.value($scope.todayTime);
        activeEndDatePicker.trigger("change");

        // Default là ngày cách ngày kích hoạt thiết bị đến 1 tháng
        today.setMonth(today.getMonth()-1)
        today.toLocaleString();
        $scope.todayTime = genDateTime(today.getTime());
        var activeStartDatePicker = $("#activeStartDatePicker").data("kendoDatePicker");
        activeStartDatePicker.value($scope.todayTime);
        activeStartDatePicker.trigger("change");

        let validate = function (searchInfo) {
            let isValid = true;
            if(searchInfo.activeStartDate != null && searchInfo.activeEndDate != null && searchInfo.activeEndDate < searchInfo.activeStartDate) {
                isValid = false;
                $("#activeEndDatePicker").parent().css("border", "1px solid red");
            } else {
                $("#activeEndDatePicker").parent().css("border", "1px solid #e6e6e6");
            }

            if(searchInfo.importStartDate != null && searchInfo.importEndDate != null && searchInfo.importEndDate < searchInfo.importStartDate) {
                isValid = false;
                $("#importEndDatePicker").parent().css("border", "1px solid red");
            } else {
                $("#importEndDatePicker").parent().css("border", "1px solid #e6e6e6");
            }
            return isValid;
        }
        $scope.periodicallyReportInfo = {
            periodicallyData: []
        }

        $scope.isSearching = false;
        $scope.processSearch = function() {
            if(!validate($scope.searchInfo)) {
                AlertService.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
                return;
            }
            $scope.isSearching = true;
            $scope.blockUI();

            Report.getReportPeriodically($scope.searchInfo).then(function (data) {
                $scope.periodicallyReportInfo.periodicallyData = data;
                if ($scope.blockModal != null) {$scope.blockModal.hide();}
                $scope.isSearching = false;
            }).catch(function (data) {
                ErrorHandle.handleOneError(data);
                if ($scope.blockModal != null){$scope.blockModal.hide();}
            });
        }
        //rowspan khu vuc
        $scope.countRowspan = function (periodicallyReport) {
            var rowspan = 0;
            periodicallyReport.contractData.forEach(function (deviceType) {
                rowspan += deviceType.totalDeviceType.length + 1;
                deviceType.totalDeviceType.forEach(function (totalDataDevice){
                    rowspan += totalDataDevice.totalData.length + 1;
                })
            })
            rowspan = rowspan + periodicallyReport.contractData.length;
            return rowspan == 0 ? 1 : rowspan;
        }
        //rowspan hợp đồng
        $scope.countRowspans = function (deviceType){
            var rowspan1 =0;
            deviceType.totalDeviceType.forEach(function (totalDataDevice){
                rowspan1 += totalDataDevice.totalData.length+1;
            })
            rowspan1 = rowspan1 + deviceType.totalDeviceType.length;
            return rowspan1 == 0 ? 1 : rowspan1;
        }

        $scope.exportExcel = function () {
            $scope.blockUI();
            Report.exportPeriodicallyExcel($scope.periodicallyReportInfo).then(function (res) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                $scope.downloadUrl = HOST_GW + "/api/files/export?filePath=" + res.url;
                $timeout(function () {
                    angular.element("#exportReport").trigger("click");
                });
            }).catch(function (error) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                AlertService.error($translate.instant(error.data.errorKey));
            });
        }

        $scope.exportPdf = function () {
            $scope.blockUI();
            Report.exportPeriodicallyPdf($scope.periodicallyReportInfo).then(function (res) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                $scope.downloadUrl = HOST_GW + "/api/files/export?filePath=" + res.url;
                $timeout(function () {
                    angular.element("#exportReport").trigger("click");
                });
            }).catch(function (error) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                AlertService.error($translate.instant(error.data.errorKey));
            });
        }
        $(document).keypress(
            function(event){
                if (event.which == '13') {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element("#searchBtn").trigger("click");
                    });
                }
            });
    }
})();