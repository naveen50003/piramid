var myApp=angular.module("myApp",['myApp.controllers','myApp.services','myApp.filters','myApp.factories','ngRoute']);
angular.module('myApp').config(function($routeProvider)
{
	$routeProvider.when('/view1',{
		templateUrl:'partials/loginView.html'     
		}).when('/view2',{
		templateUrl:'partials/accountDetails.html'  
		}).when('/view3',{
		templateUrl:'partials/graphView.html',
		});
});