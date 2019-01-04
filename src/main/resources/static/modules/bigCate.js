define(['layui', 'text!../../pages/bigCate.html'], function (layui, bigCate) {
    //  function load(){
    //      vue.component('load',{
    //          template:list,
    //          data(){
    //              return {
    //                  msg:'aabb'
    //              }
    //          }
    //      })
    //  }
    //console.log(bigCateAdd)
    var obj = {
        template: bigCate,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                pro_NAME: '',
                catelist: [],
                ajax_url:''
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            layui.use(['laypage', 'layer', 'form'], function () {
                var laypage = layui.laypage
                    , layer = layui.layer,
                    form = layui.form;
                form.on('submit(search)', function (data) {
                    // layer.alert(JSON.stringify(data.field), {
                    //     title: '最终的提交信息'
                    // })
                    console.log(data.field.pro_NAME)
                    _this.pro_NAME = data.field.pro_NAME
                    var objParam = {
                        curr: 1,
                        limit: _this.limit,
                        pro_NAME: _this.pro_NAME
                    };
                    _this.getPage(objParam);
                    return false;
                });
            })
            var objParam = {
                curr: _this.curr,
                limit: _this.limit,
                pro_NAME: _this.pro_NAME
            }

            _this.getPage(objParam);

        },
        methods: {
            searchReset: function(){
                var _this=this;
                this.pro_NAME="";
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    pro_NAME: _this.pro_NAME
                });
            },
            add: function () {
                console.log(this)
                var _this = this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['460px', '200px'], //宽高
                    content: $('#bigCateAdd'),
                    cancel: function(){
                        $('#bigCateAdd').hide();
                    }
                });
                var form = layui.form;
                form.on('submit(add)', function (data) {
                    var urlParam = _this.ajax_url + 'product/insert'
                    var dataParam = data;
                    _this.insertUpdate(urlParam,dataParam)
                    // layer.alert(JSON.stringify(data.field), {
                    //     title: '最终的提交信息'
                    // })
                    $('#bigCateAdd').hide();
                    layer.close(index)
                    return false;
                });
            },
            edit: function (id) {
                console.log(id)
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['460px', '200px'], //宽高
                    content: $('#bigCateEdit'),
                    cancel: function(){
                        $('#bigCateEdit').hide()
                    }
                });
                var form = layui.form;
                form.on('submit(edit)', function (data) {

                    // layer.alert(JSON.stringify(data.field), {
                    //     title: '最终的提交信息'
                    // })
                    $('#bigCateEdit').hide()
                    layer.close(index)
                    return false;
                });
            },
            del: function (id) {
                var _this = this;
                var index = layer.confirm('确认要删除吗?', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.ajax({
                        url: _this.ajax_url + 'product/remove',
                        type: 'post',
                        data: {
                            proId: id
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result == 1) {
                                var objParam = {
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    pro_NAME: _this.pro_NAME
                                }
                                layer.msg('删除成功', { icon: 1, time: 1000 }, function () {
                                    _this.getPage(objParam)
                                });

                            } else {
                                layer.msg('删除失败', { icon: 5, time: 1000 }, function () {
                                    _this.getPage(objParam)
                                });
                            }

                        }
                    })
                }, function () {
                    layer.close(index)
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url + 'product/showInfo',
                    type: 'post',
                    data: paramObj,
                    dataType: 'json',
                    beforeSend: function(){
						_this.load = true;
					},
                    success: function (result) {
                        _this.load = false;
                        _this.catelist = result.arr;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        console.log(laypage)
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
                                        url: _this.ajax_url + 'product/showInfo',
                                        type: 'post',
                                        data: {
                                            curr: obj.curr,
                                            limit: obj.limit,
                                            pro_NAME: _this.pro_NAME ? _this.pro_NAME : ''
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.catelist = result.arr;
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
            insertUpdate:function(urlParam,dataParam){
                console.log(urlParam)
                var _this = this;
                $.ajax({
                    url:urlParam,
                    data:dataParam.field.pro_NAME,
                    type:'post',
                    dataType:'json',
                    success:function(result){
                        if (result == 1) {
                            var objParam = {
                                curr: _this.curr,
                                limit: _this.limit,
                                pro_NAME: _this.pro_NAME
                            }
                            layer.msg('操作成功', { icon: 1, time: 1000 }, function () {
                                _this.getPage(objParam)
                            });

                        } else {
                            layer.msg('操作失败', { icon: 5, time: 1000 }, function () {
                                _this.getPage(objParam)
                            });
                        }
                    }

                })
            }
        }
    }
    return {
        bigCate: obj
    }
});