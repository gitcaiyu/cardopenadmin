define(['layui', 'text!../../pages/calculation.html'], function (layui, calculation) {
    var form=layui.form;
    var laydate = layui.laydate;
    var initInstallment_item={},initForm_data={};
    var initEX23={},initEX31={},initEX32={},initEX11={},initEX12={},initEX13={},initEX14={},initEX10={},initEX15={},initEX17={},initEX18={},initEX21={},initEX22={},initEX52={};
    var element=layui.element;

    var obj = {
        template: calculation,
        data: function () {
            return {
                load: false,
                msg: 'aabb',
                catelist: [],
                installments:[],//期数
                installment_item:{
                    tnr:'',
                    proportion:'',
                    duedayTyp:'2',
                    dueday:'',
                    loanIntRate:'',
                    paymFreqUnit:'',
                    paymFreqFreq:'1',
                    loanPaymMtd:'',
                    loanPaymTyp:'',
                    tnrTyp:'',
                    feeCde:'',
                    selList:[],
                    show:false,
                    edit_id:'',
                    checkFee:false,
                },
                duedayTyp_list:[
                    {value:'1',name:'放款日对日'},
                    {value:'2',name:'固定日'}
                ],
                is_required:false,
                is_tnr:false,
                is_proportion:false,
                is_dueday:false,
                is_ReDueday:false,
                is_loanIntRate:false,
                is_paymFreqUnit:false,
                is_paymFreqFreq:false,
                is_loanPaymMtd:false,
                is_tnrTyp:false,
                is_feeCde:false,
                installment_id:0,
                addInstallmentNew:false,
                edit_num:[],
                totalProp:0,
                form_data:{
                    NAME:'',
                    INPUT_AMOUNT:'',
                    AVE_AMOUNT:'',
                    CPCODE:'',
                },
                EX23:{TARGET_CODE:'EX23',INPUT_VALUE:'',TYPE:''},
                EX31:{TARGET_CODE:'EX31',INPUT_VALUE:'',TYPE:''},
                EX32:{TARGET_CODE:'EX32',INPUT_VALUE:'',TYPE:''},
                EX11:{TARGET_CODE:'EX11',INPUT_VALUE:'',TYPE:'02'},
                EX12:{TARGET_CODE:'EX12',INPUT_VALUE:'',TYPE:'01'},
                EX13:{TARGET_CODE:'EX13',INPUT_VALUE:'',TYPE:'02'},
                EX14:{TARGET_CODE:'EX14',INPUT_VALUE:'',TYPE:'02'},
                EX10:{TARGET_CODE:'EX10',INPUT_VALUE:'',TYPE:''},
                EX15:{TARGET_CODE:'EX15',INPUT_VALUE:'',TYPE:''},
                EX17:{TARGET_CODE:'EX17',INPUT_VALUE:'',TYPE:''},
                EX18:{TARGET_CODE:'EX18',INPUT_VALUE:'',TYPE:''},
                EX21:{TARGET_CODE:'EX21',INPUT_VALUE:'',TYPE:''},
                EX22:{TARGET_CODE:'EX22',INPUT_VALUE:'',TYPE:''},
                EX52:{TARGET_CODE:'EX52',INPUT_VALUE:'',TYPE:''},
                check_EX11_percent:'required|number|checkPosNum',
                check_EX13_percent:'required|number|checkPosNum',
                check_EX14_percent:'required|number|checkPosNum',
                is_EX11:true,
                is_EX13:true,
                is_EX14:true,
                is_NAME:false,
                is_INPUT_AMOUNT:false,
                is_AVE_AMOUNT:false,
                fee_name:{
                    feeCde:'费用代码',
                    feeTyp:'费用类型',
                    feeAmtTyp:'入账金额类型',
                    accAmtTyp:'摊销金额类型',
                    feeDesc:'费用描述'
                },
                fee_item:[],
                fee_tabItems:[],
                fee_condition_list:[],
                calculation_plan:[],
                calculation_tnr:[],
                calculation_fee:[],
                EX_list:[],
                show_list:{},
                tnrListShow:false,
                id:'',
                curr:1,
                limit:25,
                keyword:'',
                calculation_list:[],
                totalCount:'',
                is_cal:true,//测算是否成功
                ajax_url:'',
                select_data:"",
                fee_list:[],
                feeSel_list:[],
                feeCurr:1,
                feeSearch:false,
                feeLimit:10,
                feeTotalCount:'',
                feeDesc:'',
                feeTableShow:false,
                new_feeCde:[]
            }
        },
        mounted: function () {
            var _this=this;
            _this.ajax_url = _this.$parent.ajax_url;
            //_this.ajax_url='http://10.166.102.135:9030/';
            _this.getPage({
                curr: 1,
                limit: _this.limit,
                keyword: _this.keyword
            });
            layui.use('form',function(){
                form.verify({
                    checkInputAmount: function(value, item){
                        if(_this.form_data.AVE_AMOUNT*1>value){
                            return '投放金额需大于件均';
                        };
                    },
                    number: function(value, item){
                        if(!/^(-?\d+)(\.\d+)?$/.test(value)){
                            return '需要填写数字';
                        }
                    },
                    checkPosNum: function(value, item){
                        if(value<0){
                            return '需要填入非负数'
                        }
                    },
                    checkPercent: function(value, item){
                        if(value>100 || value<0){
                            return '需要在0~100中间';
                        }
                    },

                });
            });
            initInstallment_item=$.extend(true,{},_this.installment_item);
            initForm_data=$.extend(true,{},_this.form_data);
            initEX23=$.extend(true,{},_this.EX23);
            initEX31=$.extend(true,{},_this.EX31);
            initEX32=$.extend(true,{},_this.EX32);
            initEX11=$.extend(true,{},_this.EX11);
            initEX12=$.extend(true,{},_this.EX12);
            initEX13=$.extend(true,{},_this.EX13);
            initEX14=$.extend(true,{},_this.EX14);
            initEX10=$.extend(true,{},_this.EX10);
            initEX15=$.extend(true,{},_this.EX15);
            initEX17=$.extend(true,{},_this.EX17);
            initEX18=$.extend(true,{},_this.EX18);
            initEX21=$.extend(true,{},_this.EX21);
            initEX22=$.extend(true,{},_this.EX22);
            initEX52=$.extend(true,{},_this.EX52);
            this.getSeletData();
            this.SelectBigPro();
            form.render();
        },
        /*updated:function(){
            form.render();
        },*/
        methods: {
            search:function(){
                var _this=this;
                //layer.msg('zz',{icon: 1})
                this.curr=1;
                this.getPage({
                    curr:1,
                    limit:_this.limit,
                    keyword:_this.keyword,
                });
            },
            searchReset: function(){
                var _this=this;
                this.keyword="";
                _this.getPage({
                    curr: 1,
                    limit: _this.limit,
                    keyword: _this.keyword
                });
            },
            getSeletData:function(){
                var _this=this;
                $.ajax({
                    url: _this.ajax_url+'targetMeasure/getTargetMeasureParams',
                    type: 'post',
                    data:{},
                    dataType: 'json',
                    success: function (result) {
                        _this.select_data=result;
                        console.log(result)
                    }
                });
            },
            SelectBigPro:function(){
                var _this=this;
                if(this.form_data.NAME)this.is_NAME=false;
                if(this.form_data.INPUT_AMOUNT)this.is_INPUT_AMOUNT=false;
                if(this.form_data.AVE_AMOUNT)this.is_AVE_AMOUNT=false;
                form.on('select(bigPro)',function(data){
                    if(!_this.form_data.NAME ||
                        !_this.form_data.INPUT_AMOUNT ||
                        !_this.form_data.AVE_AMOUNT){
                        console.log(111)
                        _this.form_data.CPCODE='';
                        _this.initSelect({value:_this.form_data.CPCODE,name:"bigPro"});
                        form.render();
                        layer.msg('请输入必填数据！',{icon: 7})
                        _this.form_data.NAME?_this.is_NAME=false:_this.is_NAME=true;
                        _this.form_data.INPUT_AMOUNT?_this.is_INPUT_AMOUNT=false:_this.is_INPUT_AMOUNT=true;
                        _this.form_data.AVE_AMOUNT?_this.is_AVE_AMOUNT=false:_this.is_AVE_AMOUNT=true;
                    }else{
                        _this.form_data.CPCODE=data.value;
                        $.ajax({
                            url: _this.ajax_url+'targetMeasure/averagePplMeasureCost?proId='+_this.form_data.CPCODE+'&putInMoney='+_this.form_data.INPUT_AMOUNT+'&perMoney='+_this.form_data.AVE_AMOUNT,
                            type: 'get',
                            dataType: 'json',
                            success: function (result) {
                                for(var i=0;i<result.length;i++){
                                    var target_code=result[i]['targetCode'];
                                    if(_this[target_code]){
                                        result[i]['aveExpValue']?_this[target_code]['INPUT_VALUE']=result[i]['aveExpValue']:_this[target_code]['INPUT_VALUE']="";
                                        _this.EX11.TYPE='02';
                                        _this.EX12.TYPE='01';
                                        _this.EX13.TYPE='02';
                                        _this.EX14.TYPE='02';
                                        _this.is_EX11=true;
                                        _this.is_EX13=true;
                                        _this.is_EX14=true;
                                        _this.initSelect({value:_this.EX11.TYPE,name:"EX11_type"});
                                        _this.initSelect({value:_this.EX12.TYPE,name:"EX12_type"});
                                        _this.initSelect({value:_this.EX13.TYPE,name:"EX13_type"});
                                        _this.initSelect({value:_this.EX14.TYPE,name:"EX14_type"})
                                        form.render();
                                    }
                                }
                            }
                        });
                    };
                });
            },
            getSelectVal:function(item,param){
                var _this=this;
                form.on('select('+param.filter+')',function(data){
                    if(data.value){
                        _this['is_'+param.filter]=false;
                    }else{
                        _this['is_'+param.filter]=true;
                    }
                    item[param.filter]=data.value;
                });
            },
            initSelect:function(param){
                $('select[name="'+param.name+'"] option').each(function(){
                    if(param.value===this.value){
                        $(this).prop('selected','selected');
                        $(this).siblings().removeProp('selected')
                    }
                });
            },
            initDuday:function(item){
                var _this=this;
                var date=new Date();
                var day=date.getDate();
                $('input[name="dueday"]').prop('disabled','');
                if(item){
                    item.duedayTyp?item.duedayTyp:item.duedayTyp=2;
                    if(item.duedayTyp=='1'){
                        $('input[name="dueday"]').prop('disabled','disabled');
                    };
                    this.initSelect({value:item.duedayTyp,name:"duedayTyp"});
                }else{
                    this.installment_item.duedayTyp='2';
                    this.installment_item.dueday="";
                    this.initSelect({value:_this.installment_item.duedayTyp,name:"duedayTyp"});
                }


                form.on('select(duedayTyp)',function(data){
                    if(item){
                        item.duedayTyp=data.value;
                    }else{
                        _this.installment_item.duedayTyp=data.value;
                    };
                    if(data.value==1){
                        $('input[name="dueday"]').prop('disabled','disabled');
                        if(item){
                            item.dueday=day;
                        }else{
                            _this.installment_item.dueday=day;
                        };
                    }else{
                        $('input[name="dueday"]').prop('disabled','');
                        if(item){
                            item.dueday="";
                        }else{
                            _this.installment_item.dueday="";
                        };
                    }
                })
            },
            InitInstallmentReq:function(){
                this.is_required=false;
                this.is_tnr=false;
                this.is_proportion=false;
                this.is_dueday=false;
                this.is_ReDueday=false;
                this.is_loanIntRate=false;
                /*this.is_paymFreqUnit=false;*/
                this.is_paymFreqFreq=false;
                this.is_loanPaymMtd=false;
                this.is_tnrTyp=false;
            },
            installmentRequired:function(obj){
                this.totalProp=0;
                if(this.installments.length>0 ){
                    for(var i=0;i<this.installments.length;i++){
                        this.totalProp+=this.installments[i].proportion*1;
                    };
                    if(this.edit_num[0]=='addNew'){
                        this.totalProp+=this.installment_item.proportion*1;
                    };
                    if (this.totalProp>100) {
                        this.is_proportion=true;
                    };
                }else{
                    this.totalProp=this.installment_item.proportion*1;
                    /**占比超过100%**/
                    if(this.installment_item.proportion>100){
                        this.totalProp=this.installment_item.proportion*1;
                        this.is_proportion=true;
                    };
                }

                if(!obj){
                    obj=this.installment_item;
                };
                this.is_required=false;
                this.is_tnr=false;
                this.is_proportion=false;
                this.is_dueday=false;
                this.is_ReDueday=false;
                this.is_loanIntRate=false;
                /*this.is_paymFreqUnit=false;*/
                this.is_paymFreqFreq=false;
                this.is_loanPaymMtd=false;
                this.is_tnrTyp=false;
                obj.tnr?this.is_tnr=false:this.is_tnr=true;
                (obj.proportion&&this.totalProp<=100)?this.is_proportion=false:this.is_proportion=true;
                obj.dueday?this.is_dueday=false:this.is_dueday=true;
                /^[0-9]+$/.test(obj.dueday)&&obj.dueday<=31?this.is_Redueday=false:this.is_Redueday=true;
                console.log(this.is_Redueday);
                obj.loanIntRate?this.is_loanIntRate=false:this.is_loanIntRate=true;
                /*obj.paymFreqUnit?this.is_paymFreqUnit=false:this.is_paymFreqUnit=true;*/
                obj.paymFreqFreq?this.is_paymFreqFreq=false:this.is_paymFreqFreq=true;
                obj.loanPaymMtd?this.is_loanPaymMtd=false:this.is_loanPaymMtd=true;
                obj.tnrTyp?this.is_tnrTyp=false:this.is_tnrTyp=true;
            },
            initInstallmentAdd:function(){
                var _this=this;
                this.InitInstallmentReq();
                console.log(this.totalProp)
                if(this.totalProp==100){
                    layer.msg('占比已经100%！',{icon: 7});
                    return;
                };
                if(this.edit_num.length==2){
                    layer.msg('请保存编辑数据！',{icon: 7});
                    return;
                };
                this.edit_num[0]='addNew';
                this.installment_item={};
                this.installment_item=$.extend(true,{},initInstallment_item);
                this.initSelect({value:_this.installment_item.duedayTyp,name:"duedayTyp"});
                this.initDuday();
                this.initSelect({value:_this.installment_item.tnrTyp,name:"tnrTyp"});
                this.initSelect({value:_this.installment_item.loanPaymMtd,name:"loanPaymMtd"});
                /*this.initSelect({value:_this.installment_item.paymFreqUnit,name:"paymFreqUnit"});*/
                this.getSelectVal(_this.installment_item,{filter:'tnrTyp'});
                this.getSelectVal(_this.installment_item,{filter:'loanPaymMtd'});

                /*this.getSelectVal(_this.installment_item,{filter:'paymFreqUnit'});*/
                this.initCheck();
                form.render('','installmentAdd');
                this.addInstallmentNew=true;
                return false;
            },
            installmentSave:function(){
                var _this=this;
                this.installmentRequired(_this.installment_item);

                if(this.is_tnr ||
                    this.is_proportion ||
                    this.is_dueday ||
                    this.is_loanIntRate ||
                    this.is_paymFreqFreq ||
                    this.is_loanPaymMtd ||
                    this.is_tnrTyp){
                    this.is_required=true;
                    if(this.totalProp>100){
                        layer.msg('占比总和'+_this.totalProp+'%已经超过100%！',{icon: 7});
                    }else{
                        layer.msg('请输入必输数据!',{icon: 7});
                    };
                    return;
                };
                if(this.is_Redueday){
                    this.is_required=true;
                    this.is_dueday=true;
                    layer.msg('请输入小于31的正整数!',{icon: 7});
                    return;
                }else{
                    this.is_dueday=false;
                };
                if(this.installment_item.feeCde==""){
                    layer.msg('请选择费用！',{icon: 7});
                    return;
                }
                this.getLoanPaymTyp();
                var obj = this.installment_item;
                this.installment_id+=1;
                obj.edit_id=this.installment_id;
                var objparam = $.extend(true,{},obj);
                this.installments.push(objparam);
                this.addInstallmentNew=false;
                this.edit_num=[];
                form.render();
                return false;
            },
            //删除多条
            installmentDel:function(item){
                var _this=this;
                this.installments=this.installments.filter(function(v){
                    if(v.edit_id==item.edit_id){
                        _this.totalProp-=item.proportion*1;
                    };
                    return v.edit_id!=item.edit_id;
                });
            },
            showSelectName:function(item,name){
                var _this=this;
                var name_00={
                    'paymFreqUnit':'FREQ_UNIT',
                    'loanPaymMtd':'LOAN_MTD',
                    'tnrTyp':'TNR_TYP',
                    'feeCde':'feeCod'
                };
                var code='feeCde';
                var param_name='feeDesc';
                var select_name=name_00[name];
                var show_name="";
                for(var i=0;i<this.select_data[select_name].length;i++){
                    if(this.select_data[select_name][i].hasOwnProperty('PARAM_CODE')){
                        code='PARAM_CODE'
                    };
                    if(this.select_data[select_name][i].hasOwnProperty('PARAM_NAME')){
                        param_name='PARAM_NAME'
                    };
                    if(item[name] == _this.select_data[select_name][i][code]){
                        show_name = _this.select_data[select_name][i][param_name];
                    }
                }
                return show_name;
            },
            showDuedayTyp:function(item){
                for(var i=0;i<this.duedayTyp_list.length;i++){
                    if(item.duedayTyp==this.duedayTyp_list[i]['value']){
                        return this.duedayTyp_list[i]['name'];
                    }
                }
            },
            getLoanPaymTyp:function(item){
                for(var i=0;i<this.select_data.LOAN_MTD.length;i++){
                    if(item){
                        if(item.loanPaymMtd==this.select_data.LOAN_MTD[i]['PARAM_CODE']){
                            item.loanPaymTyp=this.select_data.LOAN_MTD[i]['PARAM_VALUE'];
                        }
                    }else{
                        if(this.installment_item.loanPaymMtd==this.select_data.LOAN_MTD[i]['PARAM_CODE']){
                            this.installment_item.loanPaymTyp=this.select_data.LOAN_MTD[i]['PARAM_VALUE'];
                        }
                    }
                }
            },
            initCheck:function(){
                for(var i=0;i<this.installments.length;i++){
                    this.installments[i].checkFee=false;
                };
            },
            check:function(item){
                for(var i=0;i<this.installments.length;i++){

                    if(this.installments[i]['edit_id']==item['edit_id']){
                        if(item.checkFee){
                            item.checkFee=false;
                        }else{
                            item.checkFee=true;
                        }
                    }else{
                        this.installments[i].checkFee=false;
                    }
                };
            },
            checkOut:function(item){
                item.checkFee=false;
            },
            selectFee:function(item){
                var _this=this;
                var index="";
                if(item){
                    this.feeSel_list=item.selList;
                }else{
                    this.feeSel_list=[];
                }
                this.feeDesc="";
                this.showFeeInfo({
                    feeCurr:_this.feeCurr,
                    feeLimit:_this.feeLimit,
                    feeDesc:_this.feeDesc,
                },item);

            },
            searchFee:function(){
                var _this=this;
                this.feeSearch=true;
                this.feeCurr=1;
                this.showFeeInfo({
                    feeCurr:_this.feeCurr,
                    feeLimit:_this.feeLimit,
                    feeDesc:_this.feeDesc,
                });
            },
            addToSelected:function(item){
                var _this=this;
                var a=JSON.stringify(_this.feeSel_list);
                if(a.indexOf(item.feeCde)==-1){
                    this.feeSel_list.push(item);
                }
            },
            removeSelFee:function(item){
                var _this=this;
                this.feeSel_list=this.feeSel_list.filter(function(v){
                    return v.feeCde!=item.feeCde;
                });
            },
            showFeeInfo:function(params,item){
                var laypage = layui.laypage;
                var _this = this;
                var indexx = layer.load(2);
                $.ajax({
                    url: _this.ajax_url+'targetMeasure/selectFeeFromCmis?curr='+params.feeCurr+'&limit='+params.feeLimit+'&feeDesc='+params.feeDesc,
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                        layer.close(indexx);
                        _this.feeTableShow=true;
                        _this.fee_list=result.feeCod;
                        _this.feeTotalCount = result.feeTotalCount ? result.feeTotalCount : 0;
                        laypage.render({
                            elem: 'selectPage'
                            , count: _this.feeTotalCount
                            , theme: '#1E9FFF'
                            , limit: _this.feeLimit
                            , curr: _this.feeCurr
                            , limits: 10
                            , jump: function (obj, first) {
                                if (!first) {
                                    var feeDesc= _this.feeDesc ? _this.feeDesc : '';
                                    $.ajax({
                                        url: _this.ajax_url+'targetMeasure/selectFeeFromCmis?curr='+obj.curr+'&limit='+params.feeLimit+'&feeDesc='+params.feeDesc,
                                        type: 'get',
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.feeCurr = obj.curr;
                                            _this.fee_list = result.feeCod;
                                        }
                                    })
                                }
                            }
                        });

                        if(!_this.feeDesc&&!_this.feeSearch){
                            index = layer.open({
                                type: 1,
                                skin: 'layui-layer-demo', //加上边框
                                area: ['90%', '600px'], //宽高
                                content: $('#selectFee'),
                                title:'请选择费用代码',
                                cancel: function(){
                                    $('#selectFee').hide()
                                }
                            });
                        };
                        form.on('submit(addFee)',function(data){
                            _this.new_feeCde=[];
                            if(_this.feeSel_list.length){
                                for(var i=0;i<_this.feeSel_list.length;i++){
                                    var feeCde=_this.feeSel_list[i]['feeCde'];
                                    _this.new_feeCde.push(feeCde)
                                }
                            };
                            if(item){
                                item.feeCde=_this.new_feeCde;
                                item.selList=_this.feeSel_list;
                            }else{
                                _this.installment_item.feeCde=_this.new_feeCde;
                                _this.installment_item.selList=_this.feeSel_list;
                            }
                            $('#selectFee').hide();
                            layer.close(index);
                            return false;
                        });
                    },
                    error: function (e) {
                        console.log(laypage)
                        console.log(e)
                    }
                })
            },
            installmentEdit:function(item){
                var _this=this;
                this.InitInstallmentReq();
                if(this.edit_num.length==2)return;
                if(this.edit_num[0]=='addNew'){
                    layer.msg('请保存新增数据！',{icon: 7});
                    return;
                };
                this.is_cal=false;

                this.getSelectVal(item,{filter:'duedayTyp'});
                this.initDuday(item);
                this.getSelectVal(item,{filter:'tnrTyp'});
                this.getSelectVal(item,{filter:'loanPaymMtd'});
                /*this.getSelectVal(item,{filter:'paymFreqUnit'});*/
                form.render();
                item.show=true;
                this.edit_num[0]='edit';
                this.edit_num.push(item.edit_id);
                return false;
            },
            installmentEditSave:function(item){
                var _this=this;
                this.installmentRequired(item);
                if(this.is_tnr ||
                    this.is_proportion ||
                    this.is_dueday ||
                    this.is_loanIntRate ||
                    this.is_paymFreqFreq ||
                    this.is_loanPaymMtd ||
                    this.is_feeCde){
                    this.is_required=true;
                    if(this.totalProp>100){
                        layer.msg('占比总和'+_this.totalProp+'%已经超过100%！',{icon: 7});
                    }else{
                        layer.msg('请输入必输数据!',{icon: 7});
                    };
                    return;
                };
                if(this.is_Redueday){
                    this.is_required=true;
                    this.is_dueday=true;
                    layer.msg('请输入小于31的正整数!',{icon: 7});
                    return;
                }else{
                    this.is_dueday=false;
                };
                console.log(item.feeCde)
                if(item.feeCde.length==0){
                    layer.msg('请选择费用！',{icon: 7});
                    return;
                }
                this.initCheck();
                this.getLoanPaymTyp();
                this.is_cal=true;
                item.show=false;
                this.edit_num=[];
                console.log(item)
                return false;
            },
            exchangeEX:function(param){
                var _this=this;
                if(param.is_show){
                    if(param.item['TYPE']=='01'){
                        _this[param.is_show]=false;
                        _this[param.check_per]='required|number|checkPercent';
                    }else{
                        _this[param.is_show]=true;
                        _this[param.check_per]='required|number|checkPosNum';
                    }
                }
                form.on('select('+param.filter+')',function(data){
                    if(param.is_show){
                        if(data.value==1){
                            _this[param.is_show]=false;
                            _this[param.check_per]='required|number|checkPercent';
                            var name=param.filter.substr(0,4);
                            _this[name]['INPUT_VALUE']="";
                        }else{
                            _this[param.is_show]=true;
                            _this[param.check_per]='required|number|checkPosNum';
                        }
                    };
                    param.item.TYPE=data.value;
                });
            },
            initAdd:function(){
                var _this=this;
                this.addInstallmentNew=false;
                this.edit_num=[];
                _this.initSelect({value:_this.EX11.TYPE,name:"EX11_type"});
                _this.initSelect({value:_this.EX12.TYPE,name:"EX12_type"});
                _this.initSelect({value:_this.EX13.TYPE,name:"EX13_type"});
                _this.initSelect({value:_this.EX14.TYPE,name:"EX14_type"})
                this.exchangeEX({filter:'EX11_type',is_show:'is_EX11',item:_this.EX11,check_per:'check_EX11_percent'});
                this.exchangeEX({filter:'EX12_type',item:_this.EX12});
                this.exchangeEX({filter:'EX13_type',is_show:'is_EX13',item:_this.EX13,check_per:'check_EX13_percent'});
                this.exchangeEX({filter:'EX14_type',is_show:'is_EX14',item:_this.EX14,check_per:'check_EX14_percent'});
            },
            add:function(){
                var _this=this;
                this.installment_item={};
                this.form_data={};
                this.installment_item=$.extend(true,{},initInstallment_item);
                this.form_data=$.extend(true,{},initForm_data);
                this.EX23={};this.EX31={};this.EX32={};this.EX11={};
                this.EX12={};this.EX13={};this.EX14={};this.EX10={};
                this.EX15={};this.EX17={};this.EX18={};this.EX21={};
                this.EX22={};this.EX52={};
                this.EX23=$.extend(true,{},initEX23);
                this.EX31=$.extend(true,{},initEX31);
                this.EX32=$.extend(true,{},initEX32);
                this.EX11=$.extend(true,{},initEX11);
                this.EX12=$.extend(true,{},initEX12);
                this.EX13=$.extend(true,{},initEX13);
                this.EX14=$.extend(true,{},initEX14);
                this.EX10=$.extend(true,{},initEX10);
                this.EX15=$.extend(true,{},initEX15);
                this.EX17=$.extend(true,{},initEX17);
                this.EX18=$.extend(true,{},initEX18);
                this.EX21=$.extend(true,{},initEX21);
                this.EX22=$.extend(true,{},initEX22);
                this.EX52=$.extend(true,{},initEX52);
                this.is_NAME=false;
                this.is_INPUT_AMOUNT=false;
                this.is_AVE_AMOUNT=false;
                this.installments=[];
                this.SelectBigPro();
                this.initSelect({value:_this.form_data.CPCODE,name:"bigPro"});
                this.tnrListShow=false;
                this.totalProp=0;
                this.getSeletData();
                this.initAdd();
                form.render();


                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['96%', '98%'], //宽高
                    content: $('#calAdd'),
                    title:'请新增测算数据',
                    cancel: function(){
                        $('#calAdd').hide()
                    },
                    closeBtn:0,
                });

                form.on('submit(cal)', function (data) {

                    _this.addCal(data);
                    return false;
                });
                form.on('submit(save)', function (data) {
                    if(_this.is_required){
                        layer.msg('请先测算！',{icon: 7})
                        return;
                    };
                    if(!_this.is_cal){
                        layer.msg('请先测算！',{icon: 7})
                        return;
                    };
                    _this.saveCal();

                    $('#calAdd').hide()
                    layer.close(index)
                    layer.msg('保存成功！',{icon: 1},function(){
                        _this.getPage({
                            curr: 1,
                            limit: _this.limit,
                            keyword: _this.keyword
                        });
                    });
                    return false;
                });
            },
            showTnrName:function(){
                var _this=this;
                this.calculation_tnr=[];
                this.calculation_fee=[];
                for(var i=0;i<this.show_list.calculationChild.length;i++){
                    var tnrs=this.show_list.calculationChild[i]['tnr'];
                    this.calculation_tnr.push(tnrs);
                };
                var fee_list=_this.show_list.feeHistory[0]['feeHistoryList'];
                for(var i=0;i<fee_list.length;i++){
                    var fees=fee_list[i]['feeDesc'];
                    this.calculation_fee.push(fees);
                };
                _this.calculation_plan=_this.show_list['calculationChild'][0]['repayPlan'];
                var fee_items=[]
                fee_items=_this.show_list.feeHistory[0]['feeHistoryList'][0];
                if(!fee_items['feeDtlList'] || fee_items['feeDtlList'].length==0 ){
                    _this.fee_condition_list="";
                }else{
                    _this.fee_condition_list=fee_items['feeDtlList'];
                };
                for (var a in _this.fee_name){
                    if(fee_items[a]){
                        var aa={};
                        aa.code=a;
                        aa.name=_this.fee_name[a];
                        fee_items[a+'Name']?aa.value=fee_items[a+'Name']:aa.value=fee_items[a];
                        _this.fee_item.push(aa);
                    };
                };
                _this.fee_tabItems=_this.show_list.feeHistory[0]['feeHistoryList']
                element.on('tab(exchangeTur)',function(elem){
                    _this.fee_tabItems=[];
                    _this.calculation_fee=[];
                    var fee_tabList=_this.show_list.feeHistory[elem.index]['feeHistoryList'];
                    for(var i=0;i<fee_tabList.length;i++){
                        var tab_fees=fee_tabList[i]['feeDesc'];
                        _this.calculation_fee.push(tab_fees);
                    };
                    _this.calculation_plan=_this.show_list['calculationChild'][elem.index]['repayPlan'];
                    _this.fee_tabItems=_this.show_list.feeHistory[elem.index]['feeHistoryList'];
                    _this.fee_item=[];
                    for(var i=0;i<_this.fee_tabItems.length;i++){
                        for (var a in _this.fee_name){
                            if(_this.fee_tabItems[0][a]){
                                var aa={};
                                aa.code=a;
                                aa.name=_this.fee_name[a];
                                _this.fee_tabItems[0][a+'Name']?aa.value=_this.fee_tabItems[0][a+'Name']:aa.value=_this.fee_tabItems[0][a];
                                _this.fee_item.push(aa);
                            };
                        };
                    }
                    if(!_this.fee_tabItems[0]['feeDtlList'] || _this.fee_tabItems[0]['feeDtlList'].length==0){
                        _this.fee_condition_list="";
                    }else{
                        _this.fee_condition_list=_this.fee_tabItems[0]['feeDtlList'];
                    };
                    element.tabChange('exchangeFee', '0');
                });
                element.on('tab(exchangeFee)',function(elem){
                    _this.fee_item=[];
                    for (var a in _this.fee_name){
                        if(_this.fee_tabItems[elem.index][a]){
                            var aa={};
                            aa.code=a;
                            aa.name=_this.fee_name[a];
                            _this.fee_tabItems[elem.index][a+'Name']?aa.value=_this.fee_tabItems[elem.index][a+'Name']:aa.value=_this.fee_tabItems[elem.index][a];
                            _this.fee_item.push(aa);
                        };
                    };
                    if(!_this.fee_tabItems[elem.index]['feeDtlList'] || _this.fee_tabItems[elem.index]['feeDtlList'].length==0){
                        _this.fee_condition_list="";
                    }else{
                        _this.fee_condition_list=_this.fee_tabItems[elem.index]['feeDtlList'];
                    };
                });
            },
            showEXName:function(){
                var _this=this;
                this.EX_list=this.show_list.targetMeasureResult;
                for(var i=0;i<this.EX_list.length;i++){
                    if(this.EX_list[i]['TNR']=='999'){
                        this.EX_list[i]['TNR']="汇总";
                    }else{
                        this.EX_list[i]['TNR']=this.EX_list[i]['TNR']+'期';
                    }
                };
            },
            addCal:function(data){
                var _this=this;

                if(_this.installments.length==0){
                    _this.is_cal=false;
                    layer.msg('请新增期数！',{icon: 7})
                    return false;
                };
                if(_this.edit_num.length>0){
                    _this.is_cal=false;
                    layer.msg('请保存期数！',{icon: 7})
                    return false;
                };
                if(_this.totalProp<100){
                    _this.is_cal=false;
                    layer.msg('占比之和为'+_this.totalProp+'%未满100%！',{icon: 7})
                    return false;
                };
                var targetMeasure={},measureCosts=[],calculations=[],jsonString={};
                jsonString=$.extend(true,{},_this.form_data);
                measureCosts.push(
                    _this.EX23,
                    _this.EX31,
                    _this.EX32,
                    _this.EX11,
                    _this.EX12,
                    _this.EX13,
                    _this.EX14,
                    _this.EX10,
                    _this.EX15,
                    _this.EX17,
                    _this.EX18,
                    _this.EX21,
                    _this.EX22,
                    _this.EX52);
                var installment={
                    tnr:'TNR',
                    proportion:'PROPORTION',
                    dueday:'DUE_DAY',
                    loanIntRate:'LOAN_INTRATE',
                    paymFreqUnit:'PAYM_FREQUNIT',
                    paymFreqFreq:'PAYM_FREQFREQ',
                    loanPaymMtd:'LOAN_PAYMMTD',
                    loanPaymTyp:'LOAN_PAYM_TYP',
                    tnrTyp:'TNR_TYP',
                    feeCde:'FEECDE',
                    duedayTyp:'LAST_DUEDT'
                };
                for(var i=0;i<_this.installments.length;i++){
                    var per_installment=_this.installments[i];
                    var aa={};
                    for(var a in per_installment){
                        if(installment[a]){
                            aa[installment[a]]=per_installment[a];
                        }
                    };
                    calculations.push(aa);
                }
                jsonString.measureCosts=measureCosts;
                jsonString.calculations=calculations;
                var indexx = layer.load(2, {time: 10*1000});
                $.ajax({
                    url: _this.ajax_url+'targetMeasure/addMeasure',
                    type: 'post',
                    data:{jsonString:JSON.stringify(jsonString)},
                    dataType: 'json',
                    success: function (result) {
                        layer.close(indexx);
                        _this.tnrListShow=false;
                        if(result.flag==0){
                            _this.id=result.id;
                            layer.msg('测算成功',{icon: 1},function(){
                                _this.is_cal=true;
                                //_this.id=result.id;
                                _this.show_list=result;
                                _this.tnrListShow=true;
                                _this.showTnrName();
                                _this.showEXName();
                                element.tabChange('exchangeTur', '0');
                                element.tabChange('exchangeFee', '0');
                            });

                        }else{
                            _this.is_cal=false;
                            layer.msg(result.msg,{icon:7});
                        }
                    }
                });
            },
            saveCal:function(){
                var _this=this;

                $.ajax({
                    url: _this.ajax_url+'targetMeasure/saveUpdateStatus?id='+_this.id,
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                    }
                });
            },
            getPage: function (paramObj) {
                var laypage = layui.laypage;
                var _this = this;
                $.ajax({
                    url: _this.ajax_url+'targetMeasure/showInfoPage',
                    type: 'post',
                    data: paramObj,
                    dataType: 'json',
                    beforeSend: function () {
                        _this.load = true;
                    },
                    success: function (result) {

                        _this.load = false;

                        _this.calculation_list = result.list;
                        _this.totalCount = result.total ? result.total : 0;

                        laypage.render({
                            elem: 'page'
                            , count: _this.totalCount
                            , theme: '#1E9FFF'
                            , limit: _this.limit
                            , curr: _this.curr
                            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
                            , limits: [10, 25, 50]
                            , jump: function (obj, first) {
                                if (!first) {
                                    $.ajax({
                                        url: _this.ajax_url+'targetMeasure/showInfoPage',
                                        type: 'post',
                                        data: {
                                            curr: obj.curr,
                                            limit: obj.limit,
                                            keyword: _this.keyword ? _this.keyword : ''
                                        },
                                        dataType: 'json',
                                        success: function (result) {
                                            _this.curr = obj.curr;
                                            _this.calculation_list = result.list;
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
            edit: function (id) {
                console.log(id)
                var _this=this;
                var index = layer.open({
                    type: 1,
                    skin: 'layui-layer-demo', //加上边框
                    area: ['96%', '90%'], //宽高
                    content: $('#calAdd'),
                    title:'重新测算',
                    cancel: function(){
                        $('#calAdd').hide()
                    },
                    closeBtn:0,
                });
                $.ajax({
                    url: _this.ajax_url+'targetMeasure/showInfo?id='+id,
                    type: 'get',
                    dataType: 'json',
                    success: function (result) {
                        _this.id=result.id;
                        _this.show_list=result;
                        _this.tnrListShow=true;
                        _this.showTnrName();
                        _this.showEXName();
                        _this.installments=[];
                        _this.totalProp=0;
                        for(var i=0;i<result.calculation.length;i++){
                            var a={};
                            a.tnr=result.calculation[i]['tnr'];
                            a.proportion=result.calculation[i]['proportion'];
                            a.dueday=result.calculation[i]['due_DAY'];
                            a.duedayTyp=result.calculation[i]['last_DUEDT'];
                            a.loanActvDt=result.calculation[i]['loan_ACTVDT'];
                            a.intStartDt=result.calculation[i]['int_STARTDT'];
                            a.loanIntRate=result.calculation[i]['loan_INTRATE'];
                            /*a.paymFreqUnit=result.calculation[i]['paym_FREQUNIT'];*/
                            a.paymFreqFreq=result.calculation[i]['paym_FREQFREQ'];
                            a.loanPaymMtd=result.calculation[i]['loan_PAYMMTD'];
                            a.loanPaymTyp=result.calculation[i]['loan_PAYM_TYP'];
                            a.tnrTyp=result.calculation[i]['tnr_TYP'];
                            a.feeCde=result.calculation[i]['feecde'].split(',');
                            a.selList=result.calculation[i]['selList'];
                            a.checkFee=false;

                            a.show=false;
                            a.edit_id=i+1;
                            _this.totalProp+=result.calculation[i].proportion*1;
                            _this.installments.push(a);
                            _this.initDuday(a);
                        };
                        _this.installment_id=_this.installments.length;
                        _this.form_data={
                            NAME:result.targetMeasure.name,
                            INPUT_AMOUNT:result.targetMeasure.input_AMOUNT,
                            AVE_AMOUNT:result.targetMeasure.ave_AMOUNT,
                            CPCODE:result.targetMeasure.cpcode,
                        };
                        _this.initSelect({value:_this.form_data.CPCODE,name:"bigPro"});
                        _this.SelectBigPro();
                        for(var i=0;i<result.measureCost.length;i++){
                            var EX=result.measureCost[i];
                            var EX_CODE=result.measureCost[i]['target_CODE'];
                            if(_this[EX_CODE]){
                                _this[EX_CODE]['INPUT_VALUE']=EX['input_VALUE'];
                                EX['type']===null?_this[EX_CODE]['TYPE']="":_this[EX_CODE]['TYPE']=EX['type'];
                            }

                        };
                        _this.initAdd();
                        element.tabChange('exchangeTur', '0');
                        element.tabChange('exchangeFee', '0');
                        form.render();
                    }
                });
                form.on('submit(cal)', function (data) {
                    _this.addCal(data);
                    return false;
                });
                form.on('submit(save)', function (data) {
                    if(_this.is_required){
                        layer.msg('请先测算！',{icon: 7})
                        return;
                    };
                    if(!_this.is_cal){
                        layer.msg('请先测算！',{icon: 7})
                        return;
                    };

                    _this.saveCal();
                    $('#calAdd').hide()
                    layer.close(index);
                    layer.msg('保存成功！',{icon: 1},function(){
                        _this.getPage({
                            curr: 1,
                            limit: _this.limit,
                            keyword: _this.keyword
                        });
                    });

                    return false;
                });

            },
            del: function (id) {
                var _this = this;
                var index = layer.confirm('确认要删除吗?', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.ajax({
                        url: _this.ajax_url+'targetMeasure/deleteId?id='+id,
                        type: 'get',
                        success: function (result) {
                            if (result=='success') {
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
        }
    }
    return {
        calculation: obj
    }
});