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
                    channelType:''
                },
                add_data:{
                    channelId:'',
                    channel_name:'',
                    city:'',
                    county:'',
                    charge_name:'',
                    charge_tel:'',
                    channel_address:'',
                    channelType:''
                },
                city:'',
                county:'',
                channel_name:'',
                channel_id:'',
                charge_name:'',
                charge_tel:'',
                channel_type:''
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
            this.getChannelInfo();

        },
        updated:function(){
            form.render();
        },
        methods: {
            checkInit: function(item){
                var _this=this;
                var checkListStr=this.checkList.join(',');
                if(checkListStr.indexOf(item.ID)!=-1){
                    return true;
                }else{
                    return false;
                }
            },
            getChannelInfo:function(){
                var _this=this;
                var datas = {"city":_this.city}
                $.ajax({
                    url: _this.ajax_url+'/channelInfo',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        console.log(result.resBody)
                        _this.cityList=result.resBody.city;
                        _this.countyList=result.resBody.county;
                        _this.typeList=result.resBody.channelType;
                        form.render();
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
                    }
                });
            },
            edit: function (item) {
                var _this=this;
                this.edit_data.channelId=item.channel_id;
                this.edit_data.channel_name=item.channel_name;
                this.edit_data.city=item.city_name;
                this.edit_data.county=item.county_name;
                this.edit_data.charge_name=item.charge_name;
                this.edit_data.charge_tel=item.charge_tel;
                this.edit_data.channel_address=item.channel_address;
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
                    layer.msg('修改成功');
                    return false
                });
                form.render()
            },
            add: function () {
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', ''], //宽高
                    content: $('#add'),
                    cancel: function () {
                        $('#add').hide();
                    }
                });

                form.on('submit(edit)', function (data) {
                    var formData=data.field;
                    _this.saveInfo(formData);
                    $('#add').hide();
                    layer.close(index);
                    layer.msg('保存成功');
                });
                form.render()
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
                console.log(_this.channel_type)
                var datas = {city:_this.city,
                    county:_this.county,
                    channelName:_this.channel_name,
                    channelId:_this.channel_id,
                    channelType:_this.channel_type,
                    chargeName:_this.charge_name,
                    chargeTel:_this.charge_tel,
                    curr:_this.curr,
                    limit:_this.limit,}
                    console.log(JSON.stringify(datas))
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
                        console.log(_this.codeList)
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
                                //_this.checkList=[];
                                if (!first) {
                                    $.ajax({
                                        url: _this.ajax_url+'addApiCost/getApiCost',
                                        type: 'post',
                                        data:{
                                            curr:obj.curr,
                                            limit:obj.limit,
                                            name:_this.name,
                                            city:_this.city,
                                            month:_this.month
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
                        if(result.flag==1){
                            _this.getPage();
                        }
                    }
                });
            },
            /**校验是否编辑**/
            checkEdit:function(item){
                var _this=this;
                console.log(item.FLAG)
                if(item.FLAG=='true'){
                    return false;
                }else if(item.FLAG=='false'){
                    return true;
                }

            }
        }
    }
    return {
        channel: obj
    }
});