define(['layui', 'text!../../pages/targetList.html'], function (layui, targetList) {
    var form = layui.form;
    var obj = {
        template: targetList,
        data: function () {
            return {
                curr: '1',
                limit: 20,
                totalCount: 0,
                searchQuery:'',
                factorList: [],
                name:'',
                type:'',
                SQL:'',
                desc:'',
                code:'',
                id:'',
                typeList:[],
                ajax_url:''
            }
        },
        
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            _this.getPage({
                curr: 1,
                limit: _this.limit,
                searchQuery: _this.searchQuery
            });
            _this.ajax_url = _this.$parent.ajax_url;
            layui.use(['laypage', 'layer', 'form'], function () {
                var laypage = layui.laypage
                    , layer = layui.layer,
                    form = layui.form;
                form.on('submit(search)', function (data) {
                    _this.curr=1;
                    _this.getPage({
                        curr: 1,
                        limit: _this.limit,
                        searchQuery: _this.searchQuery
                    });
                    return false;
                });
            })

            _this.getType();//获取类型
        },
        methods: {
            showTypeName:function(item){
                for(var i=0;i<this.typeList.length;i++){
                    if(item.FACTOR_PARAM_TYPE==this.typeList[i].PARAM_CODE*1){
                        return this.typeList[i].PARAM_NAME;
                    }
                }
            },
            add: function () {
                var _this=this;
                this.code="";
                this.id="";
                this.name="";
                this.type="";
                $('#selectAddType option').each(function(){
                    if(_this.type==this.value*1){
                        $(this).prop('selected','selected');
                        $(this).siblings().removeProp('selected')
                    }
                });
                form.on('select(selectType)',function(data){
                        _this.type=data.value;
                });
                this.SQL="";
                this.desc="";
                
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', '500px'], //宽高
                    content: $('#targetAdd'),
                    cancel: function () {
                        $('#targetAdd').hide();
                    }
                });
                form.on('submit(add)', function (data) {
                    console.log(data.field,_this.type)
                    _this.saveInfo(data.field);
                    $('#targetAdd').hide();
                    layer.close(index);
                    layer.msg('添加成功');
                    return false;
                });
                form.render()
            },
            edit: function (item) {
                var _this=this;
                this.code=item.FACTOR_CODE;
                this.id=item.FACTOR_ID;
                this.name=item.FACTOR_NAME;
                this.type=item.FACTOR_PARAM_TYPE;
                $('#selectEditType option').each(function(){
                    if(_this.type==this.value*1){
                        $(this).prop('selected','selected');
                        $(this).siblings().removeProp('selected')
                    }
                });
                this.SQL=item.FACTOR_SQL;
                this.desc=item.FACTOR_DESC;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', '500px'], //宽高
                    content: $('#targetEdit'),
                    cancel: function () {
                        $('#targetEdit').hide();
                    }
                });
                
                form.on('submit(edit)', function (data) {
                    _this.saveInfo(data.field);
                    $('#targetEdit').hide();
                    layer.close(index)
                    layer.msg('修改成功');
                    return false;
                })
                form.render()
                
            },
            del:function(item){
                var _this=this;
                layer.confirm('确定要删除吗？', {
                      btn: ['删除','取消'], //按钮
                      title:'提示',
                    }, function(){
                      $.ajax({
                        url: _this.ajax_url+'factor/delInfo?id='+item.FACTOR_ID,
                        type: 'get',
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==='0'){
                                console.log(_this.curr)
                                layer.msg('删除成功', {icon: 1});

                                _this.getPage({
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    searchQuery: _this.searchQuery
                                });
                            }else if(result.flag==='1'){
                                console.log("失败")
                                layer.msg('删除失败');
                            }
                        },
                        error: function (e) {
                            console.log(laypage)
                            console.log(e)
                        }
                      })
                    });
            },
            searchReset: function(){
                var _this=this;
                this.searchQuery="";
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    searchQuery: _this.searchQuery
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url+'factor/showInfo',
                    type: 'post',
                    data:{
                        'curr':paramObj.curr,
                        'limit':paramObj.limit,
                        'keyword':paramObj.searchQuery
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.factorList=result.list;
                        _this.totalCount = result.total ? result.total : 0;
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
                                        url: _this.ajax_url+'factor/showInfo',
                                        type: 'post',
                                        data:{
                                            'curr':obj.curr,
                                            'limit':obj.limit,
                                            'keyword':paramObj.searchQuery
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.factorList = result.list;
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
            saveInfo:function(data){
                var _this=this;
                $.ajax({
                        url: _this.ajax_url+'factor/saveInfo',
                        type: 'post',
                        data: data,
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==='0'){
                                _this.getPage({
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    searchQuery: _this.searchQuery
                                });
                            }else{
                                layer.msg(result.head.retMsg);
                            }
                        }
                    });
            },
            getType:function(){
                var _this=this;
                //获取type
                $.ajax({
                    url:_this.ajax_url+'common/getParam?id=FACTOR_TYPE',
                    type:'get',
                    dataType: 'json',
                    success: function (result) {
                        _this.typeList=result;
                    }
                })
            }
        }
    }
    return {
        targetList: obj
    }
});