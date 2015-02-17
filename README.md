
Routing
=======

轻量简单的移动端SPA路由控制组件


带有route功能组件的框架很多，如 backbone.js、angular.js

但是它们都附带有自己的Controller甚至View模块，很多时候我们只想用到route，而希望通过其它更新更好的MV框架做扩展

Routing旨在把前端路由功能抽象出来，独立作为一个模块，方便与其它模块配合使用，创建扩展性强的SPA

V0.6版本只兼容支持hashchange事件的浏览器，暂没有pushstate增强功能



##主要API说明：

###Routing.initialize([options])

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

>{function}  **not_hit** ： 如果定义了该函数，当路由变化但是没有规则可匹配到时触发

>{string}  **default_route** ： 默认路由地址，在Routing.route_start()的时候路由到该地址

>{function}  **before_route** ： 如果定义了该函数，在路由发生变化前触发

>{function}  **after_route** ： 如果定义了该函数，在路由发生变化后触发


###Routing.add_route(route , callback)

添加一条路由规则

@**return** {null} 

@**param** {string} route   路由规则

@**param** {function} callback   命中时的回调


###Routing.navigate(route_path , [options] , [state])

路由到指定地址

@**return** {null} 

@**param** {string} route_path   指定地址

```javascript
Routing.navigate('last/12345')      // (url#last/12345)
```

@**param** {json} options

>{bool}  **replace** ： 是否用当次路由记录 替换掉上一次的历史，默认false

>{bool}  **trigger** ： 是否触发路由规则的回调函数，默认true

@**param** {json} state

页面切换之间时进行的无状态传参


###Routing.go_back()

浏览器历史页面的返回

###Routing.route_start()

开始监听hashchange事件

###Routing.route_stop()

停止监听hashchange事件

###Routing.recheck()

手动check当前hash的命中情况，假如命中会触发对应路由规则的回调函数
