define(['layui', 'text!../../pages/targetManage.html'], function (layui, targetManage) {

    var obj = {
        template: targetManage,
        data: function () {
            return {
                curr: '1',
                limit: 20,
                totalCount: 0,
                pro_NAME: '',   //keyword
                targetlist: [],
                argList: [],
                TARGET_LEVEL: [],
                TARGET_TYPE: [],
                calculator_items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '+', '-', '*', '/', '(', ')', '?', ':', '=='],
                output: '',
                output_list: [],
                output_cn: '',
                output_cn_list: [],
                currItem: {},
                tmpArr: [],
                lastClick: '',
                currentClick: '',
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
                    // layer.alert(JSON.stringify(data.field), {
                    //     title: '最终的提交信息'
                    // })
                    console.log(data.field.keyword)
                    _this.pro_NAME = data.field.keyword
                    var objParam = {
                        curr: 1,
                        limit: _this.limit,
                        keyword: _this.pro_NAME
                    };
                    _this.getPage(objParam);
                    return false;
                });
            })
            var objParam = {
                curr: _this.curr,
                limit: _this.limit,
                keyword: _this.pro_NAME
            }

            _this.getPage(objParam);

        },
        updated: function () {
            var form = layui.form;
            form.render();
        },
        methods: {
            searchReset: function(){
                var _this=this;
                this.pro_NAME="";
                this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    keyword: _this.pro_NAME
                });
            },
            add: function () {
                var _this = this;
                $('#manageAdd input').val('')
                _this.reSet();
                $('#manageAdd select').val('')
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['760px', '550px'], //宽高
                    content: $('#manageAdd'),
                    cancel: function () {
                        $('#manageAdd').hide();
                    }
                });
                var form = layui.form;
                form.on('submit(add)', function (data) {
                    var url = _this.ajax_url + 'target/saveInfo'
                    // layer.alert(JSON.stringify(data.field), {
                    //     title: '最终的提交信息'
                    // })
                    _this.insertUpdate(url, data.field)
                    $('#manageAdd').hide();
                    layer.close(index)
                    return false;
                });

                _this.getArgList();
                _this.getParam('TARGET_TYPE');
                _this.getParam('FACTOR_PRI');
            },
            edit: function (item) {
                console.log(item)
                var _this = this;
                _this.reSet();
                _this.output = item.TARGET_EXPRE
                _this.output_cn = item.TARGET_EXPLAIN
                _this.currItem = item;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['760px', '550px'], //宽高
                    content: $('#manageEdit'),
                    cancel: function () {
                        $('#manageEdit').hide()
                        _this.output = ''
                        _this.output_cn = ''
                    }
                });
                var form = layui.form;
                form.on('submit(edit)', function (data) {
                    var url = _this.ajax_url + 'target/saveInfo'
                    // layer.alert(JSON.stringify(data.field), {
                    //     title: '最终的提交信息'
                    // })
                    _this.insertUpdate(url, data.field)
                    $('#manageEdit').hide()
                    layer.close(index)
                    return false;
                });
                _this.getArgList();
                _this.getParam('TARGET_TYPE');
                _this.getParam('FACTOR_PRI');
            },
            del: function (item) {
                var _this = this;
                var index = layer.confirm('确认要删除吗?', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.ajax({
                        url: _this.ajax_url + 'target/delInfo',
                        type: 'post',
                        data: {
                            id: item.TARGET_ID
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.flag == 0) {
                                var objParam = {
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    keyword: _this.pro_NAME
                                }
                                layer.msg('删除成功', { icon: 1, time: 1000 }, function () {
                                    var num = _this.totalCount - 1;
                                    if (num % _this.limit == 0) {
                                        objParam.curr = objParam.curr - 1 == 0 ? 1 : objParam.curr - 1
                                        _this.getPage(objParam)
                                    }
                                    _this.getPage(objParam)
                                });

                            } else {
                                var objParam = {
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    keyword: _this.pro_NAME
                                }
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
                console.log(paramObj)
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url + 'target/showInfo',
                    type: 'post',
                    data: paramObj,
                    dataType: 'json',
                    success: function (result) {
                        _this.targetlist = result.list;
                        _this.totalCount = result.total ? result.total : 0;
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
                                        url: _this.ajax_url + 'target/showInfo',
                                        type: 'post',
                                        data: {
                                            curr: obj.curr,
                                            limit: obj.limit,
                                            keyword: _this.pro_NAME ? _this.pro_NAME : ''
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.targetlist = result.list;
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
            getArgList: function () {
                var _this = this;
                $.ajax({
                    url: _this.ajax_url + 'target/getInfo',
                    type: 'post',
                    data: {},
                    dataType: 'json',
                    success: function (result) {
                        console.log(result[0])
                        _this.argList = result;
                    }
                })
            },
            getParam: function (paramObj) {
                var _this = this;
                $.ajax({
                    url: _this.ajax_url + 'common/getParam',
                    type: 'post',
                    data: {
                        id: paramObj
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (paramObj == 'TARGET_TYPE') {
                            _this.TARGET_LEVEL = result;
                        } else {
                            _this.TARGET_TYPE = result;
                        }

                    }
                })
            },
            insertUpdate: function (urlParam, dataParam) {
                console.log(urlParam)
                var _this = this;
                $.ajax({
                    url: urlParam,
                    data: dataParam,
                    type: 'post',
                    dataType: 'json',
                    success: function (result) {
                        if (result.flag == 0) {
                            var objParam = {
                                curr: _this.curr,
                                limit: _this.limit,
                                keyword: _this.pro_NAME
                            }
                            layer.msg('操作成功', { icon: 1, time: 1000 }, function () {
                                _this.getPage(objParam)
                            });

                        } else {
                            var objParam = {
                                curr: _this.curr,
                                limit: _this.limit,
                                keyword: _this.pro_NAME
                            }
                            layer.msg('操作失败', { icon: 5, time: 1000 }, function () {
                                _this.getPage(objParam)
                            });
                        }
                    }

                })
            },
            addItem: function (item) {
                //console.log(this.tmpArr.pop())
                var itemCode, itemCode_cn;
                if (item instanceof Object) {
                    itemCode = item.CODE
                    itemCode_cn = item.NAME
                } else {
                    itemCode = item;
                    itemCode_cn = item;
                }

                this.lastClick = this.tmpArr[this.tmpArr.length - 1] + '';

                this.tmpArr.push(itemCode);

                this.currentClick = itemCode + '';
                //console.log(item)
                console.log(this.tmpArr)
                if (this.lastClick) {
                    if (this.clickCheck(this.lastClick, this.currentClick, this.output)) {
                        this.output += itemCode;
                        this.output_list.push(this.output);

                        this.output_cn += itemCode_cn
                        this.output_cn_list.push(this.output_cn);


                        
                    }
                }

            },
            reBack: function () {
                if (this.output_list.length <= 1 && this.output_cn_list.length <= 1) {
                    this.output_list = [""];
                    this.output = this.output_list[0];

                    this.output_cn_list = [""];
                    this.output_cn = this.output_cn_list[0];

                    this.tmpArr = []
                    return;
                }
                this.output = this.output_list.splice(-2, 1)[0];
                this.output_cn = this.output_cn_list.splice(-2, 1)[0];

                this.tmpArr.splice(this.tmpArr.length-1,1)
                console.log(this.tmpArr)

            },
            reSet: function () {
                this.output = "";
                this.output_list = [];

                this.output_cn = "";
                this.output_cn_list = [];

                this.lastClick = ''
                this.currentClick = ''
                this.tmpArr = []

            },
            clickCheck: function (lastClick, currentClick, val) {
                console.log(lastClick, currentClick)
                console.log(val)

                var num = '0123456789';
                var operator = '+-*/';
                var other = '?:)';
                if (num.indexOf(lastClick) > -1) {
                    if (currentClick.indexOf('EX') > -1 || currentClick.indexOf('NC') > -1) {
                        this.tmpArr.pop();
                        console.log(1)
                        return false;
                    }
                } else if (lastClick.indexOf('EX') > -1 || lastClick.indexOf('NC') > -1) {
                    if (!(operator.indexOf(currentClick) > -1 || currentClick == ')')) {
                        this.tmpArr.pop();
                        console.log(2)
                        return false;
                    }
                } else if (operator.indexOf(lastClick) > -1 || '(:?'.indexOf(lastClick) > -1) {
                    if (operator.indexOf(currentClick) > -1 || other.indexOf(currentClick) > -1) {
                        console.log(3)
                        this.tmpArr.pop();
                        return false;
                    }
                } else if (currentClick == ')') {
                    if (val.indexOf('(') == -1 || (val.split('(').length <= val.split(')').length)) {
                        console.log(a)
                        this.tmpArr.pop();
                        return false;
                    }
                } else if (lastClick == ')') {
                    if (!(operator.indexOf(currentClick) > -1 || other.indexOf(currentClick) > -1)) {
                        this.tmpArr.pop();
                        console.log(4)
                        return false;
                    }
                }else if (currentClick == ':') {
                    if (val.indexOf('?') == -1) {
                        this.tmpArr.pop();
                        return false;
                    }
                } else if (currentClick == '==') {
                    if (!(num.indexOf(lastClick) > -1 || lastClick.indexOf('EX') > -1 || lastClick.indexOf('NC') > -1 || lastClick == ')')) {
                        this.tmpArr.pop();
                        return false;
                    }
                } else if (lastClick == '==') {
                    if (!(num.indexOf(currentClick) > -1 || currentClick.indexOf('EX') > -1 || currentClick.indexOf('NC') > -1)) {
                        this.tmpArr.pop();
                        return false;
                    }
                }
                return true;
            }

        }
    }
    return {
        targetManage: obj
    }
});