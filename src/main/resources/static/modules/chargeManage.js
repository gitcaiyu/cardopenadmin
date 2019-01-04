define(['layui', 'text!../../pages/chargeManage.html'], function (layui, chargeManage) {
    var form = layui.form;

    var obj = {
        template: chargeManage,
        data: function () {
            return {
                code:'',
                ID:'',
                dbCode:false,
                name:'',
                price:0,
                supplier:'',
                searchSupplier:'',
                remark:'',
                ifunion:1,
                searchQuery:'',
                limit:20,
                curr:1,
                totalCount:'',
                chargeList:[],
                supplierList:[],
                supplier:'',
                ajax_url:''
            }
        },
        mounted: function () {
            var _this = this;
           _this.ajax_url = _this.$parent.ajax_url;
            _this.getPage({
                curr: 1,
                limit: _this.limit,
                searchQuery: _this.searchQuery,
                supplier:_this.searchSupplier
            });
            this.getSupplier();
            //form.render();
        },
        updated:function(){
            form.render();
        },
        methods: {
            checkCode: function(fn){
                var _this=this;
                this.dbCode=false;
                $.ajax({
                    url: _this.ajax_url+'apiCost/getInfo',
                    type: 'post',
                    data:{'code':_this.code},
                    dataType: 'json',
                    success: function (result) {
                        if(result.flag=='1'){
                            _this.dbCode=true;
                            layer.msg('编码已使用！',{icon:7});
                        }else{
                            _this.dbCode=false;
                        };
                        if(fn)fn();
                    }
                });
            },
            getSupplier:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'addApiCost/getSupplier',
                    type: 'post',
                    data:{},
                    dataType: 'json',
                    success: function (result) {
                        _this.supplierList=result;
                        form.render();
                        form.on('select(seleSupplier)',function(data){
                            _this.searchSupplier=data.value;
                            _this.getPage({
                                curr: 1,
                                limit: _this.limit,
                                supplier:_this.searchSupplier,
                                searchQuery: _this.searchQuery
                            });
                        })
                    }
                });

            },
            add: function () {
                this.code="";
                this.name="";
                this.price=0;
                this.supplier="";
                this.remark="";
                /*$('#adda').prop('checked','checked')
                $('#addb').removeProp('checked')*/
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['480px', ''], //宽高
                    content: $('#addCharge'),
                    cancel: function () {

                        $('#addCharge').hide();
                    }
                });
                form.on('submit(add)', function (data) {
                    _this.checkCode(function(){
                        if(_this.dbCode){
                            return false;
                        }else{
                            _this.saveInfo(data.field,function(){
                                $('#addCharge').hide();
                                layer.close(index);
                                layer.msg('添加成功',{icon:1});
                            });
                            
                        }
                    });
                    return false;
                });
                form.render()
            },
            edit: function (charge) {
                var _this=this;
                this.code=charge.CODE;
                this.ID=charge.ID;
                this.name=charge.NAME;
                this.price=charge.PRICE?charge.PRICE:0;
                this.supplier=charge.SUPPLIER;
                this.remark=charge.REMARK;
                //this.ifunion=charge.IFUNION;
                /*if(charge.IFUNION == 1){
                    $('#a').prop('checked','checked')
                    $('#b').removeProp('checked')
                }else{
                    $('#b').prop('checked','checked')
                    $('#a').removeProp('checked')
                }*/
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['480px', ''], //宽高
                    content: $('#editCharge'),
                    cancel: function () {
                        $('#editCharge').hide();
                    }
                });
                
                form.on('submit(edit)', function (data) {
                    _this.saveInfo(data.field,function(){
                        $('#editCharge').hide();
                        layer.close(index);
                        layer.msg('修改成功',{icon:1});
                    });
                    
                    return false;
                })
                form.render()
                
            },
            del:function(charge){
                var _this=this;
                layer.confirm('确定要删除吗？', {
                      btn: ['删除','取消'], //按钮
                      title:'提示',
                    }, function(){
                      $.ajax({
                        url: _this.ajax_url+'apiCost/delInfo',
                        type: 'post',
                        data:{'id':charge.ID},
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==='0'){
                                console.log("成功")
                                layer.msg('删除成功', {icon: 1});

                                _this.getPage({
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    searchQuery: _this.searchQuery,
                                    supplier:_this.searchSupplier
                                });
                                console.log(_this.curr,_this.totalCount,Math.ceil(_this.totalCount/_this.limit));
                            }else if(result.flag==='1'){
                                layer.msg('删除失败',{icon:7});
                            }
                        },
                        error: function (e) {
                            console.log(laypage)
                            console.log(e)
                        }
                      })
                    });

            },
            searchCharge:function(){
                var _this=this;
                _this.curr=1;
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    searchQuery: _this.searchQuery,
                    supplier:_this.searchSupplier
                });
            },
            searchReset: function(){
                var _this=this;
                this.searchSupplier="";
                this.searchQuery="";
                this.initSelect({value:_this.searchSupplier,name:"seleSupplier"});
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    searchQuery: _this.searchQuery,
                    supplier:_this.searchSupplier
                });
                form.render();
            },
            initSelect:function(param){
                $('select[name="'+param.name+'"] option').each(function(){
                    if(param.value===this.value){
                        $(this).prop('selected','selected');
                        $(this).siblings().removeProp('selected')
                    }
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url+'apiCost/showInfo',
                    type: 'post',
                    data:{
                        'curr':paramObj.curr,
                        'limit':paramObj.limit,
                        'keyword':paramObj.searchQuery,
                        'supplier':paramObj.supplier
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.chargeList=result.list;
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
                                        url: _this.ajax_url+'apiCost/showInfo',
                                        type: 'post',
                                        data:{
                                                'curr':obj.curr,
                                                'limit':obj.limit,
                                                'keyword':paramObj.searchQuery,
                                                'supplier':paramObj.supplier
                                            },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.chargeList = result.list;
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
            saveInfo:function(data,fn){
                var _this=this;
                $.ajax({
                        url: _this.ajax_url+'apiCost/saveInfo',
                        type: 'post',
                        data: data,
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==='0'){
                                if(fn)fn();
                                _this.getPage({
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    searchQuery: _this.searchQuery,
                                    supplier:_this.searchSupplier
                                });
                            }else{
                                layer.msg(result.head.retMsg);
                            }
                        }
                    });
            }
        },
    }
    return {
        chargeManage: obj
    }
});