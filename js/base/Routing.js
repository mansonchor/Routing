define("base/Routing",[],function(require, exports)
{
	var Routing = {}

	;(function(){
		
		var _routes_config_obj = {}

		Routing.initialize = function(options)
		{
			var options = options || {}
			var routes = options.routes || {}
			
			var key_arr = __keys(routes)
			
			for(var i = 0 ; i< key_arr.length ; i++)
			{
				//alert(key_arr[i])
				__replace_route_to_route_reg(key_arr[i])
			}
			


			//var arr = "last/8155166/from_profile".match(new_re)
			//console.log(arr)

			//_routes_config_obj = routes
		}

		Routing.route_start = function(routes)
		{
			window.onhashchange = __hashchange_action
		}
		

		function __replace_route_to_route_reg(route)
		{
			var re = /:\w+\/?/g
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
			
			console.log(reg_str)
			var new_re = new RegExp(reg_str)
			console.log(new_re)
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

		function __add_route(route , callback)
		{
			_routes_config_obj[route] = callback
		}
		
	})(Routing)

	
	return Routing
})