define(['layui', 'text!../../pages/discountIndividualization.html'], function (layui, discountIndividualization) {
    var form = layui.form;

    var obj = {
        template: discountIndividualization,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                codeList:[],
                ajax_url:'',
                cityList:[],
                checkList:[],
                edit:{
                    discountId:'',
                    discountName:'',
                    city:'',
                    discountCode:''
                }
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            form.on("checkbox(check)",function(data){
                if(data.elem.checked){
                    _this.checkList.push(data.value);
                    return true;
                }else{
                    _this.checkList=_this.checkList.filter(function(v){
                        return v!=data.value;
                    })
                };
            });
            _this.getPage()
        },
        updated:function(){
            form.render();
        },
        methods: {
            discountAdd:function (item) {
                var _this=this;
                _this.edit.discountId = item.discount_id;
                _this.edit.discountName = item.discount_name;
                var selCity = document.getElementById("city");
                for(var i=0; i<selCity.options.length; i++){
                    if (selCity.options[i].value==item.city) {
                        selCity.options[i].selected = true;
                    }
                }
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['500px', '450px'], //宽高
                    content: $('#edit'),
                    title: "新增优惠促销",
                    cancel: function () {
                        $('#edit').hide();
                        selCity.options[0].selected = true;
                    },
                    success: function(){
                    }
                });
                form.on('submit(edit)', function (data) {
                    var formData=data.field;
                    $.ajax({
                        url: _this.ajax_url+'/discountAdd',
                        type: 'post',
                        data: JSON.stringify(formData),
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        contentType: false,
                        processData: false,
                        success: function () {
                            selCity.options[0].selected = true;
                            _this.getPage();
                        }
                    })
                    $('#edit').hide();
                    layer.close(index);
                    layer.msg('操作成功');
                    return false
                });
                form.render()
            },
            discountDel:function () {
                var _this = this;
                var datas = {discount:_this.checkList}
                if (datas.discount.length>0) {
                    layer.confirm('确认删除', {
                        btn: ['确定','取消'] //按钮
                    }, function(){
                        if (datas.discount.length>0) {
                            $.ajax({
                                url: _this.ajax_url + '/cardDiscountDel',
                                type: 'post',
                                data: JSON.stringify(datas),
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8'
                                },
                                dataType: 'json',
                                success: function (result) {
                                    if (result.resCode == '000000') {
                                        layer.msg('删除成功', {icon: 1})
                                        _this.getPage()
                                    } else {
                                        layer.msg(result.resDesc, {icon: 7})
                                        _this.getPage()
                                    }
                                }
                            })
                        } else {
                            layer.msg('请选择一条信息',{icon:7});
                            return;
                        }
                        form.render();
                    });
                } else {
                    layer.msg('请选择一条信息',{icon:7});
                    return;
                }
            },
            state:function (state,id) {
                var _this=this;
                var datas={"state":state,"discountId":id}
                $.ajax({
                    url: _this.ajax_url+'/discountOnOffLine',
                    type: 'post',
                    data:JSON.stringify(datas),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.resCode != '000000') {
                            layer.msg(result.resDesc, {icon: 7})
                        }
                        _this.getPage()
                    }
                })
            },
            getPage:function () {
                var _this = this;
                this.checkList=[];
                $.ajax({
                    url: _this.ajax_url+'/discountIndividualization',
                    type: 'post',
                    data:JSON.stringify({discountId:''}),
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.cityList = result.resBody.city;
                        _this.codeList = result.resBody.discount;
                    }
                })
            },
            checkInit: function(item) {
                var _this = this;
                var checkListStr = _this.checkList.join(',');
                if (checkListStr.indexOf(item.discount_id) != -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    return {
        discountIndividualization: obj
    }
});