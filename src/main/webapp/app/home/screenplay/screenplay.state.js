(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('screenplay-module', {
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
            .state('screenplays', {
                parent: 'screenplay-module',
                url: '/screenplays',
                templateUrl: 'app/home/screenplay/screenplay.home.html',
                controller: 'ScreenplayHomeController',
                controllerAs: 'vm',
                params: {
                    screenplayId:null
                },
                data: {
                    pageTitle: 'admin.menu.screenplay',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'Screenplay_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/screenplay/screenplay.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('screenplay-create', {
                parent: 'screenplay-module',
                url: '/screenplay/create',
                templateUrl: 'app/home/screenplay/screenplay.create.html',
                controller: 'ScreenplayCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.screenplay',
                    parentLink: 'screenplays',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Screenplay_Create'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/screenplay/screenplay.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('screenplay-edit',{
                url:'/screenplays/{screenplayId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/screenplay/screenplay.edit.html',
                parent:'screenplay-module',
                data: {
                    pageTitle: 'admin.menu.screenplay',
                    parentLink: 'screenplays',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Screenplay_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'ScreenplayEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/screenplay/screenplay.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('screenplay-detail',{
                parent:'screenplay-module',
                url:'/screenplays/{screenplayId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/screenplay/screenplay.detail.html',
                data: {
                    pageTitle: 'admin.menu.screenplay',
                    parentLink: 'screenplays',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Screenplay_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'ScreenplayDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/screenplay/screenplay.detail.controller.js'
                        ]);
                    }]
                }

            })
    }
})();