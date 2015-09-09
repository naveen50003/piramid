angular.module("myApp.filters",[]).filter('slice',function(){
		return function(tableData, start, end){
		return tableData.slice(start, end);
	}
});