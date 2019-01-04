define(['layui', 'text!../../pages/targetErr.html'], function (layui, targetErr) {
    var laydate = layui.laydate;
    var obj = {
        template: targetErr,
        data: function () {
            return {
                curr: '1',
                limit: 20,
                totalCount: 0,
                ERROR_DATE: '',
                catelist: [
                    {

                    }
                ],
                ajax_url: ''
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            laydate.render({
                elem: '#date1', //指定元素
                done: function(value, date){ //监听日期被切换
                    _this.ERROR_DATE=value;
                },
                showBottom: true,
            });
            layui.use(['laypage', 'layer', 'form'], function () {
                var laypage = layui.laypage
                    , layer = layui.layer,
                    form = layui.form;
                form.on('submit(search)', function (data) {
                    //console.log(data.field.param_NAME)
                    _this.ERROR_DATE = data.field.ERROR_DATE
                    var objParam = {
                        curr: 1,
                        limit: _this.limit,
                        ERROR_DATE: _this.ERROR_DATE
                    };
                    _this.getPage(objParam);
                    return false;
                });
            })
            var objParam = {
                curr: _this.curr,
                limit: _this.limit,
                ERROR_DATE: _this.ERROR_DATE
            }

            _this.getPage(objParam);

        },
        methods: {
            searchReset: function(){
                var _this=this;
                this.ERROR_DATE="";
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    ERROR_DATE: _this.ERROR_DATE
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url + 'targetCalError/getErrorInfo',
                    type: 'post',
                    data: paramObj,
                    dataType: 'json',
                    success: function (result) {
                        _this.catelist = result.arr;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                       // console.log(laypage)
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
                                        url: _this.ajax_url + 'targetCalError/getErrorInfo',
                                        type: 'post',
                                        data: {
                                            curr: obj.curr,
                                            limit: obj.limit,
                                            ERROR_DATE: _this.ERROR_DATE ? _this.ERROR_DATE : ''
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
            }
        }
    }
    return {
        targetErr: obj
    }
});