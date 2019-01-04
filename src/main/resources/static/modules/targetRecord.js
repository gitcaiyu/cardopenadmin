define(['layui', 'text!../../pages/targetRecord.html'], function (layui, targetRecord) {
    var form = layui.form;

    var obj = {
        template: targetRecord,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                totalCount: 0,
                name:'',
                dept:'',
                date:'',
                recordList: [],
                departList:[],
                dataMonthList:[],
                ajax_url:'',
                edit_data:{
                    SUM_DATE:'',
                    BIG_NAME:'',
                    BIG_CODE:'',
                    DEPT_ID:'',
                    EXP_CODE:'',
                    EXP_NAME:'',
                    EXP_VALUE:'',
                    PRO_NAME:''
                },
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            this.getPage();
            this.getDataMonth();
        },
        updated:function(){
            form.render();
        },
        methods: {
            getDataMonth:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'targetRecord/getDateAndDept',
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                        _this.dataMonthList=result.date;
                        _this.departList=result.dept
                        form.render();
                        form.on('select(seleDataMonth)',function(data){
                            console.log(data.value)
                            _this.date=data.value;
                            _this.getPage();
                        });
                        form.on('select(seleDepart)',function(data){
                            _this.dept=data.value;
                            _this.getPage();
                        });
                    }
                });
            },
            edit: function (item) {
                var _this=this;
                if(this.checkEdit(item)){
                    return;
                };
                this.edit_data.SUM_DATE=item.SUM_DATE;
                this.edit_data.BIG_NAME=item.BIG_NAME;
                this.edit_data.BIG_CODE=item.BIG_CODE;
                this.edit_data.DEPT_ID=item.DEPT_ID;
                this.edit_data.EXP_CODE=item.EXP_CODE;
                this.edit_data.EXP_NAME=item.EXP_NAME;
                this.edit_data.EXP_VALUE=item.EXP_VALUE;
                this.edit_data.PRO_NAME=item.PRO_NAME;
                this.saveInfo();
            },
            searchSupple:function(){
                var _this=this;
                this.curr=1;
                this.getPage();
            },
            searchReset: function(){
                var _this=this;
                this.date="";
                this.dept="";
                this.name="";
                this.initSelect({value:_this.date,name:"seleDataMonth"});
                this.initSelect({value:_this.dept,name:"seleDepart"});
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
                $.ajax({
                    url: _this.ajax_url+'targetRecord/pageSelect',
                    type: 'post',
                    data:{
                        curr:_this.curr,
                        limit:_this.limit,
                        name:_this.name,
                        dept:_this.dept,
                        date:_this.date
                    },
                    dataType: 'json',
                    beforeSend: function(){
                        _this.load = true;
                    },
                    success: function (result) {
                        _this.load = false;
                        _this.recordList=result.arr;
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
                                if (!first) {
                                    $.ajax({
                                        url: _this.ajax_url+'targetRecord/pageSelect',
                                        type: 'post',
                                        data:{
                                            curr:obj.curr,
                                            limit:obj.limit,
                                            name:_this.name,
                                            dept:_this.dept,
                                            date:_this.date
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.recordList = result.arr;
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
            saveInfo:function(){
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['600px', ''], //宽高
                    content: $('#apiEdit'),
                    cancel: function () {
                        $('#apiEdit').hide();
                    }
                });

                form.on('submit(edit)', function (data) {
                    console.log(data.field)
                    var formData=data.field;
                    formData.DEPT_ID=_this.edit_data.DEPT_ID;
                    $.ajax({
                        url: _this.ajax_url+'targetRecord/insertOrUpdate',
                        type: 'post',
                        data: formData,
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==0){
                                $('#apiEdit').hide();
                                layer.close(index);
                                layer.msg('修改成功',{icon:1});
                                _this.getPage();
                            }
                        }
                     });

                    return false;
                });
                form.render()

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
        targetRecord: obj
    }
});  