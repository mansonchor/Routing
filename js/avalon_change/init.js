define(function(require, exports)
{
	var Routing = require('Routing')

	Routing.initialize({
	
		routes : {
			'index' : function()
			{
				alert('index')
			},
			'last/:art_id' : function()
			{
				alert('last')
			}
		}
	})

	Routing.route_start()
})