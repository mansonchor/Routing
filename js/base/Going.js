define("base/Going",[],function(require, exports)
{
	var Going = {}

	;(function(){
		
		var CONTAINER_ID = 1,ZINDEX = 10000,__EASE_TIMINGFUNCTION = 'ease',__SLIDE_TRANSITION_TIME = '400ms',__SLIDEUP_TRANSITION_TIME = '400ms',__FADE_TRANSITION_TIME = '400ms',PAGE_IS_TRANSIT = false,LAST_PAGE_OBJ = false,PAGE_OBJ_HISTORY = [],USE_ROUTING = false,ROUTING_OBJ
		

		Going.mount_container = function(id_or_obj , options)
		{
			var options = options || {}
			USE_ROUTING = options.use_routing || false
			ROUTING_OBJ = options.routing_obj || {}

			if( __is_string(id_or_obj) ) var container_obj = document.getElementById(id_or_obj)
			else if(!__is_empty(id_or_obj)) var container_obj = id_or_obj

			var return_container_obj = {}
			var container_property = {}

			container_property.page_arr = {}
			
			container_property.container = container_obj
			container_property.container_id = CONTAINER_ID

			container_property.add_page = __add_page
			container_property.go_to_page = __go_to_page
			container_property.page_back = __page_back

			return_container_obj[CONTAINER_ID] = container_property

			CONTAINER_ID++
			
			//监听resize
			__resize_listen()
			
			return container_property
		}


		function __resize_listen()
		{
			window.addEventListener('resize', function()
			{
				if(__is_function(LAST_PAGE_OBJ.page_options.window_change))
				{
					LAST_PAGE_OBJ.page_options.window_change.call(LAST_PAGE_OBJ)
				}

			}, false)
		}

		function __add_page( page_id , options)
		{
			var controller = this

			if(!__is_empty(options))
			{
				var options = options || {}
			
				options.dom_not_cache = options.dom_not_cache || false
				options.ignore_exist  = options.ignore_exist  || false

				this.page_arr[page_id] = options

				
				if(!__is_empty(options.route) && USE_ROUTING)
				{
					ROUTING_OBJ.add_route(options.route , function(params , state)
					{
						if(this.is_backward)
						{
							controller.page_back()
						}
						else
						{
							controller.go_to_page( page_id , params , state)
						}
					})
				}
			}
		}
		
		function __page_back()
		{
			if(PAGE_IS_TRANSIT) return
			
			//没有历史记录的时候
			if(PAGE_OBJ_HISTORY.length <= 1 )
			{
				return false
			}

			var current_page_obj = PAGE_OBJ_HISTORY.pop()
			var backto_page_obj = PAGE_OBJ_HISTORY[PAGE_OBJ_HISTORY.length - 1]
			
			var check_page_identify = backto_page_obj.page_identify
			var check_page_dom_exist = document.getElementById(check_page_identify)
			
			
			if(!check_page_dom_exist)
			{
				backto_page_obj = __create_page(this,backto_page_obj.page_id,backto_page_obj.params)
			}

			__start_page_transition(current_page_obj , backto_page_obj , true)
		}

		function __go_to_page( page_id , params , state , transition )
		{
			if(PAGE_IS_TRANSIT) return
			
			var params = params || false
			var state = state || {}
			var transition = transition || false
			

			//页面唯一标识
			if(!__is_empty(params))
			{
				var params_join_string = params.join("-")
				var page_identify = page_id + "-" + params_join_string
			}
			else
			{
				var page_identify = page_id
			}

			var page_options = this.page_arr[page_id]
			
			var exist_page = document.getElementById(page_identify)
			
			
			if(exist_page && page_options.ignore_exist==false)
			{
				var page_obj = {}
			
				page_obj.page_element = exist_page
				page_obj.page_options = page_options
				page_obj.page_id = page_id
				page_obj.page_identify = page_identify
				page_obj.params = params
				page_obj.state = state
			}
			else
			{
				var page_obj = __create_page(this,page_id,params,state)
			}

			__start_page_transition(LAST_PAGE_OBJ , page_obj , false)

			
			PAGE_OBJ_HISTORY.push(page_obj)

			//console.log(PAGE_OBJ_HISTORY)
		}

		function __create_page(page_controller,page_id,params,state)
		{
			var page_element = document.createElement('div')
			page_element.style.cssText = 'width:100%;height:100%;display:none'
			

			//页面唯一标识
			if(!__is_empty(params))
			{
				var params_join_string = params.join("-")
				var page_identify = page_id + "-" + params_join_string
			}
			else
			{
				var page_identify = page_id
			}
			
			page_element.id = page_identify
			
			//append到容器
			page_controller.container.appendChild(page_element)
			

			var page_obj = {}
			
			page_obj.page_element = page_element
			page_obj.page_options = page_controller.page_arr[page_id]
			page_obj.page_id = page_id
			page_obj.page_identify = page_identify
			page_obj.params = params
			page_obj.state = state
			
			//initialize trriger
			if(__is_function(page_obj.page_options.initialize))
			{
				page_obj.page_options.initialize.call(page_obj,params,state)
			}
			
			//page_init trriger
			if(__is_function(page_obj.page_options.page_init))
			{
				page_obj.page_options.page_init.call(page_obj,params,state)
			}

			return page_obj
		}
		
		//开始页面转场
		function __start_page_transition(from_page_obj , to_page_obj , is_back)
		{
			var to_page_keyframe,from_page_keyframe,animation_timing_function,animation_duration
			
			if(is_back)
			{
				var transition_type = from_page_obj.page_options.transition_type
			}
			else
			{
				var transition_type = to_page_obj.page_options.transition_type
			}
			
			//针对用body滚动的SPA，转场动画只能none
			transition_type = "none"	
			
			switch(transition_type)
			{
				case "slide" :
					
					if(!is_back)
					{
						to_page_keyframe = 'slideinfromright'
						from_page_keyframe = 'slideoutfromleft'
					}
					else
					{
						to_page_keyframe = 'slideinfromleft'
						from_page_keyframe = 'slideoutfromright'
					}

					animation_timing_function = __EASE_TIMINGFUNCTION
					animation_duration = __SLIDE_TRANSITION_TIME

					break
				case "slide_reverse" :
					
					if(!is_back)
					{
						to_page_keyframe = 'slideinfromleft'
						from_page_keyframe = 'slideoutfromright'
					}
					else
					{
						to_page_keyframe = 'slideinfromleft'
						from_page_keyframe = 'slideoutfromright'
					}

					animation_timing_function = __EASE_TIMINGFUNCTION
					animation_duration = __SLIDE_TRANSITION_TIME

					break;
				case "slideup" :
					
					if(!is_back)
					{
						to_page_keyframe = 'slideupinfrombottom'
						from_page_keyframe = 'slideupoutfromtop'
					}
					else
					{
						to_page_keyframe = 'slideupinfromtop'
						from_page_keyframe = 'slideupoutfrombottom'
					}

					animation_timing_function = __EASE_TIMINGFUNCTION
					animation_duration = __SLIDEUP_TRANSITION_TIME

					break
				case "fade" :
					
					to_page_keyframe = 'fadein'
					from_page_keyframe = 'fadeout'

					animation_timing_function = __EASE_TIMINGFUNCTION
					animation_duration = __FADE_TRANSITION_TIME

					break
				
				default :

					to_page_keyframe = 'none'
					from_page_keyframe = 'none'
					
					animation_timing_function = __EASE_TIMINGFUNCTION
					animation_duration = '10ms';
					break
			}
			
			//正在转场
			PAGE_IS_TRANSIT = true

			if(to_page_keyframe)
			{
				//page_before_show trriger
				if(__is_function(to_page_obj.page_options.page_before_show))
				{
					to_page_obj.page_options.page_before_show.call(to_page_obj)
				}


				var to_page = to_page_obj.page_element
				
				
				setTimeout(function()
				{
					to_page.style.top = '0px'
				},10)

				//进场页面
				to_page.style.webkitAnimationDuration = animation_duration
				to_page.style.webkitAnimationTimingFunction = animation_timing_function
				to_page.style.display = ''
				to_page.style.webkitAnimationName = to_page_keyframe
				

				//退场页面
				if(from_page_obj)
				{
					var from_page = from_page_obj.page_element

					from_page.style.webkitAnimationDuration = animation_duration
					from_page.style.webkitAnimationTimingFunction = animation_timing_function
					from_page.style.webkitAnimationName = from_page_keyframe
				}
				
				
				setTimeout(function()
				{
					PAGE_IS_TRANSIT = false
					
					
					//page_before_show trriger
					if(__is_function(to_page_obj.page_options.page_show))
					{
						to_page_obj.page_options.page_show.call(to_page_obj)
					}

					if(from_page_obj)
					{
						from_page.style.display = "none"
						
						//page_hide trriger
						if( __is_function(from_page_obj.page_options.page_hide) )
						{
							from_page_obj.page_options.page_hide.call(from_page_obj)
						}
						
						//移除页面
						if(from_page_obj.page_options.dom_not_cache==true && is_back)
						{
							from_page.parentNode && from_page.parentNode.removeChild(from_page)
						}
					}

					LAST_PAGE_OBJ = to_page_obj
					
				},parseInt(animation_duration))
			}
		}
		
		
		function __keys(obj) 
		{
			var keys = []
			for (var key in obj) if (__has_key(obj, key)) keys.push(key)
			return keys
		}

		function __has_key(obj, key) 
		{
			return hasOwnProperty.call(obj, key)
		}

		function __is_array(obj) 
		{
			return toString.call(obj) == '[object Array]'
		}

		function __is_string(obj) 
		{
			return toString.call(obj) == '[object String]'
		}

		function __is_function(obj) 
		{
			return typeof obj === 'function'
		}
		
		function __is_empty(obj)
		{
			if (obj == null) return true
			if (__is_array(obj) || __is_string(obj)) return obj.length === 0
			for (var key in obj) if (__has_key(obj, key)) return false
			return true
		}

		function __getElementsByClassName(searchClass, node,tag) 
		{
			if(document.getElementsByClassName)
			{
				var nodes =  (node || document).getElementsByClassName(searchClass),result = [];
				for(var i=0 ;node = nodes[i++];)
				{
					if(tag !== "*" && node.tagName === tag.toUpperCase())
					{
						result.push(node)
					}
				}
				
				return result
			}
			else
			{
				node = node || document;
				tag = tag || "*";
				var classes = searchClass.split(" "),
				elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),
				patterns = [],
				current,
				match;
				var i = classes.length;
				while(--i >= 0)
				{
					patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
				}
				var j = elements.length;

				while(--j >= 0)
				{
					current = elements[j];
					match = false;
					for(var k=0, kl=patterns.length; k<kl; k++)
					{
						match = patterns[k].test(current.className);
						if (!match)  break;
					}
					if (match)  result.push(current);
				}
			
				return result;
			}
		}
		
	})(Going)

	
	return Going
})