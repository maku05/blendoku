// JavaScript Document
$(document).ready(function(){
	var complexValue;
	var levelId;
	var idForColor;
	
	$('.easy').click(function(){
		$('.first').attr("level", 1);
		$('.second').attr("level",2);
		$('.third').attr("level", 3);
		$('.fourth').attr("level", 4);
		$('.fifth').attr("level", 5);
		setColors();
	});
	$('.middle').click(function(){
		$('.first').attr("level", 6);
		$('.second').attr("level", 7);
		$('.third').attr("level", 8);
		$('.fourth').attr("level", 9);
		$('.fifth').attr("level", 10);	
		setColors();
	});
	$('.hard').click(function(){
		$('.first').attr("level", 11);
		$('.second').attr("level", 12);
		$('.third').attr("level", 13);
		$('.fourth').attr("level", 14);
		$('.fifth').attr("level", 15);	
		setColors();
	});
	
	
	$('.chooseLevel').click(function(){
		levelId = $(this).attr('level');
		level["id"] = levelId;
		resetGrid();
		$('#left.open').removeClass('open');
		$('.allLevels').removeClass('open');
		$('#left .finish').css('display', 'block');
		$('.menu .start').click();
	});
	
	
	function setColors(){
		idForColor = $('.chooseLevel').val();
		
		console.log(usernameCookie);
	}
	
	
});