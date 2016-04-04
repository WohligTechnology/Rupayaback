var uploadres = [];
var selectedData = [];
var abc = {};
var globalfunction = {};

var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize','ui.sortable','ui.tinymce']);
// window.uploadUrl = 'http://104.197.23.70/user/uploadfile';
//window.uploadUrl = 'http://192.168.2.22:1337/user/uploadfile';
window.uploadUrl = 'http://104.197.111.152/uploadfile/uploadfile';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
     NavigationService.countUser(function(data, status) {
       $scope.user = data;
     });
      NavigationService.analyseTransaction(function(data, status) {
        $scope.transaction = data;
        console.log(data);
        $scope.pluckedCount = _.map($scope.transaction,function(key){
          return {
            name:key.name,
            y:key.count
          };
        });
        $scope.pluckedBrand = _.map($scope.transaction,function(key){
          return key.name;
        });
        $scope.pluckedAmount = _.map($scope.transaction,function(key){
          return key.amount;
        });
        $scope.charts($scope.pluckedCount);
        $scope.charts2($scope.pluckedBrand,$scope.pluckedAmount);

      });
      $scope.charts=function(data){

    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        credits:{
          enabled:false
        },
        title: {
            text: 'Brands Redeemed'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: 'Redeemed (percentage)',
            data: data
        }]
    });
      }
      $scope.charts2=function(brands,amount){
    $('#container2').highcharts({
        chart: {
            type: 'column'
        },
        credits:{
          enabled:false
        },
        title: {
            text: 'Brands amounts redeemed'
        },
        legend:{
          enabled:false
        },
        xAxis: {
            categories: brands,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Amount (Rupees)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b> Rs.{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
          name:'Amount',
            data: amount

        }]
    });
      }
});
phonecatControllers.controller('login', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;

    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.login = {};
    $scope.verifylogin = function() {
        console.log($scope.login);
        if ($scope.login.email && $scope.login.password) {
            NavigationService.adminLogin($scope.login, function(data, status) {
                if (data.value == false) {
                    $scope.isValidLogin = 0;
                } else {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", data);
                    $location.url("/home");
                }
            })
        } else {
            console.log("blank login");
            $scope.isValidLogin = 0;
        }

    }
});
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService,$upload,$timeout) {
    $scope.template = TemplateService;
     if (!$.jStorage.get("adminuser")) {
       $location.url("/login");

     }

     var imagejstupld = "";
     $scope.images = [];
     $scope.usingFlash = FileAPI && FileAPI.upload != null;
     $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
     $scope.uploadRightAway = true;
     $scope.changeAngularVersion = function() {
         window.location.hash = $scope.angularVersion;
         window.location.reload(true);
     };
     $scope.hasUploader = function(index) {
         return $scope.upload[index] != null;
     };
     $scope.abort = function(index) {
         $scope.upload[index].abort();
         $scope.upload[index] = null;
     };
     $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
         window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';

     var arrLength = 0;

     globalfunction.onFileSelect = function($files, callback) {
         $scope.selectedFiles = [];
         $scope.progress = [];
         console.log($files);
         if ($scope.upload && $scope.upload.length > 0) {
             for (var i = 0; i < $scope.upload.length; i++) {
                 if ($scope.upload[i] != null) {
                     $scope.upload[i].abort();
                 }
             }
         }
         $scope.upload = [];
         $scope.uploadResult = uploadres;
         $scope.selectedFiles = $files;
         $scope.dataUrls = [];
         arrLength = $files.length;
         for (var i = 0; i < $files.length; i++) {
             var $file = $files[i];
             if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                 var fileReader = new FileReader();
                 fileReader.readAsDataURL($files[i]);
                 var loadFile = function(fileReader, index) {
                     fileReader.onload = function(e) {
                         $timeout(function() {
                             $scope.dataUrls[index] = e.target.result;
                         });
                     }
                 }(fileReader, i);
             }
             $scope.progress[i] = -1;
             if ($scope.uploadRightAway) {
                 $scope.start(i, callback);
             }
         }
     };

     $scope.start = function(index, callback) {
         $scope.progress[index] = 0;
         $scope.errorMsg = null;
         console.log($scope.howToSend = 1);
         if ($scope.howToSend == 1) {
             $scope.upload[index] = $upload.upload({
                 url: uploadUrl,
                 method: $scope.httpMethod,
                 headers: {
                     'Content-Type': 'Content-Type'
                 },
                 data: {
                     myModel: $scope.myModel
                 },
                 file: $scope.selectedFiles[index],
                 fileFormDataName: 'file'
             });
             $scope.upload[index].then(function(response) {
                 $timeout(function() {
                   console.log(response);
                     $scope.uploadResult.push(response.data);
                     imagejstupld = response.data;

                     if (imagejstupld != "") {
                         $scope.images.push(imagejstupld.fileId);
                         console.log($scope.images);
                         imagejstupld = "";
                         if (arrLength == $scope.images.length) {
                             callback($scope.images);
                             $scope.images = [];
                         }
                     }
                 });
             }, function(response) {
                 if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
             }, function(evt) {
                 $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
             });
             $scope.upload[index].xhr(function(xhr) {});
         } else {
             var fileReader = new FileReader();
             fileReader.onload = function(e) {
                 $scope.upload[index] = $upload.http({
                     url: uploadUrl,
                     headers: {
                         'Content-Type': $scope.selectedFiles[index].type
                     },
                     data: e.target.result
                 }).then(function(response) {
                     $scope.uploadResult.push(response.data);
                 }, function(response) {
                     if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                 }, function(evt) {
                     $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                 });
             }
             fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
         }
     };

     $scope.dragOverClass = function($event) {
         var items = $event.dataTransfer.items;
         var hasFile = false;
         if (items != null) {
             for (var i = 0; i < items.length; i++) {
                 if (items[i].kind == 'file') {
                     hasFile = true;
                     break;
                 }
             }
         } else {
             hasFile = true;
         }
         return hasFile ? "dragover" : "dragover-err";
     };

});

phonecatControllers.controller('createorder', function($scope, TemplateService, NavigationService, ngDialog, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Orders");
    TemplateService.title = $scope.menutitle;
    TemplateService.list = 2;
    TemplateService.content = "views/createorder.html";
    $scope.navigation = NavigationService.getnav();
    console.log($routeParams.id);

    $scope.order = {};

    $scope.submitForm = function() {
        console.log($scope.order);
        NavigationService.saveOrder($scope.order, function(data, status) {
            console.log(data);
            $location.url("/order");
        });
    };


    $scope.order.tag = [];
    $scope.ismatch = function(data, select) {
        abc.select = select;
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.order.tag = select.selected;
            }
        });
        console.log($scope.artwork.tag);
    }


    $scope.refreshOrder = function(search) {
        $scope.tag = [];
        if (search) {
            NavigationService.findArtMedium(search, $scope.order.tag, function(data, status) {
                $scope.tag = data;
            });
        }
    };

    $scope.GalleryStructure = [{
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }, {
        "name": "image",
        "type": "image"
    }, {
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }];

    $scope.persons = [{
        "id": 1,
        "name": "first option"
    }, {
        "id": 2,
        "name": "first option"
    }, {
        "id": 3,
        "name": "first option"
    }, {
        "id": 4,
        "name": "first option"
    }, {
        "id": 5,
        "name": "first option"
    }];

    NavigationService.getUser(function(data, status) {
        $scope.persons = data;
    });

});




//User Controller
phonecatControllers.controller('UserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/user.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.User = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedUser($scope.pagedata, function(data, status) {
          console.log(data.data);
// _.each(data.data,function(key){
//   key.date = new Date(key.date);
// });
            $scope.user = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteUser(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteuser', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'UserCtrl',
                closeByDocument: false
            });
        }
        //End User
});
//user Controller
//createUser Controller
phonecatControllers.controller('createUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createuser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    $scope.submitForm = function() {
        NavigationService.saveUser($scope.user, function(data, status) {
            $location.url('/user');
        });
    };
    $scope.user.notification = [];
    $scope.NotificationStructure = [{
        "name": "os",
        "type": "text"
    }, {
        "name": "devicetoken",
        "type": "text"
    }];
    $scope.user.billing = [];
    $scope.BillingStructure = [{
        "name": "paymentmethod",
        "type": "text"
    }, {
        "name": "amount",
        "type": "number"
    }, {
        "name": "couponcode",
        "type": "text"
    }, {
        "name": "status",
        "type": "text"
    }, {
        "name": "paisoprovided",
        "type": "text"
    }];
    //createUser
});
//createUser Controller
//editUser Controller
phonecatControllers.controller('editUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edituser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    NavigationService.getOneUser($routeParams.id, function(data, status) {
        $scope.user = data;
        if (!$scope.user.notification) {
            $scope.user.notification = [];
        }
        if (!$scope.user.billing) {
            $scope.user.billing = [];
        } //Add More Array
    });
    $scope.submitForm = function() {
        $scope.user._id = $routeParams.id;
        NavigationService.saveUser($scope.user, function(data, status) {
            $location.url('/user');
        });
    };
    $scope.NotificationStructure = [{
        "name": "os",
        "type": "text"
    }, {
        "name": "devicetoken",
        "type": "text"
    }];
    $scope.BillingStructure = [{
        "name": "paymentmethod",
        "type": "text"
    }, {
        "name": "amount",
        "type": "number"
    }, {
        "name": "couponcode",
        "type": "text"
    }, {
        "name": "status",
        "type": "text"
    }, {
        "name": "paisoprovided",
        "type": "text"
    }];
    //editUser
});
//editUser Controller
//Vendors Controller
phonecatControllers.controller('VendorsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Vendors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/vendors.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Vendors = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedVendors($scope.pagedata, function(data, status) {
            $scope.vendors = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteVendors(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletevendors', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'VendorsCtrl',
                closeByDocument: false
            });
        }
        //End Vendors
});
//vendors Controller
//createVendors Controller
phonecatControllers.controller('createVendorsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Vendors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createvendors.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.vendors = {};
    $scope.vendors.bannerurl=[];
    $scope.keepCashback=false;
    $scope.giveAmountLimit=false;
    $scope.openAmountSelector=false;
    $scope.submitForm = function() {
      if($scope.openAmountSelector==true){
        $scope.vendors.amountselect=_.map($scope.vendors.amountselect,function(key){
return parseInt(key);
        })
      }
      if($scope.vendors.offerpercent == undefined || $scope.vendors.offerpercent == 0){
        $scope.vendors.hasoffer=undefined;
      }
        NavigationService.saveVendors($scope.vendors, function(data, status) {

            $location.url('/vendors');
        });
    };
    NavigationService.getCategory(function(data, status) {
        $scope.category = data;
    });
    $scope.removeimagecerti = function() {
        $scope.vendors.certi = '';
    };
    $scope.onFileSelect = function($files, whichone, uploadtype) {
        globalfunction.onFileSelect($files, function(image) {
            if (whichone == 1) {
                $scope.vendors.logourl = image;
                if (uploadtype == 'single') {
                    $scope.vendors.logourl = image[0];
                }
            } else if (whichone == 2) {
                $scope.vendors.bannerurl = image;
                if (uploadtype == 'single') {
                    $scope.vendors.bannerurl = image[0];
                }
            }
        })
    }
    $scope.keepOffer=function(flag){
      $scope.keepCashback=false;
      $scope.vendors.hasoffer= (flag == "true")?true:false;
      if($scope.vendors.hasoffer === true){
        $scope.keepCashback =true;
        $scope.vendors.offerpercent=0;
      }else{
        $scope.keepCashback =false;
        $scope.vendors.offerpercent=undefined;
      }
    }
    $scope.convertToArray=function(input){
      $scope.vendors.amountselect=input.split(',');
    };
    $scope.selectAmountType=function(flag){
      $scope.giveAmountLimit=false;
      $scope.openAmountSelector=false;
      if(flag=="custom"){
        $scope.giveAmountLimit = true;
        $scope.vendors.amountselect=[];
      }else{
        $scope.openAmountSelector=true;
        $scope.vendors.amountlimit=undefined;
            }
    }
    $scope.removeimagehomeslide = function(i) {
        $scope.vendors.bannerurl.splice(i, 1);
    };
    //createVendors
});
//createVendors Controller
//editVendors Controller
phonecatControllers.controller('editVendorsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Vendors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editvendors.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.vendors = {};

    console.log("news");
    NavigationService.getOneVendors($routeParams.id, function(data, status) {
        $scope.vendors = data; //Add More Array
        console.log(data);
        $scope.keepOffer($scope.vendors.hasoffer);
        $scope.selectAmountType($scope.vendors.input);
        if($scope.vendors.hasoffer==true){
          $scope.vendors.hasoffer ="true";
        }else if($scope.vendors.hasoffer == false){
          $scope.vendors.hasoffer="false";
        };
        $scope.vendors.bannerurl=[];
    });
    $scope.submitForm = function() {
        $scope.vendors._id = $routeParams.id;
        if($scope.openAmountSelector==true){
          console.log("tuiadyisu");
          $scope.vendors.amountselect=_.map($scope.vendors.amountselect,function(key){
  return parseInt(key);
          })
        }
        if($scope.vendors.offerpercent == undefined || $scope.vendors.offerpercent == 0){
          $scope.vendors.hasoffer=false;
        }
        if($scope.vendors.hasoffer=="true"){
          console.log("herere");
          $scope.vendors.hasoffer =true;
        }else if($scope.vendors.hasoffer == "false"){
          console.log("herere1");
          $scope.vendors.hasoffer=false;
        }
        console.log($scope.vendors);
        NavigationService.saveVendors($scope.vendors, function(data, status) {
            $location.url('/vendors');
        });
    };
    NavigationService.getCategory(function(data, status) {
        $scope.category = data;
    });
    $scope.removeimagecerti = function() {
        $scope.vendors.logourl = '';
    };
    $scope.onFileSelect = function($files, whichone, uploadtype) {
        globalfunction.onFileSelect($files, function(image) {
            if (whichone == 1) {
                if (uploadtype == 'multiple') {
                    if ($scope.vendors.logourl.length > 0) {
                        _.each(image, function(n) {
                            $scope.vendors.logourl.push(n)
                        })
                    } else {
                        $scope.vendors.logourl = image;
                    }
                } else if (uploadtype == 'single') {
                    $scope.vendors.logourl = image[0];
                }
            } else if (whichone == 2) {
                if (uploadtype == 'multiple') {
                    if ($scope.vendors.bannerurl.length > 0) {
                        _.each(image, function(n) {
                            $scope.vendors.bannerurl.push(n);
                        })
                    } else {
                        $scope.vendors.bannerurl = image;
                    }
                } else if (uploadtype == 'single') {
                    $scope.vendors.bannerurl = image[0];
                }
            }
        })
    }
    $scope.keepOffer=function(flag){
      $scope.keepCashback=false;
      if(flag=="true"){
        $scope.vendors.hasoffer =true;
      }else if(flag == "false"){
        $scope.vendors.hasoffer=false;
      }
      if($scope.vendors.hasoffer === true){
        $scope.keepCashback =true;
      }else{
        $scope.keepCashback =false;
        $scope.vendors.offerpercent=undefined;
      }
    }
    $scope.convertToArray=function(input){
      $scope.vendors.amountselect=input.split(',');
    };
    $scope.selectAmountType=function(flag){
      $scope.giveAmountLimit=false;
      $scope.openAmountSelector=false;
      if(flag=="custom"){
        $scope.giveAmountLimit = true;
        $scope.vendors.amountselect=[];
      }else{
        $scope.openAmountSelector=true;
        $scope.vendors.amountlimit=undefined;
            }
    }
    $scope.removeimagehomeslide = function(i) {
        $scope.vendors.bannerurl.splice(i, 1);
    };
    //editVendors
});
//editVendors Controller
//Category Controller
phonecatControllers.controller('CategoryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Category');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/category.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Category = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedCategory($scope.pagedata, function(data, status) {
            $scope.category = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteCategory(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletecategory', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'CategoryCtrl',
                closeByDocument: false
            });
        }
        //End Category
});
//category Controller
//createCategory Controller
phonecatControllers.controller('createCategoryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Category');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createcategory.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.category = {};
    $scope.submitForm = function() {
      $scope.category.status = ($scope.category.status == "true")?true:false;
      $scope.category.listview = ($scope.category.listview == "true")?true:false;
        NavigationService.saveCategory($scope.category, function(data, status) {
            $location.url('/category');
        });
    };
    //createCategory
});
//createCategory Controller
//editCategory Controller
phonecatControllers.controller('editCategoryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Category');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editcategory.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.category = {};
    NavigationService.getOneCategory($routeParams.id, function(data, status) {
        $scope.category = data; //Add More Array
        $scope.category.status = ($scope.category.status == true)?"true":"false";
        $scope.category.listview = ($scope.category.listview == true)?"true":"false";
    });
    $scope.submitForm = function() {
        $scope.category._id = $routeParams.id;
        $scope.category.status = ($scope.category.status == "true")?true:false;
        $scope.category.listview = ($scope.category.listview == "true")?true:false;
        NavigationService.saveCategory($scope.category, function(data, status) {
            $location.url('/category');
        });
    };
    //editCategory
});
//editCategory Controller
//Transaction Controller
phonecatControllers.controller('TransactionCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Transaction');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/transaction.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Transaction = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        console.log(pagedata);
        NavigationService.findLimitedTransaction($scope.pagedata, function(data, status) {
            $scope.transaction = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteTransaction(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletetransaction', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'TransactionCtrl',
                closeByDocument: false
            });
        }
        //End Transaction
});
phonecatControllers.controller('BannerCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
  console.log("here");
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Banner');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/banner.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.transaction = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedBanner($scope.pagedata, function(data, status) {
            $scope.banner = data;
            console.log($scope.banner);
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    NavigationService.getVendor(function(data,status){
      $scope.vendors=data;
      console.log();

    });
    $scope.confDelete = function() {
        NavigationService.deleteBanner(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletetransaction', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'BannerCtrl',
                closeByDocument: false
            });
        }
        //End Transaction
});
phonecatControllers.controller('createBannerCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Banner');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createbanner.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.banner = {};
    $scope.submitForm = function() {
        NavigationService.saveBanner($scope.banner, function(data, status) {
          $scope.banner
            $location.url('/banner');
        });
    };
    $scope.removeimagecerti = function() {
        $scope.banner.imgurl = null;
    };
    $scope.onFileSelect = function($files, whichone, uploadtype) {
        globalfunction.onFileSelect($files, function(image) {
          console.log(image);
            if (whichone == 1) {
                $scope.banner.imgurl = image[0];
                if (uploadtype == 'single') {
                    $scope.banner.imgurl = image[0];
                }
            }
        })
    }
    NavigationService.getVendor(function(data,status){
      $scope.vendors=data;
    });
    //createCategory
});
//banner Controller
//Edit Banner
phonecatControllers.controller('editBannerCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog,$routeParams) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Banner');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editbanner.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.banner = {};
    NavigationService.getOneBanner($routeParams.id, function(data, status) {
        $scope.banner = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.banner._id = $routeParams.id;
        NavigationService.saveBanner($scope.banner, function(data, status) {
            $location.url('/banner');
        });
    };
    $scope.removeimagecerti = function() {
        $scope.banner.imgurl = null;
    };
    $scope.onFileSelect = function($files, whichone, uploadtype) {
        globalfunction.onFileSelect($files, function(image) {
          console.log(image);
            if (whichone == 1) {
                $scope.banner.imgurl = image[0];
                if (uploadtype == 'single') {
                    $scope.banner.imgurl = image[0];
                }
            }
        })
    }
    NavigationService.getVendor(function(data,status){
      $scope.vendors=data;
    });
    //editTransaction
});
//End of edit Banner
//createTransaction Controller
phonecatControllers.controller('createTransactionCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Transaction');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createtransaction.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.transaction = {};
    $scope.submitForm = function() {
        NavigationService.saveTransaction($scope.transaction, function(data, status) {
            $location.url('/transaction');
        });
    };
    NavigationService.getUser(function(data, status) {
        $scope.from = data;
    });
    //createTransaction
});
//createTransaction Controller
//editTransaction Controller
phonecatControllers.controller('editTransactionCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Transaction');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edittransaction.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.transaction = {};
    NavigationService.getOneTransaction($routeParams.id, function(data, status) {
        $scope.transaction = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.transaction._id = $routeParams.id;
        NavigationService.saveTransaction($scope.transaction, function(data, status) {
            $location.url('/transaction');
        });
    };
    NavigationService.getUser(function(data, status) {
        $scope.from = data;
    });
    //editTransaction
});

//editTransaction Controller
phonecatControllers.controller('broadcastCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Broadcast');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/broadcast.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};
    $scope.submitForm = function() {
        NavigationService.sendNotification($scope.notification, function(data, status) {
            $location.url('/broadcast');
        });
    };
    //editTransaction
});

phonecatControllers.controller('paisoPercentCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Change PAiSO percent');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/paisopercent.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.variable={};
    $scope.findPaisoPercent = function(){

      NavigationService.findVariable(function(resp){
        if(resp.value !=  false){
          $scope.variable = resp[0];
        }
      });
    };
    $scope.findPaisoPercent();
    $scope.submitForm = function() {
      console.log("here");
        NavigationService.saveVariable($scope.variable, function(data, status) {
          console.log("erere");
          console.log(data);
            $location.url('/paisopercent');

        });
    };
});
//Add New Controller
