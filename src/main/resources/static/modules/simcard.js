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
                stateList:[],
                write_data:{
                    cardnum:'',
                    mealName:'',
                    mealId:'',
                    discount:'',
                    edit_data:{
                        cardnum:'',
                        simnum:'',
                        mealName:'',
                        mealId:'',
                        discount:''
                    }
                },
                detailList:[],
                fileNameShow:false,
                filename:'',
                orderId:''
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
            cancel:function(orderId) {
                var _this = this;
                var datas = JSON.stringify({orderState:'5',orderId:orderId})
                $.ajax({
                    url: _this.ajax_url+'/updateState',
                    type: 'post',
                    data:datas,
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.resCode == '000000') {
                            layer.msg('工单已取消',{icon:1});
                            _this.getPage()
                        } else {
                            layer.msg('工单取消失败',{icon:7});
                        }
                    }
                })
            },
            print:function(orderId) {
                var _this = this;
                var datas = JSON.stringify({orderState:'4',orderId:orderId})
                $.ajax({
                    url: _this.ajax_url+'/updateState',
                    type: 'post',
                    data:datas,
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.resCode == '000000') {
                            layer.msg('工单已邮寄',{icon:1});
                            _this.getPage()
                        } else {
                            layer.msg('工单邮寄失败',{icon:7});
                        }
                    }
                })
            },
            edit:function() {
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['500px', '500px'], //宽高
                    content: $('#edit'),
                    title: "新增卡号信息",
                    cancel: function () {
                        $('#edit').hide();
                    },
                    success: function(){
                    }
                });
                form.on('submit(edit)', function (data) {
                    var formData=data.field;
                    $.ajax({
                        url: _this.ajax_url+'/orderDetailAdd',
                        type: 'post',
                        data: JSON.stringify(formData),
                        contentType: false,
                        processData: false,
                        success: function () {
                            _this.getDetail();
                        }
                    })
                    $('#edit').hide();
                    layer.close(index);
                    layer.msg('操作成功');
                    return false
                });
                form.render()
            },
            addFile: function(){
                var _this=this;
                $('#file1').click();
                this.fileNameShow=true;
            },
            fileChange: function(){
                this.filename=$("#file1")[0].files[0].name;
            },
            detailImport:function() {
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['500px', '500px'], //宽高
                    content: $('#detailImport'),
                    title: "导入数据",
                    cancel: function () {
                        $('#detailImport').hide();
                    },
                    success: function(){
                    }
                });
                $("#file1").val('');
                this.filename="";
                form.on('submit(upload)',function(data){
                    var formData = new FormData();
                    if($("#file1").val()==""){
                        layer.msg('请选择导入文件！',{icon:7});
                        return;
                    };
                    formData.append("file", $("#file1")[0].files[0]);
                    $.ajax({
                        url: _this.ajax_url+'/detailBatchImport',
                        type: 'post',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function () {
                            layer.msg('导入成功！',{icon:1});
                            $('#detailImport').hide();
                            layer.close(index);
                            _this.getDetail();
                        }
                    })
                    return false;
                });
                form.render();
            },
            detailExport:function() {
              var _this = this;
                var datas = {cardnum:_this.write_data.cardnum,
                    simnum:_this.write_data.simnum,
                    orderMeal:_this.mealId,
                    orderDiscount:_this.discount,
                    curr:_this.curr,
                    limit:_this.limit}
                $.ajax({
                    url: _this.ajax_url+'/orderDetailExport',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.resCode == '000000') {
                            layer.msg('导出成功',{icon:1});
                        } else {
                            layer.msg('导出失败',{icon:7});
                        }
                    }
                })
            },
            detailDel:function() {
                var _this = this;
                var datas = {detail:_this.checkList}
                $.ajax({
                    url: _this.ajax_url+'/orderDetailDel',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.resCode == '000000') {
                            layer.msg('删除成功',{icon:1});
                            _this.getDetail();
                        } else {
                            layer.msg('删除失败',{icon:7});
                        }
                    }
                })
            },
            checkInit: function(item){
                var _this=this;
                var checkListStr=this.checkList.join(',');
                if(checkListStr.indexOf(item.detail_id)!=-1){
                    return true;
                }else{
                    return false;
                }
            },
            write:function(orderId) {
                var _this = this;
                _this.orderId = orderId
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['1500px', '800px'], //宽高
                    content: $('#writeCard'),
                    cancel: function () {
                        $('#writeCard').hide();
                    }
                });
                _this.getDetail();
            },
            getDetail:function() {
                var _this = this;
                var laypage = layui.laypage;
                var datas = {cardnum:_this.write_data.cardnum,
                    simnum:_this.write_data.simnum,
                    orderMeal:_this.mealId,
                    orderDiscount:_this.discount,
                    curr:_this.curr,
                    limit:_this.limit,
                    orderId:_this.orderId}
                this.checkList=[];
                $.ajax({
                    url: _this.ajax_url+'/orderDetail',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    contentType: false,
                    processData: false,
                    beforeSend: function(){
                        _this.load = true;
                    },
                    success: function (result) {
                        _this.load = false;
                        _this.detailList=result.resBody.detail;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        _this.mealList=result.resBody.meal;
                        _this.discountList=result.resBody.discount;
                        form.on('select(mealId)',function(data){
                            _this.mealId=data.value;
                            _this.getDetail();
                        })
                        form.on('select(mealName)',function(data){
                            _this.mealId =data.value;
                            _this.getDetail();
                        })
                        form.on('select(discount)',function(data){
                            _this.discount =data.value;
                            _this.getDetail();
                        })
                        laypage.render({
                            elem: 'detailPage'
                            , count: _this.totalCount
                            , theme: '#1E9FFF'
                            , limit: _this.limit
                            , curr: _this.curr
                            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
                            , limits: [20, 50, 100]
                            , jump: function (obj, first) {
                                if (!first) {
                                    $.ajax({
                                        url: _this.ajax_url+'/orderDetail',
                                        type: 'post',
                                        data:JSON.stringify({cardnum:_this.write_data.cardnum,
                                            simnum:_this.write_data.simnum,
                                            orderMeal:_this.write_data.mealName,
                                            orderTariff:_this.write_data.mealId,
                                            orderDiscount:_this.write_data.discount,
                                            curr:obj.curr,
                                            limit:obj.limit,
                                            orderId:_this.orderId}),
                                        headers : {
                                            'Content-Type' : 'application/json;charset=utf-8'
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.detailList=result.resBody.detail;
                                        }
                                    })
                                }
                            }
                        });
                    }
                })
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
                    limit:_this.limit,
                    state:_this.state}
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
                                            limit:obj.limit,
                                            state:_this.state}),
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