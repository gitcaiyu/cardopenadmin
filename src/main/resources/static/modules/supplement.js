define(['layui', 'text!../../pages/supplement.html'], function (layui, supplement) {
    var form = layui.form;
    var laydate = layui.laydate;
    var obj = {
        template: supplement,
        data: function () {
            return {
                curr: '1',
                limit: 20,
                totalCount: 0,
                month:'',
                codeList: [],
                typeList:[],
                nameList:[],
                saveDataList:[],
                type:'',/**select选type**/
                ajax_url:'',
                addSure:true,
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            laydate.render({
                elem: '#date1', //指定元素
                format: 'yyyyMM',
                type: 'month',
                    change: function(value, date, endDate){
                    _this.month=value;
                    $('.layui-laydate').hide();
                    },
                done: function(value, date){ //监听日期被切换
                    _this.month=value;
                },
                showBottom: true,
            });
            //_this.ajax_url = "http://10.166.102.103:9030/";
            _this.checkAdd();
            _this.getPage({
                curr: 1,
                limit: _this.limit,
                month: _this.month
            });
        },
        methods: {
            add: function () {
                var _this=this;
                
                if (!_this.addSure) {
                    layer.msg("本月数据已经补录！");
                    return;
                };
                _this.nameList=[];
                form.on('select(addTypeSelect)',function(data){
                    _this.selectType(data,'record/getTargetForRecord');
                });
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', '500px'], //宽高
                    content: $('#suppleAdd'),
                    cancel: function () {
                        $('#suppleAdd').hide();
                        _this.type="";
                    }
                });
                form.on('submit(add)', function (data) {
                    var formData=data.field;
                    _this.saveDataList=[];
                    for(var i=0;i<_this.nameList.length;i++){
                        _this.saveDataList.push({
                            PARAM_CODE:_this.nameList[i].PARAM_CODE,
                            PARAM_NAME:_this.nameList[i].PARAM_NAME,
                            PARAM_VALUE:formData[_this.nameList[i].PARAM_CODE],
                        })
                    };
                    _this.saveInfo({
                        PARAM_TYPE:formData.PARAM_TYPE,
                        arr:JSON.stringify(_this.saveDataList)
                    },'record/addRecord',index,$('#suppleAdd'),'添加成功');
                    /*$('#suppleAdd').hide();
                    layer.close(index);
                    layer.msg('添加成功');*/
                    return false;
                });
                form.render()
            },
            edit: function (item) {
                var _this=this;
                if (_this.addSure) {
                    layer.msg("请新增本月补录数据！");
                    return;
                };
                _this.type="";
                _this.nameList=[];
                form.on('select(editTypeSelect)',function(data){
                        _this.selectType(data,'record/getRecordByMonth');
                });
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', '500px'], //宽高
                    content: $('#suppleEdit'),
                    cancel: function () {
                        $('#suppleEdit').hide();
                        _this.type="";
                    }
                });
                
                form.on('submit(edit)', function (data) {
                    var formData=data.field;
                    _this.saveDataList=[];
                    for(var i=0;i<_this.nameList.length;i++){
                        _this.saveDataList.push({
                            PARAM_CODE:_this.nameList[i].PARAM_CODE,
                            PARAM_NAME:_this.nameList[i].PARAM_NAME,
                            PARAM_VALUE:formData[_this.nameList[i].PARAM_CODE],
                        })
                    };
                    _this.saveInfo({
                        PARAM_TYPE:formData.PARAM_TYPE,
                        arr:JSON.stringify(_this.saveDataList)
                    },'record/updateRecordByMonth',index,$('#suppleEdit'),'修改成功');

                    /*$('#suppleEdit').hide();
                    layer.close(index);
                    layer.msg('修改成功');*/
                    return false;
                });
                form.render()
                
            },
            searchSupple:function(){
                var _this=this;
                _this.curr=1;
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    month: _this.month
                });
            },
            searchReset: function(){
                var _this=this;
                this.month="";
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    month: _this.month
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url+'record/showInfo',
                    type: 'post',
                    data:{
                        curr:paramObj.curr,
                        limit:paramObj.limit,
                        RECORD_MONTH:paramObj.month
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.codeList=result.arr;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
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
                                   var searchQuery= _this.searchQuery ? _this.searchQuery : '';
                                    $.ajax({
                                        url: _this.ajax_url+'record/showInfo',
                                        type: 'post',
                                        data:{
                                            curr:obj.curr,
                                            limit:obj.limit,
                                            RECORD_MONTH:_this.month
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.codeList = result.arr;
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
            /**添加保存/修改保存**/
            saveInfo:function(saveData,url,index,obj,msg){
                var _this=this;
                $.ajax({
                        url: _this.ajax_url+url,
                        type: 'post',
                        data: saveData,
                        dataType: 'json',
                        success: function (result) {
                            if(!result.check){
                                layer.msg(result.msg,{icon:7})
                                return;
                            };
                            _this.type="";//初始化类型
                            /**获取类型**/
                            if(_this.addSure){
                                _this.getType('record/getAllRecordType');
                            }else{
                                _this.getType('record/getParamForUpdate');
                            }
                            _this.checkAdd();//验证是否新增
                            _this.saveDataList=[];//发送数据初始化
                            _this.nameList=[];//初始化参数列表
                            _this.getPage({
                                curr: _this.curr,
                                limit: _this.limit,
                                month: _this.month
                            });
                            obj.hide();
                            layer.close(index);
                            layer.msg(msg);
                        }
                    });
            },
            /**获取type**/
            getType:function(url){
                var _this=this;
                
                $.ajax({
                    url:_this.ajax_url+url,
                    type:'get',
                    dataType: 'json',
                    success: function (result) {
                        _this.typeList=result.arr;
                    }
                })
            },
            /**选择type**/
            selectType:function(data,url){
                var _this=this;
                $.ajax({
                    url:_this.ajax_url+url,
                    type:'post',
                    data:{
                        PARAM_TYPE:data.value
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.type=data.value;
                        _this.nameList=result.arr;
                    }
                })
            },
            /**校验是否新增**/
            checkAdd:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'record/checkMonth',
                    type: 'post',
                    data:{},
                    dataType: 'json',
                    success:function(result){
                        if(result){
                            _this.addSure=false;
                            /**获取类型**/
                            _this.getType('/record/getParamForUpdate');
                        }else{
                            _this.getType('record/getAllRecordType');
                        };

                    }
                })
            }
        }
    }
    return {
        supplement: obj
    }
});