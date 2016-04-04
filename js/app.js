// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ngRoute',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice'
]);

firstapp.config(
    function($routeProvider, uiSelectConfig) {
        //        uiSelectConfig.theme = 'bootstrap';
        //        uiSelectConfig.resetSearchInput = true;
        //        uiSelectConfig.appendToBody = true;
        $routeProvider.
        when('/login', {
            templateUrl: 'views/template.html',
            controller: 'login'
        }).
        when('/home', {
            templateUrl: 'views/template.html',
            controller: 'home'
        }).
        when('/user', {
                templateUrl: 'views/template.html',
                controller: 'UserCtrl'
            }).when('/createuser', {
                templateUrl: 'views/template.html',
                controller: 'createUserCtrl'
            }).when('/edituser/:id', {
                templateUrl: 'views/template.html',
                controller: 'editUserCtrl'
            }).when('/vendors', {
                templateUrl: 'views/template.html',
                controller: 'VendorsCtrl'
            }).when('/createvendors', {
                templateUrl: 'views/template.html',
                controller: 'createVendorsCtrl'
            }).when('/editvendors/:id', {
                templateUrl: 'views/template.html',
                controller: 'editVendorsCtrl'
            }).when('/category', {
                templateUrl: 'views/template.html',
                controller: 'CategoryCtrl'
            }).when('/createcategory', {
                templateUrl: 'views/template.html',
                controller: 'createCategoryCtrl'
            }).when('/editcategory/:id', {
                templateUrl: 'views/template.html',
                controller: 'editCategoryCtrl'
            }).when('/transaction', {
                templateUrl: 'views/template.html',
                controller: 'TransactionCtrl'
            }).when('/createtransaction', {
                templateUrl: 'views/template.html',
                controller: 'createTransactionCtrl'
            }).when('/edittransaction/:id', {
                templateUrl: 'views/template.html',
                controller: 'editTransactionCtrl'
            }).when('/banner',{
              templateUrl:'views/template.html',
              controller:'BannerCtrl'
            }).when('/createbanner', {
                templateUrl: 'views/template.html',
                controller: 'createBannerCtrl'
            }).when('/editbanner/:id', {
                templateUrl: 'views/template.html',
                controller: 'editBannerCtrl'
            }).when('/broadcast', {
                templateUrl: 'views/template.html',
                controller: 'broadcastCtrl'
            }).when('/paisopercent', {
                templateUrl: 'views/template.html',
                controller: 'paisoPercentCtrl'
            }).//Add New Path

        otherwise({
            redirectTo: '/login'
        });
    });
firstapp.filter('uploadpath', function() {
    return function(input) {
        return adminurl + "uploadfile/getupload?file=" + input;
    };
});

firstapp.directive('array', function() {
    return {
        restrict: 'EA',
        scope: {
            GalleryStructure: "=objval",
            EditVal: "=editval",
            ModelObj: "=modelobj"
        },
        replace: false,
        templateUrl: "views/directive/array.html",
        link: function($scope, element, attr) {
            console.log($scope.EditVal);
            var GalleryStructure = $scope.GalleryStructure;
            var EditVal = $scope.EditVal;
            $scope.label = attr.label;
            $scope.GalleryStrucObj = {};
            $scope.GalleryStrucObj.keyOf = _.pluck(GalleryStructure, "name");
            $scope.GalleryStrucObj.structure = GalleryStructure;
            $scope.GalleryStrucObj.valuesOf = [];
            $scope.GalleryStrucObj.valuesOf = EditVal;
            $scope.GalleryStrucObj.nullObj = {};
            _.each($scope.GalleryStrucObj.keyOf, function(n, key) {
                $scope.GalleryStrucObj.nullObj[n] = "";
            });
            $scope.GalleryStrucObj.add = function() {
                $scope.GalleryStrucObj.valuesOf.push(_.clone($scope.GalleryStrucObj.nullObj, true));
            };
            $scope.GalleryStrucObj.remove = function(obj) {
                var objkey = _.remove($scope.GalleryStrucObj.valuesOf, obj);
            };
            $scope.EditVal = $scope.GalleryStrucObj.valuesOf;
        }
    }
});

firstapp.directive('createovalidation', function() {
    return {
        restrict: 'EA',
        replace: false,
        link: function($scope, element, attr) {
            $element = $(element);
            var validation = $scope[attr.createovalidation].structure[attr.objkey].validation;
            _.each(validation, function(n) {
                var m = n.split("=");
                if (!m[1]) {
                    m[1] = "";
                }
                $element.attr(m[0], m[1]);
            });
        }
    }
});
firstapp.directive('barhighchart', function() {
    return {
        restrict: 'A',
        scope: {
            obj: "="
        },
        replace:true,
        templateUrl: 'views/directive/barhighchart.html',
        link: function($scope, element, attr) {
          console.log("gher");
                       console.log($scope.obj);

            $element = $(element);
            $element.children('#container').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: '<span style="color:#9b59b6;margin-left:20px;">Make Your Choice</span>'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: ''
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        //                        stacking: 'percent',
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                series: [{
                    //                    name: "Brands",
                    colorByPoint: true,
                    data: $scope.obj
                }],
                credits: {
                    enabled: false
                },
            });
        }
    };
});



firstapp.directive('capitalizeFirst', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var capitalized = inputValue.charAt(0).toUpperCase() +
                    inputValue.substring(1);
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
        }
    };
});
firstapp.filter('touppercase', function() {
    return function(input) {
        var firstletter = input.substr(0, 1);
        var remaining = input.substr(1);
        return firstletter.toUpperCase() + remaining;
    };
});
