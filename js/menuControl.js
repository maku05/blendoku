// JavaScript Document
$(document).ready(function(){
	
	var tutorialGUI	= '<div class="tutorialGUI"></div>';
	
	
	$('.menu li.start').click(function(){
		$('#foreground').animate({opacity: "0"},1500, function(){
														$('#left').addClass('open');
														$('.tablet_navi').addClass('open');
														
														});
		$('#foreground').animate({left: "-100%"},1);
		
	});
	
	$('.menu li.tutorial').click(function(){
		$('#foreground').animate({opacity: "0"},1500,function(){
														$('#left').addClass('open');
														showOnlyBackToMainDeskop();
														$('.tutorialGUI').addClass('open');
														showOnlyBackToMainTablet();
														
														});	
		$('#foreground').animate({left: "-100%"},1);
		
	});
	
	$('.menu li.level').click(function(){
		$('#foreground').animate({opacity: "0"},1500,function(){
														$('#left').addClass('open');
														showOnlyBackToMainDeskop();
														$('.difficultySelection').addClass('open');
														showOnlyBackToMainTablet();
															
														});	
		$('#foreground').animate({left: "-100%"},1);	
					
									
	});
	
	$('.menu li.highscore').click(function(){
		$('#foreground').animate({opacity: "0"},1500,function(){
														$('#left').addClass('open');
														showOnlyBackToMainDeskop();
														$('.highscoreContainer').addClass('open');
														showOnlyBackToMainTablet();
															
														});	
		$('#foreground').animate({left: "-100%"},1);	
					
									
	});
	
	$('.difficultySelection .difficulty').click(function(){
		$('.difficultySelection').removeClass('open');
		$('.allLevels').addClass('open');
	});
	
	
	
	$('.back').click(function(){
			
			resetMobileNav();
			$('.back.open').removeClass('open');
			$('#left.open').removeClass('open');
			$('.tutorialGUI').removeClass('open');
			$('.difficultySelection').removeClass('open');
			$('.allLevels').removeClass('open');
			$('#left .finish').css('display', 'block');
			$('#foreground').animate({left: "0"},1);
			$('#foreground').animate({opacity: "1"},1500);
			$('.highscoreContainer').removeClass('open');
			if(status == "wait"){
				status = "comeBack";
				if(direction == 1){
					direction = -1;
				}
				else{
					direction = 1;
				}
			}
    });
	
		$('.finish').click(function(){
		var solutionJson = getSolutionJSON();
		sendSolutionJSON(solutionJson);
    });
	
	function showOnlyBackToMainTablet(){
		$('.tablet_navi').addClass('open');
		$('.tablet_navi.open .finish').css('display', 'none');
	}
	
	function showOnlyBackToMainDeskop(){
		$('#left .finish').css('display', 'none');
	}

});

	function resetMobileNav(){
		$('.tablet_navi').removeClass('open');
		$('.tablet_navi .finish').css('dispaly', 'block');
	}