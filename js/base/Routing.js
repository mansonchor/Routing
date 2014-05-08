define("base/Routing",[],function(require, exports)
{
	var Routing = {}

	;(function(){
		
		var _routes_config_obj = {}

		Routing.initialize = function(options)
		{
			var options = options || {}
			var routes = options.routes || {}
			
			//添加初始化路由
			__add_routes(routes)
		}

		Routing.route_start = function(routes)
		{
			window.onhashchange = __hashchange_action
		}
		

		//把路由匹配规则先转换成正则字符串，方便之后作路由匹配
		function __replace_route_to_route_reg(route)
		{
			var re = /:\w+\/?/g		//传参规则

			var params_count = route.split(':').length - 1		//参数个数


			var reg_str = route.replace(re, function($0)
			{
				var replace_role_str = '(\\w+)'

				var have_spilt = $0.indexOf('/') != -1

				if(have_spilt) replace_role_str += '/'
				
				return replace_role_str
			})    
			
			var re = /\//g
			reg_str = reg_str.replace(re,'\\/')
			reg_str += "$"
			
			return { route_reg : reg_str , route : route , params_count : params_count }
		}
		

		function __hashchange_action()
		{
			var now_hash = window.location.hash
			var final_hash = now_hash.replace('#','')
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

		function __add_routes(routes , callback)
		{
			var key_arr = __keys(routes)

			//console.log()
			//数组才循环添加
			if( __is_array(key_arr) )
			{
				for(var i = 0 ; i< key_arr.length ; i++)
				{
					var route = key_arr[i]
					
					console.log(route)
					
					var route_data = __replace_route_to_route_reg(route)

					
					_routes_config_obj[route] = route_data
					_routes_config_obj[route].callback = routes[route]
				}
			}

			console.log(_routes_config_obj)

			//_routes_config_obj[route] = callback
		}
		
	})(Routing)

	
	return Routing
})