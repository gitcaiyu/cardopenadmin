define(['layui', 'text!../../pages/orderTotal.html'], function (layui, orderTotal) {
    var form = layui.form;

    var obj = {
        template: orderTotal,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                ajax_url: '',
                cityList: [],
                countyList: [],
                mealList: [],
                discountList: [],
                subTime: '',
                subTimeE: '',
                createTime: '',
                createTimeE: '',
                city: '',
                county: '',
                mealName: '',
                mealId: '',
                discount: '',
                state: '',
                stateList: []
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            layui.use('laydate', function () {
                var laydate = layui.laydate;
                //日期时间选择器
                laydate.render({
                    elem: '#subTime'
                    , type: 'datetime'
                    , done: function (value) {
                        _this.subTime = value;
                    }
                });
                //日期时间选择器
                laydate.render({
                    elem: '#subTimeE'
                    , type: 'datetime'
                    , done: function (value) {
                        _this.subTimeE = value;
                    }
                });
                //日期时间选择器
                laydate.render({
                    elem: '#createTime'
                    , type: 'datetime'
                    , done: function (value) {
                        _this.createTime = value;
                    }
                });
                //日期时间选择器
                laydate.render({
                    elem: '#createTimeE'
                    , type: 'datetime'
                    , done: function (value) {
                        _this.createTimeE = value;
                    }
                });
            })
            this.getPage();
        },
        updated: function () {
            form.render();
        },
        methods: {
            getPage: function () {
                var _this = this;
                form.on('select(city)',function(data){
                    _this.city=data.value;
                    _this.getPage();
                })
                form.on('select(county)',function(data){
                    _this.county=data.value;
                    _this.getPage();
                })
                form.on('select(mealName)',function(data){
                    _this.mealId=data.value;
                    _this.getPage();
                })
                form.on('select(mealId)',function(data){
                    _this.mealId=data.value;
                    _this.getPage();
                })
                form.on('select(discount)',function(data){
                    _this.discount=data.value;
                    _this.getPage();
                })
                form.on('select(state)',function(data){
                    _this.state=data.value;
                    _this.getPage();
                })
                layui.use('table', function(){
                    var table = layui.table;
                    table.render({
                        elem: '#data'
                        ,url:_this.ajax_url+'/workCount'
                        ,method:'post'
                        ,where:{city:_this.city,county:_this.county,meal:_this.mealId,discount:_this.discount,state:_this.state,subTime:_this.subTime,subTimeE:_this.subTimeE,createTime:_this.createTime,createTimeE:_this.createTimeE}
                        ,cols: [[
                            {field:'order_id', title: '工单编号', sort: true}
                            ,{field:'sub_time', title: '申请时间',sort: true}
                            ,{field:'city_name', title: '盟市', sort: true}
                            ,{field:'county_name', title: '县区',sort: true}
                            ,{field:'channel_name', title: '渠道名称',sort: true}
                            ,{field:'channel_id', title: '渠道编码', sort: true}
                            ,{field:'order_state',title: '工单状态', sort: true}
                            ,{field:'meal_name', title: '套餐资费',sort: true}
                            ,{field:'meal_code', title: '资费代码', sort: true}
                            ,{field:'discount_name', title: '优惠促销', sort: true}
                            ,{field:'order_count', title: '开卡数量', sort: true}
                        ]]
                        ,page: true
                        ,curr : 1
                        ,limits : [ 20, 50, 100, 1 ]
                        ,limit : 20
                        ,done: function(res){
                            _this.cityList = res.city;
                            _this.countyList = res.county;
                            _this.mealList = res.meal;
                            _this.discountList = res.discount;
                            _this.stateList = res.orderState;
                        }
                    });
                });
            },
            orderExport:function () {
                var _this = this;
                var datas={city:_this.city,county:_this.county,meal:_this.mealId,discount:_this.discount,state:_this.state,subTime:_this.subTime,subTimeE:_this.subTimeE,createTime:_this.createTime,createTimeE:_this.createTimeE}
                $.ajax({
                    url: _this.ajax_url + '/workExport',
                    type: 'post',
                    data: JSON.stringify(datas),
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.resCode == '000000') {
                            layer.msg('导出成功', {icon: 1});
                            _this.getDetail();
                        } else {
                            layer.msg('导出失败', {icon: 7});
                        }
                    }
                })
            }
        }
    }
    return {
        orderTotal: obj
    }
});