define(function(require, exports)
{
	var Going = require('Going')

	var page_controler = Going.mount_container('page_container')

	console.log(page_controler)
	

	page_controler.add_page('index',{ 
		transition_type : "slide",
		dom_not_cache : false,
		initialize : function(page_obj)
		{
			page_obj.style.background = 'red'
		},
		page_init : function()
		{
			alert('safsaf')
		}
	})


	page_controler.add_page('last',{ 
		transition_type : "slide",
		dom_not_cache : false,
		initialize : function(page_obj)
		{
			page_obj.style.background = 'yellow'
		},
		page_init : function()
		{
			alert('safsaf')
		}
	})



	page_controler.go_to_page('index')
	
	setTimeout(function(){
		page_controler.go_to_page('last')
	},500)
	
})