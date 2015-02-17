;(function (global) {

	var routing = global.routing = {},_routes_config_obj = {}

	routing.initialize = function(options)
	{
		var options = options || {}
		var routes = options.routes || {}
		not_hit = options.not_hit || false
		_default_route = options.default_route || false
		_before_route = options.before_route || false
		_after_route = options.after_route || false
		
		//添加初始化路由
		__add_routes(routes)
	}

	routing.route_start = function()
	{
		document.documentElement.addEventListener( 'click', function(e) 
		{
			var target = e.target;

			while(target && target.tagName.toLowerCase()!="body"){

				if( target.tagName.toLowerCase() === 'a' ) {
					var href = target.getAttribute('href')
					var usePagelet = target.getAttribute('data-pagelets')

					if( href && usePagelet ){
						e.preventDefault()
	          			e.stopPropagation()

						state = {
							href : href,
							url: global.location.href,
							title: document.title
				        }
						routing.navigate(href, state)
					}

					break;
				}

				target = target.parentNode
			}
		})

		//浏览器前进后退按钮
		window.addEventListener('popstate',function(e){
			var state = e.state
			if(!state) return 
				
			var path = state.href
			__judge_hash_hit(path, state, true)
		})
	}

	routing.route_stop = function()
	{
		
	}

	routing.recheck = function(){
		var href = location.pathname

		__judge_hash_hit(href, {}, false)
	}

	routing.add_route = function(route,callback)
	{
		var new_route_obj = {}

		new_route_obj[route] = callback

		__add_routes(new_route_obj)
	}

	routing.navigate = function(path, state, options)
	{
		var options = options || {}
		var replace = options.replace || false

		__judge_hash_hit(path, state, false)

		if(replace){
			history.replaceState(state,null,path)
		}else{
			history.pushState(state,null,path)
		}
	}

	//判断路由配置是否有命中
	function __judge_hash_hit(path, state, is_backward)
	{
		var routes_reg_arr = __keys(_routes_config_obj)
		var routes_reg_arr_length = routes_reg_arr.length
		
		var the_hit = false			//本次命中标识

		for( var i = 0 ; i < routes_reg_arr_length ; i++ )
		{
			var route_reg_str = routes_reg_arr[i]

			var route_re = new RegExp(route_reg_str)
			
			var match_ret = path.match(route_re)
			
			//命中
			if(match_ret != null)
			{
				the_hit = true

				var route_data = _routes_config_obj[route_reg_str]
				route_data.is_backward = is_backward
				route_data.path = path
				route_data.state = state

				__trigger_route_callback(route_data, match_ret)
			}
		}

		if(!the_hit && __is_function(not_hit))
		{
			not_hit.call(window)
		}
	}


	//触发路由回调函数
	function __trigger_route_callback(route_data, match_ret)
	{
		if(__is_function(_before_route))
		{
			_before_route.call(this)
		}

		var params_count = route_data.params_count
		var callback = route_data.callback
		
		//组织匹配到的参数
		var params = []
		for(var i =1 ; i <= params_count ; i++)
		{
			if(match_ret[i]) params.push(match_ret[i])
		}
		route_data.params = params
		
		if(__is_function(callback))
		{
			callback.call(route_data)
		}

		if(__is_function(_after_route))
		{
			_after_route.call(this)
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

	
	//批量添加路由
	function __add_routes(routes , callback)
	{
		var key_arr = __keys(routes)

		//数组才循环添加
		if( __is_array(key_arr) )
		{
			for(var i = 0 ; i< key_arr.length ; i++)
			{
				var route = key_arr[i]
				
				//返回的路由处理数据
				var route_data = __replace_route_to_route_reg(route)
				var route_reg = route_data.route_reg

				_routes_config_obj[route_reg] = route_data
				_routes_config_obj[route_reg].callback = routes[route]
			}
		}
	}

	function __replace_route_to_route_reg(route)
	{
		var omission_param_re =	/\(.+\)/g		//省略参数
		var param_re = /:\w+\/?/g		//必传参数

		var params_count = route.split(':').length - 1		//参数个数
		
		var reg_str = route.replace(param_re, function($0)
		{
			var replace_role_str = '{[^\/]+}'

			var have_spilt = $0.indexOf('/') != -1

			if(have_spilt) replace_role_str += '/'
			
			return replace_role_str
		})    
		
		//console.log(reg_str)

		var reg_str = reg_str.replace(omission_param_re, function($1)
		{
			var replace_role_str = $1.replace('(','(?:').replace(')','|)')

			return replace_role_str
		})

		//花括号替换回()
		var re = /{/g
		reg_str = reg_str.replace(re,'(')
		var re = /}/g
		reg_str = reg_str.replace(re,')')
		
		//转义字符构造
		var re = /\//g
		reg_str = reg_str.replace(re,'\\/')
		
		//最后加上结束符
		reg_str += "$"
		
		return { route_reg : reg_str , route : route , params_count : params_count }
	}

})(window);