var services=angular.module('myApp.services',[]).service("validateService",function(){
	
	/*****Authenticating User Service***/
	this.authenticateUser=function(tabledata,username,password){
		
		var search_flag=true;
		for(var i=0;i<tabledata.length-1;i++){
			
			if(tabledata[i].name===username&&tabledata[i].password===password){
				
				search_flag=false;
				break;
			}
			else{
				
				continue;
			}
		}
		if(search_flag){
		
			//alert("invalid");
			return "invalid";
		}
		else{
			
			return "valid";
		}
	}
	
}).service("retriveJsonService",function($http,$q) {
	
	/*****Retrieving JSON Data Service***/
	var deffered=$q.defer();
	$http.get('data/data1.json').then(function(data) {
		deffered.resolve(data);
	});
	this.jsonDataPromise=function(){

		return deffered.promise;
			
	}

}).service("paginationService",function(){
	
	/*****Pagination Service***/
	this.pagination=function(tableData,myPage){
		var length = Math.ceil(tableData.length/10);
		var counter = 0;
		for(var i=0;i<length;i++){
			myPage[i+1] = counter;
			counter += 10;
		}
		return myPage;
	}
	this.checkRecords=function(start,end,tableData){
		
		var records=0;
		for(i=start;i<end;i++){
		
			if(Object.keys(tableData)[i]){
			
				records++;
			}
			else{		
				break;
			}
		}
		return records;
	}
}).service("retriveuserService",function($http,$q) {
	
	/*****Retrieve admin Details Service***/
	var deffered=$q.defer();
	$http.get('data/main.json').then(function(data) {
	
		deffered.resolve(data);
	});
	this.jsonDataPromise=function() {
		
		return deffered.promise;	
	}
});
