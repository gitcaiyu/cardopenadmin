define(['layui', 'text!../../pages/proGoalMana.html'], function (layui, proGoalMana) {
    var form = layui.form,upload = layui.upload;

    var obj = {
        template: proGoalMana,
        data: function () {
            return {
                searchQuery:'',
                limit:20,
                curr:1,
                totalCount:'',
                ajax_url:'',
                year_list:[],
                this_year:'',
                proGoal_list:[],
                edit_item:{
                    ID:'',
                    m1:'',
                    m2:'',
                    m3:'',
                    m4:'',
                    m5:'',
                    m6:'',
                    m7:'',
                    m8:'',
                    m9:'',
                    m10:'',
                    m11:'',
                    m12:''
                },
                goal_list:[
                  {type:1,name:'贷款余额'},
                  {type:2,name:'放款额'},
                  {type:3,name:'收入'},
                  {type:4,name:'利润'},
                  {type:5,name:'固定成本'},
                  {type:6,name:'变动成本'}
                ],
                goal_type:'',
                upload_year:'',
                fileNameShow:false,
                filename:'',
                importCate:'',
                goalType:'',
                ajax_url:'',
                goalCate:'1',
                goal_url:'',
                save_url:'',
            }
        },
        mounted: function () {
            var _this = this;
            var date=new Date;
            this.this_year=date.getFullYear();
            this.getYear();
           _this.ajax_url = _this.$parent.ajax_url;
          // this.ajax_url="http://10.166.102.119:9030/"
          this.goal_url="proTarget/showInfo";
          this.selectGoalCate();
            _this.getPage({
                curr: 1,
                limit: _this.limit,
                searchQuery: _this.searchQuery,
                year:_this.this_year,
                type:_this.goal_type
            });
            this.selectYear();
            this.selectGoalType();
        },
        updated: function(){
            form.render();
        },
        methods: {
            getYear: function(){
                var date=new Date;
                var year=date.getFullYear();
                this.this_year=year;
                this.year_list=[];
                for (var i=year-5;i<year+2;i++){
                    this.year_list.push(i);
                }
            },
            selected: function(item){
                if(item==this.this_year){
                    return 'selected';
                }else{
                    return "";
                }
            },
            selectYear: function(){
                var _this=this;
                form.on('select(year)',function(data){
                    _this.curr=1;
                    _this.this_year=data.value;
                    _this.getPage({
                        curr: 1,
                        limit: _this.limit,
                        searchQuery: _this.searchQuery,
                        year:_this.this_year,
                        type:_this.goal_type
                    });
                })
            },
            showGoalName: function(item){
                var type=item.TYPE;
                for(var i=0;i<this.goal_list.length;i++){
                    if(type==this.goal_list[i]['type']){
                        return this.goal_list[i]['name'];
                    };
                }
            },
            selectGoalCate: function(){
                var _this=this;
                form.on('select(goalCate)',function(data){
                    _this.curr=1;
                    _this.goalCate=data.value;
                    _this.goalCate=='1'?_this.goal_url="proTarget/showInfo":_this.goal_url="orgTarget/showInfo";
                    _this.getPage({
                        curr: 1,
                        limit: _this.limit,
                        searchQuery: _this.searchQuery,
                        year:_this.this_year,
                        type:_this.goal_type
                    });
                })
            },
            changeName: function(item){
                if(this.goalCate=='1'){
                    return item.PRONAME;
                }else{
                    return item.ORGNAME;
                };
            },
            selectGoalType: function(){
                var _this=this;
                form.on('select(goal)',function(data){
                    _this.curr=1;
                    _this.goal_type=data.value;
                    _this.getPage({
                        curr: 1,
                        limit: _this.limit,
                        searchQuery: _this.searchQuery,
                        year:_this.this_year,
                        type:_this.goal_type
                    });
                })
            },
            addFile: function(){
                var _this=this;
                $('#file1').click();
                this.fileNameShow=true;
            },
            fileChange: function(){
                this.filename=$("#file1")[0].files[0].name;

            },
            getSelectVal: function(param){
                var _this=this;
                form.on('select('+param.filter+')',function(data){
                    _this[param.val]=data.value;
                });
            },
            initSelectVal: function(param){
                $('select[name="'+param.name+'"] option').each(function(){
                    if(param.value===this.value){
                        $(this).prop('selected','selected');
                        $(this).siblings().removeProp('selected')
                    }
                });
                form.render();
            },
            add: function () {
                var _this=this;
                this.initSelectVal({name:'importCate',value:''});
                this.initSelectVal({name:'goalType',value:''});
                this.getSelectVal({filter:'importCate',val:'importCate'});
                this.getSelectVal({filter:'goalType',val:'goalType'});
                this.getYear();
                this.upload_year=this.this_year;
                form.on('select(importYear)',function(data){
                    _this.upload_year=_this.this_year=data.value;
                });
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['500px', '500px'], //宽高
                    content: $('#proGoalImport'),
                    title: "导入数据",
                    cancel: function () {
                        $('#proGoalImport').hide();
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
                    formData.append("year", _this.upload_year);
                    formData.append("type", _this.importCate);
                    formData.append("targetType", _this.goalType);
                    var size = document.getElementById('file1').files[0].size;
                    var filesize = (size / (1024*1024)).toFixed(2);
                    if(filesize>3){
                        layer.msg('上传文件不能超过3M',{icon:7});
                        return;
                    };
                    var msg=["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel"];
                    var msgCheck=false;
                    for(var i=0;i<msg.length;i++){
                        if($("#file1")[0].files[0].type.indexOf(msg[i])!=-1){
                            msgCheck=true;
                        }
                    };
                    if(!msgCheck){
                        layer.msg('请上传excel文件',{icon:7});
                        return;
                    };
                    var indexx = layer.load(2);
                    $.ajax({
                        url: _this.ajax_url+'importExcel',
                        type: 'post',
                        data: formData,
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            layer.close(indexx);
                            if(result.flag){
                                layer.msg('导入成功！',{icon:1});
                                $('#proGoalImport').hide();
                                layer.close(index);
                            }else{
                                layer.msg(result.message,{icon:7});
                            }
                        },
                        error:function(e){
                            layer.close(indexx);
                            layer.msg('导入失败！',{icon:7});
                        }
                    });
                    return false;
                });
                form.render();
            },
            download: function(){
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['500px', '200px'], //宽高
                    content: $('#proModelDL'),
                    title: "下载模板",
                    cancel: function () {
                        $('#proModelDL').hide();
                    },
                    success: function(){
                    }
                });
            },
            edit: function (item) {
                var _this=this;
                for(var a in this.edit_item){
                    var A=a.toUpperCase();
                    if(item[A]){
                        this.edit_item[a]=item[A]
                    }
                };
                var name=item.PRONAME?item.PRONAME:item.ORGNAME;
                var index = layer.open({
                    type: 1,
                    title:_this.this_year+'年'+name+'目标管理',
                    skin: 'layui-layer-demo', //加上边框
                    area: ['950px', ''], //宽高
                    content: $('#proGoalEdit'),
                    cancel: function () {
                        $('#proGoalEdit').hide();
                    }
                });
                
                form.on('submit(edit)', function (data) {
                    _this.saveInfo();
                    $('#proGoalEdit').hide();
                    layer.close(index);
                    layer.msg('修改成功',{icon:1});
                    return false;
                })
                form.render()
            },
            searchCharge:function(){
                var _this=this;
                _this.curr=1;
                _this.goalCate=='1'?_this.goal_url="proTarget/showInfo":_this.goal_url="orgTarget/showInfo";
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    searchQuery: _this.searchQuery,
                    year:_this.this_year,
                    type:_this.goal_type
                });
            },
            searchReset: function(){
                var _this=this;
                var date=new Date;
                this.this_year=date.getFullYear();
                this.searchQuery="";
                this.goal_type="";
                this.initSelectVal({name:'year',value:_this.this_year});
                this.initSelectVal({name:'goal',value:_this.goal_type});
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    searchQuery: _this.searchQuery,
                    year:_this.this_year,
                    type:_this.goal_type
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url+_this.goal_url,
                    type: 'post',
                    data:{
                        'curr':paramObj.curr,
                        'limit':paramObj.limit,
                        'keyword':paramObj.searchQuery,
                        'year':paramObj.year,
                        'type':paramObj.type
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.proGoal_list=result.list;
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
                                        url: _this.ajax_url+_this.goal_url,
                                        type: 'post',
                                        data:{
                                            'curr':obj.curr,
                                            'limit':obj.limit,
                                            'keyword':paramObj.searchQuery,
                                            'year':paramObj.year,
                                            'type':paramObj.type
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.proGoal_list = result.list;
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
            saveInfo:function(){
                var _this=this;
                _this.goalCate=='1'?_this.goal_url="proTarget/showInfo":_this.goal_url="orgTarget/showInfo";
                _this.goalCate=='1'?_this.save_url="proTarget/saveInfo":_this.save_url="orgTarget/saveInfo";
                $.ajax({
                        url: _this.ajax_url+_this.save_url,
                        type: 'post',
                        data: _this.edit_item,
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==='0'){
                                _this.getPage({
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    searchQuery: _this.searchQuery,
                                    year:_this.this_year,
                                    type:_this.goal_type
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
        proGoalMana: obj
    }
});