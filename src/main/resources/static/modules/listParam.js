define(['layui', 'text!../../pages/listParam.html'], function (layui, listParam) {
    var obj = {
        template: listParam,
        data: function () {
            return {
                curr: '1',
                limit: 20,
                totalCount: 0,
                PARAM_NAME: '',
                catelist: [],
                ajax_url: ''
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
                    //console.log(data.field.PARAM_NAME)
                    _this.PARAM_NAME = data.field.PARAM_NAME
                    var objParam = {
                        curr: 1,
                        limit: _this.limit,
                        PARAM_NAME: _this.PARAM_NAME
                    };
                    _this.getPage(objParam);
                    return false;
                });
            });
            var objParam = {
                curr: _this.curr,
                limit: _this.limit,
                PARAM_NAME: _this.PARAM_NAME
            }

            _this.getPage(objParam);

        },
        methods: {
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url + 'common/getParamInfo',
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
                                        url: _this.ajax_url + 'common/getParamInfo',
                                        type: 'post',
                                        data: {
                                            curr: obj.curr,
                                            limit: obj.limit,
                                            PARAM_NAME: _this.PARAM_NAME ? _this.PARAM_NAME : ''
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
        listParam: obj
    }
});