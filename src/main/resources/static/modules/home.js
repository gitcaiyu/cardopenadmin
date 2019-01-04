define(['layui', 'text!../../pages/home.html'], function (layui, home) {

	var obj = {
		template: home,
		data: function () {
			return {
				load: false,
				part1: {},
				part2: {},
				part3: {},
				part4: {},
				part5: '',
				part6: '',
				part7: {},
				dkye: {},
				fke: {},
				topTenDept: [],
				topTenPro: [],
                ajax_url:'',
				time: ''
			}
		},
		mounted: function () {
			var _this = this;
            _this.ajax_url = _this.$parent.ajax_url;
			var date = new Date();
			date.setDate(date.getDate()-1);
			Y = date.getFullYear() + '-';
			M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
			_this.time = Y + M + D
			layui.use('laydate', function () {
				var laydate = layui.laydate;

				//执行一个laydate实例
				laydate.render({
					elem: '#date' //指定元素
					, value: _this.time
					, max:  _this.time
					, done: function (value, date) { //监听日期被切换
						//console.log(value)
						_this.time = value
						getData(_this.time)
					}
				});
			});
			function getData(time){
				$.ajax({
					url: _this.ajax_url+'showInfo?date=' + time,
					type: 'get',
					async: false,
					beforeSend: function(){
						_this.load = true;
					},
					success: function (res) {

						_this.load = false;

						console.log(res)
						_this.part1 = res.part1
						_this.part2 = res.part2
						_this.part3 = res.part3
						_this.part4 = res.part4
						_this.part5 = res.part5
						_this.part6 = res.part6
						_this.part7 = res.part7
						_this.dkye = res.dkye
						_this.fke = res.fke
						_this.sr = res.sr
						_this.lr = res.lr
						_this.gdcb = res.gdcb
						_this.bdcb = res.bdcb
						_this.topTenDept = res.topTenDept
						_this.topTenPro = res.topTenPro
						getGauge();
					}
				})
			}
			getData(_this.time);

			$('#more').click(function(){
				$('#show').toggleClass('show')
			})

			require.config({
				paths: {
					echarts: '../js'
				}
			});
			getGauge();
			function getGauge(){
				require(
					[
						'echarts',
	
						'echarts/chart/gauge' // 使用柱状图就加载bar模块，按需加载
					],
					function (ec) {
						console.log(_this.part5)
						// 基于准备好的dom，初始化echarts图表
						var myChart01 = ec.init(document.getElementById('gauge01'));
						var option01 = {
							tooltip: {
								formatter: "{a} <br/>{b} : {c}%"
							},
							toolbox: {
								feature: {
									restore: {},
									saveAsImage: {}
								}
							},
							series: [
								{
									name: '业务指标',
									type: 'gauge',
									max: 30,
									axisLine: {
										lineStyle: {
											width: 10, // 这个是修改宽度的属性  
											color: [[0.33, '#009688'], [0.66, '#FFB800'], [1, '#FF5722']]
										}
									},
									splitLine: {           // 分隔线  
										length: 5,         // 属性length控制线长  
										lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式  
											color: 'auto'
										}
									},
									detail: { formatter: _this.part5 + '%', textStyle: { fontSize: 20 }  },
									data: [{ value: _this.part5, name: '逾期率' }]
								}
							]
						};
						// 为echarts对象加载数据 
						myChart01.setOption(option01);
	
						var myChart02 = ec.init(document.getElementById('gauge02'));
						var option02 = {
							tooltip: {
								formatter: "{a} <br/>{b} : {c}%"
							},
							toolbox: {
								feature: {
									restore: {},
									saveAsImage: {}
								}
							},
							series: [
								{
									name: '业务指标',
									type: 'gauge',
									max: 10,
									axisLine: {
										lineStyle: {
											width: 10, // 这个是修改宽度的属性  
											color: [[0.33, '#009688'], [0.66, '#FFB800'], [1, '#FF5722']]
										}
									},
									splitLine: {           // 分隔线  
										length: 5,         // 属性length控制线长  
										lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式  
											color: 'auto'
										}
									},
									detail: { formatter: _this.part6 + '%', textStyle: { fontSize: 20 }  },
									data: [{ value: _this.part6, name: '不良率' }]
								}
							]
						};
						// 为echarts对象加载数据 
						myChart02.setOption(option02);
					}
				);
			}
			// 使用

			require(
				[
					'echarts',

					'echarts/chart/line', // 使用柱状图就加载bar模块，按需加载
					'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					//console.log(layui)
					// 基于准备好的dom，初始化echarts图表
					var arr = [];
					var d = new Date();
					var m = d.getMonth() + 1
					console.log(m)
					for (var i = 1; i <= 12; i++) {
						arr.push(m + '月')
						m = m - 1;
						if (m == 0) {
							m = 12
						}
					}
					arr.reverse()
					console.log(arr)
					var myChartRight = ec.init(document.getElementById('rightline'));
					var myChart01 = ec.init(document.getElementById('tabview1'));
					var optionRight = {
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							data: ['逾期率', '不良率']
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						toolbox: {
							feature: {
								saveAsImage: {}
							}
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: '{value} %'
							}
						},
						series: [
							{
								name: '逾期率',
								type: 'line',
								itemStyle : {
									normal : {
										color:'#009688',
										lineStyle:{
											color:'#009688'
										}
									}
								},
								stack: '总量1',
								data: _this.part7.overdueRate
							},
							{
								name: '不良率',
								type: 'line',
								itemStyle : {
									normal : {
										color:'#1e9fff',
										lineStyle:{
											color:'#1e9fff'
										}
									}
								},
								stack: '总量2',
								data: _this.part7.adverseRate
							}
						]
					};

					var option01 = {
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross',
								crossStyle: {
									color: '#999'
								}
							}
						},
						toolbox: {
							feature: {
								dataView: { show: true, readOnly: false },
								magicType: { show: true, type: ['line', 'bar'] },
								restore: { show: true },
								saveAsImage: { show: true }
							}
						},
						legend: {
							data: ['目标', '实际', '同期', '实际走势']
						},
						xAxis: [
							{
								type: 'category',
								data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
								axisPointer: {
									type: 'shadow'
								}
							}
						],
						yAxis: [
							{
								type: 'value',
								name: '金额',
								min: 0,
								// max: 250,
								// interval: 50,
								axisLabel: {
									formatter: '{value} 万元'
								}
							},
							{
								type: 'value',
								name: '实际',
								min: 0,
								// max: 250,
								// interval: 5,
								axisLabel: {
									formatter: '{value} 万元'
								}
							}
						],
						series: [
							{
								name: '目标',
								type: 'bar',
								itemStyle : {
									normal : {
										color:'#1e9fff',
										lineStyle:{
											color:'#1e9fff'
										}
									}
								},
								data: _this.dkye.target
							},
							{
								name: '实际',
								type: 'bar',
								itemStyle : {
									normal : {
										color:'#009688',
										lineStyle:{
											color:'#009688'
										}
									}
								},
								data: _this.dkye.real
							},
							{
								name: '同期',
								type: 'bar',
								itemStyle : {
									normal : {
										color:'#FFB800',
										lineStyle:{
											color:'#FFB800'
										}
									}
								},
								data: _this.dkye.last
							},
							{
								name: '实际走势',
								type: 'line',
								itemStyle : {
									normal : {
										color:'#009688',
										lineStyle:{
											color:'#009688'
										}
									}
								},
								yAxisIndex: 1,
								data: _this.dkye.real
							}
						]
					};
					// 为echarts对象加载数据 
					myChartRight.setOption(optionRight);
					myChart01.setOption(option01)

					layui.use('element', function () {
						var element = layui.element;
						element.on('tab(tabview)', function (data) {
							if (data.index == 0) {
								option01.series = [
									{
										name: '目标',
										type: 'bar',
										data: _this.dkye.target
									},
									{
										name: '实际',
										type: 'bar',
										data: _this.dkye.real
									},
									{
										name: '同期',
										type: 'bar',
										data: _this.dkye.last
									},
									{
										name: '实际走势',
										type: 'line',
										yAxisIndex: 1,
										data: _this.dkye.real
									}
								]
								myChart01.setOption(option01)
							}
							if (data.index == 1) {
								option01.series = [
									{
										name: '目标',
										type: 'bar',
										data: _this.fke.target
									},
									{
										name: '实际',
										type: 'bar',
										data: _this.fke.real
									},
									{
										name: '同期',
										type: 'bar',
										data: _this.fke.last
									},
									{
										name: '实际走势',
										type: 'line',
										yAxisIndex: 1,
										data: _this.fke.real
									}
								]
								myChart01.setOption(option01)
							}
							if (data.index == 2) {
								option01.series = [
									{
										name: '目标',
										type: 'bar',
										data: _this.sr.target
									},
									{
										name: '实际',
										type: 'bar',
										data: _this.sr.real
									},
									{
										name: '同期',
										type: 'bar',
										data: _this.sr.last
									},
									{
										name: '实际走势',
										type: 'line',
										yAxisIndex: 1,
										data: _this.sr.real
									}
								]
								myChart01.setOption(option01)
							}
							if (data.index == 3) {
								option01.series = [
									{
										name: '目标',
										type: 'bar',
										data: _this.lr.target
									},
									{
										name: '实际',
										type: 'bar',
										data: _this.lr.real
									},
									{
										name: '同期',
										type: 'bar',
										data: _this.lr.last
									},
									{
										name: '实际走势',
										type: 'line',
										yAxisIndex: 1,
										data: _this.lr.real
									}
								]
								myChart01.setOption(option01)
							}
							if (data.index == 4) {
								option01.series = [
									{
										name: '目标',
										type: 'bar',
										data: _this.gdcb.target
									},
									{
										name: '实际',
										type: 'bar',
										data: _this.gdcb.real
									},
									{
										name: '同期',
										type: 'bar',
										data: _this.gdcb.last
									},
									{
										name: '实际走势',
										type: 'line',
										yAxisIndex: 1,
										data: _this.gdcb.real
									}
								]
								myChart01.setOption(option01)
							}
							if (data.index == 5) {
								option01.series = [
									{
										name: '目标',
										type: 'bar',
										data: _this.bdcb.target
									},
									{
										name: '实际',
										type: 'bar',
										data: _this.bdcb.real
									},
									{
										name: '同期',
										type: 'bar',
										data: _this.bdcb.last
									},
									{
										name: '实际走势',
										type: 'line',
										yAxisIndex: 1,
										data: _this.bdcb.real
									}
								]
								myChart01.setOption(option01)
							}
						});
					});



				}
			);

		},
		methods: {
			manageRank: function(opt1,opt2){
				var _this = this;
				console.log(_this.topTenDept)
				if(opt1 == 'dkye' && opt2 == 'asc'){
					_this.topTenDept.sort(function(a,b){
						return a.DKYE - b.DKYE
					})
				}
				if(opt1 == 'dkye' && opt2 == 'desc'){
					_this.topTenDept.sort(function(a,b){
						return b.DKYE - a.DKYE
					})
				}
				if(opt1 == 'fke' && opt2 == 'asc'){
					_this.topTenDept.sort(function(a,b){
						return a.FKE - b.FKE
					})
				}
				if(opt1 == 'fke' && opt2 == 'desc'){
					_this.topTenDept.sort(function(a,b){
						return b.FKE - a.FKE
					})
				}
				if(opt1 == 'sr' && opt2 == 'asc'){
					_this.topTenDept.sort(function(a,b){
						return a.SR - b.SR
					})
				}
				if(opt1 == 'sr' && opt2 == 'desc'){
					_this.topTenDept.sort(function(a,b){
						return b.SR - a.SR
					})
				}
				if(opt1 == 'lr' && opt2 == 'asc'){
					_this.topTenDept.sort(function(a,b){
						return a.LR - b.LR
					})
				}
				if(opt1 == 'lr' && opt2 == 'desc'){
					_this.topTenDept.sort(function(a,b){
						return b.LR - a.LR
					})
				}
				
			},
			proRank: function(opt1,opt2){
				console.log(opt1,opt2)
				var _this = this;
				if(opt1 == 'dkye' && opt2 == 'asc'){
					_this.topTenPro.sort(function(a,b){
						return a.DKYE - b.DKYE
					})
				}
				if(opt1 == 'dkye' && opt2 == 'desc'){
					_this.topTenPro.sort(function(a,b){
						return b.DKYE - a.DKYE
					})
				}
				if(opt1 == 'fke' && opt2 == 'asc'){
					_this.topTenPro.sort(function(a,b){
						return a.FKE - b.FKE
					})
				}
				if(opt1 == 'fke' && opt2 == 'desc'){
					_this.topTenPro.sort(function(a,b){
						return b.FKE - a.FKE
					})
				}
				if(opt1 == 'sr' && opt2 == 'asc'){
					_this.topTenPro.sort(function(a,b){
						return a.SR - b.SR
					})
				}
				if(opt1 == 'sr' && opt2 == 'desc'){
					_this.topTenPro.sort(function(a,b){
						return b.SR - a.SR
					})
				}
				if(opt1 == 'lr' && opt2 == 'asc'){
					_this.topTenPro.sort(function(a,b){
						return a.LR - b.LR
					})
				}
				if(opt1 == 'lr' && opt2 == 'desc'){
					_this.topTenPro.sort(function(a,b){
						return b.LR - a.LR
					})
				}
			}
		}
	}
	return {
		home: obj
	}
});