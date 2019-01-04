define(['layui', 'text!../../pages/apiSuppleSum.html'], function (layui, apiSuppleSum) {
    var form = layui.form;

    var obj = {
        template: apiSuppleSum,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 25,
                totalCount: 0,
                name:'',
                supplier:'',
                codeList: [],
                supplierList:[],
                ajax_url:'',
                checkList:[],
                dateStr:'',
                checkDate:true,
                exportUrl:'',
                strDate:'',
                endDate:'',
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            this.resetDate();
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
            this.getSupplier();
        },
        updated:function(){
            form.render();
        },
        methods: {
            checkInit: function(item){
                var _this=this;
                var checkListStr=this.checkList.join(',');
                if(checkListStr.indexOf(item.CODE)!=-1){
                    return true;
                }else{
                    return false;
                }
            },
            checkCodes: function(){
                var _this=this;
                if(!this.checkList.length){
                    layer.msg("请选择数据",{icon:7});
                    return;
                };
                this.exportUrl=this.ajax_url+'addApiCostDay/exportExcelByCodes?codes='+JSON.stringify(_this.checkList)+'&start='+this.strDate+'&end='+this.endDate+'&name='+this.name+'&supplier='+this.supplier;
                $.ajax({
                    url: _this.ajax_url+'addApiCostDay/showInfoByCodes',
                    type: 'post',
                    data:{
                        codes:JSON.stringify(_this.checkList),
                        start:_this.strDate,
                        end:_this.endDate
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.checkList=[];
                        _this.codeList=result.arr;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        var laypage = layui.laypage;
                        laypage.render({
                            elem: 'page'
                            , count: _this.totalCount
                            , theme: '#1E9FFF'
                        });
                    }
                });
            },
            resetDate: function(){
                var _this=this;
                var date = new Date();
                var M = (date.getMonth()+1)>10?(date.getMonth()+1):'0'+(date.getMonth()+1);
                var D = date.getDate()>10?date.getDate():'0'+date.getDate();
                var date_time = date.getFullYear()+'-'+M+'-'+D;
                var str_time = date.getFullYear()+'-'+M+'-'+'0'+1;
                this.checkDate=true;
                this.strDate=str_time;
                this.endDate=date_time;
                var laydate = layui.laydate;
                  laydate.render({
                    elem: '#strDate',
                    showBottom: false,
                    value: str_time,
                    done: function(data){
                        _this.strDate=data;
                       var b=new Date(_this.endDate);
                       var c=new Date(_this.strDate);
                       _this.checkDate=true;
                       if(b.getTime()<c.getTime()){
                          _this.checkDate=false;
                          layer.msg("结束日期需不小于开始日期",{icon:7})
                          return;
                       }else{
                         _this.getPage();
                       };
                    }
                  });
                  laydate.render({
                    elem: '#endDate',
                    showBottom: false,
                    value: date_time,
                    done: function(data){
                       _this.endDate=data;
                       var b=new Date(_this.endDate);
                       var c=new Date(_this.strDate);
                       _this.checkDate=true;
                       if(b.getTime()<c.getTime()){
                          _this.checkDate=false;
                          layer.msg("结束日期需不小于开始日期",{icon:7})
                          return;
                       }else{
                         _this.getPage();
                       };
                    }
                  });
            },
            getSupplier:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'addApiCostDay/getSupplier',
                    type: 'post',
                    data:{},
                    dataType: 'json',
                    success: function (result) {
                        _this.supplierList=result;
                        form.render();
                        form.on('select(seleSupplier)',function(data){
                            _this.supplier=data.value;
                            _this.getPage();
                        })
                    }
                });
            },
            searchSupple:function(){
                var _this=this;
                this.curr=1;
                this.getPage();
            },
            searchReset: function(){
                var _this=this;
                this.resetDate();
                this.supplier="";
                this.name="";
                this.initSelect({value:_this.supplier,name:"seleSupplier"});
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
                this.exportUrl=this.ajax_url+'addApiCostDay/exportExcel?start='+this.strDate+'&end='+this.endDate+'&name='+this.name+'&supplier='+this.supplier;
                if(!this.checkDate){
                    this.exportUrl="#";
                    layer.msg("结束日期需不小于开始日期",{icon:7});
                    return;
                };
                $.ajax({
                    url: _this.ajax_url+'addApiCostDay/getApiCostDay',
                    type: 'post',
                    data:{
                        curr:_this.curr,
                        limit:_this.limit,
                        name:_this.name,
                        supplier:_this.supplier,
                        start:_this.strDate,
                        end:_this.endDate
                    },
                    dataType: 'json',
                    beforeSend: function(){
                        _this.load = true;
                    },
                    success: function (result) {
                        _this.load = false;
                        _this.codeList=result.arr;
                        _this.dateStr=result.dateStr;
                        _this.totalCount = result.totalCount ? result.totalCount : 0;
                        laypage.render({
                            elem: 'page'
                            , count: _this.totalCount
                            , theme: '#1E9FFF'
                            , limit: _this.limit
                            , curr: _this.curr
                            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
                            , limits: [10, 25, 50]
                            , jump: function (obj, first) {
                                form.render();
                                if (!first) {
                                    $.ajax({
                                        url: _this.ajax_url+'addApiCostDay/getApiCostDay',
                                        type: 'post',
                                        data:{
                                            curr:obj.curr,
                                            limit:obj.limit,
                                            name:_this.name,
                                            supplier:_this.supplier,
                                            start:_this.strDate,
                                            end:_this.endDate
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.dateStr=result.dateStr;
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
            }
        }
    }
    return {
        apiSuppleSum: obj
    }
});