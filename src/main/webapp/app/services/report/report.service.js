(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Report', Report);

    Report.$inject = ['$http', 'HOST_GW'];

    function Report ($http, HOST_GW) {
        var service = {
            getReportDevice: getReportDevice,
            getReportCustomer: getReportCustomer,
            getReportPeriodically: getReportPeriodically,
            exportDeviceExcel: exportDeviceExcel,
            exportDevicePdf: exportDevicePdf,
            exportCustomerExcel: exportCustomerExcel,
            exportCustomerPdf: exportCustomerPdf,
            exportPeriodicallyPdf: exportPeriodicallyPdf,
            exportPeriodicallyExcel: exportPeriodicallyPdfExcel
        };

        return service;


        function getReportCustomer(searchInfo) {
            return $http.post(HOST_GW + '/api/reports/customer', searchInfo).then(function (response) {
                return response.data;
            });
        }

        function getReportDevice(searchInfo) {
            return $http.post(HOST_GW + '/api/reports/device', searchInfo).then(function (response) {
                return response.data;
            });
        }

        function exportDeviceExcel(dataReport) {
            return $http.post(HOST_GW + '/api/reports/device/export-excel', dataReport).then(function (response) {
                return response.data;
            });
        }

        function exportDevicePdf(dataReport) {
            return $http.post(HOST_GW + '/api/reports/device/export-pdf', dataReport).then(function (response) {
                return response.data;
            });
        }

        function exportCustomerExcel(dataReport) {
            return $http.post(HOST_GW + '/api/reports/customer/export-excel', dataReport).then(function (response) {
                return response.data;
            });
        }

        function exportCustomerPdf(dataReport) {
            return $http.post(HOST_GW + '/api/reports/customer/export-pdf', dataReport).then(function (response) {
                return response.data;
            });
        }
        function exportPeriodicallyPdf(dataReport) {
            return $http.post(HOST_GW + '/api/reports/devicePeriodically/export-pdf', dataReport).then(function (response) {
                return response.data;
            });
        }
        function exportPeriodicallyPdfExcel(dataReport) {
            return $http.post(HOST_GW + '/api/reports/devicePeriodically/export-excel', dataReport).then(function (response) {
                return response.data;
            });
        }
        function getReportPeriodically(searchInfo) {
            return $http.post(HOST_GW + '/api/reports/report', searchInfo).then(function (response) {
                return response.data;
            });
        }
    }
})();
