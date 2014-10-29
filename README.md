Routing
=======

轻量简单的移动端SPA路由控制组件


带有route功能组件的框架很多，如 backbone.js、angular.js

但是它们都附带有自己的Controller甚至View模块，很多时候我们只想用到route，而希望通过其它更新更好的MV框架做扩展

Routing旨在把前端路由功能抽象出来，独立作为一个模块，方便与其它模块配合使用，创建扩展性强的SPA

V0.6版本只兼容支持hashchange事件的浏览器，暂没有pushstate增强功能

------

##主要API说明：

Routing.initialize(options)

@**return** {null} 

@**param** {json} options

>{json}  **routes** ： 初始化建立的路由规则

```javascript
options.routes = {
    'index' : function()
    {
        //首页
    },
    'last/:art_id' : function(params , state)
    {
        //详情页
        console.log(params)     //art_id
    }
}
```

>{routing obj}  **routing_obj** ： (use_routing为true时生效)绑定的Routing实例，绑定后可自动映射路由和页面的关系

>{bool}  **listen_scroll** ： 是否监听页面滚动（若为true，可在后续每次页面滚动时触发page的window_scroll事件）
