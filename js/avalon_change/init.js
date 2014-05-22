define(function(require, exports)
{
	var Routing = require('Routing')

	Routing.initialize({
	
		routes : {
			'doorplate_last(/:query)/:user_id' : function(params)
			{
				console.log(this)
				console.log(params)
			},
			'last/:art_id' : function(params)
			{
				console.log(this)
				console.log(params)
			},
			'theme_pic_list/:keyword' : function()
			{
				alert(234324)	
			},
			'init' : function()
			{
				alert('init')	
			}
		},
		not_hit : function()
		{
			alert('not_hit')
		}
	})

	Routing.route_start()

	Routing.add_route('init',function(){
		alert('test add')
	})
})