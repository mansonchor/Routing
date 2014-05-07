define(function(require, exports)
{
	var Routing = require('Routing')

	Routing.initialize({
	
		routes : {
			'index' : function()
			{
				alert('index')
			},
			'last' : function()
			{
				alert('last')
			}
		}
	})

	Routing.route_start()
})