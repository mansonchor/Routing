Routing
=======

轻量简单的移动端SPA路由控制组件


带有route功能组件的框架很多，如 backbone.js、angular.js

但是它们都附带有自己的MVC或MVVM模块，很多时候我们只想用到route，而希望通过其它更新更好的MV模块做扩展

Routing旨在把前端路由功能抽象出来，独立作为一个模块，方便与其它模块配合使用，创建扩展性强的SPA


------

V0.5版本只兼容支持hashchange事件的浏览器，暂没有pushstate增强功能
