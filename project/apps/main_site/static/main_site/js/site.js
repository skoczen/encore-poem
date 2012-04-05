var ANIMATION_CONSTANT = 0.1;
var MIN_RED_WORD_DISTANCE = 40;
var RED_WORD_PADDING = 80;
var win_height, win_width;
var current_delay_counter = 0;
var zoomed_in = false;
var red_word_coordinates = new Array();

$(function(){
	resized();
	$("h1.title").css("margin-top",win_height/2 - $("h1.title").height()/2);
	$("poem").css("top",win_height/2 - $("poem").height()/2).css({"left":win_width/2 - $("poem").width()/2});
	animate_action("h1.title", "fadeIn(1000*ANIMATION_CONSTANT)", 4000);
	animate_action("h1.title", "fadeOut(1000*ANIMATION_CONSTANT)", 2000);
	make_visible_and_animate_in("poem word.tulips", 1000, 1000);
	make_visible_and_animate_in("poem word.red", 1000, 2000);
	make_visible_and_animate_in("poem word.softly", 1000, 1000);
	make_visible_and_animate_in("poem word.wilted", 1000, 1000);
	$("poem word").click(poem_word_clicked);
	$("#red_explosion word").bind("mouseover", red_mouseover);
	$("#red_explosion word").bind("mouseout", red_mouseout);
	$("#tulips_explosion word").bind("mouseover", tulips_mouseover);
	$("#tulips_explosion word").bind("mouseout", tulips_mouseout);
});

function animate_action(target, action, wait_after) {
	// ugh, eval
	// console.log("$(\"" + target + "\").delay("+current_delay_counter*ANIMATION_CONSTANT+")." + action + ";")
	eval("$(\"" + target + "\").delay("+current_delay_counter*ANIMATION_CONSTANT+")." + action + ";")
	if (wait_after != undefined) {
		current_delay_counter += wait_after*ANIMATION_CONSTANT;
	}
}

function make_visible_and_animate_in(target, animation_time, post_delay) {
	animate_action(target, "css({opacity: 0.0, visibility: 'visible'}).animate({opacity: 1.0}, "+animation_time*ANIMATION_CONSTANT+")", post_delay*ANIMATION_CONSTANT);
}

function resized() {
	win_height = $(window).height();
	win_width = $(window).width();
	MIN_RED_WORD_DISTANCE = win_height*win_width / 21000;
	RED_WORD_PADDING = MIN_RED_WORD_DISTANCE*2;
}
function poem_word_clicked() {
	var word = $(this);
	var id = word.attr("id").substring(10);
	if (zoomed_in) {
		$("poem").animate({"top":win_height/2 - $("poem").height()/2, "left": win_width/2 - $("poem").width()/2}, 2000*ANIMATION_CONSTANT);	
		$("explosion.current").animate({'opacity': 0}, 2000*ANIMATION_CONSTANT);
		zoomed_in = false;
	} else {
		switch (id) {

			case "tulips":
				$("poem").animate({"top":win_height-35, "left": win_width-90}, 2000*ANIMATION_CONSTANT);
				$("explosion#"+id+"_explosion").animate({'opacity': 0}, 0).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT).addClass("current");
				break;

			case "red":
				$("poem").animate({"top":win_height-35, "left": -90}, 2000*ANIMATION_CONSTANT);	
				setTimeout(red_start, 3500*ANIMATION_CONSTANT);
				
				break;

			case "softly":
				$("poem").animate({"top":-35, "left": win_width-75}, 2000*ANIMATION_CONSTANT);	
				$("explosion#"+id+"_explosion").animate({'opacity': 0}, 0).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT).addClass("current");
				break;

			case "wilted":
				$("poem").animate({"top":-35, "left": -70}, 2000*ANIMATION_CONSTANT);	
				$("explosion#"+id+"_explosion").animate({'opacity': 0}, 0).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT).addClass("current");
				break;

			default:
				break;
		}
		zoomed_in = true;
	}
}


function tulips_mouseover() {
	var callout = $("#" + $(this).attr("callout_id"));
	callout.show();
}
function tulips_mouseout() {
	var callout = $("#" + $(this).attr("callout_id"));
	callout.hide();
}

function red_start() {
	$("explosion#red_explosion").animate({'opacity': 0}, 0).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT).addClass("current");
	var center_coords = {"x":win_width/2, "y": win_height/2};
	$("#red_explosion word.center").css({"left":center_coords.x, "top": center_coords.y});
	red_word_coordinates = [];
	red_word_coordinates.push(center_coords);
	$("#red_explosion word:not(.center)").each(function(){
		red_word_animate(this);
	});
}

function get_red_word_coordinates() {
	var x = false;
	var y = false;
	var is_far_enough = false;

	while (is_far_enough === false) {
		is_far_enough = true;
		x = (win_width-RED_WORD_PADDING*2)*Math.random()+RED_WORD_PADDING/2;
		y = (win_height-RED_WORD_PADDING*2)*Math.random()+RED_WORD_PADDING;

		for (k in red_word_coordinates) {
			if ( (Math.abs(x - red_word_coordinates[k].x) < MIN_RED_WORD_DISTANCE*2 && Math.abs(y - red_word_coordinates[k].y) < MIN_RED_WORD_DISTANCE*2) ||
				(Math.abs(y - red_word_coordinates[k].y) < MIN_RED_WORD_DISTANCE && Math.abs(x - red_word_coordinates[k].x) < MIN_RED_WORD_DISTANCE*4) ) {
				is_far_enough = false;
				break;
			}
		}
	}
	var coords = {"x": x, "y": y};
	red_word_coordinates.push(coords);
	return coords;

}

function red_word_animate(word) {
	var coords = get_red_word_coordinates();
	$(word)
		.animate({'opacity': 0}, 0)
		.show()
		.css({"top": coords.y, "left": coords.x})
		.delay(Math.random()*ANIMATION_CONSTANT*8000)
		.animate({'opacity': 1}, Math.random()*ANIMATION_CONSTANT*10000);

}

function red_mouseover() {
	console.log($("tails",this).attr("possible"))
	if (undefined !== $("tails",this).attr("possible") && $("tails",this).attr("possible") != ""){
		var possible_tails = $("tails",this).attr("possible").split(",");
		var tail_num = Math.round(Math.random() * possible_tails.length);
		$("tails",this).html(possible_tails[tail_num]);
	}
	$("tails",this).show();
	$("heads",this).hide();
	
}
function red_mouseout() {
	$("tails",this).hide();
	$("heads",this).show();
}