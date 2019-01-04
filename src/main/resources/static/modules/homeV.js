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


			// 使用
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
								axisLine: {
									lineStyle: {
										width: 10 // 这个是修改宽度的属性  
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
								axisLine: {
									lineStyle: {
										width: 10 // 这个是修改宽度的属性  
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
								stack: '总量1',
								data: _this.part7.adverseRate
							},
							{
								name: '不良率',
								type: 'line',
								stack: '总量2',
								data: _this.part7.overdueRate
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

			// 使用
			require(
				[
					'echarts',

					'echarts/chart/radar' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					// 基于准备好的dom，初始化echarts图表
					var myChart = ec.init(document.getElementById('leftbottom'));

					var option = {
						title: {
							text: '星座分布',

						},
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							x: 'center',
							data: ['男', '女']
						},
						toolbox: {
							show: false,
							feature: {
								mark: { show: true },
								dataView: { show: true, readOnly: false },
								restore: { show: true },
								saveAsImage: { show: true }
							}
						},
						calculable: true,
						polar: [
							{
								indicator: [
									{ text: '白羊', max: 100 },
									{ text: '金牛', max: 100 },
									{ text: '双子', max: 100 },
									{ text: '巨蟹', max: 100 },
									{ text: '狮子', max: 100 },
									{ text: '处女', max: 100 },
									{ text: '天秤', max: 100 },
									{ text: '天蝎', max: 100 },
									{ text: '射手', max: 100 },
									{ text: '摩羯', max: 100 },
									{ text: '水瓶', max: 100 },
									{ text: '双鱼', max: 100 }
								],
								radius: '50%'
							}
						],
						series: [
							{
								name: '完全实况球员数据',
								type: 'radar',
								itemStyle: {
									normal: {
										areaStyle: {
											type: 'default'
										}
									}
								},
								data: [
									{
										value: [97, 42, 88, 94, 90, 86, 40, 55, 31, 13, 67],
										name: '男'
									},
									{
										value: [97, 32, 74, 95, 88, 92, 67, 11, 89, 66, 54],
										name: '女'
									}
								]
							}
						]
					};

					// 为echarts对象加载数据 
					myChart.setOption(option);
				}
			);

			// 使用
			require(
				[
					'echarts',

					'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					// 基于准备好的dom，初始化echarts图表
					var myChart = ec.init(document.getElementById('middlecenter'));

					var option = {
						title: {
							text: '用户分布',

							x: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						legend: {
							orient: 'vertical',
							x: 'left',
							data: ['iphone3', 'iphone4', 'iphone5']
						},
						dataRange: {
							min: 0,
							max: 2500,
							x: 'left',
							y: 'bottom',
							text: ['高', '低'],           // 文本，默认为数值文本
							calculable: true
						},
						toolbox: {
							show: false,
							orient: 'vertical',
							x: 'right',
							y: 'center',
							feature: {
								mark: { show: true },
								dataView: { show: true, readOnly: false },
								restore: { show: true },
								saveAsImage: { show: true }
							}
						},
						roamController: {
							show: false,
							x: 'right',
							mapTypeControl: {
								'china': true
							}
						},
						series: [
							{
								name: 'iphone3',
								type: 'map',
								mapType: 'china',
								roam: false,
								itemStyle: {
									normal: { label: { show: true } },
									emphasis: { label: { show: true } }
								},
								data: [
									{ name: '北京', value: Math.round(Math.random() * 1000) },
									{ name: '天津', value: Math.round(Math.random() * 1000) },
									{ name: '上海', value: Math.round(Math.random() * 1000) },
									{ name: '重庆', value: Math.round(Math.random() * 1000) },
									{ name: '河北', value: Math.round(Math.random() * 1000) },
									{ name: '河南', value: Math.round(Math.random() * 1000) },
									{ name: '云南', value: Math.round(Math.random() * 1000) },
									{ name: '辽宁', value: Math.round(Math.random() * 1000) },
									{ name: '黑龙江', value: Math.round(Math.random() * 1000) },
									{ name: '湖南', value: Math.round(Math.random() * 1000) },
									{ name: '安徽', value: Math.round(Math.random() * 1000) },
									{ name: '山东', value: Math.round(Math.random() * 1000) },
									{ name: '新疆', value: Math.round(Math.random() * 1000) },
									{ name: '江苏', value: Math.round(Math.random() * 1000) },
									{ name: '浙江', value: Math.round(Math.random() * 1000) },
									{ name: '江西', value: Math.round(Math.random() * 1000) },
									{ name: '湖北', value: Math.round(Math.random() * 1000) },
									{ name: '广西', value: Math.round(Math.random() * 1000) },
									{ name: '甘肃', value: Math.round(Math.random() * 1000) },
									{ name: '山西', value: Math.round(Math.random() * 1000) },
									{ name: '内蒙古', value: Math.round(Math.random() * 1000) },
									{ name: '陕西', value: Math.round(Math.random() * 1000) },
									{ name: '吉林', value: Math.round(Math.random() * 1000) },
									{ name: '福建', value: Math.round(Math.random() * 1000) },
									{ name: '贵州', value: Math.round(Math.random() * 1000) },
									{ name: '广东', value: Math.round(Math.random() * 1000) },
									{ name: '青海', value: Math.round(Math.random() * 1000) },
									{ name: '西藏', value: Math.round(Math.random() * 1000) },
									{ name: '四川', value: Math.round(Math.random() * 1000) },
									{ name: '宁夏', value: Math.round(Math.random() * 1000) },
									{ name: '海南', value: Math.round(Math.random() * 1000) },
									{ name: '台湾', value: Math.round(Math.random() * 1000) },
									{ name: '香港', value: Math.round(Math.random() * 1000) },
									{ name: '澳门', value: Math.round(Math.random() * 1000) }
								]
							},
							{
								name: 'iphone4',
								type: 'map',
								mapType: 'china',
								itemStyle: {
									normal: { label: { show: true } },
									emphasis: { label: { show: true } }
								},
								data: [
									{ name: '北京', value: Math.round(Math.random() * 1000) },
									{ name: '天津', value: Math.round(Math.random() * 1000) },
									{ name: '上海', value: Math.round(Math.random() * 1000) },
									{ name: '重庆', value: Math.round(Math.random() * 1000) },
									{ name: '河北', value: Math.round(Math.random() * 1000) },
									{ name: '安徽', value: Math.round(Math.random() * 1000) },
									{ name: '新疆', value: Math.round(Math.random() * 1000) },
									{ name: '浙江', value: Math.round(Math.random() * 1000) },
									{ name: '江西', value: Math.round(Math.random() * 1000) },
									{ name: '山西', value: Math.round(Math.random() * 1000) },
									{ name: '内蒙古', value: Math.round(Math.random() * 1000) },
									{ name: '吉林', value: Math.round(Math.random() * 1000) },
									{ name: '福建', value: Math.round(Math.random() * 1000) },
									{ name: '广东', value: Math.round(Math.random() * 1000) },
									{ name: '西藏', value: Math.round(Math.random() * 1000) },
									{ name: '四川', value: Math.round(Math.random() * 1000) },
									{ name: '宁夏', value: Math.round(Math.random() * 1000) },
									{ name: '香港', value: Math.round(Math.random() * 1000) },
									{ name: '澳门', value: Math.round(Math.random() * 1000) }
								]
							},
							{
								name: 'iphone5',
								type: 'map',
								mapType: 'china',
								itemStyle: {
									normal: { label: { show: true } },
									emphasis: { label: { show: true } }
								},
								data: [
									{ name: '北京', value: Math.round(Math.random() * 1000) },
									{ name: '天津', value: Math.round(Math.random() * 1000) },
									{ name: '上海', value: Math.round(Math.random() * 1000) },
									{ name: '广东', value: Math.round(Math.random() * 1000) },
									{ name: '台湾', value: Math.round(Math.random() * 1000) },
									{ name: '香港', value: Math.round(Math.random() * 1000) },
									{ name: '澳门', value: Math.round(Math.random() * 1000) }
								]
							}
						]
					};

					// 为echarts对象加载数据 
					myChart.setOption(option);
				}
			);
			// 使用
			require(
				[
					'echarts',

					'echarts/chart/funnel' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					// 基于准备好的dom，初始化echarts图表
					var myChart = ec.init(document.getElementById('righttop'));

					var option = {
						title: {
							text: '转化率',
							x: 'center'
						},
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c}%"
						},
						toolbox: {
							show: false,
							feature: {
								mark: { show: true },
								dataView: { show: true, readOnly: false },
								restore: { show: true },
								saveAsImage: { show: true }
							}
						},

						calculable: true,
						series: [
							{
								name: '漏斗图',
								type: 'funnel',
								x: '10%',
								y: 50,
								//x2: 80,
								y2: 50,
								width: '80%',
								// height: {totalHeight} - y - y2,
								min: 0,
								max: 100,
								minSize: '0%',
								maxSize: '100%',
								sort: 'descending', // 'ascending', 'descending'
								gap: 10,
								itemStyle: {
									normal: {
										// color: 各异,
										borderColor: '#fff',
										borderWidth: 1,
										label: {
											show: true,
											position: 'inside'
											// textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
										},
										labelLine: {
											show: false,
											length: 10,
											lineStyle: {
												// color: 各异,
												width: 1,
												type: 'solid'
											}
										}
									},
									emphasis: {
										// color: 各异,
										borderColor: 'red',
										borderWidth: 5,
										label: {
											show: true,
											formatter: '{b}:{c}%',
											textStyle: {
												fontSize: 10
											}
										},
										labelLine: {
											show: true
										}
									}
								},
								data: [
									{ value: 100, name: '申请' },
									{ value: 60, name: '认证' },
									{ value: 40, name: '申额' },
									{ value: 20, name: '支用' }
								]
							}
						]
					};


					// 为echarts对象加载数据 
					myChart.setOption(option);
				}
			);
			// 使用
			require(
				[
					'echarts',

					'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
				],
				function (ec) {
					// 基于准备好的dom，初始化echarts图表
					var myChart = ec.init(document.getElementById('rightbottom'));

					var option = {
						tittle: {
							text: '转化量'
						},
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							data: ['申请', '认证', '支用']
						},
						toolbox: {
							show: false,
							feature: {
								mark: { show: true },
								dataView: { show: true, readOnly: false },
								magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
								restore: { show: true },
								saveAsImage: { show: true }
							}
						},
						calculable: true,
						xAxis: [
							{
								type: 'category',
								boundaryGap: false,
								data: ['2016', '2017', '2018']
							}
						],
						yAxis: [
							{
								type: 'value'
							}
						],
						series: [
							{
								name: '申请',
								type: 'line',
								stack: '总量',
								data: [320, 432, 201]
							},
							{
								name: '认证',
								type: 'line',
								stack: '总量',
								data: [220, 482, 391]
							},
							{
								name: '支用',
								type: 'line',
								stack: '总量',
								data: [250, 232, 401]
							}
						]
					};


					// 为echarts对象加载数据 
					myChart.setOption(option);
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