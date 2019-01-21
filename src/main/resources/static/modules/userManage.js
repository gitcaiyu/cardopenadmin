define(['layui', 'text!../../pages/userManage.html'], function (layui, userManage) {
    var form = layui.form;

    var obj = {
        template: userManage,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                codeList:[],
                userRole:'',
                roleList:[],
                cityList:'',
                userName:'',
                userTel:'',
                ajax_url:'',
                filename:'',
                edit_data:{
                    userName:'',
                    userTel:'',
                    userPass:'',
                    city:''
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
                if(checkListStr.indexOf(item.user_id)!=-1){
                    return true;
                }else{
                    return false;
                }
            },
            edit: function (item) {
                var _this=this;
                this.edit_data.userTel=item.user_tel;
                this.edit_data.userName=item.user_name;
                this.edit_data.userPass=item.user_pass;
                var selCity = document.getElementById("cityCode");
                for(var i=0; i<selCity.options.length; i++){
                    if(selCity.options[i].innerHTML == item.city_name){
                        selCity.options[i].selected = true;
                        break;
                    }
                }
                var selRole = document.getElementById("userRole");
                for(var i=0; i<selRole.options.length; i++){
                    if(selRole.options[i].innerHTML == item.role_name){
                        selRole.options[i].selected = true;
                        break;
                    }
                }
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', '1800'], //宽高
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
            addFile: function(){
                var _this=this;
                $('#file1').click();
                this.fileNameShow=true;
            },
            fileChange: function(){
                this.filename=$("#file1")[0].files[0].name;
            },
            batchImport: function () {
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['500px', '500px'], //宽高
                    content: $('#batchImport'),
                    title: "导入数据",
                    cancel: function () {
                        $('#batchImport').hide();
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
                        url: _this.ajax_url+'/userImport',
                        type: 'post',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function () {
                            layer.msg('导入成功！',{icon:1});
                            $('#batchImport').hide();
                            layer.close(index);
                            _this.getPage();
                        }
                    })
                    return false;
                });
                form.render();
            },
            channelExport:function() {
                var _this=this;
                var datas = {userName:_this.userName,
                    userTel:_this.userTel,
                    userRole:_this.userRole}
                $.ajax({
                    url: _this.ajax_url+'/userExport',
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
            channelDel:function() {
                var _this = this;
                var datas = {detail:_this.checkList}
                console.log(JSON.stringify(datas))
                if (datas.detail.length > 0) {
                    $.ajax({
                        url: _this.ajax_url+'/userDel',
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
                    layer.msg('请选择一条用户信息',{icon:7});
                    return;
                }
                form.render();
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
                    userName:_this.userName,
                    userTel:_this.userTel,
                    userRole:_this.userRole,
                    curr:_this.curr,
                    limit:_this.limit}
                this.checkList=[];
                $.ajax({
                    url: _this.ajax_url+'/userManage',
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
                        _this.codeList=result.resBody.user;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        _this.roleList = result.resBody.roleList;
                        _this.cityList = result.resBody.city;
                        form.on('select(userRole)',function(data){
                            _this.userRole =data.value;
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
                                        url: _this.ajax_url+'/userManage',
                                        type: 'post',
                                        data:JSON.stringify({userName:_this.userName,
                                            userTel:_this.userTel,
                                            userRole:_this.userRole,
                                            curr:obj.curr,
                                            limit:obj.limit}),
                                        headers : {
                                            'Content-Type' : 'application/json;charset=utf-8'
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.codeList=result.resBody.user;
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
                    url: _this.ajax_url+'/userAdd',
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
        userManage: obj
    }
});