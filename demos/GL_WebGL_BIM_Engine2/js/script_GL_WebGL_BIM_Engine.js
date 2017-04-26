$(function($) {
  // 你可以在这里继续使用$作为别名...
  $("span.checkbox").on("click", function(){
	checkbox_toggle(this);
	});
  $("i.i_tree_checkbox").on("click", function(){
	i_checkbox_toggle(this);
	});
  $("i.i_tree_expan").addClass("visibility_hidden");
  $("i.i_tree_file").addClass("display_none");
  $(".pop_contents_tree ul.treeview").addClass("tree_ul_display_none");
  $(".pop_contents_tree ul.tree_root").removeClass("tree_ul_display_none");
  
  $("ul.treeview>li").has("ul.treeview").map(function(){
  	$(this).children("i.i_tree_expan").removeClass("visibility_hidden");
//	$(this).children("span.tree_leave").on("click",expan_tree_ul(this));
  	$(this).children("i.i_tree_expan").on("click", function(){
		//展开子元素中的ul
		if($(this).parent("li").children("ul.treeview").hasClass("tree_ul_display_none")){
	  		$(this).parent("li").children("ul.treeview").removeClass("tree_ul_display_none");
	  		$(this).parent("li").children("i.i_tree_expan").addClass("i_tree_retract");
	  	}else{
	  		$(this).parent("li").children("ul.treeview").addClass("tree_ul_display_none");	  		
	  		$(this).parent("li").children("i.i_tree_expan").removeClass("i_tree_retract");
	  	}
	});
  	if($(this).children("ul.treeview").hasClass("tree_ul_display_none")){
  		$(this).children("i.i_tree_expan").removeClass("i_tree_retract");
  	}else{
  		$(this).children("i.i_tree_expan").addClass("i_tree_retract");
  	}
  });

});

function toggleTabs(ele,index){
	var arrow = $(".pop_box .arrow");
	$(arrow).removeClass("arrow1");
	$(arrow).removeClass("arrow2");
	$(arrow).removeClass("arrow3");
	$(".pop_box_contents>div").addClass("display_none")
	
	if(index==1){
		$(arrow).addClass("arrow1")
		showModelsList();
	}else if(index==2){
		$(arrow).addClass("arrow2")
		showTreeList();
	}else if(index==3){
		$(arrow).addClass("arrow3")
		showAttrssList()
	}
}
function showModelsList(){
	$(".pop_box_contents .pop_contents_models").removeClass("display_none")
	$(".pop_box_contents .pop_contents_models").insertAfter(".pop_box_contents>div:last-of-type");
}
function showTreeList(){
	$(".pop_box_contents .pop_contents_tree").removeClass("display_none")
	$(".pop_box_contents .pop_contents_tree").insertAfter(".pop_box_contents>div:last-of-type");
}
function showAttrssList(){
	$(".pop_box_contents .pop_contents_attrs").removeClass("display_none")
	$(".pop_box_contents .pop_contents_attrs").insertAfter(".pop_box_contents>div:last-of-type");
}


function checkbox_toggle(ele){
	//切换选中状态
	if($($(ele).parent("li").find("i.check_slider")).hasClass("check_slider_hecked")){
		$($(ele).parent("li").find("i.check_slider")).removeClass("check_slider_hecked")
	}else{
		$($(ele).parent("li").find("i.check_slider")).addClass("check_slider_hecked")
	}
	//被选择的checkbox ID
	alert($($(ele).parent("li").find("label.model_title")).attr("id"));	
}

function i_checkbox_toggle(ele){
	//切换选中状态
	if($(ele).hasClass("i_tree_checked")){
		$(ele).removeClass("i_tree_checked")
	}else{
		$(ele).addClass("i_tree_checked")
	}
	//被选择的checkbox ID
	alert($($(ele).parent("li").find("span.tree_leave")).attr("id"));	
}
function onloadFun(){
//	if (!$.browser.webkit) {
				 	$('body').addClass('dark');
				
					$.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
					$.mCustomScrollbar.defaults.axis="y"; //enable 2 axis scrollbars by default
					
					$(".container").mCustomScrollbar({theme:"dark"});
					
//					$(".class_moz").removeClass("scrollbar");
//					$(".class_moz").removeClass("style-7");
//					$(".class_moz").removeClass("force-overflow");
//	}

	if ((navigator.userAgent.indexOf('MSIE') >= 0) 
	    && (navigator.userAgent.indexOf('Opera') < 0)){
	    $(".check_slider").css("top","-24px");
	}
}
