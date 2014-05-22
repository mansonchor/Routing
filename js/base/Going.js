define("base/Going",[],function(require, exports)
{
	var Going = {}

	;(function(){
		
		var CONTAINER_ID = 1,ZINDEX = 10000,TO_PAGE_OPTIONS,__EASE_TIMINGFUNCTION = 'ease',__SLIDE_TRANSITION_TIME = '400ms',__SLIDEUP_TRANSITION_TIME = '400ms',__FADE_TRANSITION_TIME = '400ms',PAGE_IS_TRANSIT = false,LAST_PAGE_OBJ = false
		

		Going.mount_container = function(id_or_obj)
		{
			if( __is_string(id_or_obj) ) var container_obj = document.getElementById(id_or_obj)
			else if(!__is_empty(id_or_obj)) var container_obj = id_or_obj

			var return_container_obj = {}
			var container_property = {}

			container_property.page_arr = {}
			
			container_property.container = container_obj
			container_property.container_id = CONTAINER_ID

			container_property.add_page = __add_page
			container_property.go_to_page = __go_to_page

			return_container_obj[CONTAINER_ID] = container_property

			CONTAINER_ID++
			
			return container_property
		}

		function __add_page( page_id , options)
		{
			this.page_arr[page_id] = options
		}

		function __go_to_page( page_id , state , transition )
		{
			console.log(PAGE_IS_TRANSIT)
			if(PAGE_IS_TRANSIT) return

			var state = state || {}
			var transition = transition || false
			

			var page_obj = document.createElement('div')
			page_obj.style.cssText = 'width:100%;height:100%; position:absolute;visibility:hidden;top:0px;z-index:'+ZINDEX

			this.container.appendChild(page_obj)
			
			var to_page = page_obj
			TO_PAGE_OPTIONS = this.page_arr[page_id]
			

			__is_function(TO_PAGE_OPTIONS.initialize)
			{
				TO_PAGE_OPTIONS.initialize.call(TO_PAGE_OPTIONS,page_obj)
			}

			var to_page_transition_type = TO_PAGE_OPTIONS.transition_type

			__start_page_transition(LAST_PAGE_OBJ , page_obj , to_page_transition_type , false)
		}
		
		//开始页面转场
		function __start_page_transition(from_page , to_page , transition_type , is_back)
		{
			var to_page_keyframe,from_page_keyframe,animation_timing_function,animation_duration

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
				//var to_page_element = to_page

				//进场页面
				to_page.style.webkitAnimationDuration = animation_duration
				to_page.style.webkitAnimationTimingFunction = animation_timing_function
				to_page.style.visibility = 'visible'
				to_page.style.webkitAnimationName = to_page_keyframe
				

				//退场页面
				if(from_page)
				{
					//var from_page_element = FROM_PAGE_VIEW.el

					from_page.style.webkitAnimationDuration = animation_duration
					from_page.style.webkitAnimationTimingFunction = animation_timing_function
					from_page.style.webkitAnimationName = from_page_keyframe
				}
				
				
				setTimeout(function()
				{
					PAGE_IS_TRANSIT = false
					
					if(from_page)
					{
						from_page.style.top = "-3000px"
					}

					LAST_PAGE_OBJ = to_page
					
				},parseInt(animation_duration))
			}
		}
		

		function __tansition_end_page_dom_control()
		{
			PAGE_IS_TRANSIT = false

			var that = this

			var from_page_element = FROM_PAGE_VIEW && FROM_PAGE_VIEW.el
			var to_page_element = TO_PAGE_VIEW.el
			
			//页面转换动态改变title   add by manson 2013.11.15
			if(TO_PAGE_VIEW.manual_title!=true)
			{
				if(TO_PAGE_VIEW.title)
				{
					document.title = TO_PAGE_VIEW.title
				}
				else
				{
					document.title = DEFAULT_TITLE
				}
			}
				
			if(from_page_element)
			{
				$(from_page_element).css({'top' : "-3000px"});
				
				if( IS_FUNCTION(FROM_PAGE_VIEW.page_hide) )
				{
					FROM_PAGE_VIEW.page_hide.call(that)
				}
				
				//移除页面
				if(FROM_PAGE_VIEW.dom_not_cache==true && IS_BACKWARD)
				{
					FROM_PAGE_VIEW && FROM_PAGE_VIEW.remove()
				}
				
				if(TO_PAGE_VIEW.without_his)
				{
					FROM_PAGE_VIEW && FROM_PAGE_VIEW.remove()
				}
			}
			
			_MOVE = null
			IS_BACKWARD = null
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
		
	})(Going)

	
	return Going
})