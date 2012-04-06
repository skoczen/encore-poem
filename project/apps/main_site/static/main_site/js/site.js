var ANIMATION_CONSTANT = 1;
var MIN_RED_WORD_DISTANCE = 40;
var RED_WORD_PADDING = 80;
var win_height, win_width;
var main_delay_counter = 0;
var softly_delay_counter = 0;
var zoomed_in = false;
var in_main_animation = false;
var soil_1_initial_position = 0;
var red_word_coordinates = new Array();
var red_word_fadeout_timeouts = {};
var has_seen_tulips = false;
var has_seen_red = false;
var has_seen_softly = false;
var has_seen_wilted = false;
var tulip_scroll_speed = 0.5;
var tulip_scroll_timeout = false;
var tulip_scroll_top_cutoff = 0;
var tulip_scroll_bottom_cutoff = 0;
var TULIP_SCROLL_INTERVAL_TIME = 50; //ms
var TUILP_FADEOUT_INCREMENT = 200; // ms

$(function(){
	resized();
	$("h1.title").css("margin-top",win_height/2 - $("h1.title").height()/2);
	$("poem").css("top",-1000).css({"left":win_width/2 - $("poem").width()/2});
	animate_action("main_delay_counter", "h1.title", "fadeIn(1000*ANIMATION_CONSTANT)", 4000);
	animate_action("main_delay_counter", "h1.title", "fadeOut(1000*ANIMATION_CONSTANT)", 2000);

	$("poem").delay(6000).css("top",win_height/2 - $("poem").height()/2);
	make_visible_and_animate_in("main_delay_counter", "poem word.tulips", 1000, 1000);
	make_visible_and_animate_in("main_delay_counter", "poem word.red", 1000, 2000);
	make_visible_and_animate_in("main_delay_counter", "poem word.softly", 1000, 1000);
	make_visible_and_animate_in("main_delay_counter", "poem word.wilted", 1000, 1000);
	setTimeout(bind_mouse_actions, 11000);
	
});

function bind_mouse_actions() {
	$("poem word").click(poem_word_clicked);
	// $("poem").bind("mouseover", poem_moused_over);
	$("poem word").bind("mouseover", poem_word_moused_over);
	$("poem").bind("mouseout", poem_moused_out);
	$("#red_explosion word").bind("mouseover", red_mouseover);
	$("#red_explosion word").bind("mouseout", red_mouseout);
	$("#tulips_explosion word:not(.center)").bind("mouseover", tulips_mouseover);
	$("#tulips_explosion word:not(.center)").bind("mouseout", tulips_mouseout);
	$("#wilted_explosion line").bind("mouseover", wilted_line_hovered);
}

function animate_action(counter_name, target, action, wait_after) {
	// ugh, eval
	// console.log("$(\"" + target + "\").delay("+counter_name+ "*ANIMATION_CONSTANT)." + action + ";")
	eval("$(\"" + target + "\").delay("+counter_name+ "*ANIMATION_CONSTANT)." + action + ";")
	if (wait_after != undefined) {
		eval(counter_name + "+= wait_after*ANIMATION_CONSTANT;");
	}
}

function make_visible_and_animate_in(counter_name, target, animation_time, post_delay) {
	animate_action(counter_name, target, "css({opacity: 0.0, visibility: 'visible'}).show().animate({opacity: 0.7}, "+animation_time*ANIMATION_CONSTANT+")", post_delay*ANIMATION_CONSTANT);
}

function resized() {
	win_height = $(window).height();
	win_width = $(window).width();
	MIN_RED_WORD_DISTANCE = win_height*win_width / 21000;
	RED_WORD_PADDING = MIN_RED_WORD_DISTANCE*2;
	tulip_scroll_top_cutoff = win_height*0.4;
	tulip_scroll_bottom_cutoff = win_height*0.4 + $("#tulips_explosion").height();
}
function poem_word_clicked() {
	var word = $(this);
	var id = word.attr("id").substring(10);
	if (!in_main_animation) {
		in_main_animation = true;
		if (zoomed_in) {
			
			switch (id) {

				case "tulips":
					end_tulips()
					break;

				case "red":
					red_end();
					break;

				case "softly":
					$("poem").animate({"top":win_height/2 - $("poem").height()/2, "left": win_width/2 - $("poem").width()/2}, 2000*ANIMATION_CONSTANT);	
					$("explosion.current").animate({'opacity': 0}, 2000*ANIMATION_CONSTANT);
					setTimeout(clear_main_animation_flag, 2000*ANIMATION_CONSTANT);
					break;

				case "wilted":
					$("poem").delay(1000).animate({"top":win_height/2 - $("poem").height()/2, "left": win_width/2 - $("poem").width()/2}, 2000*ANIMATION_CONSTANT);	
					$("explosion.current").animate({'opacity': 0}, 2000*ANIMATION_CONSTANT);
					setTimeout(clear_main_animation_flag, 2000*ANIMATION_CONSTANT);
					break;

				default:
					break;
			}
			zoomed_in = false;
		} else {
			switch (id) {

				case "tulips":
					setTimeout(clear_main_animation_flag, 2000*ANIMATION_CONSTANT);
					$("poem").animate({"top":win_height-35, "left": win_width-90}, 2000*ANIMATION_CONSTANT);
					setTimeout(start_tulips, 3000*ANIMATION_CONSTANT)
					has_seen_tulips = true;
					break;

				case "red":
					$("poem").animate({"top":win_height-35, "left": -90}, 2000*ANIMATION_CONSTANT);	
					setTimeout(clear_main_animation_flag, 2000*ANIMATION_CONSTANT);
					setTimeout(red_start, 3500*ANIMATION_CONSTANT);
					has_seen_red = true;
					break;

				case "softly":
					$("poem").animate({"top":-35, "left": win_width-75}, 2000*ANIMATION_CONSTANT);	
					setTimeout(softly_start, 3500*ANIMATION_CONSTANT)
					setTimeout(clear_main_animation_flag, 2000*ANIMATION_CONSTANT);
					has_seen_softly = true;
					break;

				case "wilted":
					start_wilted();
					setTimeout(clear_main_animation_flag, 2000*ANIMATION_CONSTANT);
					has_seen_wilted = true;
					break;

				default:
					break;
			}
			zoomed_in = true;
		}
	}
}

function clear_main_animation_flag() {
	in_main_animation = false;
}

function poem_moused_over() {
	if (!zoomed_in) {
		if (!has_seen_tulips) {
			$("poem word.tulips").animate({'opacity': 0.9}, 1000*ANIMATION_CONSTANT);
			$("poem word:not(.tulips)").animate({'opacity': 0.5}, 1000*ANIMATION_CONSTANT);
		} else {
		if (!has_seen_red) {
			$("poem word.red").animate({'opacity': 0.9}, 1000*ANIMATION_CONSTANT);
			$("poem word:not(.red)").animate({'opacity': 0.5}, 1000*ANIMATION_CONSTANT);	
		} else {
		if (!has_seen_softly) {
			$("poem word.softly").animate({'opacity': 0.9}, 1000*ANIMATION_CONSTANT);
			$("poem word:not(.softly)").animate({'opacity': 0.5}, 1000*ANIMATION_CONSTANT);
		} else {
		if (!has_seen_wilted) {
			$("poem word.wilted").animate({'opacity': 0.9}, 1000*ANIMATION_CONSTANT);
			$("poem word:not(.wilted)").animate({'opacity': 0.5}, 1000*ANIMATION_CONSTANT);
		}}}}	
	}	
}
function poem_word_moused_over() {
	var word = $(this);
	word.stop().animate({'opacity': 0.9}, 600*ANIMATION_CONSTANT);

	$("poem word:not(." + word.attr("class") + ")").stop().animate({'opacity': 0.4}, 600*ANIMATION_CONSTANT);
}

function poem_moused_out() {
	$("poem word").stop().animate({'opacity': 0.7}, 500*ANIMATION_CONSTANT);
}

function tulips_mouseover() {
	var word = $(this);
	word.addClass("current");
	var callouts = $("callout[callout_id=" + $(this).attr("callout_id") + "]");
	callouts.each(function(){
		var callout = $(this);
		var top = false;
		if (callout.hasClass("below")){
			top = word.height()+ 40;
		} else {
			top = -1*callout.height() + 10;
		}
		callout.css({'display':'block', 'top': "-10000"}).css({'top':top });
	});
	

}
function tulips_mouseout() {
	var word = $(this);
	word.removeClass("current");
	var callout = $("callout[callout_id=" + $(this).attr("callout_id") + "]");
	callout.hide();
}

function tulip_mousemoved(e) {
	// if (e.pageY < tulip_scroll_top_cutoff || e.pageY > tulip_scroll_bottom_cutoff ) {
		tulip_scroll_speed = (e.pageX / win_width) - 0.4;
		if ( Math.abs(tulip_scroll_speed) < 0.05 ) {
			tulip_scroll_speed = 0;
		} else {
			is_negative = tulip_scroll_speed < 0;

			tulip_scroll_speed = (tulip_scroll_speed * tulip_scroll_speed)*3;
			if (is_negative) {
				tulip_scroll_speed = tulip_scroll_speed * -1;
			}
			// if (is_negative) {
			// 	tulip_scroll_speed = -0.4; 
			// } else {
			// 	tulip_scroll_speed = 0.6
			// }
		}

	// }
}

function start_tulips() {
	tulip_scroll_speed = 0.5;
	$(window).bind("mousemove.tulips", tulip_mousemoved);

	$("explosion#tulips_explosion")
		.css({'opacity': 0, 'width':win_width, 'height':win_height, 'display': 'block', })
		.animate({scrollLeft: 0}, 0);
	$("#tulips_explosion word").css({'margin-top': tulip_scroll_top_cutoff, 'opacity':1});


	soil_1_initial_position = $("#soil_1").position().left;
	soil_2_initial_position = $("#soil_word_2").position().left;
	$("explosion#tulips_explosion")
		.animate({scrollLeft: soil_1_initial_position}, 0)
		.animate({'opacity': 1}, 2000*ANIMATION_CONSTANT)
		.addClass("current");

	setTimeout(start_tulip_scroll, 2050);
}

function start_tulip_scroll() {
	tulip_scroll_timeout = setInterval(tulipscroll, TULIP_SCROLL_INTERVAL_TIME);
}


function tulipscroll() {
	// check the position of #soil_word_2, reset if needed.
	var soil2_left = $("#soil_word_2").offset().left;
	if (soil2_left < win_width * 0.2) {
		$("#tulips_explosion").stop().animate({scrollLeft: soil_1_initial_position-soil2_left}, 0);
	} else {
		var soil1_left = $("#soil_1").offset().left;
		if (soil1_left > win_width *0.8) {
			$("#tulips_explosion").stop().animate({scrollLeft: soil_2_initial_position-soil1_left}, 0);
		}
	}
	

	var speed =  (tulip_scroll_speed * 16);
	
	var scroll_string = "+="+ speed;
	$("#tulips_explosion").stop().animate({
		scrollLeft: scroll_string,
	}, TULIP_SCROLL_INTERVAL_TIME, "linear");	
}

function animate_out_word(word){
	var opacity = (word.css('opacity')*1.0)-0.1;
	word.css('opacity', opacity);
	if (opacity > 0) {
		setTimeout(function(){animate_out_word(word)}, 100);	
	} else {
		word.css('opacity', 0);	
	}
	
}

function end_tulips() {
	var timeout_counter = 0;
	$("#tulips_explosion word").each(function(){
		var word = $(this);
		var left = word.offset().left;
		if (left > -100 && left < win_width*1.2) {
			setTimeout(function(){
				animate_out_word(word);
			}, timeout_counter);	
			timeout_counter += TUILP_FADEOUT_INCREMENT*ANIMATION_CONSTANT;
			// console.log(timeout_counter);
		} else {
			word.css({'opacity':0});
		}
	});
	timeout_counter += 1400*ANIMATION_CONSTANT;

	setTimeout(function(){
		clearInterval(tulip_scroll_timeout);
		clear_main_animation_flag();
		$(window).unbind("mousemove.tulips");
		$("poem").animate({"top":win_height/2 - $("poem").height()/2, "left": win_width/2 - $("poem").width()/2}, 2000*ANIMATION_CONSTANT);	
		$("#tulips_explosion").hide();
	}, timeout_counter);
}

function red_start() {
	$("explosion#red_explosion").css({'opacity': 0}).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT).addClass("current");
	var center_coords = {"x":((win_width/2)-($("#red_explosion word.center").width()/2)), "y": ((win_height/2)-($("#red_explosion word.center").height()))};
	$("#red_explosion word.center").css({"left":center_coords.x, "top": center_coords.y, 'opacity': 0}).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT);
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
		.css({'opacity': 0}, 0)
		.show()
		.css({"top": coords.y, "left": coords.x})
		.delay(Math.random()*ANIMATION_CONSTANT*8000)
		.animate({'opacity': 1}, Math.random()*ANIMATION_CONSTANT*10000);

}

function red_mouseover() {
	var word = $(this);
	clearTimeout(red_word_fadeout_timeouts[$("heads",word).html()]);
	if ( !word.hasClass("over") ) {
		word.addClass("over");
		if (undefined !== $("tails",this).attr("possible") && $("tails",this).attr("possible") != ""){
			var possible_tails = $("tails",this).attr("possible").split(",");
			var tail_num = Math.round(Math.random() * possible_tails.length);
			$("tails",this).html(possible_tails[tail_num]);
		}
		$("tails",this).css({'opacity': 0}).show().animate({'opacity': 1}, 1000*ANIMATION_CONSTANT);
		$("heads",this).css({'opacity': 1}).animate({'opacity': 0}, 1000*ANIMATION_CONSTANT);	
	}
	
	
}
function red_mouseout() {
	var word = $(this);
	red_word_fadeout_timeouts[$("heads",word).html()] = setTimeout(function(){red_word_fadeout(word)}, 600); // ANIMATION_CONSTANT
	
}
function red_word_fadeout(word) {
	word.removeClass("over");
	$("heads",word).css({'opacity': 0}).show().animate({'opacity': 1}, 1000*ANIMATION_CONSTANT);
	$("tails",word).css({'opacity': 1}).animate({'opacity': 0}, 1000*ANIMATION_CONSTANT);
	
}

function red_end() {
	$("#red_explosion word:not(.center)").each(function(){
		var word = $(this);
		word.delay(Math.random()*ANIMATION_CONSTANT*5000)
		.animate({'opacity': 0}, Math.random()*ANIMATION_CONSTANT*2000+(1000*ANIMATION_CONSTANT));
	});
	$("#red_explosion word.center").delay(ANIMATION_CONSTANT*4000)
		.animate({'opacity': 0}, 4000*ANIMATION_CONSTANT);
	$("poem").delay(8500*ANIMATION_CONSTANT).animate({"top":win_height/2 - $("poem").height()/2, "left": win_width/2 - $("poem").width()/2}, 2000*ANIMATION_CONSTANT);	
	setTimeout(clear_main_animation_flag, 8500*ANIMATION_CONSTANT);
}

function softly_start() {
	softly_delay_counter = 0;
	$("explosion#softly_explosion").css({'opacity': 0}, 0).show().animate({'opacity': 1}, 2000*ANIMATION_CONSTANT).addClass("current");
	
	animate_action("softly_delay_counter", "#softly_explosion line.shh1", 
					"css({'top':win_height*0.7, 'left': win_width*0.8, 'opacity':0}).show().animate({'top':win_height*0.6, 'opacity': 1.0}, 2000*ANIMATION_CONSTANT, 'linear').animate({'top':win_height*0.2, 'opacity':0}, 8000*ANIMATION_CONSTANT, 'linear')", 15000*ANIMATION_CONSTANT);
	
	animate_action("softly_delay_counter", "#softly_explosion line.listen1", 
					"css({'top':win_height*0.7, 'left': win_width*0.2, 'opacity': 0}).show().animate({'opacity': 1.0, 'top':win_height*0.622}, 2000*ANIMATION_CONSTANT, 'linear').animate({'top':0.3*win_height, 'opacity':0}, 7000*ANIMATION_CONSTANT, 'linear')", 9000*ANIMATION_CONSTANT);
	
	animate_action("softly_delay_counter", "#softly_explosion line.footsteps", 
					"css({'top':win_height*0.8, 'left': win_width*0.5, 'opacity': 0}).show().animate({'opacity': 1.0, 'top':0.72*win_height}, 2000*ANIMATION_CONSTANT, 'linear').animate({'top':0.4*win_height, 'opacity':0}, 8000*ANIMATION_CONSTANT, 'linear')", 10000*ANIMATION_CONSTANT);

	animate_action("softly_delay_counter", "#softly_explosion line.echo", 
					"css({'top':win_height*0.6, 'left': 0.3*win_width, 'opacity': 0}).show().animate({'opacity': 1.0, 'left':win_width*0.375}, 4000*ANIMATION_CONSTANT, 'linear').animate({'left':win_width*0.6, 'opacity':0}, 12000*ANIMATION_CONSTANT, 'linear')", 16000*ANIMATION_CONSTANT);
	
	animate_action("softly_delay_counter", "#softly_explosion line.oak", 
					"css({'top':win_height*0.7, 'left': win_width*0.7, 'opacity': 0}).show().animate({'opacity': 1.0, 'left':0.584*win_width}, 4000*ANIMATION_CONSTANT, 'linear').animate({'left':win_width*0.2, 'opacity':0}, 13000*ANIMATION_CONSTANT, 'linear')", 16000*ANIMATION_CONSTANT);
	
	// TODO: slow these down a teeny bit.
	animate_action("softly_delay_counter", "#softly_explosion line.still", 
					"css({'top':win_height*0.8, 'left': win_width*0.75, 'opacity': 0}).show().animate({'opacity': 1.0, 'left':0.7033*win_width}, 2000*ANIMATION_CONSTANT, 'linear').animate({'left':win_width*0.4, 'opacity':0}, 13000*ANIMATION_CONSTANT, 'linear')", 15000*ANIMATION_CONSTANT);
	
	animate_action("softly_delay_counter", "#softly_explosion line.shh2", 
					"css({'top':win_height*0.7, 'left': win_width*0.7}).show().animate({'opacity': 1.0, 'top':win_height*0.566}, 6000*ANIMATION_CONSTANT, 'linear').animate({'top':0.3*win_height, 'opacity':0}, 12000*ANIMATION_CONSTANT, 'linear')", 18000*ANIMATION_CONSTANT);

	animate_action("softly_delay_counter", "#softly_explosion line.listen2", 
					"css({'top':win_height*0.5, 'left': win_width*0.5}).show().animate({'opacity': 0.4}, 4000*ANIMATION_CONSTANT, 'linear').animate({'opacity':0.16}, 8000*ANIMATION_CONSTANT, 'linear').animate({'opacity':0.03 }, 20000*ANIMATION_CONSTANT, 'linear').animate({'opacity':0.0}, 20000*ANIMATION_CONSTANT, 'linear')", 17000*ANIMATION_CONSTANT);
		
}

function start_wilted() {
	$("poem").animate({"top":-35, "left": -70}, 2000*ANIMATION_CONSTANT);	
	$("explosion#wilted_explosion")
		.css({'opacity': 0, 'display':'block', 'width':win_width, 'height':win_height})
		.animate({'opacity': 1}, 2000*ANIMATION_CONSTANT)
		.addClass("current");
	$("#wilted_explosion stanza").css({'opacity':0}).delay(3000*ANIMATION_CONSTANT).animate({'opacity':1}, 2000*ANIMATION_CONSTANT);
	$("#wilted_explosion stanza line:first").delay(5000*ANIMATION_CONSTANT).animate({'opacity':0.1}, 1000*ANIMATION_CONSTANT);
}

function wilted_line_hovered() {
	var all_above_me_hovered = true;
	var stop_tracking = false;
	var line = $(this);

	$("#wilted_explosion line").each(function(){
		var l = $(this);
		if (l.text() == line.text()) {
			stop_tracking = true;
		}
		if (!l.hasClass("has_been_hovered") && !stop_tracking) {
			all_above_me_hovered = false;
		}
	})
	if (all_above_me_hovered) {
		line.stop().animate({'opacity': 0.5}, 1000*ANIMATION_CONSTANT).animate({'opacity': 0.02}, 10000*ANIMATION_CONSTANT)
		line.addClass("has_been_hovered");	
	}
	
}