(function(){
    'use strict';
    angular.module('erpApp')
        .controller('RoleDetailController',RoleDetailController);

    RoleDetailController.$inject = ['$rootScope','$scope','$state','$stateParams','Role', 'Privilege', 'AlertService','$translate','variables', '$timeout','ErrorHandle'];
    function RoleDetailController($rootScope,$scope, $state, $stateParams, Role, Privilege, AlertService,$translate, variables, $timeout, ErrorHandle) {
        var vm = this;

        $scope.blockModal;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        }

        var tmp_priv = [];
        $scope.role = {};

        $scope.addPrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var selected_nodes = left_tree.getSelectedNodes();
            for (var i = 0; i < selected_nodes.length; i++) {
                if (!selected_nodes[i].hasChildren()) {
                    // the selected node is action node
                    var parentNode = selected_nodes[i].getParent().key;
                    //console.log(selected_nodes[i].key)
                    var currentPNode = right_tree.getNodeByKey(parentNode);
                    var existNode = right_tree.getNodeByKey(selected_nodes[i].key);
                    if (existNode == null) {
                        var actionNode = {
                            "title": selected_nodes[i].title,
                            "parentId": currentPNode.key,
                            "key": selected_nodes[i].key,
                            "icon": false,
                            "folder": false
                        }
                        currentPNode.addChildren(actionNode);
                        currentPNode.setExpanded(true);
                        currentPNode.getParent().setExpanded(true);
                        currentPNode.sortChildren(function (a, b) {
                            a = a.key;
                            b = b.key;
                            return a > b ? 1 : a < b ? -1 : 0;
                        }, false);
                        tmp_priv.push("priv_" +
                            currentPNode.getParent().title + "_" +
                            currentPNode.title + "_" + actionNode.title);
                        selected_nodes[i].remove();
                    }
                }
            }

            left_tree.visit(function (node) {
                node.setSelected(false);
            });
        }

        $scope.addAllPrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var node_remove = [];
            left_tree.visit(function (node) {
                if (!node.hasChildren() && !node.isFolder()) {
                    var parentNode = node.getParent().key;
                    var currentPNode = right_tree.getNodeByKey(parentNode);
                    var existNode = right_tree.getNodeByKey(node.key);
                    if (existNode == null) {
                        var actionNode = {
                            "title": node.title,
                            "parentId": currentPNode.key,
                            "key": node.key,
                            "icon": false,
                            "folder": false
                        }
                        currentPNode.addChildren(actionNode);
                        currentPNode.setExpanded(true);
                        currentPNode.getParent().setExpanded(true);
                        currentPNode.sortChildren(function (a, b) {
                            a = a.key;
                            b = b.key;
                            return a > b ? 1 : a < b ? -1 : 0;
                        }, false);
                        tmp_priv.push("priv_" +
                            currentPNode.getParent().title + "_" +
                            currentPNode.title + "_" + actionNode.title);
                    }
                    node_remove.push(node.key)
                }
                node.setSelected(false);
            });
            for (var i = 0; i < node_remove.length; i++) {
                var existNode = left_tree.getNodeByKey(node_remove[i]);
                if (existNode != null) {
                    existNode.remove();
                }
            }
        }

        $scope.removePrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var selected_nodes = right_tree.getSelectedNodes();
            for (var i = 0; i < selected_nodes.length; i++) {
                if (!selected_nodes[i].hasChildren()) {
                    // the selected node is action node
                    var parentNode = selected_nodes[i].getParent().key;
                    //console.log(selected_nodes[i].key)
                    var currentPNode = left_tree.getNodeByKey(parentNode);
                    var existNode = left_tree.getNodeByKey(selected_nodes[i].key);
                    if (existNode == null) {
                        var actionNode = {
                            "title": selected_nodes[i].title,
                            "parentId": currentPNode.key,
                            "key": selected_nodes[i].key,
                            "icon": false,
                            "folder": false
                        }
                        currentPNode.addChildren(actionNode);
                        currentPNode.setExpanded(true);
                        currentPNode.getParent().setExpanded(true);
                        currentPNode.sortChildren(function (a, b) {
                            a = a.key;
                            b = b.key;
                            return a > b ? 1 : a < b ? -1 : 0;
                        }, false);
                        var privData = "priv_" +
                            currentPNode.getParent().title + "_" +
                            currentPNode.title + "_" + actionNode.title;
                        var index = tmp_priv.indexOf(privData);
                        tmp_priv.splice(index, 1);
                        selected_nodes[i].remove();
                    }
                }
            }

            right_tree.visit(function (node) {
                node.setSelected(false);
            });
        }

        $scope.removeAllPrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var node_remove = [];
            right_tree.visit(function (node) {
                if (!node.hasChildren() && !node.isFolder()) {
                    var parentNode = node.getParent().key;
                    var currentPNode = left_tree.getNodeByKey(parentNode);
                    var existNode = left_tree.getNodeByKey(node.key);
                    if (existNode == null) {
                        var actionNode = {
                            "title": node.title,
                            "parentId": currentPNode.key,
                            "key": node.key,
                            "icon": false,
                            "folder": false
                        }
                        currentPNode.addChildren(actionNode);
                        currentPNode.setExpanded(true);
                        currentPNode.getParent().setExpanded(true);
                        currentPNode.sortChildren(function (a, b) {
                            a = a.key;
                            b = b.key;
                            return a > b ? 1 : a < b ? -1 : 0;
                        }, false);
                        var privData = "priv_" +
                            currentPNode.getParent().title + "_" +
                            currentPNode.title + "_" + actionNode.title;
                        var index = tmp_priv.indexOf(privData);
                        tmp_priv.splice(index, 1);
                    }
                    node_remove.push(node.key)
                }
                node.setSelected(false);
            });
            for (var i = 0; i < node_remove.length; i++) {
                var existNode = right_tree.getNodeByKey(node_remove[i]);
                if (existNode != null) {
                    existNode.remove();
                }
            }
        }

        var parentNode;
        var childNode;
        var actionNode;
        $scope.parseData = function (treeModel, data, treeLeft) {
            parentNode = [];
            childNode = {};
            actionNode = {};
            for (var i = 0; i < data.length; i++) {
                if (data[i].categoryName.indexOf("priv") !== -1) {
                    var nodes = data[i].categoryName.split("_");
                    var nodeP1 = nodes[1];
                    var nodeP2 = nodes[2];
                    var nodeP3 = nodes[3];
                    if (parentNode.indexOf(nodeP1) == -1) {
                        parentNode.push(nodeP1);
                    }
                    if (!(nodeP1 in childNode)) {
                        childNode[nodeP1] = [];
                    }
                    if (childNode[nodeP1].indexOf(nodeP2) == -1) {
                        childNode[nodeP1].push(nodeP2);
                    }
                    if (!(nodeP2 in actionNode)) {
                        actionNode[nodeP2] = [];
                    }
                    if (actionNode[nodeP2].indexOf(nodeP3) == -1) {
                        actionNode[nodeP2].push(nodeP3);
                    }
                }
            }

            // Config parent node
            var tree_nodes = 1;
            for (var i = 0; i < parentNode.length; i++) {
                var parentN = {
                    "children": [],
                    "title": parentNode[i],
                    "key": i + 1,
                    "folder": true,
                    "expanded": true
                }
                treeModel.push(parentN);
                tree_nodes++;
            }

            // Config child node
            for (var i = 0; i < treeModel.length; i++) {
                var parentN = treeModel[i];
                var titleP = parentN["title"];
                if (titleP in childNode) {
                    for (var j = 0; j < childNode[titleP].length; j++) {
                        var childN = {
                            "children": [],
                            "title": childNode[titleP][j],
                            "parentId": parentN["key"],
                            "key": tree_nodes,
                            "folder": true
                        }
                        parentN["children"].push(childN);
                        tree_nodes++;
                    }
                }
            }

            // Config action node
            if (treeLeft) {
                for (var i = 0; i < treeModel.length; i++) {
                    var parentN = treeModel[i];
                    for (var j = 0; j < parentN.children.length; j++) {
                        var childN = parentN.children[j];
                        var titleC = childN["title"];
                        if (titleC in actionNode) {
                            for (var k = 0; k < actionNode[titleC].length; k++) {
                                var actionN = {
                                    "title": actionNode[titleC][k],
                                    "parentId": childN["key"],
                                    "key": tree_nodes,
                                    "icon": false,
                                    "folder": false
                                }
                                childN["children"].push(actionN);
                                tree_nodes++;
                            }
                        }
                    }
                }
            }
        }

        $scope.findNodeByName = function (tree, rootKey, parentName, actionName) {
            var rootNode = tree.getNodeByKey("" + rootKey);
            for(var i = 0; i < rootNode.getChildren().length; i++) {
                if(rootNode.getChildren()[i].title == parentName) {
                    var parentNode = rootNode.getChildren()[i];
                    for(var j = 0; j < parentNode.getChildren().length; j++) {
                        if (parentNode.getChildren()[j].title == actionName) {
                            var actionNode = parentNode.getChildren()[j];
                            actionNode.setSelected(true);
                            break;
                        }
                    }
                    break;
                }
            }
            $scope.addPrivilege();
            tree.visit(function (node) {
                node.removeClass("fancytree-partsel")
            });

        }

        $scope.addSelectedInitData = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            for(var i = 0; i < $scope.role.privileges.length; i++) {
                var priv = $scope.role.privileges[i].categoryName;
                if (priv.indexOf("priv") !== -1) {
                    var root = priv.split("_")[1];
                    var parent = priv.split("_")[2];
                    var child = priv.split("_")[3];
                    $scope.findNodeByName(left_tree, parentNode.indexOf(root) + 1, parent, child);
                }
            }

            $scope.renderRightNodes();

            left_tree.visit(function (node) {
                node.setSelected(false);
                if(node.isFolder() && !node.hasChildren()) {
                    $(node.li).hide();
                }
            });

            // hide root node
            left_tree.visit(function (node) {
                if(node.getParent() == left_tree.getRootNode()) {
                    var forceExpand = false;
                    if(!node.isExpanded()) {
                        forceExpand = true;
                        node.setExpanded(true);
                    }
                    if($(node.ul).children(':visible').length == 0) {
                        // action when all are hidden
                        $(node.li).hide();
                    }
                    if(forceExpand) {
                        node.setExpanded(false);
                        forceExpand = false;
                    }
                }
            });
        }

        $scope.renderRightNodes = function () {
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            right_tree.visit(function (node) {
                if(node.hasChildren()) {
                    // if node is root node
                    if(node.getParent() == right_tree.getRootNode()) {
                        var notEmpty = false;
                        for(var i = 0; i < node.getChildren().length; i++) {
                            if(node.getChildren()[i].hasChildren()){
                                notEmpty = true;
                                break;
                            }
                        }
                        if(!notEmpty)
                            $(node.li).hide();
                        else
                            $(node.li).show();
                    } else {
                        // if node is parent node
                        $(node.li).show();
                    }
                } else {
                    // if node is root node
                    if(node.getParent() == right_tree.getRootNode()) {
                        $(node.li).hide();
                    } else {
                        var isParentNode = false;
                        for(var i = 0; i < right_tree.getRootNode().getChildren().length; i++) {
                            if(right_tree.getRootNode().getChildren()[i] == node.getParent()){
                                isParentNode = true;
                                break;
                            }
                        }
                        // if node is parent node
                        if(isParentNode)
                            $(node.li).hide();
                        else
                            $(node.li).show();
                    }
                }
            });
        }

        $scope.deleteRole = function () {
            UIkit.modal.confirm($translate.instant($scope.actionConfirm.delete), function () {
                //$("#ts_pager_filter").trigger('update');
                Role.deleteOne($scope.role.id).then(function(data){
                    $state.go('roles');
                }).catch(function(data){
                    //AlertService.error('admin.messages.errorDeleteRole');
                    ErrorHandle.handleError(data)
                })
            }, {
                labels: {
                    'Ok': $translate.instant($scope.button.delete),
                    'Cancel': $translate.instant($scope.button.cancel)
                }
            });
        }

        $timeout(function () {
            if (angular.element('#tFilter').length) {
                Privilege.getAll().then(function (data) {
                    $scope.treeData = [];
                    $scope.treeData_selected = [];
                    $scope.parseData($scope.treeData, data, true);
                    $scope.parseData($scope.treeData_selected, data, false);

                    // TREE LEFT
                    // Filters
                    var $tFilter = $("#tFilter");
                    $tFilter.fancytree({
                        checkbox: false,
                        selectMode: 3,
                        extensions: ["filter"],
                        quicksearch: true,
                        source: $scope.treeData,
                        filter: {
                            autoApply: true,  // Re-apply last filter if lazy data is loaded
                            counter: true,  // Show a badge with number of matching child nodes near parent icons
                            fuzzy: true,  // Match single characters in order, e.g. 'fb' will match 'FooBar'
                            hideExpandedCounter: true,  // Hide counter badge, when parent is expanded
                            highlight: true,  // Highlight matches by wrapping inside <mark> tags
                            mode: "hide"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                        },
                        activate: function (event, data) {
                            // alert("activate " + data.node);
                        }
                    });
                    var tree = $tFilter.fancytree("getTree");

                    $("#filter_input").keydown(function(event) {
                        if (event.keyCode == 13) {
                            event.preventDefault();
                        }
                    });

                    $("#filter_input").keyup(function (e) {
                        var n,
                            opts = {
                                autoExpand: true,
                                leavesOnly: $("#leavesOnly").is(":checked")
                            },
                            match = $(this).val();

                        if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                            $("#tree_filter_reset").click();
                            return;
                        }

                        if ($("#tree_filter_regex").is(":checked")) {
                            // Pass function to perform match
                            n = tree.filterBranches(function (node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = tree.filterBranches(match, opts);
                        }
                        $("#tree_filter_reset").attr("disabled", false);

                    });

                    // reset filter
                    $scope.resetFilters = function ($event) {
                        $scope.tree.filterInput = '';
                        tree.clearFilter();
                    };

                    $("#filter_switches").find("input:checkbox").on('ifChanged', function (e) {
                        var id = $(this).attr("id"),
                            flag = $(this).is(":checked");

                        switch (id) {
                            case "autoExpand":
                            case "regex":
                            case "leavesOnly":
                                // Re-apply filter only
                                break;
                            case "hideMode":
                                tree.options.filter.mode = flag ? "hide" : "dimm";
                                break;
                            case "counter":
                            case "fuzzy":
                            case "hideExpandedCounter":
                            case "highlight":
                                tree.options.filter[id] = flag;
                                break;
                        }
                        tree.clearFilter();
                        $("#filter_input").keyup();
                    });

                    // activate filters
                    $scope.tree = {
                        counter: true,
                        hideExpandedCounter: true,
                        highlight: true
                    };

                    // TREE RIGHT
                    // Filters
                    var $tFilter_selected = $("#tFilter_selected");
                    $tFilter_selected.fancytree({
                        checkbox: false,
                        selectMode: 3,
                        extensions: ["filter"],
                        quicksearch: true,
                        source: $scope.treeData_selected,
                        filter: {
                            autoApply: true,  // Re-apply last filter if lazy data is loaded
                            counter: true,  // Show a badge with number of matching child nodes near parent icons
                            fuzzy: true,  // Match single characters in order, e.g. 'fb' will match 'FooBar'
                            hideExpandedCounter: true,  // Hide counter badge, when parent is expanded
                            highlight: true,  // Highlight matches by wrapping inside <mark> tags
                            mode: "hide"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                        },
                        activate: function (event, data) {
                            // alert("activate " + data.node);
                        }
                    });
                    var tree_selected = $tFilter_selected.fancytree("getTree");

                    $("#filter_input_selected").keydown(function(event) {
                        if (event.keyCode == 13) {
                            event.preventDefault();
                        }
                    });

                    $("#filter_input_selected").keyup(function (e) {
                        var n,
                            opts = {
                                autoExpand: true,
                                leavesOnly: $("#leavesOnly").is(":checked")
                            },
                            match = $(this).val();

                        if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                            $("#tree_selected_filter_reset").click();
                            return;
                        }

                        if ($("#tree_selected_filter_regex").is(":checked")) {
                            // Pass function to perform match
                            n = tree_selected.filterBranches(function (node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = tree_selected.filterBranches(match, opts);
                        }
                        $("#tree_selected_filter_reset").attr("disabled", false);

                    });

                    // reset filter
                    $scope.resetFilters_selected = function ($event) {
                        $scope.tree_selected.filterInput = '';
                        tree_selected.clearFilter();
                    };

                    $("#filter_switches_selected").find("input:checkbox").on('ifChanged', function (e) {
                        var id = $(this).attr("id"),
                            flag = $(this).is(":checked");

                        switch (id) {
                            case "autoExpand":
                            case "regex":
                            case "leavesOnly":
                                // Re-apply filter only
                                break;
                            case "hideMode":
                                tree_selected.options.filter.mode = flag ? "hide" : "dimm";
                                break;
                            case "counter":
                            case "fuzzy":
                            case "hideExpandedCounter":
                            case "highlight":
                                tree_selected.options.filter[id] = flag;
                                break;
                        }
                        tree_selected.clearFilter();
                        $("#filter_input_selected").keyup();
                    });

                    // activate filters
                    $scope.tree_selected = {
                        counter: true,
                        hideExpandedCounter: true,
                        highlight: true
                    };

                    //$scope.addSelectedInitData();
                    $scope.blockUI();
                    Role.getOne($stateParams.roleId).then(function (data) {
                        $scope.role = data;
                        if(angular.isDefined($scope.role.privileges) && $scope.role.privileges !=null){
                            $scope.addSelectedInitData();
                        }

                        // $scope.ComboBox['organizationId'].options = [data.organization];

                        if ($scope.blockModal != null){
                            $scope.blockModal.hide();
                        }
                    })
                })
            }
        });

    }

})();