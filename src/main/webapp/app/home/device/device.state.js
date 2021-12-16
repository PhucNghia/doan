(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('device-module', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('device');
                        return $translate.refresh();
                    }]
                }
            })
            .state('stock',{
                parent: 'device-module',
                url: '/stock',
                templateUrl: 'app/home/stock/stock.html',
                controller: 'StockController',
                controllerAs: 'vm',
                params: {
                    deviceTypeId:null
                },
                data: {
                    pageTitle: 'Kho',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/stock/stock.controller.js'
                        ]);
                    }]
                }
            })
            .state('stock-detail',{
                parent:'device-module',
                url:'/stock/{stockId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/stock/stock.detail.html',
                data: {
                    pageTitle: 'Kho',
                    parentLink: 'stock',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Type_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'StockDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/stock/stock.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('stock-create',{
                parent:'device-module',
                url:'/stock/create',
                templateUrl:'app/home/stock/stock.create.html',
                data: {
                    pageTitle: 'Kho',
                    parentLink: 'stock',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'StockCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/stock/stock.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('stock-edit',{
                url:'/stock/{stockId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/stock/stock.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'Kho',
                    parentLink: 'stock',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'StockEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/stock/stock.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('category',{
                parent: 'device-module',
                url: '/category',
                templateUrl: 'app/home/category/category.html',
                controller: 'CategoryController',
                controllerAs: 'vm',
                params: {
                    categoryId:null
                },
                data: {
                    pageTitle: 'Loại',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/category/category.controller.js'
                        ]);
                    }]
                }
            })
            .state('category-detail',{
                parent:'device-module',
                url:'/category/{categoryId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/category/category.detail.html',
                data: {
                    pageTitle: 'Loại',
                    parentLink: 'category',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Type_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'CategoryDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/category/category.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('category-create',{
                parent:'device-module',
                url:'/category/create',
                templateUrl:'app/home/category/category.create.html',
                data: {
                    pageTitle: 'Loại',
                    parentLink: 'category',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'CategoryCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/category/category.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('category-edit',{
                url:'/category/{categoryId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/category/category.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'Loại',
                    parentLink: 'category',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'CategoryEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/category/category.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('product',{
                parent: 'device-module',
                url: '/product',
                templateUrl: 'app/home/product/product.html',
                controller: 'ProductController',
                controllerAs: 'vm',
                params: {
                    categoryId:null
                },
                data: {
                    pageTitle: 'Loại',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/product/product.controller.js'
                        ]);
                    }]
                }
            })
            .state('product-detail',{
                parent:'device-module',
                url:'/product/{productId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/product/product.detail.html',
                data: {
                    pageTitle: 'Loại',
                    parentLink: 'category',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Type_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'ProductDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/product/product.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('product-create',{
                parent:'device-module',
                url:'/product/create',
                templateUrl:'app/home/product/product.create.html',
                data: {
                    pageTitle: 'Loại',
                    parentLink: 'category',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'ProductCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/product/product.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('product-edit',{
                url:'/product/{productId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/product/product.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'Loại',
                    parentLink: 'category',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'ProductEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/product/product.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('order',{
                parent: 'device-module',
                url: '/order',
                templateUrl: 'app/home/order/order.html',
                controller: 'OrderController',
                controllerAs: 'vm',
                params: {
                    orderId:null
                },
                data: {
                    pageTitle: 'Hóa đơn',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/order/order.controller.js'
                        ]);
                    }]
                }
            })
            .state('order-detail',{
                parent:'device-module',
                url:'/order/{orderId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/order/order.detail.html',
                data: {
                    pageTitle: 'Hóa đơn',
                    parentLink: 'order',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Type_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'OrderDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/order/order.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('order-create',{
                parent:'device-module',
                url:'/order/create',
                templateUrl:'app/home/order/order.create.html',
                data: {
                    pageTitle: 'Hóa đơn',
                    parentLink: 'order',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'OrderCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/order/order.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('order-edit',{
                url:'/order/{orderId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/order/order.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'Hóa đơn',
                    parentLink: 'order',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'OrderEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/order/order.edit.controller.js'
                        ]);
                    }]
                }
            })
    }
})();