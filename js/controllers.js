var uploadres = [];
var selectedData = [];
var abc = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
// window.uploadUrl = 'http://104.197.23.70/user/uploadfile';
//window.uploadUrl = 'http://192.168.2.22:1337/user/uploadfile';
window.uploadUrl = 'http://localhost:1337/user/uploadfile';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    //  NavigationService.countUser(function(data, status) {
    //    $scope.user = data;
    //  });
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
                if (data.value == "false") {
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
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService) {
    $scope.template = TemplateService;
    //  if (!$.jStorage.get("adminuser")) {
    //    $location.url("/login");
    //
    //  }
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
    $scope.submitForm = function() {
        NavigationService.saveVendors($scope.vendors, function(data, status) {
            $location.url('/vendors');
        });
    };
    NavigationService.getCategory(function(data, status) {
        $scope.category = data;
    });
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
    NavigationService.getOneVendors($routeParams.id, function(data, status) {
        $scope.vendors = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.vendors._id = $routeParams.id;
        NavigationService.saveVendors($scope.vendors, function(data, status) {
            $location.url('/vendors');
        });
    };
    NavigationService.getCategory(function(data, status) {
        $scope.category = data;
    });
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
    });
    $scope.submitForm = function() {
        $scope.category._id = $routeParams.id;
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
//transaction Controller
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
//Add New Controller
