/*Create By LiuLi 2016-10-13*/

;(function (win,$) {
	$.extend({
		calendar : function(opt){
			var defaultOpt = {
				ele:"",//目标标签
				maxDate: "",
				minDate: "",
				data : [],
				selectedDate: "",
				selected: ""
			};
			if(opt && opt instanceof Object){
				$.extend(defaultOpt,opt);
			}
			if(!$.plugin_calendar_num){
				$.plugin_calendar_num = 1;//日历控件数
			}else{
				$.plugin_calendar_num++;
			}
			var id = "plugin_calendar_" + $.plugin_calendar_num;
			var dateUtil = new DateUtil();
			defaultOpt.selectedDate = dateUtil.newDate(defaultOpt.selectedDate);
			var today = defaultOpt.selectedDate || new Date();
			var $year = today.getFullYear();
			var $selectYearStart = -1;//选择年份的开始年份
			var $selectYearEnd = -1;//选择年份的结束年份
			var $month = today.getMonth();
			var date = today.getDate();
			var maxDate = dateUtil.newDate(defaultOpt.maxDate);
			var minDate = dateUtil.newDate(defaultOpt.minDate);
			var maxYear = maxDate.getFullYear();
			var maxMonth = maxDate.getMonth();
			var minYear = minDate.getFullYear();
			var minMonth = minDate.getMonth();
			setCalendarDom(id);
			var calendar = $("#"+id);
			var prevYear = calendar.find(".l_plugin_calendar_prev_year");
			var prevMonth = calendar.find(".l_plugin_calendar_prev_month");
			var nextYear = calendar.find(".l_plugin_calendar_next_year");
			var nextMonth = calendar.find(".l_plugin_calendar_next_month");
			var yearSelection = calendar.find(".l_plugin_calendar_year_selection");//选择年份框
			var monthSelection = calendar.find(".l_plugin_calendar_month_selection");//选择月份框
			var prevPageYear = calendar.find(".l_plugin_calendar_arrow_left");//上一页年份
			var nextPageYear = calendar.find(".l_plugin_calendar_arrow_right");//下一页年份
			setHtml($year,$month);
			//上一年
			prevYear.click(function(e){
				if($(this).hasClass("l_disabled")){
					return false;
				}
				if(new Date($year-1,$month,1) - new Date(minYear,minMonth,1) > 0){
					$year--;
				}else {
					$year = minYear;
					$month = minMonth;
				}
				setHtml($year,$month);
			});
			//上一月
			prevMonth.click(function(e){
				if($(this).hasClass("l_disabled")){
					return false;
				}
				var minDate = new Date(minYear,minMonth,1);
				if(new Date($year,$month,1) - minDate > 0){
					if($month > 0){
						$month -= 1;
					}else{
						$month = 11;
						$year--;
					}
					setHtml($year,$month);
				}
			});
			//下一月
			nextMonth.click(function(e){
				if($(this).hasClass("l_disabled")){
					return false;
				}
				var maxDate = new Date(maxYear,maxMonth,1);
				if(maxDate - new Date($year,$month,1) > 0) {
					if ($month == 11) {
						$month = 0;
						$year += 1;
					} else {
						$month += 1;
					}
					setHtml($year, $month);
				}
			});
			//下一年
			nextYear.click(function(e){
				if($(this).hasClass("l_disabled")){
					return false;
				}
				if(new Date(maxYear,maxMonth,1) - new Date($year+1,$month) > 0 ) {
					$year++;
				}else {
					$year = maxYear;
					$month = maxMonth;
				}
				setHtml($year, $month);
			});
			//选择年份
			calendar.find(".l_plugin_calendar_year").click(function(){
				yearSelection.toggle();
				monthSelection.hide();
			});
			//选择月份
			calendar.find(".l_plugin_calendar_month").click(function(){
				var html = [];
				var date = null;
				var minDate = new Date(minYear,minMonth,1);
				for(var i = 0; i < 12; i++){
					date = new Date($year,i,1);
					if(date - minDate >= 0 && date - maxDate <= 0){
						html.push('<li><a data-month="'+i+'" href="javascript:void(0);">'+(i+1)+'月</a></li>');
					}
				}
				calendar.find(".l_plugin_calendar_selection_month").html(html.join(""));
				monthSelection.toggle();
				yearSelection.hide();
				//绑定事件
				calendar.find(".l_plugin_calendar_selection_month a").click(function(e){
					var year = calendar.find(".l_plugin_calendar_year").val();
					var m = $(this).attr("data-month");
					$month = +m;
					setHtml(+year,+$month);
				});
			});
			//设置日期HTML，填充数据
			function setHtml(year,month){
				var list = dateUtil.getMonthDays(year,month,maxDate,minDate);
				var selected = defaultOpt.selectedDate;
				var html = [];
				for(var i = 0; i < list.length; i++){
					if(i % 7 == 0){
						html.push('<ul class="l_plugin_calendar_date_row">');
					}
					var cls = "";
					if(list[i].day % 6 == 0){
						cls += "l_plugin_calendar_weekend";
					}
					if(list[i].belong != 0 || list[i].disabled){
						cls += " l_plugin_calendar_date_gray";
					}
					if(selected instanceof Date && list[i].date == selected.getDate() && list[i].month == selected.getMonth() && list[i].year == selected.getFullYear()){
						cls += " l_plugin_calendar_selected";
					}
					if(list[i].data){
						cls += " l_plugin_calendar_has_data";
					}
					html.push('<li>');
					html.push('<a data-year="'+list[i].year+'" data-month="'+list[i].month+'" data-date="'+list[i].date+'" data-time="'+list[i].time+'" data-data="'+(list[i].data?list[i].data:"")+'" class="'+cls+'" href="javascript:void(0);">');
					html.push('<span>'+list[i].date+'</span>');
					if(list[i].data){
						html.push('<span class="l_plugin_calendar_date_data">'+(list[i].data?list[i].data:"&nbsp;")+'</span>');
					}
					html.push('</a>');
					html.push('</li>');
					if(i % 7 == 6){
						html.push('</ul>');
					}
				}
				calendar.find(".l_plugin_calendar_date").html(html.join(""));
				calendar.find(".l_plugin_calendar_date_row a").click(function(){
					if(!$(this).hasClass("l_plugin_calendar_date_gray")){
						calendar.find(".l_plugin_calendar_date_row a.l_plugin_calendar_selected").removeClass("l_plugin_calendar_selected");
						$(this).addClass("l_plugin_calendar_selected");
						var year = $(this).attr("data-year");
						var month = $(this).attr("data-month");
						var date = $(this).attr("data-date");
						var d = dateUtil.formatDate("YYYY-MM-DD",new Date(year,month,date));
						// console.log(d);
						var obj = {
							dateStr: d,
							data: $(this).attr("data-data"),
							year: year,
							month: month,
							date: date,
							time: $(this).attr("data-time")
						};
						defaultOpt.selectedDate = dateUtil.newDate(d);
						if(defaultOpt.selected && defaultOpt.selected instanceof Function){
							defaultOpt.selected(d,obj,this);
						}
					}
				});
				//设置年月
				calendar.find(".l_plugin_calendar_year").val(year);
				calendar.find(".l_plugin_calendar_month").val(month+1);
				setYearSelection(0);
				//判断是否禁止按钮点击
				if(new Date(year,month,1) - new Date(minYear,minMonth,1) > 0){
					prevYear.removeClass("l_disabled");
					prevMonth.removeClass("l_disabled");
				}else {
					prevYear.addClass("l_disabled");
					prevMonth.addClass("l_disabled");
				}
				if(new Date(maxYear,maxMonth,1) - new Date($year,$month,1) > 0){
					nextYear.removeClass("l_disabled");
					nextMonth.removeClass("l_disabled");
				}else {
					nextYear.addClass("l_disabled");
					nextMonth.addClass("l_disabled");
				}
				//隐藏选择框
				monthSelection.hide();
				yearSelection.hide();
			}

			//设置选择的年份
			function setYearSelection(arrow){
				if(arrow === 0){
					$selectYearStart = $year - 10;
					$selectYearEnd = $year + 9;
				}else if(arrow === -1){
					$selectYearEnd = $selectYearStart - 1;
					$selectYearStart = $selectYearStart - 20;
				}else if(arrow === 1){
					$selectYearStart = $selectYearEnd + 1;
					$selectYearEnd = $selectYearEnd + 20;
				}
				$selectYearStart = $selectYearStart < minYear ? minYear : $selectYearStart;
				$selectYearEnd = $selectYearEnd > maxYear ? maxYear : $selectYearEnd;
				$selectYearStart = ($selectYearEnd - 19) > minYear ? ($selectYearEnd - 19) : minYear;
				$selectYearEnd = ($selectYearStart + 19) < maxYear ? ($selectYearStart + 19) : maxYear;
				// $selectYearStart = $selectYearStart < minYear ? minYear : $selectYearStart;
				// $selectYearEnd = $selectYearEnd > maxYear ? maxYear : $selectYearEnd;
				var yHtml = [];
				for(var j = $selectYearStart; j <= $selectYearEnd; j++){
					yHtml.push('<li><a data-year="'+j+'" href="javascript:void(0);">'+j+'</a></li>');
				}
				calendar.find(".l_plugin_calendar_selection_year").html(yHtml.join(""));

				if($selectYearStart == minYear){
					prevPageYear.addClass("l_disabled");
				}else {
					prevPageYear.removeClass("l_disabled");
				}
				if($selectYearEnd == maxYear){
					nextPageYear.addClass("l_disabled");
				}else {
					nextPageYear.removeClass("l_disabled");
				}
				bindClick();
			}
			//绑定年份点击事件
			function bindClick(){
				calendar.find(".l_plugin_calendar_selection_year a").off().on("click",function(e){
					var year = $(this).attr("data-year");
					var month = calendar.find(".l_plugin_calendar_month").val();
					month = month - 1;
					year = +year;
					var date = new Date(year,month,1);
					if(date - new Date(maxYear,maxMonth,1) > 0){
						month = maxMonth;
					}
					if(date - new Date(minYear,minMonth,1) < 0){
						month = minMonth;
					}
					$year = year;
					$month = month;
					calendar.find(".l_plugin_calendar_year").val($year);
					calendar.find(".l_plugin_calendar_month").val(month+1);
					setHtml($year,month);
				});
			}
			//选择年份按钮绑定事件
			prevPageYear.off().on("click",function(){
				if($(this).hasClass("l_disabled")){
					return false;
				}
				setYearSelection(-1);
			});
			nextPageYear.off().on("click",function(){
				if($(this).hasClass("l_disabled")){
					return false;
				}
				setYearSelection(1);
			});
			calendar.find(".l_plugin_calendar_close_selection").off().on("click",function(){
				yearSelection.hide();
			});

			//设置选择月份
			calendar.find(".l_plugin_calendar_close_month").click(function(e){
				monthSelection.hide();
			});

			//时间日期工具
			function DateUtil(){
				this.today = new Date();
				this.getMonthDays = function(year,month,maxDate,minDate){
					var firstDay = new Date(year,month,1);//第一天
					var dayTime = 24 * 60 * 60 * 1000;
					var lastDay = null;
					maxDate = this.newDate(maxDate);
					minDate = this.newDate(minDate);
					if(month == 11){
						lastDay = new Date(year + 1, 0, 1);
					}else{
						lastDay = new Date(year, month + 1, 1);
					}
					lastDay = new Date(lastDay.getTime() - dayTime);//最后一天
					var firstDayWeekDay = firstDay.getDay();//月份第一天是周几
					var lastDayWeekDay = lastDay.getDay();//月份最后一天是周几
					var firstDayTime = firstDay.getTime();//第一天换算成毫秒
					var lastDayTime = lastDay.getTime();//最后一天换算成毫秒
					var days = [];//月份的日期
					var date = null;
					var data = defaultOpt.data;
					var dateTemp = null;
					var dataTemp = "";
					//上月日期
					for(var i = 0; i < firstDayWeekDay; i++){
						date = new Date(firstDayTime - (firstDayWeekDay - i) * dayTime);
						dataTemp = "";
						for(var j = 0; j < data.length; j++){
							dateTemp = this.newDate(data[j].date);
							if(dateTemp instanceof Date && dateTemp.getTime() == date.getTime()){
								dataTemp = data[j].data;
								break;
							}
						}
						days.push({
							year: date.getFullYear(),
							month: date.getMonth(),
							date: date.getDate(),
							belong: -1,
							data: dataTemp,
							day: date.getDay(),
							time: date.getTime()
						});
					}
					//当月日期
					for(i = firstDay.getDate(); i <= lastDay.getDate(); i++){
						date = new Date(year, month, i);
						var disabled = false;
						if(maxDate instanceof Date){
							disabled = date > maxDate;
						}
						if(minDate instanceof Date){
							disabled = disabled || date < minDate;
						}
						dataTemp = "";
						for(j = 0; j < data.length; j++){
							dateTemp = this.newDate(data[j].date);
							if(dateTemp instanceof Date && dateTemp.getTime() == date.getTime()){
								dataTemp = data[j].data;
								break;
							}
						}
						days.push({
							year: date.getFullYear(),
							month: date.getMonth(),
							date: date.getDate(),
							belong: 0,
							data: dataTemp,
							// data: "",
							day: date.getDay(),
							time: date.getTime(),
							disabled: disabled
						});
					}
					//下月日期
					if(lastDayWeekDay < 6){
						for(i = lastDayWeekDay + 1; i < 7; i++){
							date = new Date(lastDayTime + (i - lastDayWeekDay) * dayTime);
							dataTemp = "";
							for(j = 0; j < data.length; j++){
								dateTemp = this.newDate(data[j].date);
								if(dateTemp instanceof Date && dateTemp.getTime() == date.getTime()){
									dataTemp = data[j].data;
									break;
								}
							}
							days.push({
								year: date.getFullYear(),
								month: date.getMonth(),
								date: date.getDate(),
								belong: 1,
								data: "",
								day: date.getDay(),
								time: date.getTime()
							});
						}
					}
					return days;
				};
				this.getCurrentMonth = function(){
					return this.getMonthDays(this.today.getFullYear(),this.today.getMonth());
				};
				this.formatDate = function(formatStr, oldDate){
					var str = formatStr;
					var Week = ['日', '一', '二', '三', '四', '五', '六'];
					var month = oldDate.getMonth() + 1;
					str = str.replace(/yyyy|YYYY/, oldDate.getFullYear());
					str = str.replace(/yy|YY/, (oldDate.getYear() % 100) > 9 ? (oldDate.getYear() % 100).toString() : '0' + (oldDate.getYear() % 100));
					str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
					str = str.replace(/M/g, month);
					str = str.replace(/w|W/g, Week[oldDate.getDay()]);
					str = str.replace(/dd|DD/, oldDate.getDate() > 9 ? oldDate.getDate().toString() : '0' + oldDate.getDate());
					str = str.replace(/d|D/g, oldDate.getDate());
					str = str.replace(/hh|HH/, oldDate.getHours() > 9 ? oldDate.getHours().toString() : '0' + oldDate.getHours());
					str = str.replace(/h|H/g, oldDate.getHours());
					str = str.replace(/mm/, oldDate.getMinutes() > 9 ? oldDate.getMinutes().toString() : '0' + oldDate.getMinutes());
					str = str.replace(/m/g, oldDate.getMinutes());
					str = str.replace(/ss|SS/, oldDate.getSeconds() > 9 ? oldDate.getSeconds().toString() : '0' + oldDate.getSeconds());
					str = str.replace(/s|S/g, oldDate.getSeconds());
					return str;
				};
				this.newDate = function (dateStr) {
					var date = null;
					if(dateStr instanceof Date){
						return dateStr;
					}
					if(typeof dateStr == "number"){
						try{
							return new Date(dateStr);
						}catch (e){
							//
						}
					}
					if(typeof dateStr == "string" && dateStr.indexOf("-") > -1){
						var arr = dateStr.split("-");
						try{
							date = new Date(arr[0],arr[1] - 1,arr[2]);
						}catch (e){
							date = null;
						}
					}
					return date;
				}
			}

			//生成日历DOM结构
			function setCalendarDom(id) {
				var html = [];
				html.push('<div id="'+id+'" class="l_plugin_calendar_calendar">');
				html.push('<ul class="l_plugin_calendar_year_month">');
				html.push('<li><a class="l_plugin_calendar_prev_year" href="javascript:void(0);">&lt;&lt;</a></li>');
				html.push('<li><a class="l_plugin_calendar_prev_month" href="javascript:void(0);">&lt;</a></li>');
				html.push('<li class="l_plugin_calendar_year_month_input"><input class="l_plugin_calendar_year" type="text" value="2016" readonly><span>年</span></li>');
				html.push('<li class="l_plugin_calendar_year_month_input"><input class="l_plugin_calendar_month" type="text" value="09" readonly><span>月</span></li>');
				html.push('<li><a class="l_plugin_calendar_next_month" href="javascript:void(0);">&gt;</a></li>');
				html.push('<li><a class="l_plugin_calendar_next_year" href="javascript:void(0);">&gt;&gt;</a></li>');
				html.push('</ul>');
				html.push('<div class="l_plugin_calendar_calendar_body">');
				html.push('<ul class="l_plugin_calendar_days">');
				html.push('<li class="l_plugin_calendar_weekend">日</li>');
				html.push('<li>一</li>');
				html.push('<li>二</li>');
				html.push('<li>三</li>');
				html.push('<li>四</li>');
				html.push('<li>五</li>');
				html.push('<li class="l_plugin_calendar_weekend">六</li>');
				html.push('</ul>');
				html.push('<div class="l_plugin_calendar_date">');
				html.push('</div>');
				html.push('<div class="l_plugin_calendar_year_selection">');
				html.push('<ul class="l_plugin_calendar_selection_year">');
				html.push('</ul>');
				html.push('<div class="l_plugin_calendar_btns">');
				html.push('<ul>');
				html.push('<li><button class="l_plugin_calendar_btn l_plugin_calendar_arrow_left">&larr;</button></li>');
				html.push('<li><button class="l_plugin_calendar_btn l_plugin_calendar_arrow_right">&rarr;</button></li>');
				html.push('<li><button class="l_plugin_calendar_btn l_plugin_calendar_close_selection">关闭</button></li>');
				html.push('</ul>');
				html.push('</div>');
				html.push('</div><!-- 年份选择 end -->');
				html.push('<div class="l_plugin_calendar_month_selection">');
				html.push('<ul class="l_plugin_calendar_selection_month">');
				html.push('<li><a data-month="0" href="javascript:void(0);">一月</a></li>');
				html.push('<li><a data-month="1" href="javascript:void(0);">二月</a></li>');
				html.push('<li><a data-month="2" href="javascript:void(0);">三月</a></li>');
				html.push('<li><a data-month="3" href="javascript:void(0);">四月</a></li>');
				html.push('<li><a data-month="4" href="javascript:void(0);">五月</a></li>');
				html.push('<li><a data-month="5" href="javascript:void(0);">六月</a></li>');
				html.push('<li><a data-month="6" href="javascript:void(0);">七月</a></li>');
				html.push('<li><a data-month="7" href="javascript:void(0);">八月</a></li>');
				html.push('<li><a data-month="8" href="javascript:void(0);">九月</a></li>');
				html.push('<li><a data-month="9" href="javascript:void(0);">十月</a></li>');
				html.push('<li><a data-month="10" href="javascript:void(0);">十一月</a></li>');
				html.push('<li><a data-month="11" href="javascript:void(0);">十二月</a></li>');
				html.push('</ul>');
				html.push('<button class="l_plugin_calendar_btn l_plugin_calendar_close_month">关闭</button>');
				html.push('</div><!-- 月份选择 end -->');
				html.push('</div>');
				html.push('</div>');
				$("body").append(html.join(""));
			}
		}
	});

})(window,jQuery);
