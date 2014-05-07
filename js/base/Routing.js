define("base/Routing",[],function(require, exports)
{
	var Routing = {}

	;(function(){
		
		var _routes_config_obj = {}

		Routing.initialize = function(options)
		{
			var options = options || {}
			var routes = options.routes || {}

			_routes_config_obj = routes
		}

		Routing.route_start = function(routes)
		{
			window.onhashchange = __hashchange_action
		}
		
		function __hashchange_action()
		{
			alert(window.location.hash)
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