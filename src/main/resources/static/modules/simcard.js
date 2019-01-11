define(['layui', 'text!../../pages/simcard.html'], function (layui, simcard) {
    var form = layui.form;

    var obj = {
        template: simcard,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                codeList:[],
                ajax_url:'',
                cityList:[],
                countyList:[],
                mealList:[],
                discountList:[],
                channel_name:'',
                subTime:'',
                subTimeE:'',
                createTime:'',
                createTimeE:'',
                channel_type:'',
                orderOtherPeople:'',
                orderOtherPhone:'',
                typeList:[],
                city:'',
                county:'',
                mealName:'',
                mealId:'',
                discount:'',
                state:'',
                stateList:[]
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            layui.use('laydate', function() {
                var laydate = layui.laydate;
                //日期时间选择器
                laydate.render({
                    elem: '#subTime'
                    ,type: 'datetime'
                    ,done: function(value){
                        _this.subTime = value;
                    }
                });
                //日期时间选择器
                laydate.render({
                    elem: '#subTimeE'
                    ,type: 'datetime'
                    ,done: function(value){
                        _this.subTimeE = value;
                    }
                });
                //日期时间选择器
                laydate.render({
                    elem: '#createTime'
                    ,type: 'datetime'
                    ,done: function(value){
                        _this.createTime = value;
                    }
                });
                //日期时间选择器
                laydate.render({
                    elem: '#createTimeE'
                    ,type: 'datetime'
                    ,done: function(value){
                        _this.createTimeE = value;
                    }
                });
            })
            form.on("checkbox(check)",function(data){
                if(data.elem.checked){
                    _this.checkList.push(data.value);
                }else{
                    _this.checkList=_this.checkList.filter(function(v){
                        return v!=data.value;
                    })
                };
            });
            this.getPage();
        },
        updated:function(){
            form.render();
        },
        methods: {
            searchOrder:function () {

            },
            orderExport:function () {
                var _this=this;
                var datas = {city:_this.city,
                    county:_this.county,
                    channelName:_this.channel_name,
                    channelType:_this.channel_type,
                    orderMeal:_this.mealId,
                    orderDiscount:_this.discount,
                    orderState:_this.state,
                    subTime:_this.subTime,
                    subTimeE:_this.subTimeE,
                    createTime:_this.createTime,
                    createTimeE:_this.createTimeE,
                    orderOtherPeople:_this.orderOtherPeople,
                    orderOtherPhone:_this.orderOtherPhone,
                    curr:_this.curr,
                    limit:_this.limit}
                $.ajax({
                    url: _this.ajax_url+'/orderExport',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    contentType: false,
                    processData: false,
                    success: function () {
                        layer.msg('导出成功！',{icon:1});
                    }
                })
            },
            getPage: function () {
                var laypage = layui.laypage;
                var _this = this;
                var datas = {city:_this.city,
                    county:_this.county,
                    channelName:_this.channel_name,
                    channelType:_this.channel_type,
                    orderMeal:_this.mealId,
                    orderDiscount:_this.discount,
                    orderState:_this.state,
                    subTime:_this.subTime,
                    subTimeE:_this.subTimeE,
                    createTime:_this.createTime,
                    createTimeE:_this.createTimeE,
                    orderOtherPeople:_this.orderOtherPeople,
                    orderOtherPhone:_this.orderOtherPhone,
                    curr:_this.curr,
                    limit:_this.limit}
                $.ajax({
                    url: _this.ajax_url+'/simCard',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    beforeSend: function(){
                        _this.load = true;
                    },
                    success: function (result) {
                        _this.load = false;
                        _this.codeList=result.resBody.order;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        _this.cityList=result.resBody.city;
                        _this.countyList=result.resBody.county;
                        _this.typeList=result.resBody.channelType;
                        _this.stateList=result.resBody.orderState;
                        _this.mealList=result.resBody.meal;
                        _this.discountList=result.resBody.discount;
                        form.on('select(city)',function(data){
                            _this.city=data.value;
                            _this.getPage();
                        })
                        form.on('select(county)',function(data){
                            _this.county=data.value;
                            _this.getPage();
                        })
                        form.on('select(channel_type)',function(data){
                            _this.channel_type=data.value;
                            _this.getPage();
                        })
                        form.on('select(mealId)',function(data){
                            _this.mealId=data.value;
                            _this.getPage();
                        })
                        form.on('select(mealName)',function(data){
                            _this.mealId =data.value;
                            _this.getPage();
                        })
                        form.on('select(discount)',function(data){
                            _this.discount =data.value;
                            _this.getPage();
                        })
                        form.on('select(state)',function(data){
                            _this.state =data.value;
                            _this.getPage();
                        })
                        laypage.render({
                            elem: 'page'
                            , count: _this.totalCount
                            , theme: '#1E9FFF'
                            , limit: _this.limit
                            , curr: _this.curr
                            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
                            , limits: [20, 50, 100]
                            , jump: function (obj, first) {
                                if (!first) {
                                    $.ajax({
                                        url: _this.ajax_url+'/simCard',
                                        type: 'post',
                                        data:JSON.stringify({city:obj.city,
                                            county:_this.county,
                                            channelName:_this.channel_name,
                                            channelType:_this.channel_type,
                                            orderMeal:_this.mealId,
                                            orderDiscount:_this.discount,
                                            orderState:_this.state,
                                            subTime:_this.subTime,
                                            subTimeE:_this.subTimeE,
                                            createTime:_this.createTime,
                                            createTimeE:_this.createTimeE,
                                            orderOtherPeople:_this.orderOtherPeople,
                                            orderOtherPhone:_this.orderOtherPhone,
                                            curr:obj.curr,
                                            limit:obj.limit}),
                                        headers : {
                                            'Content-Type' : 'application/json;charset=utf-8'
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.codeList=result.resBody.order;
                                        }
                                    })
                                }
                            }
                        });
                    },
                    error: function (e) {
                        console.log(laypage)
                        console.log(e)
                    }
                })
            },
        }
    }
    return {
        simcard: obj
    }
});