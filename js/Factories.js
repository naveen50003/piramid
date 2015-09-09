angular.module("myApp.factories",[]).factory("loadDataFactory",function(){
				
		var factory={};
		/***function for Searching Data****/
		factory.searchFunction=function(tableData,search,accountLevel){
			var search_txt=search;
			var account_txt=accountLevel;
			var result=[];
			var territory_flag=false;	
			for(var i=0;i<Object.keys(tableData).length;i++){
						
				for (var j=0;j<tableData[i]['TerritoryCode'].length;j++){
				
					if(Number(search_txt)===tableData[i]['TerritoryCode'][j]){
					
						territory_flag=true;
						break;
					}else{
						continue;
					}
				}
						
				console.log("This is territory in for loop"+Number(search_txt) in tableData[i]['TerritoryCode']);
				if((tableData[i]['accountName']['name']===search_txt||tableData[i]['accountNo'].toString()===search_txt||tableData[i]['accountName']['state']===search_txt||tableData[i]['accountName']['city']===search_txt||tableData[i]['accountName']['pinCode'].toString()===search_txt||tableData[i]['accountName']['state']===search_txt||territory_flag) && (tableData[i]['accountLevel']['name']===account_txt)){
						
					territory_flag=false;
					result.push(tableData[i]);

				}
				territory_flag=false;
			
			}
			
			return result;
		}
		
		/****function for valid/Invalid Search*****/
		factory.searchChecking=function(search,accountLevel){
	
			if((!(search)&&!(accountLevel))||!(search)||!(accountLevel)){
			
				return true;
			}
			else{
			
				return false;
			}
				
		}
		
		return factory;
});