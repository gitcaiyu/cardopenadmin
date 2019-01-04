define(['layui', 'text!../../pages/feeSet.html'], function (layui, feeSet) {
    var form = layui.form;
    var initInnerData={},editInnerData={},initFeeSetData={},initOtherCondition={};
    var obj = {
        template: feeSet,
        data: function () {
            return {
                load: false,
                curr: '1',
                limit: 20,
                keyword: '',
                totalCount: 0,
                feelist: [],
                feeConditionList:true,/**显示多条列表*/
                feeCondition_list:[],
                feeConditionAjax_list:[],
                feeConditionAjax_data:{},
                fcAddInitShow:false,
                feeCondition_curr:{
                    feeTnrTyp:{value:"",disabled:false},
                    feeMinTnr:{value:0,disabled:false},
                    feeMaxTnr:{value:0,disabled:false},
                    loanMinAmt:{value:0,disabled:false},
                    loanMaxAmt:{value:0,disabled:false},
                    tnrUnit:{value:'',disabled:false},
                    feeActionTyp:{value:'',disabled:false},
                    feePctBase:{value:'',disabled:false},
                    feeTnrStr:{value:0,disabled:false},
                    feeTnrEnd:{value:0,disabled:false},
                    feePct:{value:0,disabled:false},
                    feeFixAmt:{value:0,disabled:false},
                    feeMinAmt:{value:0,disabled:false},
                    feeMaxAmt:{value:0,disabled:false},
                    feeResource:{value:'',disabled:false},
                    feeAccInd:{value:'',disabled:false},
                    edit:false,
                    fcId:0,
                },
                feeConditionEdit:false,/**显示多条编辑**/
                feeConditionAdd:true,/**显示多条添加**/
                feeouterlist:[],/**外部select字典**/
                feeinnerlist:[],/**多条select字典**/
                feelistAdd:0,//多条id保存
                editNum:[],//多条编辑条数
                feeSetItem:{
                    feeCde:'',
                    feeTyp:'',
                    feeAmtTyp:'',
                    accAmtTyp:'',
                    feeDesc:'',
                    feeCondOpt:'01',//收费条件
                    pFeeDtlList:[]
                },
                feeEditItem:{},
                is_number:false,
                isSolid:false,//判断其他的固定金额是否必输
                innerRequired:false,
                is_feeTnrTyp:false,
                is_feeMinTnr:false,
                is_feeMaxTnr:false,
                is_tnrUnit:false,
                is_feeActionTyp:false,
                is_feeResource:false,
                is_feePct:false,
                is_feeFixAmt:false,
                is_feeMinAmt:false,
                is_feeMaxAmt:false,
                is_feeTnrStr:false,
                is_feeTnrEnd:false,
                is_loanMinAmt:false,
                is_loanMaxAmt:false,

                feeEditItem:{},
                ajax_url:'',
                feeType:'1',

                edit_disable:'',
            }
        },
        mounted: function () {
            var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
            layui.use(['laypage', 'layer', 'form', 'laydate'], function () {
                var laypage = layui.laypage
                    , layer = layui.layer
                    , laydate = layui.laydate
                form = layui.form;
                //console.log(layui)
                form.on('submit(search)', function (data) {
                    _this.keyword = data.field.keyword;
                    var objParam = {
                        curr: 1,
                        limit: _this.limit,
                        keyword: _this.keyword
                    }
                    _this.getPage(objParam);
                    return false;
                });
                form.verify({
                    number: function(value, item){
                        if(!/^(-?\d+)(\.\d+)?$/.test(value)){
                            return '需要填写数字';
                        }
                    },
                    checkNum: function(value, item){
                        //value：表单的值、item：表单的DOM对象

                        if(value>100 || value<0){
                            return '需要在0~100中间';
                        }
                    },
                    checkFee: function(value, item){
                        if(value<_this.feeSetItem.other_condition.feeMinAmt*1){
                            return '最高费用需大于最低费用';
                        }
                    }
                });

            });
            initInnerData=$.extend(true,{},_this.feeCondition_curr);
            initFeeSetData=$.extend(true,{},_this.feeSetItem);
            _this.getPage({
                curr: _this.curr,
                limit: _this.limit,
                keyword: _this.keyword
            });
            _this.getOuterFee();//获取select数据
            _this.getInnerFee();//获取多条select数据
            form.render();
        },
        methods: {
            searchReset: function(){
                var _this=this;
                this.keyword="";
                _this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    keyword: _this.keyword
                });
            },
            /**获取外部select列表**/
            getOuterFee:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'feeSetting/getMasterParam',
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                        _this.feeouterlist=result;
                    },
                    error:function(e){}
                });
            },
            getInnerFee:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'feeSetting/getSlaveParam',
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                        _this.feeinnerlist=result;
                    },
                    error:function(e){}
                });
            },
            /***初始化多条新增**/
            initInnerRule:function(){
                var _this=this;
                this.feeCondition_curr=$.extend(true,{},initInnerData);
                this.initRadioSelect({value:"",name:"feeTnrTyp"});
                this.initRadioSelect({value:"",name:"feeActionTyp"});
                this.initRadioSelect({value:"",name:"feePctBase"});
                this.initRadioSelect({value:"",name:"tnrUnit"});
                this.initRadioSelect({value:"",name:"feeResource"});
                this.initRadioSelect({value:"",name:"feeAccInd"});
                $('#feePctBase').attr('disabled',false);
                $('#feeAccInd').attr('disabled',false);
                form.render('','feeConditionAdd');
            },
            /**多条判断条件**/
            checkInnerRule:function(item){
                var _this=this;
                var select_id="";
                item.fcId*1?select_id="_"+item.fcId*1:"";
                /***编辑初始化判断**/
                if(item.feeTnrTyp.value=='01'){
                    item.feeTnrStr.disabled=true;
                    item.feeTnrEnd.disabled=true;
                }else if(item.feeTnrTyp.value=='02'){
                    $('#feeAccInd'+select_id).attr('disabled',true);
                }else if(item.feeTnrTyp.value=='03'){
                    item.feeTnrStr.disabled=true;
                    item.feeTnrEnd.disabled=true;
                    $('#feeAccInd'+select_id).attr('disabled',true);
                }else if(item.feeTnrTyp.value=='04'){
                    item.feeTnrStr.disabled=true;
                    item.feeTnrStr.value=1;
                    item.feeTnrEnd.disabled=true;
                    item.feeTnrEnd.value=1;
                };
                /* if(item.feeActionTyp.value=='NOAMT'){
                     item.feePct.disabled=true;
                     item.feeMinAmt.disabled=true;
                     item.feeMaxAmt.disabled=true;
                     $('#feePctBase'+select_id).attr('disabled',true);
                 }else if(item.feeActionTyp.value=='PCTAMTALL'){
                     item.feeFixAmt.disabled=true;
                     item.feeAccInd.value="N"
                     $('#feeAccInd'+select_id).attr('disabled',true);
                     item.feeAccInd.disabled=2;
                     $('#feeAccInd'+select_id).val('N')
                 };*/
                if(item.feeAccInd.value=="N"){
                    $('#feeAccInd'+select_id).attr('disabled',true);
                };
                if(item.feeTnrTyp.value=='01'){
                    $('#feeAccInd'+select_id).attr('disabled',false);

                }
                form.render('','feeConditionEdit');

                form.on('select(feeTnrTyp)', function (data) {
                    _this.is_feeTnrTyp=true;
                    item.feeTnrTyp.value=data.value;
                    item.feeTnrStr.disabled=false;
                    item.feeTnrEnd.disabled=false;
                    item.feeTnrStr.value="0";
                    item.feeTnrEnd.value="0";
                    /**如果“计算类型”选择是否摊销不可写**/
                    item.feeAccInd.disabled_01=false;
                    $('#feeAccInd'+select_id).attr('disabled',false);

                    if(data.value=='01'){
                        item.feeTnrStr.disabled=true;
                        item.feeTnrEnd.disabled=true;
                    }else if(data.value=='02'){
                        $('#feeAccInd'+select_id).attr('disabled',true);
                        item.feeAccInd.disabled_01=true;
                    }else if(data.value=='03'){
                        item.feeTnrStr.disabled=true;
                        item.feeTnrEnd.disabled=true;
                        $('#feeAccInd'+select_id).attr('disabled',true);
                        item.feeAccInd.disabled_01=true;
                    }else if(data.value=='04'){
                        item.feeTnrStr.disabled=true;
                        item.feeTnrStr.value=1;
                        item.feeTnrEnd.disabled=true;
                        item.feeTnrEnd.value=1;
                    }else{
                        _this.is_feeTnrTyp=false;
                    };
                    if(item.feeAccInd.disabled_02){
                        $('#feeAccInd'+select_id).attr('disabled',true);
                        item.feeAccInd.value="N"
                        $('#feeAccInd'+select_id).val('N');
                    };
                    console.log(item.feeAccInd.disabled_01+','+item.feeAccInd.disabled_02)
                    form.render('select','YES_NO');
                });
                form.on('select(tnrUnit)',function(data){
                    _this.is_tnrUnit=false;
                    item.tnrUnit.value=data.value;
                    if(data.value){
                        _this.is_tnrUnit=true;
                    }
                });
                form.on('select(feeActionTyp)', function (data) {
                    item.feeActionTyp.value=data.value;
                    _this.is_feeActionTyp=true;
                    item.feePct.disabled=false;
                    item.feeMinAmt.disabled=false;
                    item.feeMaxAmt.disabled=false;
                    item.feeFixAmt.disabled=false;
                    item.feePct.value="0";
                    item.feeMinAmt.value="0";
                    item.feeMaxAmt.value="0";
                    item.feeFixAmt.value="0";
                    item.feeAccInd.value="";
                    item.feePctBase.value="";
                    $('#feePctBase'+select_id).attr('disabled',false);
                    /**如果“收取类型”选择是否摊销不可写**/
                    item.feeAccInd.disabled_02=false;
                    $('#feeAccInd'+select_id).val('');
                    $('#feeAccInd'+select_id).attr('disabled',false);
                    if(data.value=='NOAMT'){
                        item.feePct.disabled=true;
                        item.feeMinAmt.disabled=true;
                        item.feeMaxAmt.disabled=true;
                        item.feePctBase.value=""
                        item.feeAccInd.disabled=false;
                        $('#feePctBase'+select_id).val('')
                        $('#feePctBase'+select_id).attr('disabled',true);
                    }else if(data.value=='PCTAMTALL'){
                        item.feeFixAmt.disabled=true;
                        //item.feeAccInd.value="N"
                        // $('#feeAccInd'+select_id).attr('disabled',true);
                        item.feeAccInd.disabled_02=true;
                        // $('#feeAccInd'+select_id).val('N')
                    }else{
                        _this.is_feeActionTyp=false;
                    };
                    if(item.feeAccInd.disabled_01){
                        //  $('#feeAccInd'+select_id).attr('disabled',true);
                    };
                    form.render('select','FEE_PCT_BASE');
                    form.render('select','YES_NO');
                });
                form.on('select(feeResource)',function(data){
                    _this.is_feeResource=false;
                    item.feeResource.value=data.value;
                    if(data.value){
                        _this.is_feeResource=true;
                    }
                });

            },
            /**多条编辑-下拉列表数据**/
            fcSelectData:function(item){
                item.selectData=this.feeinnerlist;
                return item.selectData;
            },
            /**添加多条-编辑-费用条件**/
            fcEdit:function(item){
                var _this=this;
                if(this.editNum.length==2){
                    if(this.editNum[this.editNum.length-1]=='addNew'){
                        layer.msg('请保存新增数据',{icon:7})
                        return;
                    };
                    layer.msg('请保存修改数据',{icon:7})
                    return;
                }
                this.editNum[0]='edit';
                this.editNum.push(item.fcId);
                if(this.editNum.length>2)return;//如果在编辑多条，不能编辑其他多条
                item.edit=true;
                this.fcAddInitShow=false;
                this.checkInnerRule(item);
                form.render('','feeConditionEdit');
                editInnerData=$.extend(true,{},item);

                this.getFCRidioSelectVal(item,{filter:'feePctBase'});
                this.getFCRidioSelectVal(item,{filter:'feeAccInd'});

            },
            /***添加多条-编辑保存-费用条件***/
            fcSave:function(item){
                var _this=this;
                this.fcRequired(item);
                if(this.is_number){
                    this.innerRequired=true;
                    if(item.feePct.value>100){
                        layer.msg('费用比例需在0~100间',{icon:7});
                    }else{
                        layer.msg('请输入数字',{icon:7})
                    }
                    return;
                };
                if(!this.is_feeTnrTyp ||
                    !this.is_feeResource ||
                    !this.is_feeActionTyp ||
                    !this.is_tnrUnit ||
                    !this.is_feeMinTnr ||
                    !this.is_feeMaxTnr ||
                    !this.is_loanMaxAmt ||
                    !this.is_feeMaxAmt ||
                    !this.is_feeTnrEnd){
                    this.innerRequired=true;
                    layer.msg('请输入必填项',{icon:7});
                    if(item.feeMaxTnr.value*1<item.feeMinTnr.value*1){
                        layer.msg('不能小于“最小期限”',{icon:7})
                    }
                    if(item.loanMaxAmt.value*1<item.loanMinAmt.value*1){
                        layer.msg('不能小于“贷款最小金额”',{icon:7})
                    }
                    if(item.feeTnrEnd.value*1<item.feeTnrStr.value*1){
                        layer.msg('不能小于“开始期数”',{icon:7})
                    }
                    if(item.feeMaxAmt.value*1<item.feeMinAmt.value*1){
                        layer.msg('不能小于“最低费用”',{icon:7});
                    }
                    return;
                }else{
                    this.innerRequired=false;
                };
                this.editNum.pop();
                item.edit=false;
                _this.feeConditionAjax_list=[];
                this.fcAddAjax(_this.feeConditionAjax_list,_this.feeCondition_list);
            },
            //删除多条
            fcDel:function(item){
                var _this=this;
                _this.feeConditionAjax_list=[];
                this.feeCondition_list=this.feeCondition_list.filter(function(v){
                    return v.fcId!=item.fcId;
                });

                this.fcAddAjax(_this.feeConditionAjax_list,_this.feeCondition_list);
            },
            /**添加多条-新增**/
            fcAddInit:function(){

                var _this=this;
                this.innerRequired=false;
                this.is_feeTnrTyp=false;
                this.is_feeMinTnr=false;
                this.is_feeMaxTnr=false;
                this.is_tnrUnit=false;
                this.is_feeActionTyp=false;
                this.is_feeResource=false;
                this.is_feeMaxAmt=true;
                this.is_feeTnrEnd=true;
                this.is_loanMaxAmt=true;
                this.initInnerRule();
                this.checkInnerRule(_this.feeCondition_curr);
                if(this.editNum.length==2){
                    editInnerData.fcId?this.fcSave(_this.feeCondition_list[editInnerData.fcId-1]):this.fcSave(_this.feeCondition_list[editInnerData.fcId]);
                    this.editNum.push('addNew');
                }else{
                    this.editNum[1]='addNew';
                };
                var _this=this;
                this.fcAddInitShow=true;
                this.getFCRidioSelectVal(_this.feeCondition_curr,{filter:'feePctBase'});
                this.getFCRidioSelectVal(_this.feeCondition_curr,{filter:'feeAccInd'});
            },
            /***添加多条-新增保存-费用条件***/
            fcRequired:function(obj){
                var _this=this;
                if(this.editNum.length>9){
                    obj=this.feeCondition_curr;
                };
                if(!obj){
                    var obj=this.feeCondition_curr;
                }
                obj.feeTnrTyp.value?this.is_feeTnrTyp=true:this.is_feeTnrTyp=false;
                obj.feeResource.value?this.is_feeResource=true:this.is_feeResource=false;
                obj.feeActionTyp.value?this.is_feeActionTyp=true:this.is_feeActionTyp=false;
                obj.tnrUnit.value?this.is_tnrUnit=true:this.is_tnrUnit=false;
                /*obj.feeMinTnr.value?this.is_feeMinTnr=true:this.is_feeMinTnr=false;
                obj.feeMaxTnr.value?this.is_feeMaxTnr=true:this.is_feeMaxTnr=false;*/
                var reg=/^(\d+)(\.\d+)?$/;
                reg.test(obj.feeMinTnr.value)&&obj.feeMinTnr.value?this.is_feeMinTnr=true:this.is_feeMinTnr=false;
                reg.test(obj.feeMaxTnr.value)&&obj.feeMaxTnr.value?this.is_feeMaxTnr=true:this.is_feeMaxTnr=false;
                reg.test(obj.loanMinAmt.value)?this.is_loanMinAmt=false:this.is_loanMinAmt=true;
                reg.test(obj.loanMaxAmt.value)?this.is_loanMaxAmt=false:this.is_loanMaxAmt=true;
                reg.test(obj.feeTnrStr.value)?this.is_feeTnrStr=false:this.is_feeTnrStr=true;
                reg.test(obj.feeTnrEnd.value)?this.is_feeTnrEnd=false:this.is_feeTnrEnd=true;
                reg.test(obj.feePct.value)&&(obj.feePct.value<=100)?this.is_feePct=false:this.is_feePct=true;
                reg.test(obj.feeFixAmt.value)?this.is_feeFixAmt=false:this.is_feeFixAmt=true;
                reg.test(obj.feeMinAmt.value)?this.is_feeMinAmt=false:this.is_feeMinAmt=true;
                reg.test(obj.feeMaxAmt.value)?this.is_feeMaxAmt=false:this.is_feeMaxAmt=true;
                if(!reg.test(obj.feeMinTnr.value) ||
                    !reg.test(obj.feeMaxTnr.value) ||
                    !reg.test(obj.loanMinAmt.value) ||
                    !reg.test(obj.loanMaxAmt.value) ||
                    !reg.test(obj.feeTnrStr.value) ||
                    !reg.test(obj.feeTnrEnd.value) ||
                    this.is_feePct ||
                    !reg.test(obj.feeFixAmt.value) ||
                    !reg.test(obj.feeMinAmt.value) ||
                    !reg.test(obj.feeMaxAmt.value) ){
                    this.is_number=true;
                }else{
                    this.is_number=false;
                };
                if(obj.feeMaxTnr.value*1<obj.feeMinTnr.value*1){
                    this.is_feeMaxTnr=false;
                    layer.msg('不能小于“最小期限”',{icon:7})
                }else if(obj.feeMaxTnr.value==0){
                    this.is_feeMaxTnr=false;
                }else{
                    this.is_feeMaxTnr=true;
                };
                if(obj.loanMaxAmt.value*1<obj.loanMinAmt.value*1){
                    this.is_loanMaxAmt=false;
                    layer.msg('不能小于“贷款最小金额”',{icon:7})
                }else{
                    this.is_loanMaxAmt=true;
                };
                if(obj.feeTnrEnd.value*1<obj.feeTnrStr.value*1){
                    this.is_feeTnrEnd=false;
                    layer.msg('不能小于“开始期数”',{icon:7})
                }else{
                    this.is_feeTnrEnd=true;
                };
                if(obj.feeMaxAmt.value*1<obj.feeMinAmt.value*1){
                    this.is_feeMaxAmt=false;
                    layer.msg('不能小于“最低费用”',{icon:7});
                }else{
                    this.is_feeMaxAmt=true;
                };
                if(obj.feePct.value>100){
                    layer.msg('费用比例需在0~100间',{icon:7});
                };
                console.log(this.is_number,this.is_feePct)
            },
            fcAdd:function(){
                var _this=this;
                this.fcRequired(_this.feeCondition_curr);
                if(this.is_number){
                    this.innerRequired=true;
                    if(_this.feeCondition_curr.feePct.value>100){
                        layer.msg('费用比例需在0~100间',{icon:7});
                    }else{
                        layer.msg('请输入数字',{icon:7})
                    }
                    return;
                };
                if(!this.is_feeTnrTyp ||
                    !this.is_feeResource ||
                    !this.is_feeActionTyp ||
                    !this.is_tnrUnit ||
                    !this.is_feeMinTnr ||
                    !this.is_feeMaxTnr ||
                    !this.is_loanMaxAmt ||
                    !this.is_feeMaxAmt ||
                    !this.is_feeTnrEnd){
                    this.innerRequired=true;
                    layer.msg('请输入必填项',{icon:7});
                    if(_this.feeCondition_curr.feeMaxTnr.value*1<_this.feeCondition_curr.feeMinTnr.value*1){
                        layer.msg('不能小于“最小期限”',{icon:7})
                    }
                    if(_this.feeCondition_curr.loanMaxAmt.value*1<_this.feeCondition_curr.loanMinAmt.value*1){
                        layer.msg('不能小于“贷款最小金额”',{icon:7})
                    }
                    if(_this.feeCondition_curr.feeTnrEnd.value*1<_this.feeCondition_curr.feeTnrStr.value*1){
                        layer.msg('不能小于“开始期数”',{icon:7})
                    }
                    if(_this.feeCondition_curr.feeMaxAmt.value*1<_this.feeCondition_curr.feeMinAmt.value*1){
                        layer.msg('不能小于“最低费用”',{icon:7});
                    }

                    return;
                }else{
                    this.innerRequired=false;
                };
                var obj = this.feeCondition_curr;

                var objparam = $.extend(true,{},obj);
                this.feelistAdd+=(this.feeCondition_list.length+1);
                objparam.fcId=this.feelistAdd;
                this.feeCondition_list.push(objparam);
                this.feeConditionAjax_list=[];
                this.fcAddAjax(_this.feeConditionAjax_list,_this.feeCondition_list);
                this.fcAddInitShow=false;
                this.editNum=[];
            },
            addDel:function(){
                var _this=this;
                _this.feeConditionAjax_list=[];
                this.fcAddAjax(_this.feeConditionAjax_list,_this.feeCondition_list);
                this.fcAddInitShow=false;
                this.editNum=[];
            },
            /***提取value值传输数据**/
            fcAddAjax:function(ajax_arr,obj_arr){
                if(obj_arr instanceof Array){
                    var item={};
                    for (var i=0;i<obj_arr.length;i++){
                        item={};
                        for(var a in obj_arr[i]){
                            if(obj_arr[i][a].hasOwnProperty('disabled')){
                                item[a]=obj_arr[i][a].value;
                            }else{
                                item[a]=obj_arr[i][a];
                            };
                        };
                        ajax_arr.push(item);
                    };
                }else{
                    for(var a in obj_arr){
                        if(obj_arr[a] && obj_arr[a].hasOwnProperty('disabled')){
                            ajax_arr[a]=obj_arr[a].value;
                        }else{
                            ajax_arr[a]=obj_arr[a];
                        };
                    };
                }
            },
            /**radio,select初始化**/
            initRadioSelect:function(param){
                $('select[name="'+param.name+'"] option').each(function(){
                    if(param.value===this.value){
                        $(this).prop('selected','selected');
                        $(this).siblings().removeProp('selected')
                    }
                });
                $('input[name="'+param.name+'"]').each(function(){
                    $(this).attr('checked',false);
                    $(this).prop('lay-verify','required');
                    if(param.value==this.value){
                        $(this).prop('checked',true);
                        $(this).siblings().attr('checked',false);
                    };
                });
            },
            showSelectName:function(item,filter,sel){
                var select_data=item.selectData;
                for(var i=0;i<select_data[sel].length;i++){
                    if(item[filter].value==select_data[sel][i].PARAM_CODE){
                        return select_data[sel][i].PARAM_NAME;
                    }
                }
            },
            getFCRidioSelectVal:function(item,param){
                var _this=this;
                if(param.filter=="feeTnrTyp" || param.filter=="feeActionTyp" || param.filter=="tnrUnit")return;
                form.on('select('+param.filter+')',function(data){
                    item[param.filter].value=data.value;
                });
                form.render();
            },
            getRidioSelectVal:function(param){
                var _this=this;
                form.on('select('+param.filter+')',function(data){
                    _this.feeSetItem[param.filter]=data.value;
                });
            },
            /**添加初始化**/
            initAdd:function(){
                var _this=this;
                this.feeCondition=1;/**费用条件**/
                this.feeConditionList=true;/**显示多条列表*/
                this.feeConditionEdit=false;/**显示多条编辑**/
                this.feeConditionAdd=true;/**显示多条添加**/
                this.feeCondition_list=[];
                _this.feeSetItem={};
                $.extend(true,_this.feeSetItem,initFeeSetData);
                this.initRadioSelect({value:1,name:'condition'});
                this.initRadioSelect({value:"",name:'calcuType'});
                this.initRadioSelect({value:"",name:'feeTyp'});
                this.initRadioSelect({value:"",name:'feeAmtTyp'});
                this.initRadioSelect({value:"",name:'accAmtTyp'});
                this.initRadioSelect({value:"",name:'feeDesc'});
                console.log(initFeeSetData);
                console.log(_this.feeSetItem);
            },
            add:function(){
                var _this=this;
                this.edit_disable=false
                _this.initAdd();

                _this.editNum=[];
                _this.initInnerRule();
                _this.saveInfo('新增成功！');

            },
            saveInfo:function(msg){
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['90%', '90%'], //宽高
                    content: $('#feeAdd'),
                    cancel: function () {
                        $('#feeAdd').hide();
                    }
                });
                _this.getRidioSelectVal({filter:'feeTyp'});
                _this.getRidioSelectVal({filter:'feeAmtTyp'});
                _this.getRidioSelectVal({filter:'accAmtTyp'});
                form.on('submit(add)', function (data) {
                    if(_this.feeCondition_list.length>0){
                        _this.feeSetItem.pFeeDtlList=_this.feeConditionAjax_list;
                    }else{
                        layer.msg('请新增数据！',{icon:7});
                        return false;
                    };
                    if(_this.editNum.length==2){
                        if(_this.editNum[_this.editNum.length-1]=='addNew'){
                            layer.msg('请保存新增数据！',{icon:7});
                            return false;
                        }else{
                            layer.msg('请保存编辑数据！',{icon:7});
                            return false;
                        }
                    };
                    for(var i=0;i<_this.feeSetItem.pFeeDtlList.length;i++){
                        _this.feeSetItem.pFeeDtlList[i]['feePct']=_this.feeSetItem.pFeeDtlList[i]['feePct']/100;
                    };
                    $.ajax({
                        url: _this.ajax_url+'feeSetting/saveInfo',
                        type: 'post',
                        data:{
                            fee_set:JSON.stringify(_this.feeSetItem),
                        },
                        dataType: 'json',
                        success: function (result) {
                            if(result.flag==0){
                                $('#feeAdd').hide();
                                layer.close(index);
                                layer.msg(msg,{icon:1});
                                _this.getPage({
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    keyword: _this.keyword
                                });
                            }else{
                                layer.msg(result.msg,{icon:7});

                            }
                        },
                        error:function(e){
                            console.log(e);
                        }
                    })
                    return false;
                });
                form.render();

            },
            edit: function (item) {
                var _this=this;
                this.initAdd();
                _this.feeCondition_list=[];
                $.ajax({
                    url: _this.ajax_url+'feeSetting/getInfo',
                    type: 'post',
                    data: {
                        id: item.id
                    },
                    dataType: 'json',
                    success: function (result) {
                        _this.edit_disable=true;
                        _this.editNum=[];
                        _this.initInnerRule();

                        for(var a in result.fee){
                            if(result.fee[a]===null)result.fee[a]="";
                        };
                        var obj=result.feeSignList;
                        if(result.fee.feeCondOpt==1){
                            _this.feeConditionList=true;
                            for(var i=0;i<obj.length;i++){
                                var aa=$.extend(true,{},initInnerData);
                                for(var b in obj[i]){
                                    if(_this.feeCondition_curr[b] instanceof Object){
                                        aa[b]['value']=obj[i][b];
                                    }else{
                                        aa[b]=obj[i][b];
                                        aa['fcId']=i+1;
                                    };
                                };
                                _this.feeCondition_list.push(aa);
                            }
                        }
                        $.extend(true,_this.feeSetItem,item);
                        _this.initRadioSelect({value:_this.feeSetItem.feeTyp,name:'feeTyp'});
                        _this.initRadioSelect({value:_this.feeSetItem.feeAmtTyp,name:'feeAmtTyp'});
                        _this.initRadioSelect({value:_this.feeSetItem.accAmtTyp,name:'accAmtTyp'});
                        _this.initRadioSelect({value:_this.feeSetItem.feeCondOpt,name:'condition'});
                        _this.initRadioSelect({value:_this.feeSetItem.feeActionTyp,name:'calcuType'});

                        _this.saveInfo('编辑成功！');

                    },
                    error:function(e){
                        console.log(e);
                    }
                });
            },
            del: function (item) {
                console.log(item)
                var _this = this;
                var index = layer.confirm('确认要删除吗?', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.ajax({
                        url: _this.ajax_url+'feeSetting/delInfo',
                        type: 'post',
                        data: {
                            code: item.feeCde,
                            id: item.id
                        },
                        dataType: 'json',
                        success: function (result) {
                            if (result.flag == 0) {
                                var objParam = {
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    keyword: _this.keyword
                                }
                                layer.msg('删除成功', { icon: 1, time: 1000 }, function () {
                                    var num = _this.totalCount - 1;
                                    if(num%_this.limit == 0){
                                        objParam.curr = objParam.curr - 1 == 0 ? 1 :objParam.curr - 1
                                        _this.getPage(objParam)
                                    }
                                    _this.getPage(objParam)
                                    console.log(_this.pro_NAME)
                                });

                            } else {
                                var objParam = {
                                    curr: _this.curr,
                                    limit: _this.limit,
                                    keyword: _this.keyword
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
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url+'feeSetting/showInfo',
                    type: 'post',
                    data: paramObj,
                    dataType: 'json',
                    beforeSend: function(){
                        _this.load = true;
                    },
                    success: function (result) {
                        _this.load = false;

                        _this.feelist = result.list;
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
                                    $.ajax({
                                        url: _this.ajax_url + 'feeSetting/showInfo',
                                        type: 'post',
                                        data: {
                                            curr: obj.curr,
                                            limit: obj.limit,
                                            keyword: _this.keyword ? _this.keyword : ''
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.feelist = result.list;
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
        feeSet: obj
    }
});