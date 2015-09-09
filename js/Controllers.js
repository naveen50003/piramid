var table = angular.module('myApp.controllers', []).controller('tableController', function ($scope,$rootScope,$location,$http,retriveJsonService,paginationService,loadDataFactory){
	
	/***** Flag Variable for Displaying Search Error *****/
	$scope.message=false;
	/***** Variable for Storing all Account Details *****/
	$scope.tableData=[];
	/***** Variables for pagination ******/
	$scope.start = 0;
	$scope.end = 10;
	$scope.noPrev = false;
	$scope.noNext = false;
	$scope.myPage = {};
	/**** Variable for storing number of records *****/
	$scope.records=0;
	$scope.noRecords="";

	/**** Checking for Login Session*****/
	if($rootScope.loggedOut)
	{
		$location.path('/view1/');
	}
	
	/**** Function for LogOut ****/
	$scope.logOutAdmin=function()
	{
		$location.path('/view1/');
		$rootScope.loggedOut=true;
	}
	
	/**** Function for Checking Records ****/
	$scope.checkRecords=function(){
		//alert("Entered to check Records");
		$scope.records=0;
		$scope.records=paginationService.checkRecords($scope.start,$scope.end,$scope.tableData);
		//alert("This is checkrecords"+$scope.records);
		
	}
	
	/**** Function for Getting JSON Data(Using Promise) *****/
	var promise = retriveJsonService.jsonDataPromise();
		promise.then(function(result) {
			$scope.tableData=result.data;
			$scope.tableDupData=result.data;
			$rootScope.table_data_for_pyramid=result.data;
			$scope.checkRecords();
			console.log($scope.tableData);
			},function(error){
				console.log('This is error');
		});
	
	/****Function for Pagination Logic****/
	$scope.pagination=function(){
	
		if($scope.tableData.length<=10){
			$scope.start=0;
			$scope.end=10;
			$scope.pagination_flag=false;
			return $scope.myPage;
		}
		else{
			$scope.pagination_flag=true;
			$scope.myPage=paginationService.pagination($scope.tableData,$scope.myPage);//Using PaginationService
			return $scope.myPage;
		}
		
	}
	
	/***** Function for getting records per page *****/
	$scope.getArr = function(value){
		$scope.start = value;
		$scope.end = value + 10;
		$scope.checkRecords();
	};
	
	/***** Function for Pagination-Next *****/
	$scope.hasNext = function(){
		if($scope.end<$scope.tableData.length){
			$scope.start = $scope.end;
			$scope.end = $scope.end + 10;
			$scope.checkRecords();
		}
		else{
				noNext = true;
		}
	};
	
	/***** Function for Pagination-Prev *****/
	$scope.hasPrev = function(){
		if($scope.start<=0){
			noPrev = true;
		}
		else{
			$scope.end=$scope.start;
			$scope.start=$scope.start-10;
			$scope.checkRecords();
		}
	};

	/***** Function for Pagination Click Handling *****/
	$scope.isClicked = function(value){
		if(value==$scope.start){
			return true;
		}
		else{
			return false;
		}
	};
	
	/*****Function for Searching Data When selected in search menu's *****/
	$scope.searchFunction=function(){
	
		$scope.searchChecking();
		if(!$scope.message){
			$scope.message=false;
			//Using LoadDataFactory for loading data based on search
			$scope.tableData=loadDataFactory.searchFunction($scope.tableDupData,$scope.search,$scope.accountLevel);
			if($scope.tableData.length===0)
			{
				$scope.noRecords="No Records Found";
			}
			else
			{
				$scope.noRecords="";
			}
			$scope.checkRecords();
			for (var member in $scope.myPage) delete $scope.myPage[member];
			$scope.pagination();
		}	
	}
	
	/***** Function for Getting Valid/Invalid Message ******/
	$scope.searchChecking=function(){
	
		$scope.message=loadDataFactory.searchChecking($scope.search,$scope.accountLevel);
		return $scope.message;	
	}
	
	/***** Function for Navigating to graphView ******/
	$scope.checkIndex=function(data){
	
			$rootScope.user_id=data;
			$location.path('/view3/');
	};
	
	/******Functions for Sorting******/
	$scope.OnItemClick = function(type) {
	 
		$scope.order = type;
	}
	
	/*****Functions for Getting Sort Details*****/
	$scope.OnItem = function(type) {
		
	    $scope.field = type;
	}
	  
	$scope.activate=function(){
		
	    $scope.Order=$scope.order;
	    $scope.Field=$scope.field;
		$scope.mySortFunction();
	}
	  
	$scope.mySortFunction = function(i) {
			
		if( $scope.Order==="Ascending"){
			
			$scope.value=false;//For ascending if $scope.value===false
		}
		else{
		
		$scope.value=true;
		}
		if($scope.value===false){
				
			if(isNaN(i[$scope.Field])){
					
				if($scope.Field==="accountName"){
				
					return i.accountName.name;
				}
				else{
					
					return i[$scope.Field]
				}
			}
			else{
			
				return parseInt(i[$scope.Field]);
			}
		}
		else{
		
			if(isNaN(i[$scope.Field])){
			
				if($scope.Field==="accountName"){
						
						return i.accountName.name;
				}
				else{
					return i[$scope.Field]
				}
			}
			else{
				
				return parseInt(i[$scope.Field]);
			}
		}
	}

	/******* JQUERY Script For Sorting Functionality-Start *********/
	$(document).ready(function(){
	$(".drop").hide();
	$('#button').hide();
	$('.menu_holder').hide();
	$("#sort1").click(function(){
	
		$('.menu_holder').toggle();
		$('.drop').toggle();
		$('#button').toggle();
	});
	$('.lidrop').click(function(){
	
		$(this).addClass('active'); 
		$(this).parent().siblings().children().removeClass('active');
		$(this).parent().parent().parent().siblings().children().children().children().removeClass('active');
		return this;
	});
	$('.drop').click(function(){
				
		if($('.drop').index($(this))===0){
		
			for(var i=0;i<$('.submenu_holder').eq(1).children().length;i++){
								
				$('.submenu_holder').eq(1).children().eq(i).children().removeClass('active');
			}
		}
		else{
		
			for(var i=0;i<$('.submenu_holder').eq(0).children().length;i++){
			
				$('.submenu_holder').eq(0).children().eq(i).children().removeClass('active');
			}
		}
		$(this).parent().addClass('active');
		$(this).parent().parent().parent().siblings().children().children().removeClass('active');
		$('x').parent().parent().siblings().children().children().siblings().children().children().removeClass('active');
		var indexer=$('.drop').index($(this));
		$('.submenu_holder').eq(indexer).toggle();
		if(indexer===1){
		
			$('.submenu_holder').eq(0).hide();
			$('.submenu_holder').eq(0).removeClass('active'); 
		}
		if(indexer===0){
		
			$('.submenu_holder').eq(1).hide();
			$('.submenu_holder').eq(1).removeClass('active'); 
		}
				
	});
	$("#button").click(function(){
	
		$('.menu_holder').toggle();
		$('.submenu_holder').hide();
		$('.drop').toggle();
		$('#button').toggle();
		$('.lidrop').removeClass('active'); 
		$("#sort").removeClass('active'); 
		$(".drop").removeClass('active'); 
	});
		 
});
	/******* JQUERY Script For Sorting Functionality-End *********/
}).controller('validateController', function($http,$scope,validateService,$location,$rootScope,retriveuserService){
	
	$scope.tableData=[];
	$scope.username="";
	$scope.password="";
	$scope.result="";
	
	/*** Promise For Getting Admin Details ***/
	var promise = retriveuserService.jsonDataPromise();
	promise.then(function(result) {
		$scope.tableData=result.data;
		//console.log($scope.tableData);
	},function(error){
			console.log('This is error');
		});
	
	/**** Function for Authenticatin Admin *****/
	$scope.formSubmit=function(){
		
		$scope.result=validateService.authenticateUser($scope.tableData,$scope.username,$scope.password);
		if($scope.result==="valid"){
			
			$rootScope.loggedOut=false;
			$location.path('/view2/');
		}
		else{
			
			$scope.displayError=true;
		}
	}
	
});

/**** Controller for Loading Login page *****/
table.controller("loadLoginPageController",function($location,$rootScope){
	
	$location.path('/view1');	
});

/**** Controller for Loading Pyramid in GraphView *****/
table.controller("graphicalPageController",function($rootScope,retriveJsonService,$scope,$location){
	
	/*****Login and Logout Sessions****/
	if($rootScope.loggedOut){
			
		$location.path('/view1/')
	}
	$scope.backPage=function(){
		
		$location.path('/view2/');
	}
	$scope.logOutAdmin=function(){
			
		$rootScope.loggedOut=true;
		$location.path('/view1/');
	}
		
	/*****Geting Particular User Details*****/	
	for(var i=0;i<$rootScope.table_data_for_pyramid.length;i++){
		 
		 result=[];
		if($rootScope.table_data_for_pyramid[i].id===$rootScope.user_id){
			
			result.push($rootScope.table_data_for_pyramid[i]);
			break;
		}
			
	}
		
	/******pyramid drawing start(Kinetic Java Script)*********/

	/***Variables For taking X-Position and Y-Position for Pyramid on screen and Its length***/
	start_x=50;
    start_y=280;      
    length=300;
	font_size="";
	axis_points=[[start_x,start_y,length+start_x,start_y]];
	line_points=["30 pts","150 pts","350 pts","600 pts","900 pts","1300 pts"];
	line_levels=["Silver","Gold","Platinum","Platinum Plus","Diamond","Black Diamond"];
	
	/**** Creates Kinetic Stage ****/
	function createKineticStage(width,height,container_name){
			
		var stage=new Kinetic.Stage({
				
			container:container_name,
			width:width,
			height:height
		});
		return stage;
		}
		
	/**** Function to get Triangle Points ****/	
	function getTrianglePoints(length,start_x,start_y){
	
		height=Math.abs(start_y-Math.sqrt((length*length)-(length/2*length/2)));
		//console.log(height);
		return [start_x,start_y,start_x+length,start_y,start_x+length-(length/2),height];	
	}
	
	/***** Function to draw Triangle Points ****/
	function getTriangle(length,start_x,start_y){
			
		var triangle = new Kinetic.Line({
			points : getTrianglePoints(length,start_x,start_y),
			closed:true,
			name: 'triangle',
		});
		return triangle;
	}
		
	/***** Function to get Axis Points with equal Divisions*****/	
	function getBarLines(length,start_x,start_y,division_distance,axis,x_point){
			
		//console.log("barline@height is "+height);
		//console.log("barline@division is "+division_distance);
		//console.log("barline@start_x is "+start_x);
		var startx=start_x+(length*0.08375);
		var starty=start_y-division_distance;
		//console.log(length+"::"+x_point+"::"+axis);
		var endx=length+x_point-(axis*(length*0.08375));
		var endy=start_y-division_distance;
		//console.log(startx+":::"+starty+"::::"+endx+":::::"+endy);
		points=[startx,starty,endx,endy];
		//console.log(points);
		axis_points.push(points);
		//console.log(axis_points);
		return points;		
	}
		
	/***** Function to draw Axis lines with equal Divisions*****/		
	function drawBarLines(length,start_x,start_y,divisions){
			
		height=Math.abs(Math.sqrt((length*length)-(length/2*length/2)));
		division_distance=height/(divisions);
		var x_point=start_x;
		for(var i=0;i<divisions;i++){
		
			var points=getBarLines(length,start_x,start_y,division_distance,(i+1),x_point);
			markLinePoints(points[2],points[3],i);
			var line=new Kinetic.Line({
					points:points,
					name:'axis1'	
			});
			var layer=new Kinetic.Layer();
			layer.add(line);
			stage.add(layer);
			start_x=points[0];
			start_y=points[1];
		}
	}
	
	/***** Function to mark Levels *****/
	function markLineLevels(){
			
		for(var i=0;i<axis_points.length-1;i++){
		
			var y_cord_line1=axis_points[i][1];
			var y_cord_line2=axis_points[i+1][1];
			var y_axis=(y_cord_line1+y_cord_line2)/2;
			var x_axis=axis_points[i][0];
			var simpleText = new Kinetic.Text({
			    x: x_axis-line_levels[i].length-(length/2),
			    y: y_axis-7.5,
			    text:""+line_levels[i],
			    fontSize: 15,
				width:length/2,
				align:"right",
			    fontFamily: 'Calibri',
			    fill: 'white'
			});
			var layer=new Kinetic.Layer();
			layer.add(simpleText);
			stage.add(layer);
		}
	}
	
	/****** Function to mark Points *****/	
	function markLinePoints(start_x,start_y,point){
			
		var x=start_x+15;
		var y=start_y-15;
		//console.log("x point is "+x+" y point is "+y);
		var simpleText = new Kinetic.Text({
		
			x: x,
			y: y,
			text:""+line_points[point],
			fontSize: 15,
			fontFamily: 'Calibri',
			fill: 'white'
		});
		var layer=new Kinetic.Layer();
		layer.add(simpleText);
		stage.add(layer);
	}
		
	/****** Functions to get points and Fill lines for triangle initially to fill the background gradients******/
	function get_Points_For_Initial_Triangle(index){
	
		var start_firstX=axis_points[index][0];
		var start_firstY=axis_points[index][1];
		var end_firstX=axis_points[index][2];
		var end_firstY=axis_points[index][3];
		start_secondX=axis_points[index+1][0];
		start_secondY=axis_points[index+1][1]
		end_secondX=axis_points[index+1][2];
		end_secondY=axis_points[index+1][3];
		return [start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY];
	}
		
	function fillInitialTriangle(){
	
		colors=["#0e5263","#187da5","#1b98c9","#30b0e3","#4dbce8","#74cff2"];
		for(i=0;i<axis_points.length-1;i++){
		
			var dest_points=get_Points_For_Initial_Triangle(i);
			var filler=new Kinetic.Line({
			
				points:dest_points,
				strokewidth:4,
				closed:true,
				fill:colors[i],
				name:'filler'
			});
			var layer=new Kinetic.Layer();
			layer.add(filler);
			stage.add(layer);
		}
	}
		
		
	function getFillPoints(value){
	
		var start_firstX=axis_points[0][0];
		var start_firstY=axis_points[0][1];
		var end_firstX=axis_points[0][2];
		var end_firstY=axis_points[0][3];
		if(value<=30){
		
			start_secondX=axis_points[1][0];
			start_secondY=axis_points[1][1]
			end_secondX=axis_points[1][2];
			end_secondY=axis_points[1][3];
			return [[start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY],30-value,"Silver"];	
		}
		else if(value<=150){
		
			start_secondX=axis_points[2][0];
			start_secondY=axis_points[2][1]
			end_secondX=axis_points[2][2];
			end_secondY=axis_points[2][3];
			return [[start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY],150-value,"Gold"];
		}
		else if(value<=350){
		
			start_secondX=axis_points[3][0];
			start_secondY=axis_points[3][1]
			end_secondX=axis_points[3][2];
			end_secondY=axis_points[3][3];
			return [[start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY],350-value,"Platinum"];
		}
		else if(value<=600){
		
			start_secondX=axis_points[4][0];
			start_secondY=axis_points[4][1]
			end_secondX=axis_points[4][2];
			end_secondY=axis_points[4][3];
			return [[start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY],600-value,"Platinum Plus"];
		}
		else if(value<=900){
		
			start_secondX=axis_points[5][0];
			start_secondY=axis_points[5][1]
			end_secondX=axis_points[5][2];
			end_secondY=axis_points[5][3];
			return [[start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY],900-value,"Diamond"];
		}
		else{
		
			start_secondX=axis_points[6][0];
			start_secondY=axis_points[6][1]
			end_secondX=axis_points[6][2];
			end_secondY=axis_points[6][3];
			return [[start_firstX,start_firstY,end_firstX,end_firstY,end_secondX,end_secondY,start_secondX,start_secondY,start_firstX,start_firstY],1300-value,"Black Diamond"];
		}
	}
		
	/***** Final Function to Fill the user Data****/
	function fillPlot(value){	
	
		dest_points=getFillPoints(value);
		var fill_poll=new Kinetic.Line({
		
			points:dest_points[0],
			strokewidth:4,
			closed:true,
			fill:'#39e091',
			name:'filler'
		});
		var layer=new Kinetic.Layer();
		layer.add(fill_poll);
		stage.add(layer);
		var required_points=dest_points[1];
		var level=dest_points[2];
		
		/*****Objects for drawing text on Canvas****/
		var simpleText = new Kinetic.Text({
			x: start_x,
			y: start_y-(length/6),
			text:""+value+" -PTS",
			fontSize: length/20,
			width:length,
			height:100,
			align:'center',
			fontFamily: 'Calibri',
			fill: 'white',
			id:"PointerText"
		});
		var simpleText1 = new Kinetic.Text({
			x: start_x,
			y: start_y-(length/6)+(length/20),
			text:"Current Level-"+level+"",
			fontSize: length/20,
			width:length,
			height:100,
			align:'center',
			fontFamily: 'Calibri',
			fill: '#798180',
			id:"PointerText"
		});
		var simpleText2 = new Kinetic.Text({
			x: start_x,
			y: start_y-(length/6)+2*(length/20),
			text:"Points required for next Level-"+required_points+" PTS",
			fontSize: length/20,
			width:length,
			height:100,
			align:'center',
			fontFamily: 'Calibri',
			fill: 'white',
			id:"PointerText"
		});
		layer.add(simpleText);
		layer.add(simpleText1);
		layer.add(simpleText2);
		stage.add(layer);
		
		/*****Objects for drawing image on Canvas****/
		var imageObj = new Image();
		imageObj.onload = function() {
		var pen_point = new Kinetic.Image({
		
			x: ((length+start_x)/2.5),
			y: start_y-(length/6),
			image: imageObj,
			width: length*0.0766666666666667,
			height: length*0.04
			});

			layer.add(pen_point);
			stage.add(layer);
		};
		imageObj.src = 'images/sold-to-white.png';
		if(value<1300){
		
			var diamond = new Kinetic.RegularPolygon({
			x: axis_points[6][2]+1,
			y: axis_points[6][1]+10,
			sides: 4,
			radius: 6.5,
			fill: 'white',
			name: 'triangle'
			});
			layer.add(diamond);
			stage.add(layer);
		}
	}	
	
	/****Final Calls for Pyramid Graph****/	
	var stage=createKineticStage(436,300,'pyramid');
	var layer=new Kinetic.Layer();
	layer.add(getTriangle(length,start_x,start_y));
	drawBarLines(length,start_x,start_y,6);
	stage.add(layer);
	fillInitialTriangle();
	markLineLevels();
	fillPlot(result[0].points);
	
	/****pyramid drawing end*****/
}).controller('cubeController',function($rootScope,$scope,$timeout){	
	
	$timeout(function(){
		cubeLogic(result[0]);
	},10);
	/****** Cube Rating Script(Java Script) *********/
	for(var i=0;i<$rootScope.table_data_for_pyramid.length;i++){
	
		result=[];
		if($rootScope.table_data_for_pyramid[i].id===$rootScope.user_id){
		
			result.push($rootScope.table_data_for_pyramid[i]);
			break;
		}		
	}
	var flag=1;
	
	/****Function for Filling Cubes****/
	function cubeLogic(data){
	
		$scope.cubeData=data;
		var cubeDivContainer=$('.replacedImg');
		for(var j=0;j<cubeDivContainer.length;j++){
		
			$(cubeDivContainer[j]).find('.cubeDiv').addClass('cubeInactive');
			var values=Math.ceil($scope.cubeData.ProductInfo[j].points/10);
			for(var i=0;i<values;i++){
				
				$(cubeDivContainer[j]).find('.cubeDiv').eq(i).removeClass('cubeInactive');
				$(cubeDivContainer[j]).find('.cubeDiv').eq(i).addClass('cubeActive');
			}
		}
				
				
	}
	
	/****** Cube Script End *********/
}).controller('barController',function($rootScope){

	for(var i=0;i<$rootScope.table_data_for_pyramid.length;i++){
	
		result=[];
		if($rootScope.table_data_for_pyramid[i].id===$rootScope.user_id){
		
			result.push($rootScope.table_data_for_pyramid[i]);
			break;
		}
			
	}
	
	/*****BarGraph Script Start(Java Script********/
	var count=0;
	
	/*****main Function for Showing Bar Graph ***/
	function showBarGraph(data){
	
		var overSvg=document.createElementNS("http://www.w3.org/2000/svg","svg");//Svg for displaying bar graph
		overSvg.setAttribute("height",150);
		overSvg.setAttribute("width",920);
		document.getElementById("graph").appendChild(overSvg);
		var svg2=document.createElementNS("http://www.w3.org/2000/svg","svg");//svg for display text
		svg2.setAttribute("height",100);
		svg2.setAttribute("width",920);
		document.getElementById("textCont").appendChild(svg2);
		var barHeight=20;
		var ylength=(150-barHeight);
		var xlength=270;
		var rectangle1=document.createElementNS("http://www.w3.org/2000/svg","rect");//Drawing Botox rectangle 
		rectangle1.setAttribute("height",120);
		rectangle1.setAttribute("width",50);
		rectangle1.setAttribute("x",70);
		rectangle1.setAttribute("y",150-120);
		rectangle1.setAttribute("fill","#139DD4");
		overSvg.appendChild(rectangle1);
		var textb=document.createElementNS("http://www.w3.org/2000/svg","text");// Appending texts
		textb.setAttribute("x",40);
		textb.setAttribute("y",20);
		textb.textContent="Points in 2011:10";
		textb.setAttribute("fill","#6F9CB3");
		overSvg.appendChild(rectangle1);
		svg2.appendChild(textb);
		var text12=document.createElementNS("http://www.w3.org/2000/svg","text");
		text12.setAttribute("x",65);
		text12.setAttribute("y",50);
		text12.textContent="Botox";
		text12.setAttribute("fill","#6F9CB3");
		overSvg.appendChild(rectangle1);
		svg2.appendChild(text12);
		var text10=document.createElementNS("http://www.w3.org/2000/svg","text");
		text10.setAttribute("x",85);
		text10.setAttribute("y",150-10);
		text10.textContent=data.ProductInfo[0].points;
		text10.setAttribute("fill","white");
		overSvg.appendChild(rectangle1);
		overSvg.appendChild(text10);
		for(var i=1;i<5;i++){ //Background bars filling
		
			ylength=(150-barHeight);
			var h1=data.ProductInfo[i].points;
			var text=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text1=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text2=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text3=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text4=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text5=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text6=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text7=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text8=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text9=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text10=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text11=document.createElementNS("http://www.w3.org/2000/svg","text");
			var text12=document.createElementNS("http://www.w3.org/2000/svg","text");
			var val1=document.createElementNS("http://www.w3.org/2000/svg","text");
			var val2=document.createElementNS("http://www.w3.org/2000/svg","text");
			var val3=document.createElementNS("http://www.w3.org/2000/svg","text");
			var val4=document.createElementNS("http://www.w3.org/2000/svg","text");
			var val5=document.createElementNS("http://www.w3.org/2000/svg","text");
			var value=document.createElementNS("http://www.w3.org/2000/svg","text");
			for(var j=0;j<5;j++){
	
				var rectangle=document.createElementNS("http://www.w3.org/2000/svg","rect");
				rectangle.setAttribute("height",barHeight);
				rectangle.setAttribute("width",50);
				rectangle.setAttribute("x",xlength);
				rectangle.setAttribute("y",ylength);
				rectangle.setAttribute("fill","#139DD4");
				overSvg.appendChild(rectangle);
				ylength=ylength-25;
				console.log("small rects");
				//Right Text for the bars
				text2.setAttribute("x",xlength+55);
				text2.setAttribute("y",150-5);
				text2.textContent="2%";
				text2.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(text2);
				text3.setAttribute("x",xlength+55);
				text3.setAttribute("y",150-30);
				text3.textContent="4%";
				text3.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(text3);
				text4.setAttribute("x",xlength+55);
				text4.setAttribute("y",150-55);
				text4.textContent="6%";
				text4.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(text4);
				text5.setAttribute("x",xlength+55);
				text5.setAttribute("y",150-75);
				text5.textContent="8%";
				text5.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(text5);
				text6.setAttribute("x",xlength+55);
				text6.setAttribute("y",150-100);
				text6.textContent="10%";
				text6.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(text6);
				//Left Text for the bars
				val1.setAttribute("x",xlength-55);
				val1.setAttribute("y",150-5);
				val1.textContent="20PTS";
				val1.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(val1);
				val2.setAttribute("x",xlength-55);
				val2.setAttribute("y",150-30);
				val2.textContent="40PTS";
				val2.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(val2);
				val3.setAttribute("x",xlength-55);
				val3.setAttribute("y",150-55);
				val3.textContent="60PTS";
				val3.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(val3);
				val4.setAttribute("x",xlength-55);
				val4.setAttribute("y",150-75);
				val4.textContent="80PTS";
				val4.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(val4);
				val5.setAttribute("x",xlength-55);
				val5.setAttribute("y",150-100);
				val5.textContent="100PTS";
				val5.setAttribute("fill","white");
				overSvg.appendChild(rectangle);
				overSvg.appendChild(val5);
				//Below text of the bars
				text9.setAttribute("x",xlength-50);
				text9.setAttribute("y",20);
				text9.textContent="10 points to next level";
				text9.setAttribute("fill","#6F9CB3");
				svg2.appendChild(text9);
				text8.setAttribute("x",xlength-50);
				text8.setAttribute("y",35);
				text8.textContent="Points in 2011:10 pts";
				text8.setAttribute("fill","#41505C");
				svg2.appendChild(text8);
				text7.setAttribute("x",xlength);
				text7.setAttribute("y",55);
				text7.textContent=data.ProductInfo[i].Name;
				text7.setAttribute("fill","#6F9CB3");
				svg2.appendChild(text7);
			}
			

			//Getting the values --Looping through the bars
			ylength=(150-barHeight);
			var gap=0;
			for(var j=0;j<h1/20;j++){	
				
				var rectangle=document.createElementNS("http://www.w3.org/2000/svg","rect");
				rectangle.setAttribute("height",barHeight);
				rectangle.setAttribute("width",50);
				rectangle.setAttribute("x",xlength);
				rectangle.setAttribute("y",ylength);
				rectangle.setAttribute("fill","#8378AB");
				overSvg.appendChild(rectangle);
				ylength=ylength-25;
			}
			text11.setAttribute("x",xlength+10);
			text11.setAttribute("y",ylength+40);
			text11.textContent=data.ProductInfo[i].points;
			text11.setAttribute("fill","white");
			overSvg.appendChild(text11);
			xlength=xlength+180;
			console.log(xlength);	
		}
}	
	/***Calling to Draw bar graph****/
	showBarGraph(result[0]);	
}).controller('tabController',function($rootScope){

	var flag=1;
	
	/****Function for Tabbing Data****/
	function tabbingConcept(){
		$(document).ready(function(){
			$('.linkButtons').click(function(){
				if(flag===1){
			
					flag=0;
					$('.menuData').hide();
					index=$('.linkButtons').index($(this));
					$('.menuData').eq(index).slideDown(1000);
					flag=1;
				}
			});
		});
	}
	
	/**** Calling to animate tab ****/ 
	tabbingConcept();
});

