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
            this.getPage();
        },
        updated:function(){
            form.render();
        },
        methods: {
            template:function() {
                var _this = this;
                window.location.href = _this.ajax_url+'/orderTemplate'
            },
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
                        _this.write_data.edit_data.simnum='';
                        _this.write_data.edit_data.cardnum='';
                        document.getElementById("emealName").options[0].selected = true;
                        document.getElementById("emealId").options[0].selected = true;
                        document.getElementById("ediscount").options[0].selected = true;
                        form.render()
                    }
                });
                form.on('select(emealId)', function (data) {
                    var selMealName = document.getElementById("emealName");
                    if(data.value!='') {
                        for(var i=0; i<selMealName.options.length; i++){
                            if (selMealName.options[i].value == data.value) {
                                selMealName.options[i].selected = true;
                            }
                        }
                    } else {
                        selMealName.options[0].selected = true;
                    }
                    _this.write_data.edit_data.mealId = data.value;
                });
                form.on('select(emealName)', function (data) {
                    var selMealId = document.getElementById("emealId");
                    if(data.value!='') {
                        for (var i = 0; i < selMealId.options.length; i++) {
                            if (selMealId.options[i].innerHTML == data.value) {
                                selMealId.options[i].selected = true;
                            }
                        }
                    } else {
                        selMealId.options[0].selected = true;
                    }
                    _this.write_data.edit_data.mealId = data.value;
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
                    limit:_this.limit,
                    orderId:_this.orderId}
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
                if (datas.detail.length>0) {
                    $.ajax({
                        url: _this.ajax_url + '/orderDetailDel',
                        type: 'post',
                        data: JSON.stringify(datas),
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.resCode == '000000') {
                                layer.msg('删除成功', {icon: 1});
                                _this.getDetail();
                            } else {
                                layer.msg('删除失败', {icon: 7});
                            }
                        }
                    })
                } else {
                    layer.msg('请选择一条信息',{icon:7});
                    return;
                }
                form.render()
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
                        _this.write_data.simnum='';
                        _this.write_data.cardnum='';
                        _this.write_data.mealId='';
                        _this.write_data.mealName='';
                        _this.write_data.discount='';
                        document.getElementById("wmealName").options[0].selected = true;
                        document.getElementById("wmealId").options[0].selected = true;
                        document.getElementById("wdiscount").options[0].selected = true;
                        form.render()
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
                    orderMeal:_this.write_data.mealId,
                    orderDiscount:_this.write_data.discount,
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
                        form.on('select(wmealId)', function (data) {
                            var selMealName = document.getElementById("wmealName");
                            if(data.value!='') {
                                for(var i=0; i<selMealName.options.length; i++){
                                    if (selMealName.options[i].value == data.value) {
                                        selMealName.options[i].selected = true;
                                    }
                                }
                            } else {
                                selMealName.options[0].selected = true;
                            }
                            _this.write_data.mealId = data.value;
                            _this.getDetail();
                        });
                        form.on('select(wmealName)', function (data) {
                            var selMealId = document.getElementById("wmealId");
                            if(data.value!='') {
                                for (var i = 0; i < selMealId.options.length; i++) {
                                    if (selMealId.options[i].innerHTML == data.value) {
                                        selMealId.options[i].selected = true;
                                    }
                                }
                            } else {
                                selMealId.options[0].selected = true;
                            }
                            _this.write_data.mealId = data.value;
                            _this.getDetail();
                        });
                        form.on('select(wdiscount)', function (data) {
                            _this.write_data.discount = data.value;
                            _this.getDetail();
                        });
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
            merge: function (res) {
                var data = res.data;
                var mergeIndex = 0;//定位需要添加合并属性的行数
                var mark = 1; //这里涉及到简单的运算，mark是计算每次需要合并的格子数
                var columsName = ['order_id'];//需要合并的列名称
                var columsIndex = [0];//需要合并的列索引值
                for (var k = 0; k < columsName.length; k++) { //这里循环所有要合并的列
                    var trArr = $(".layui-table-body>.layui-table").find("tr");//所有行
                    for (var i = 1; i < res.data.length; i++) { //这里循环表格当前的数据
                        var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
                        var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列

                        if (data[i][columsName[k]] === data[i-1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
                            mark += 1;
                            tdPreArr.each(function () {//相同列的第一列增加rowspan属性
                                $(this).attr("rowspan", mark);
                            });
                            tdCurArr.each(function () {//当前行隐藏
                                $(this).css("display", "none");
                            });
                        }else {
                            mergeIndex = i;
                            mark = 1;//一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
                        }
                    }
                    mergeIndex = 0;
                    mark = 1;
                }
            },
            getPage: function () {
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
                form.on('select(city)', function (data) {
                    _this.city = data.value;
                    _this.getPage();
                });
                form.on('select(county)', function (data) {
                    _this.county = data.value;
                    _this.getPage();
                });
                form.on('select(channel_type)', function (data) {
                    _this.channel_type = data.value;
                    _this.getPage();
                });
                form.on('select(mealId)', function (data) {
                    var selMealName = document.getElementById("mealName");
                    if(data.value!='') {
                        for(var i=0; i<selMealName.options.length; i++){
                            if (selMealName.options[i].value == data.value) {
                                selMealName.options[i].selected = true;
                            }
                        }
                    } else {
                        selMealName.options[0].selected = true;
                    }
                    _this.mealId = data.value;
                    _this.getPage();
                });
                form.on('select(mealName)', function (data) {
                    var selMealId = document.getElementById("mealId");
                    if(data.value!='') {
                        for (var i = 0; i < selMealId.options.length; i++) {
                            if (selMealId.options[i].innerHTML == data.value) {
                                selMealId.options[i].selected = true;
                            }
                        }
                    } else {
                        selMealId.options[0].selected = true;
                    }
                    _this.mealId = data.value;
                    _this.getPage();
                });
                form.on('select(discount)', function (data) {
                    _this.discount = data.value;
                    _this.getPage();
                });
                form.on('select(state)', function (data) {
                    _this.state = data.value;
                    _this.getPage();
                });
                layui.use('table', function () {
                    var table = layui.table;
                    table.render({
                        elem: '#data'
                        , url: _this.ajax_url + '/simCard'
                        , method: 'post'
                        , where: datas
                        , cols: [[
                            {field: 'order_id', title: '工单编号'}
                            , {field: 'sub_time', title: '申请时间'}
                            , {field: 'city_name', title: '盟市'}
                            , {field: 'county_name', title: '县区'}
                            , {field: 'channel_id', title: '渠道编码'}
                            , {field: 'channel_name', title: '渠道名称'}
                            , {field: 'meal_name', title: '套餐资费'}
                            , {field: 'meal_code', title: '资费代码'}
                            , {field: 'discount_name', title: '优惠促销'}
                            , {field: 'order_count', title: '开卡数量'}
                            , {field: 'order_state', title: '工单状态'}
                            , {field: 'create_time', title: '写卡完成时间'}
                            , {field: 'order_people', title: '收件人'}
                            , {field: 'order_phone', title: '收件人号码'}
                            , {fixed: 'right', align:'center',title: '操作', rowspan:"2", width:120,
                                templet: function(d){
                                    if (d.state == 2) {
                                        return '<a class="layui-btn layui-btn-normal layui-btn-sm" id="write" lay-event="write">处理</a>' +
                                            '<a class="layui-btn layui-btn-normal layui-btn-sm" id="cancel" lay-event="cancel">取消</a>'
                                    } else if (d.state == 3) {
                                        return '<a class="layui-btn layui-btn-normal layui-btn-sm" id="update" lay-event="write">修改</a>' +
                                            '<a class="layui-btn layui-btn-normal layui-btn-sm" id="print" lay-event="print">打印</a>'
                                    } else {
                                        return ''
                                    }
                                }
                            }
                        ]]
                        , page: true
                        , curr: 1
                        , limits: [20, 50, 100, 1]
                        , limit: 20
                        , done: function (result) {
                            _this.cityList = result.city;
                            _this.countyList = result.county;
                            _this.typeList = result.channelType;
                            _this.stateList = result.orderState;
                            _this.mealList = result.meal;
                            _this.discountList = result.discount;
                            _this.merge(result);
                        }
                    });
                    //监听工具条
                    table.on('tool(demo)', function(obj){
                        var data = obj.data;
                        if(obj.event === 'write'){
                            _this.write(data.order_id)
                        }
                        if(obj.event == 'cancel') {
                            _this.cancel(data.order_id)
                        }
                        if(obj.event == 'print') {
                            _this.print(data.order_id)
                        }
                    });
                });
            },
        }
    }
    return {
        simcard: obj
    }
});