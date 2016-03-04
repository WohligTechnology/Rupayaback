// var adminurl = "http://104.197.111.152/";
var adminurl = "http://localhost:1337/";
var adminlogin = {
  "username": "admin@admin.com",
  "password": "admin123"
};
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
  var navigation = [{
      name: "Dashboard",
      classis: "active",
      link: "#/home",
      subnav: []
    }, {
      name: 'User',
      active: '',
      link: '#/user',
      subnav: []
    }, {
      name: 'Vendors',
      active: '',
      link: '#/vendors',
      subnav: []
    }, {
      name: 'Category',
      active: '',
      link: '#/category',
      subnav: []
    }, {
      name: 'Transaction',
      active: '',
      link: '#/transaction',
      subnav: []
    }, {
      name: 'Banner',
      active: '',
      link: '#/banner',
      subnav: []
    } //Add New Left

  ];

  return {
    makeactive: function(menuname) {
      for (var i = 0; i < navigation.length; i++) {
        if (navigation[i].name == menuname) {
          navigation[i].classis = "active";
        } else {
          navigation[i].classis = "";
        }
      }
      return menuname;
    },
    getnav: function() {
      return navigation;
    },
    adminLogin: function(data, callback) {
      $http({
        url: adminurl + "user/adminlogin",
        method: "POST",
        data: {
          "email": data.email,
          "password": data.password
        }
      }).success(callback);
    },
    countUser: function(callback) {
      $http.get(adminurl + "user/countusersOverTime").success(callback);
    },
    setUser: function(data) {
      $.jStorage.set("user", data);
    },
    getUser: function() {
      $.jStorage.get("user");
    },
    getOneUser: function(id, callback) {
      $http({
        url: adminurl + 'user/findone',
        method: 'POST',
        data: {
          '_id': id
        }
      }).success(callback);
    },
    findLimitedUser: function(user, callback) {
      $http({
        url: adminurl + 'user/findlimited',
        method: 'POST',
        data: {
          'search': user.search,
          'pagesize': parseInt(user.limit),
          'pagenumber': parseInt(user.page)
        }
      }).success(callback);
    },
    findLimitedBanner: function(banner, callback) {
      $http({
        url: adminurl + 'banner/findlimited',
        method: 'POST',
        data: {
          'search': banner.search,
          'pagesize': parseInt(banner.limit),
          'pagenumber': parseInt(banner.page)
        }
      }).success(callback);
    },
    saveBanner: function(banner, callback) {
      $http({
        url: adminurl + 'banner/save',
        method: 'POST',
        data: banner
      }).success(callback);
    },
    deleteUser: function(callback) {
      $http({
        url: adminurl + 'user/delete',
        method: 'POST',
        data: {
          '_id': $.jStorage.get('deleteuser')
        }
      }).success(callback);
    },
    saveUser: function(data, callback) {
      $http({
        url: adminurl + 'user/save',
        method: 'POST',
        data: data
      }).success(callback);
    },
    getOneVendors: function(id, callback) {
      $http({
        url: adminurl + 'vendors/findone',
        method: 'POST',
        data: {
          '_id': id
        }
      }).success(callback);
    },
    findLimitedVendors: function(vendors, callback) {
      $http({
        url: adminurl + 'vendors/findlimited',
        method: 'POST',
        data: {
          'search': vendors.search,
          'pagesize': parseInt(vendors.limit),
          'pagenumber': parseInt(vendors.page)
        }
      }).success(callback);
    },
    deleteVendors: function(callback) {
      $http({
        url: adminurl + 'vendors/delete',
        method: 'POST',
        data: {
          '_id': $.jStorage.get('deletevendors')
        }
      }).success(callback);
    },
    saveVendors: function(data, callback) {
      $http({
        url: adminurl + 'vendors/save',
        method: 'POST',
        data: data
      }).success(callback);
    },
    getCategory: function(callback) {
      $http({
        url: adminurl + 'category/find',
        method: 'POST',
        data: {}
      }).success(callback);
    },
    getVendor: function(callback) {
      $http({
        url: adminurl + 'vendors/find',
        method: 'POST',
        data: {}
      }).success(callback);
    },
    analyseTransaction: function(callback) {
      $http({
        url: adminurl + 'transaction/analyseTransaction',
        method: 'POST',
        data: {}
      }).success(callback);
    },
    getOneCategory: function(id, callback) {
      $http({
        url: adminurl + 'category/findone',
        method: 'POST',
        data: {
          '_id': id
        }
      }).success(callback);
    },
    findLimitedCategory: function(category, callback) {
      $http({
        url: adminurl + 'category/findlimited',
        method: 'POST',
        data: {
          'search': category.search,
          'pagesize': parseInt(category.limit),
          'pagenumber': parseInt(category.page)
        }
      }).success(callback);
    },
    deleteCategory: function(callback) {
      $http({
        url: adminurl + 'category/delete',
        method: 'POST',
        data: {
          '_id': $.jStorage.get('deletecategory')
        }
      }).success(callback);
    },
    saveCategory: function(data, callback) {
      $http({
        url: adminurl + 'category/save',
        method: 'POST',
        data: data
      }).success(callback);
    },
    getOneTransaction: function(id, callback) {
      $http({
        url: adminurl + 'transaction/findone',
        method: 'POST',
        data: {
          '_id': id
        }
      }).success(callback);
    },
    findLimitedTransaction: function(transaction, callback) {
      $http({
        url: adminurl + 'transaction/findlimited',
        method: 'POST',
        data: {
          'type': transaction.type,
          'to': transaction.to,
          'from': transaction.from,
          'pagesize': parseInt(transaction.limit),
          'pagenumber': parseInt(transaction.page)
        }
      }).success(callback);
    },
    deleteTransaction: function(callback) {
      $http({
        url: adminurl + 'transaction/delete',
        method: 'POST',
        data: {
          '_id': $.jStorage.get('deletetransaction')
        }
      }).success(callback);
    },
    saveTransaction: function(data, callback) {
      $http({
        url: adminurl + 'transaction/save',
        method: 'POST',
        data: data
      }).success(callback);
    },
    getUser: function(callback) {
      $http({
        url: adminurl + 'user/find',
        method: 'POST',
        data: {}
      }).success(callback);
    }, //Add New Service

  }
})
