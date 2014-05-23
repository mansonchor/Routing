define(function(require, exports)
{
	var Going = require('Going')

	var page_controler = Going.mount_container('page_container')
	

	page_controler.add_page('index',{ 
		transition_type : "slide",
		initialize : function()
		{
			this.page_element.style.background = 'red'
		},
		page_init : function(params , state)
		{
			console.log(params,state)
		},
		page_before_show : function()
		{
			//alert('page_before_show')
		},
		page_show : function()
		{
			//alert('page_show')
		},
		window_change : function()
		{
			//alert('window_change ')	
		}
	})


	page_controler.add_page('last',{ 
		transition_type : "slide",
		dom_not_cache : true,
		ignore_exist : true,
		initialize : function()
		{

			this.page_element.style.background = 'yellow'
		},
		page_init : function(params , state)
		{
			console.log(params,state)
		},
		window_change : function()
		{
			//alert('window_change 22222222222222')	
		}
	})



	page_controler.go_to_page('index')
	
	setTimeout(function(){
		page_controler.go_to_page('last',[998])
	},500)


	setTimeout(function(){
		page_controler.go_to_page('index')
	},1000)

	setTimeout(function(){
		page_controler.go_to_page('last',[998,2424],{ sss: 111 })
	},1500)
	

	setTimeout(function(){
		page_controler.page_back()
	},10000)

	
})