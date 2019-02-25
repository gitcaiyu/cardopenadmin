define(['layui', 'text!../../pages/roleManage.html'], function (layui, roleManage) {
    var form = layui.form;

    var obj = {
        template: roleManage,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                codeList:[],
                ajax_url:'',
                createPeople:'',
                userRole:'',
                roleList:[],
                edit_data:{
                    roleName:'',
                    roleType:'',
                    roleId:''
                }
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
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
            checkInit: function(item){
                var _this=this;
                var checkListStr=this.checkList.join(',');
                if(checkListStr.indexOf(item.role_id)!=-1){
                    return true;
                }else{
                    return false;
                }
            },
            edit: function (item) {
                var _this=this;
                this.edit_data.roleName=item.role_name;
                this.edit_data.roleType=item.role_type;
                this.edit_data.roleId=item.role_id;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', ''], //宽高
                    content: $('#edit'),
                    cancel: function () {
                        $('#edit').hide();
                    }
                });

                form.on('submit(edit)', function (data) {
                    var formData=data.field;
                    _this.saveInfo(formData);
                    $('#edit').hide();
                    layer.close(index);
                    layer.msg('操作成功');
                    return false
                });
                form.render()
            },
            channelDel:function() {
                var _this = this;
                var datas = {detail:_this.checkList}
                if (datas.detail.length > 0) {
                    layer.confirm('确认删除', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        if (datas.detail.length > 0) {
                            $.ajax({
                                url: _this.ajax_url+'/roleDel',
                                type: 'post',
                                data: JSON.stringify(datas),
                                contentType: false,
                                processData: false,
                                success: function () {
                                    layer.msg('删除成功！',{icon:1});
                                    _this.getPage();
                                }
                            })
                        } else {
                            layer.msg('请选择一条角色信息',{icon:7});
                            return;
                        }
                        form.render();
                    });
                } else {
                    layer.msg('请选择渠道编号',{icon:7});
                    return;
                }
            },
            searchChannel:function(){
                var _this=this;
                this.curr=1;
                this.getPage();
            },
            searchReset: function(){
                var _this=this;
                this.month="";
                this.city="";
                this.name="";
                this.initSelect({value:_this.city,name:"city"});
                this.initSelect({value:_this.county,name:"county"})
                this.initSelect({value:_this.channel_type,name:"channel_type"})
                this.getPage();
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
            getPage: function () {
                var laypage = layui.laypage;
                var _this = this;
                var datas = {
                    createPeople:_this.createPeople,
                    roleType:_this.roleType,
                    curr:_this.curr,
                    limit:_this.limit}
                this.checkList=[];
                $.ajax({
                    url: _this.ajax_url+'/roleManage',
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
                        _this.codeList=result.resBody.role;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        _this.roleList = result.resBody.roleList;
                        form.on('select(userRole)',function(data){
                            _this.roleType =data.value;
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
                                        url: _this.ajax_url+'/roleManage',
                                        type: 'post',
                                        data:JSON.stringify({
                                            createPeople:_this.createPeople,
                                            roleType:_this.roleType,
                                            curr:obj.curr,
                                            limit:obj.limit}),
                                        headers : {
                                            'Content-Type' : 'application/json;charset=utf-8'
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.codeList=result.resBody.role;
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
            saveInfo:function(saveData){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'/roleAdd',
                    type: 'post',
                    data:JSON.stringify(saveData),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.getPage();
                    }
                });
            },
            /**校验是否编辑**/
            checkEdit:function(item){
                var _this=this;
                if(item.FLAG=='true'){
                    return false;
                }else if(item.FLAG=='false'){
                    return true;
                }
            }
        }
    }
    return {
        roleManage: obj
    }
});