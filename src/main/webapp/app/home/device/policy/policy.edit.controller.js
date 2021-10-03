(function () {
    'use strict';
    angular.module('erpApp')
        .controller('PolicyEditController', PolicyEditController);

    PolicyEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window', 'ComboBoxController',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel', 'DeviceType',
        'ErrorHandle', 'Policy', 'Provider', 'Firmware', 'Area'];

    function PolicyEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window, ComboBoxController,
            AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType,
            ErrorHandle,Policy, Provider, Firmware, Area) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.ComboBox = {};
        $scope.policy = {};
        $scope.versioningLastest={};
        $scope.selectedCbb = {
        		firmwares:[],
        		fromFirmwareVersion:[],
        		exceptVersion:[],
        		deviceType:[],
        		deviceModel: [],
                area: []
        }
        var isFirstLoadDeviceModel = true;
        var isFirstLoadFirmware = true;

        var deviceTypeComboBox = {
            id: 'deviceTypeCbb',
            url: '/api/device-types',
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
        ComboBoxController.init($scope, deviceTypeComboBox);

        var deviceModelComboBox = {
            id: 'deviceModelCbb',
            url: '/api/device-models',
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
        ComboBoxController.init($scope, deviceModelComboBox);

        var areaComboBox = {
            id:'area',
            url: null,
            originParams:'type==0', // chỉ lấy địa điểm
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:null,
            ngModel:[],
            options:[],
            placeholder: "Chọn khu vực"
        };
        ComboBoxController.init($scope, areaComboBox);
        $scope.allAreas =[];

        $scope.changeArea = function () {
            let areaIds = $scope.policy.areaIds;
            if(areaIds != undefined && (areaIds.includes(1) || areaIds.includes("1"))) {
                $scope.policy.areaIds = [1];
                areaComboBox.options = [{id:1,name:"Tất cả"}];
                areaComboBox.url = null;
                ComboBoxController.init($scope, areaComboBox);
            } else {
                areaComboBox.options = $scope.allAreas;
                areaComboBox.url = '/api/areas';
                areaComboBox.originParams = 'type==0';
                ComboBoxController.init($scope, areaComboBox);
            }
        };

        /*var providerComboBox = {
            id: 'providerCbb',
            url: '/api/providers',
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
        ComboBoxController.init($scope, providerComboBox);*/
        
        var firmwareVersionComboBox = {
            id: 'firmwareVersionCbb',
            url: '/api/firmwares',
            originParams: null,
            valueField: 'id',
            labelField: 'firmwareVersion',
            searchField: 'firmwareVersion',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'created,desc'
        };
        ComboBoxController.init($scope, firmwareVersionComboBox);
        
        var fromVersionComboBox = {
                id: 'fromVersionCbb',
                url: '/api/firmwares',
                originParams: null,
                valueField: 'id',
                labelField: 'firmwareVersion',
                searchField: 'firmwareVersion',
                table: null,
                column: null,
                maxItems: null,
                ngModel: [],
                options: [],
                placeholder: null,
                orderBy: 'created,desc'
            };
        ComboBoxController.init($scope, fromVersionComboBox);
        
        var exceptVersionComboBox = {
                id: 'exceptVersionCbb',
                url: '/api/firmwares',
                originParams: null,
                valueField: 'id',
                labelField: 'firmwareVersion',
                searchField: 'firmwareVersion',
                table: null,
                column: null,
                maxItems: null,
                ngModel: [],
                options: [],
                placeholder: null,
                orderBy: 'created,desc'
            };
        var policy = {};
        ComboBoxController.init($scope, exceptVersionComboBox);
        Policy.getOne($stateParams.id).then(function (data) {
        	$scope.policy= data;
        	Object.assign(policy, data);
        	$scope.isLastestVersion = false;
        	if($scope.policy.exceptVersion != null) $scope.isFromVersion = false;
        	else $scope.isFromVersion = true;
        	$scope.deviceTypeIdOld = $scope.policy.deviceTypeId;
        	$scope.deviceModelIdOld = $scope.policy.deviceModelId;
            deviceTypeComboBox.options = [{id:$scope.policy.deviceTypeId,name:$scope.policy.deviceTypeName}];
            ComboBoxController.init($scope, deviceTypeComboBox);
            //providerComboBox.options = [{id:$scope.policy.providerId,name:$scope.policy.providerName}];
            //ComboBoxController.init($scope, providerComboBox);
            deviceModelComboBox.options = [{id:$scope.policy.deviceModelId,name:$scope.policy.deviceModelName}];
            deviceModelComboBox.originParams = 'deviceTypeId==' + $scope.policy.deviceTypeId + ';providerId==' + $scope.policy.providerId;
            ComboBoxController.init($scope, deviceModelComboBox);
            if($scope.policy.areas){
                $scope.policy.areaIds = [];
                for(var i = 0; i < $scope.policy.areas.length; i++) {
                    $scope.policy.areaIds.push($scope.policy.areas[i].id);
                }
            }
            Area.getAll().then(function (data) {
                for(let i=0; i<data.length; i++) {
                    if(data[i].id == 0 || data[i].type != 0) {
                        delete data[i];
                        break;
                    }
                }
                $scope.allAreas = data;
                areaComboBox.options = $scope.policy.areaIds.includes(1) ? [{id:1,name:"Tất cả"}] : data;
                ComboBoxController.init($scope, areaComboBox);
            });
        });
        
        // change device Type Combobox-> update Device Model Combobox
        $scope.updateDeviceModelCbb = function() {
        	if($scope.policy.deviceTypeId != $scope.deviceTypeIdOld && $scope.policy.deviceTypeId != null && $scope.policy.providerId != null){
        		console.log("deviceType: "+ $scope.policy.deviceTypeId+"; deviceTypeIdOld: "+$scope.deviceTypeIdOld)
    			deviceModelComboBox.options = [""];
            	$scope.policy.modelCode = "";
            	$scope.versioningLastest.firmwareVersion = null;
    			$scope.versioningLastest.id = null;
    			$scope.policy.versioning = null;
    			$scope.policy.fromVersion = null;
    			$scope.policy.exceptVersion = null;
    			$scope.listFirmwareLength = 0;
                deviceModelComboBox.resetScroll = true;
                deviceModelComboBox.originParams = 'deviceTypeId==' + $scope.policy.deviceTypeId + ';providerId==' + $scope.policy.providerId;
                ComboBoxController.init($scope, deviceModelComboBox);
                $scope.deviceTypeIdOld = $scope.policy.deviceTypeId;
    		}
        	
        };
        
        // change device model Combobox -> update:
        // 1. Model code
        // 2. firmware combobox
        $scope.changeDeviceModelCbb = function() {
        	var deviceModelId = $scope.policy.deviceModelId;
        	if(deviceModelId != null && deviceModelId != undefined && (isFirstLoadFirmware || deviceModelId != $scope.deviceModelIdOld)){
        		DeviceModel.getOne(deviceModelId).then(function (deviceModel) {
	            	$scope.policy.modelCode = deviceModel.code;
	                $scope.policy.deviceModelName = deviceModel.name;
	            });
            	var params = "query=deviceModelId=="+deviceModelId+"&page=0&size=2&sort=created,desc"
            	Firmware.getPage(params).then(function (data) {
            		if(data.data != null && data.data.length > 0){
            			$scope.listFirmwareLength = data.data.length;
            			$scope.versioningLastest.firmwareVersion = data.data[0].firmwareVersion;
            			$scope.versioningLastest.id = data.data[0].id;
            			if(!isFirstLoadFirmware){
            				$scope.policy.versioning = $scope.versioningLastest.id;
            				$scope.policy.versioningName = $scope.versioningLastest.firmwareVersion;
            				firmwareVersionComboBox.options = [{id:$scope.policy.versioning,firmwareVersion:$scope.policy.versioningName}];
                    		exceptVersionComboBox.options = [""];
            			}else{
            				firmwareVersionComboBox.options = [{id:$scope.policy.versioning,firmwareVersion:$scope.policy.versioningName}];
        	                if($scope.policy.exceptVersion != null){
        	                	exceptVersionComboBox.options = [$scope.policy.exceptVersionLst];
        	                	var temp = $scope.policy.exceptVersion.slice(1,$scope.policy.exceptVersion.length -1);
        						$scope.policy.exceptVersions = temp.split(',');
        	                }else{
        	                	exceptVersionComboBox.options = [""];
        	                	$scope.policy.exceptVersions = [];
        	                }
            			}
            		}else{
            			$scope.versioningLastest.firmwareVersion = null;
            			$scope.versioningLastest.id = null;
            			$scope.listFirmwareLength = 0;
            			firmwareVersionComboBox.options = [""];
            		}
            		
            		firmwareVersionComboBox.resetScroll = true;
                	firmwareVersionComboBox.originParams = 'deviceModelId==' + deviceModelId;
                    ComboBoxController.init($scope, firmwareVersionComboBox);
                    
                    /*fromVersionComboBox.resetScroll = true;
                    if(isNotNullAndUndefined($scope.policy.versioning))
                    	fromVersionComboBox.originParams = 'deviceModelId==' + deviceModelId+";id!="+ $scope.policy.versioning;
                    else fromVersionComboBox.originParams = 'deviceModelId==' + deviceModelId;
                    ComboBoxController.init($scope, fromVersionComboBox);*/
                    
                    exceptVersionComboBox.resetScroll = true;
                 	exceptVersionComboBox.originParams = 'deviceModelId==' + deviceModelId;
                    ComboBoxController.init($scope, exceptVersionComboBox);
                });
                $scope.deviceModelIdOld = $scope.policy.deviceModelId;
        	}
        };
        
        $scope.chooseLastestVersionUpgrade = function(){
        	$scope.isLastestVersion = true;
        }
        $scope.chooseVersionUpgrade = function(){
        	$scope.isLastestVersion = false;
        }
        
        $scope.chooseFromCondition = function(){
        	$scope.isFromVersion = true;
        }
        
        $scope.chooseExceptVersionCondition = function(){
        	$scope.isFromVersion = false;
        }
        
        $scope.changeVersionging = function(){
        	$timeout(function () {
        		if(isNotNullAndUndefined($scope.policy.versioning) && $scope.selectedCbb.firmwares.length>0){
        			$scope.policy.versioningName = $scope.selectedCbb.firmwares[0].firmwareVersion;
	                fromVersionComboBox.originParams = 'deviceModelId==' + $scope.policy.deviceModelId+";id!="+ $scope.policy.versioning;
        		}else fromVersionComboBox.originParams = 'deviceModelId==' + $scope.policy.deviceModelId;
        		if(isFirstLoadFirmware && isNotNullAndUndefined($scope.policy.fromVersion)){
	        		var temp = $scope.policy.fromVersion.slice(1,$scope.policy.fromVersion.length -1);
					$scope.policy.fromVersions = temp.split(',');
	            	fromVersionComboBox.options = [$scope.policy.fromVersionLst];
        		} else{
        			fromVersionComboBox.options = [""];
        		}
        		fromVersionComboBox.resetScroll = true;	
        		ComboBoxController.init($scope, fromVersionComboBox);	
        		isFirstLoadFirmware = false;
            });
        }
        
        $scope.changeFromVersion = function(){
       	 $timeout(function () {
       		$scope.policy.fromVersionNames = [];
       		for (var i = 0; i < $scope.selectedCbb.firmwares.length; i++) {
       			$scope.policy.fromVersionNames.push($scope.selectedCbb.firmwares[i].firmwareVersion);
			}
         });
       }
        
       $scope.changeExceptVersion = function(){
    	   $timeout(function () {
    		   $scope.policy.exceptVersionNames = [];
    		   for (var i = 0; i < $scope.selectedCbb.firmwares.length; i++) {
          			$scope.policy.exceptVersionNames.push($scope.selectedCbb.firmwares[i].firmwareVersion);
   			   }
    	   });
       }

        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#policy_form");
            $('#policy_form').parsley();
            if(!$scope.policy_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            Policy.getOne($stateParams.id).then(function (data) {
            	if(data.active != 2){
            		AlertModalService.error("error.policy.cannotEdit");
                    $timeout(function () {
                        isClose ? $state.go('policy'): $state.go('policy-detail',{id: data.id});
                    },3000);
            	}else{
            		// $scope.btnDisable = true;
                    $scope.blockUI();
                    processSubmit(isClose);
            	}
            });
        };

        function processSubmit(isClose){
        	updateFirmware(isClose);
        }
        
        function updateFirmware(isClose) {
        	if($scope.isLastestVersion) {
        		if($scope.versioningLastest.id == null || $scope.versioningLastest.id == '') {
        			AlertService.error('Bạn chưa chọn phiên bản phần mềm nâng cấp');
                    return false;
        		}
        		$scope.policy.versioning = $scope.versioningLastest.id;
    			$scope.policy.versioningName = $scope.versioningLastest.firmwareVersion;
        	}
            if($scope.policy.fromVersions != null && $scope.policy.fromVersions.includes(String($scope.policy.versioning))) {
                AlertService.error('Nâng cấp phiên bản từ trùng với phiên bản nâng cấp lên');
                return false;
            }
        	if($scope.isFromVersion) {
        		if(isNotNullAndUndefined($scope.policy.fromVersions)){
        			$scope.policy.fromVersion = ','+$scope.policy.fromVersions.join()+",";
        			$scope.policy.fromVersionName = ','+$scope.policy.fromVersionNames.join()+",";
        		}else{
        			$scope.policy.fromVersion = null;
            		$scope.policy.fromVersionName = 'All';
        		}
        		$scope.policy.exceptVersion = null;
            	$scope.policy.exceptVersionName = null;
        	}else{
        		if(isNotNullAndUndefined($scope.policy.exceptVersions)){
        			$scope.policy.exceptVersion = ','+$scope.policy.exceptVersions.join()+",";
        			$scope.policy.exceptVersionName = ','+$scope.policy.exceptVersionNames.join()+",";
        		}else{
        			$scope.policy.exceptVersion = null;
                	$scope.policy.exceptVersionName = null;
        		}
        		$scope.policy.fromVersion = null;
            	$scope.policy.fromVersionName = 'All';
        	}
        	console.log($scope.policy);
            $scope.policy.areas = $scope.selectedCbb.area;
            Policy.update($scope.policy).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('policy'): $state.go('policy-detail',{id: data.id});
                },1100);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }
        
        function isNotNullAndUndefined(v){
        	if(v != null && v!='' && v!= undefined) return true;
        	else return false;
        }

        // ======================================
        var $formValidate = $('#policy_form');
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
})();
