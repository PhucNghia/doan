(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('notification-manager-module', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('application');
                        $translatePartialLoader.addPart('data-package');
                        return $translate.refresh();
                    }]
                }
            })
            .state('notificationManager', {
                parent: 'notification-manager-module',
                url: '/notification-manager',
                templateUrl: 'app/home/notification-manager/notification-manager.home.html',
                controller: 'NotificationHomeController',
                controllerAs: 'vm',
                params: {
                    notificationManagerId:null
                },
                data: {
                    pageTitle: 'admin.menu.notificationManager',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'Notification_Manager_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/notification-manager/notification-manager.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('notification-manager-create', {
                parent: 'notification-manager-module',
                url: '/notification-manager/create',
                templateUrl: 'app/home/notification-manager/notification-manager.create.html',
                controller: 'NotificationManagerCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.notificationManager',
                    parentLink: 'notificationManager',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Notification_Manager_Create'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/notification-manager/notification-manager.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('notification-manager-detail',{
                parent:'notification-manager-module',
                url:'/notificationManager/{notificationId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/notification-manager/notification-manager.detail.html',
                data: {
                    pageTitle: 'admin.menu.notificationManager',
                    parentLink: 'notificationManager',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Notification_Manager_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'NotificationManagerDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/notification-manager/notification-manager.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('notification-manager-edit',{
                url:'/notification-manager/{notificationId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/notification-manager/notification-manager.edit.html',
                parent:'notification-manager-module',
                data: {
                    pageTitle: 'admin.menu.notificationManager',
                    parentLink: 'notificationManager',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Notification_Manager_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'NotificationManagerEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/notification-manager/notification-manager.edit.controller.js'
                        ]);
                    }]
                }
            })
    }
})();