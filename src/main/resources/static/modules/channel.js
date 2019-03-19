define(['layui', 'text!../../pages/channel.html'], function (layui, channel) {
    var form = layui.form;

    var obj = {
        template: channel,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                cityList:[],
                countyList:[],
                codeList:[],
                typeList:[],
                ajax_url:'',
                edit_data:{
                    channelId:'',
                    channel_name:'',
                    city:'',
                    county:'',
                    charge_name:'',
                    charge_tel:'',
                    channel_address:'',
                    channelType:'',
                    countyList:[]
                },
                city:'',
                county:'',
                channel_name:'',
                channel_id:'',
                charge_name:'',
                charge_tel:'',
                channel_type:'',
                fileNameShow:false,
                filename:''
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
            template:function() {
                var _this=this;
                window.location.href = _this.ajax_url+'/channelTemplate'
            },
            checkInit: function(item){
                var _this=this;
                var checkListStr=this.checkList.join(',');
                if(checkListStr.indexOf(item.channel_id)!=-1){
                    return true;
                }else{
                    return false;
                }
            },
            edit: function (item) {
                var _this=this;
                $form = $('form');
                _this.edit_data.channelId=item.channel_id;
                _this.edit_data.channel_name=item.channel_name;
                _this.edit_data.city=item.city_name;
                _this.edit_data.county=item.county_name;
                _this.edit_data.charge_name=item.charge_name;
                _this.edit_data.charge_tel=item.charge_tel;
                _this.edit_data.channel_address=item.channel_address;
                var selCity = document.getElementById("city");
                var selCounty = document.getElementById("county");
                selCounty.length=0;
                for(var i=0; i<selCity.options.length; i++){
                    if(selCity.options[i].innerHTML == item.city_name){
                        selCity.options[i].selected = true;
                        var datas={city:item.city_code};
                        $.ajax({
                            url: _this.ajax_url+'/countyInfo',
                            type: 'post',
                            data:JSON.stringify(datas),
                            headers : {
                                'Content-Type' : 'application/json;charset=utf-8'
                            },
                            dataType: 'json',
                            success: function (result) {
                                var arr = result.resBody.county;
                                var option = null;
                                for(var j=0; j<arr.length; j++){
                                    if(arr[j].county_id == item.county_id){
                                        option = new Option(arr[j].county_name,arr[j].county_id,true,true);
                                    } else {
                                        option = new Option(arr[j].county_name,arr[j].county_id,false);
                                    }
                                    selCounty.options.add(option)
                                    form.render('select')
                                }
                            }
                        })
                    } else {
                        selCity.options[i].selected = false;
                    }
                }
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
                        url: _this.ajax_url+'/batchImport',
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
                // var datas = {city:_this.city,
                //     county:_this.county,
                //     channelName:_this.channel_name,
                //     channelId:_this.channel_id,
                //     channelType:_this.channel_type,
                //     chargeName:_this.charge_name,
                //     chargeTel:_this.charge_tel,
                //     curr:_this.curr,
                //     limit:_this.limit}
                // $.ajax({
                //     url: _this.ajax_url+'/channelExport',
                //     type: 'post',
                //     data:JSON.stringify(datas),
                //     headers : {
                //         'Content-Type' : 'application/json;charset=utf-8'
                //     },
                //     contentType: false,
                //     processData: false,
                //     success: function () {
                //         layer.msg('导出成功！',{icon:1});
                //     }
                // })
                window.location.href = _this.ajax_url+'/channelExport?city='+_this.city+'&county='+_this.county+'&channelName='+_this.channel_name+'&channelId='+_this.channel_id+'&channelType='+_this.channel_type+'&chargeName='+_this.charge_name+'&chargeTel='+_this.charge_tel;
            },
            channelDel:function() {
                var _this = this;
                var datas = {channelId:_this.checkList}
                if (datas.channelId.length > 0) {
                    layer.confirm('确认删除', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        if (datas.channelId.length > 0) {
                            $.ajax({
                                url: _this.ajax_url+'/channelDel',
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
                            layer.msg('请选择渠道编号',{icon:7});
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
                var datas = {city:_this.city,
                    county:_this.county,
                    channelName:_this.channel_name,
                    channelId:_this.channel_id,
                    channelType:_this.channel_type,
                    chargeName:_this.charge_name,
                    chargeTel:_this.charge_tel,
                    curr:_this.curr,
                    limit:_this.limit}
                this.checkList=[];
                $.ajax({
                    url: _this.ajax_url+'/channelInfo',
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
                        _this.codeList=result.resBody.channel;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        _this.cityList=result.resBody.city;
                        _this.countyList=result.resBody.county;
                        _this.typeList=result.resBody.channelType;
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
                        form.on('select(selCity)', function(data){
                            var datas={city:data.value};
                            $.ajax({
                                url: _this.ajax_url+'/countyInfo',
                                type: 'post',
                                data:JSON.stringify(datas),
                                headers : {
                                    'Content-Type' : 'application/json;charset=utf-8'
                                },
                                dataType: 'json',
                                success: function (result) {
                                    var arr = result.resBody.county;
                                    var option = null;
                                    var selCounty = document.getElementById("county");
                                    selCounty.length=0;
                                    for(var j=0; j<arr.length; j++){
                                        option = new Option(arr[j].county_name,arr[j].county_id,false);
                                        selCounty.options.add(option)
                                        form.render('select')
                                    }
                                }
                            })
                        });
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
                                        url: _this.ajax_url+'/channelInfo',
                                        type: 'post',
                                        data:JSON.stringify({city:_this.city,
                                            county:_this.county,
                                            channelName:_this.channel_name,
                                            channelId:_this.channel_id,
                                            channelType:_this.channel_type,
                                            chargeName:_this.charge_name,
                                            chargeTel:_this.charge_tel,
                                            curr:obj.curr,
                                            limit:obj.limit}),
                                        headers : {
                                            'Content-Type' : 'application/json;charset=utf-8'
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.codeList=result.resBody.channel;
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
                    url: _this.ajax_url+'/channelAdd',
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
            }
        }
    }
    return {
        channel: obj
    }
});