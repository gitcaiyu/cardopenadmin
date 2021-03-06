requirejs.config({  //模块指定（定义）别名
    paths: {
        text: 'text',
        jquery: 'jquery.min',
        vue: '../lib/vue/vue.min',
        layui: '../lib/layui/layui.all',
        router: '../lib/vue/vue-router',
        channel: '../../modules/channel',
        simcard:'../../modules/simcard',
        mealunify:'../../modules/mealunify',
        mealIndividualization:'../../modules/mealIndividualization',
        discountUnify:'../../modules/discountUnify',
        discountIndividualization:'../../modules/discountIndividualization',
        userManage:'../../modules/userManage',
        roleManage:'../../modules/roleManage',
        orderTotal:'../../modules/orderTotal',
        simCount:'../../modules/simCount'
    },
    shim: {
        'layui': {
            deps: ['jquery'],
            exports: "layui"
        }

    }
})

var arrList = ['text', 'jquery', 'vue', 'router', 'layui', 'channel','simcard','mealunify','mealIndividualization','discountUnify','discountIndividualization','userManage','roleManage','orderTotal','simCount'];
require(arrList, function (text, $, Vue, router, layui, channel,simcard,mealunify,mealIndividualization,discountUnify,discountIndividualization,userManage,roleManage,orderTotal,simCount) {   //引入定义的模块
    Vue.use(router)
    var router = new router({
        routes: [
            {
                path: '/channel',
                component: channel.channel
            },
            {
                path: '/simcard',
                component: simcard.simcard
            },
            {
                path:'/mealunify',
                component: mealunify.mealunify
            },
            {
                path:'/mealIndividualization',
                component: mealIndividualization.mealIndividualization
            },
            {
                path:'/discountUnify',
                component: discountUnify.discountUnify
            },
            {
                path:'/discountIndividualization',
                component:discountIndividualization.discountIndividualization
            },
            {
                path:'/userManage',
                component:userManage.userManage
            },
            {
                path:'/roleManage',
                component:roleManage.roleManage
            },
            {
                path:'/orderTotal',
                component:orderTotal.orderTotal
            },
            {
                path:'/simCount',
                component:simCount.simCount
            }
        ]
    })

    new Vue({
        el: '#app',
        router: router,
        data: {
            userName: '',
            i: 0,
            flag: true,
            outWidth: 0,
            innerWidth: 0,
            totalWidth: 0,
            navList: [],
            pagePanle: [
                {
                    id: 0,
                    name: '',
                    url: '#/home',
                    isActive: true
                }
            ],
            isDot:true,
            isDotNum:0,
            ajax_url:window.location.protocol + "//" + window.location.host + '/cardopenadmin'
        },
        mounted: function () {
            var _this = this;
            $(function () {
                $('.glxl').on('click',function(){
                    var url = $(this).find('a').attr('href').split('#')[1]
                    var obj = {};
                    obj.url = $(this).find('a').attr('href');
                    obj.isActive = true;    //单独此元素设置为true
                    var arr = [];
                    _this.pagePanle.forEach(function (v, i) {
                        v.isActive = false;     //全部设置为否
                        if (url == v.url.split('#')[1]) {
                            v.isActive = true;
                        }
                        arr.push(v.name)
                    })
                    if (arr.indexOf(obj.name) == -1) {
                        obj.id = ++_this.i;
                        _this.pagePanle.push(obj);
                        _this.$nextTick(function () {
                            _this.innerWidth = $('#pagetabs .tabs ul').width()
                            _this.checkIsOverflow(_this.innerWidth)
                        });
                    }
                })
                $(".head-left li").hover(function () {
                    $(this).find("span").toggleClass("up")
                    $(this).find("dl").toggle();
                })
                $(".left-nav").on("click", "li p", function () {
                    $(this).siblings().toggle()
                    $(this).find("span").toggleClass("up")
                })
                $(".left-nav").on("click", "dd", function () {
                    var url = $(this).find('a').attr('href').split('#')[1]
                    $(this).addClass("active").siblings().removeClass("active")
                    $(this).parent().parent().siblings().find("dd").removeClass("active")
                    var obj = {};
                    obj.name = $(this).find('a').html();
                    obj.url = $(this).find('a').attr('href');
                    obj.isActive = true;    //单独此元素设置为true
                    var arr = [];
                    _this.pagePanle.forEach(function (v, i) {
                        v.isActive = false;     //全部设置为否
                        if (url == v.url.split('#')[1]) {
                            v.isActive = true;
                        }
                        arr.push(v.name)
                    })
                    if (arr.indexOf(obj.name) == -1) {
                        obj.id = ++_this.i;
                        _this.pagePanle.push(obj);
                        _this.$nextTick(function () {
                            _this.innerWidth = $('#pagetabs .tabs ul').width()
                            _this.checkIsOverflow(_this.innerWidth)
                        });
                    }
                })
                $('.p-left').on('click', function () {
                    $('#pagetabs .tabs ul').css('left', 0 + 'px')
                })
                $('.p-right').on('click', function () {
                    $('#pagetabs .tabs ul').css('left', -_this.totalWidth + 'px')
                })
                $('.p-down .alltab').on('click', function () {
                    $('#pagetabs .tabs ul li').first().show().siblings().hide();
                    _this.pagePanle = [
                        {
                            id: 0,
                            name: '',
                            url: '#/home',
                            isActive: true
                        }
                    ]
                    location.href = '#/home'
                    $('#pagetabs .tabs ul').css('left','0px')
                })
                $('.p-down .othertab').on('click', function () {
                    var url = $('#pagetabs .tabs ul li.active').find('a').attr('href').split('#')[1];
                    var tmp = [
                        {
                            id: 0,
                            name: '',
                            url: '#/home',
                            isActive: false
                        }
                    ]
                    _this.pagePanle.forEach(function(item,index){
                        if(item.url.split('#')[1] == url){
                            if(_this.pagePanle[0].name == item.name){
                                return false;
                            }else{
                                item.isActive = true;
                                tmp.push(item)
                            }
                        }
                    })
                    _this.pagePanle = tmp;
                })
                var flag = true;
                $('#LAY_app_flexible').on('click', function () {

                    if (flag) {
                        $('.tg01').hide()
                        $('.tg02').show()
                        $('#left').animate({ 'width': '44px' }, 300)
                        $('.logo').animate({ 'width': '44px' }, 300)
                        $('#top').animate({ 'left': '44px' }, 300)
                        $('#pagetabs').animate({ 'left': '44px' }, 300)
                        $('#main').animate({ 'left': '44px' }, 300)
                        $('.left-nav li span').hide()
                        $('.left-nav li dd').hide()
                        $('.left-nav li').css('height', '55px')
                        flag = false
                    } else {
                        $('.tg01').show()
                        $('.tg02').hide()
                        $('#left').animate({ 'width': '200px' }, 300, function () {
                            $('.left-nav li span').show()
                            $('.left-nav li dd').show()
                        })
                        $('.logo').animate({ 'width': '200px' }, 300)
                        $('#top').animate({ 'left': '200px' }, 300)
                        $('#pagetabs').animate({ 'left': '200px' }, 300)
                        $('#main').animate({ 'left': '200px' }, 300)
                        $('.left-nav li').css('height', 'auto')
                        flag = true;
                    }
                })
                $.ajax({
                    url: window.location.protocol + "//" + window.location.host + '/cardopenadmin/menu',
                    type: 'post',
                    async: false,
                    success: function (result) {
                        _this.userName = result.resBody.userName
                        _this.navList = result.resBody.menu.menuList;
                    }
                })
                $(window).resize(function () {
                    var outWidth = $('#pagetabs .tabs').width()
                    _this.outWidth = outWidth
                }).trigger('resize')

            })
        },
        updated: function () {
            $('.left-nav li').each(function () {
                var k = $(this).index();
                $(this).find('p i').addClass('layui-icon-' + k);
            })
        },
        methods: {
            logout:function() {
                $.ajax({
                    url: window.location.protocol + "//" + window.location.host + '/cardopenadmin/userLogout',
                    type: 'post',
                    async: false,
                    success: function (result) {
                        window.location.href="/cardopenadmin/login"
                    }
                })
            },
            liClick: function(item){
                var _this = this;
                _this.pagePanle.forEach(function(i,v){
                    i.isActive = false;
                })
                item.isActive = true;
            },
            remove: function (item) {
                if (item.id == 0) {
                    return false;
                }
                var _this = this;
                _this.pagePanle.splice($.inArray(item, _this.pagePanle), 1)
                var changeObj = _this.pagePanle[0]
                location.href = changeObj.url;
            },
            checkIsOverflow: function (paramWidth) {
                var _this = this;
                if (paramWidth >= _this.outWidth) {
                    if (_this.flag) {
                        _this.totalWidth = $('#pagetabs .tabs ul li').last().outerWidth();
                        _this.flag = false;

                    } else {
                        _this.totalWidth += $('#pagetabs .tabs ul li').last().outerWidth();
                    }

                    $('#pagetabs .tabs ul').css('left', -_this.totalWidth + 'px')
                } else {
                    _this.totalWidth = 0;
                    $('#pagetabs .tabs ul').css('left', 0 + 'px')
                }

            },

        }
    })
    layui.use(['element'], function () {
        var element = layui.element;
    });
})
