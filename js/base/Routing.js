define("base/Routing",[],function(require, exports)
{
	var Routing = {}

	;(function(){
		
		var _routes_config_obj = {},not_hit,started = false,_curent_trigger = true

		Routing.initialize = function(options)
		{
			var options = options || {}
			var routes = options.routes || {}
			not_hit = options.not_hit || false
			
			//添加初始化路由
			__add_routes(routes)
		}

		Routing.route_start = function(routes)
		{
			started = true
			window.onhashchange = __hashchange_action
		}
		
		Routing.route_stop = function()
		{
			started = false
			window.onhashchange = null
		}
		
		//程序路由
		Routing.navigate = function(path , options)
		{
			if (!started) return false
			
			var options = options || {}
			var replace = options.replace || false
			_curent_trigger = (options.trigger==null) ? true : options.trigger

			if(replace)
			{
				window.location.replace('#' + path)
			}
			else
			{
				window.location.hash = '#' + path
			}
		}


		function __hashchange_action()
		{
			var now_hash = window.location.hash
			var use_hash = now_hash.replace('#','')

			__judge_hash_hit(use_hash)
		}

		//把路由匹配规则先转换成正则字符串，方便之后作路由匹配
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

			
			//console.log(reg_str)
			
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
			
			//console.log(reg_str)

			return { route_reg : reg_str , route : route , params_count : params_count }
		}
		
		
		//判断路由配置是否有命中
		function __judge_hash_hit(use_hash)
		{
			var routes_reg_arr = __keys(_routes_config_obj)
			var routes_reg_arr_length = routes_reg_arr.length
			
			var the_hit = false			//本次命中标识

			for( var i = 0 ; i < routes_reg_arr_length ; i++ )
			{
				var route_reg_str = routes_reg_arr[i]

				var route_re = new RegExp(route_reg_str)
				
				var match_ret = use_hash.match(route_re)
				
				//命中
				if(match_ret != null)
				{
					the_hit = true

					var route_data = _routes_config_obj[route_reg_str]

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
			//console.log(_curent_trigger)

			if(_curent_trigger)		//手动执行navigate时是否设置 trigger : false
			{
				var params_count = route_data.params_count
				var callback = route_data.callback
				
				//组织匹配到的参数
				var params = []
				for(var i =1 ; i <= params_count ; i++)
				{
					if(match_ret[i]) params.push(match_ret[i])
				}

				if(__is_function(callback))
				{
					callback.call(route_data , params)
				}
			}

			_curent_trigger = true
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
		
		function __is_function(obj) 
		{
			return typeof obj === 'function'
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

			console.log(_routes_config_obj)
		}
		
	})(Routing)

	
	return Routing
})