define(function(require, exports)
{
	var Going = require('Going')
	var Routing = require('Routing')
	
	Routing.initialize({
	
		not_hit : function()
		{
			alert('not_hit')
		},
		default_route : "index"
	})

	


	var page_controler = Going.mount_container('page_container' , { use_routing : true , routing_obj : Routing })
	

	page_controler.add_page('index',{ 
		route : 'index',
		transition_type : "slide",
		initialize : function()
		{
			this.page_element.style.background = 'red'
		},
		page_init : function(params , state)
		{
			console.log(params,state)
		}
	})


	page_controler.add_page('last',{ 
		route : 'last/:art_id',
		transition_type : "slideup",
		dom_not_cache : true,
		ignore_exist : true,
		initialize : function()
		{
			this.page_element.style.background = 'yellow'
		},
		page_init : function(params , state)
		{
			console.log(params,state)
		}
	})

	Routing.route_start()

	setTimeout(function()
	{
		Routing.navigate('last/32324' , false ,{ data : 2232323 })
	},500)

	setTimeout(function()
	{
		Routing.navigate('index' )
	},1000)

	setTimeout(function()
	{
		Routing.navigate('last/453888' , { replace : true } ,{ data : 'index' } )
	},1500)
	

	/*setTimeout(function()
	{
		Routing.go_back()
		
	},1000)
	

	/*setTimeout(function()
	{
		Routing.go_back()
	},2000)*/
	
	
})