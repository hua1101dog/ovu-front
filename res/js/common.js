/*Ajax加载下拉框*/
var isInitialDefOpt = true;
function loadSelect(myOpt, callback) {
	var opt = {
		src : "",
		sel : null,
		key : "id",
		val : "name",// function(data){}
		defVal : "请选择",
		defKey : "",
		parent : {},// name:select name,pname:param name
		defSel : "",
		dataName : null,
		param : {},
		onchange : function(data) {
		}// 下拉框change事件
	};
	coverObj(opt, myOpt);

	if (isNull(opt.src) || isNull(opt.sel))
		return false;

	var optionsHtml = '<option value="' + opt.defKey + '">' + opt.defVal
			+ '</option>';
	opt.sel = $(opt.sel);
	opt.sel.html(optionsHtml);
	
	if (opt.parent.name == null || opt.isParent == 1) {
		$.ajax({
			async : true,
			url : opt.src,
			data : opt.param,
			success : function(data) {
				if(typeof data =="string"){
					data=eval("("+data+")");
				}
				data = isNull(opt.dataName) ? data : data[opt.dataName];
				var dataLength = data.length;
				for (var i = 0; i < dataLength; i++) {
					var selKey = data[i][opt.key];

					var selVal = "";
					if (typeof opt.val == "function") {
						selVal = opt.val(data[i]);
					} else {
						selVal = data[i][opt.val];
					}
					selVal = isNull(selVal, "");
					optionsHtml += '<option value="' + selKey + '">' + selVal
							+ '</option>';
				}
				opt.sel.html(optionsHtml);
				if (!isNull(opt.defSel))
					opt.sel.val(opt.defSel).change();

				if (typeof callback == "function")
					callback(data);
				initSelVal(opt.sel);
				if (opt.isParent == 1) {
					$(opt.sel).removeAttr("defval");
				}
				if (typeof opt.onchange == "function") {
					$(opt.sel).unbind("change.loadSelect").bind(
							"change.loadSelect", function() {
								var i = this.selectedIndex - 1;
								var d = null;
								if (i >= 0)
									d = data[i];
								opt.onchange(this, d,i);
							});
				}
			}
		});
	} else {
		$(opt.parent.name).bind("change.ls", function() {
			if(isNull(this.value)){
				var optionsHtml = '<option value="' + opt.defKey + '">' + opt.defVal
				+ '</option>';
				opt.sel = $(opt.sel);
				opt.sel.html(optionsHtml);
				$(opt.sel).change();
				return ;
			}
			if (!isNull(opt.parent.pname))
				opt.param[opt.parent.pname] = this.value;
			opt.defSel = isInitialDefOpt ? opt.defSel : "";
			isInitialDefOpt = false;
			opt.isParent = 1;
			opt.init = false;
			if (isNull(opt.dataName))
				opt.dataName = this.getAttribute("dataName");
			loadSelect(opt,function(data){
				if (typeof callback == "function")
					callback(data);
				$(opt.sel).change();
			});
		});
	}
}
function initSelVal(sel) {
	sel = isNull(sel, $("select[defval]"));
	$(sel).each(function() {
		var defVal = $(this).attr("defval");
		defVal = isNull(defVal, "");
		if (defVal == "" && $(this).find('option').length > 0)
			$(this).find('option:eq(0)').prop('seleced', 'seleced');
		else{
			this.value = defVal;
			$(this).change();
		}
	});
}
/* 绑定Date格式化日期 */
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

function formatDate(date, format) {
	if (!date)
		return;
	if (!format)
		format = "yyyy-MM-dd";
	switch (typeof date) {
	case "string":
		date = new Date(date.replace(/-/, "/"));
		break;
	case "number":
		date = new Date(date);
		break;
	}
	if (!date instanceof Date)
		return;
	var dict = {
		"yyyy" : date.getFullYear(),
		"M" : date.getMonth() + 1,
		"d" : date.getDate(),
		"H" : date.getHours(),
		"m" : date.getMinutes(),
		"s" : date.getSeconds(),
		"MM" : ("" + (date.getMonth() + 101)).substr(1),
		"dd" : ("" + (date.getDate() + 100)).substr(1),
		"HH" : ("" + (date.getHours() + 100)).substr(1),
		"mm" : ("" + (date.getMinutes() + 100)).substr(1),
		"ss" : ("" + (date.getSeconds() + 100)).substr(1)
	};
	return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
		return dict[arguments[0]];
	});
}

/* 获取json属性 */
function getAttr(data, name) {
	//var names = name.split(".");
	var names;
	if(name!=null){
		names = name.split(".");
	}else{
		return;
	}
	var val = null;
	for ( var name in names) {
		val = data[names[name]];
		if (!isNull(val)) {
			data = val;
		} else {
			return val;
		}
	}
	return val;
}
/* 非空判断 */
function isNull(val, nval) {
	if (val == null || $.trim(val) === "") {
		if (typeof nval != "undefined")
			return nval;
		return true;
	}
	if (typeof nval != "undefined")
		return val;
	return false;
}
/* json属性合并 */
function coverObj(obj1, obj2) {
	for ( var key in obj2) {
		obj1[key] = obj2[key];
	}
}
function cancelDialog(str) {
	str = isNull(str, "div.dialog:visible");
	$(str).dialog("close");
}
/* 获取dialog默认属性参数 */
function getDialogOpt(myOpt) {
	myOpt = isNull(myOpt, {});
	var opt = {
		autoOpen : false,
		modal : true,
		height : "auto",
		width : "auto",
		formModel : true,
		saveText : "保存",
		cancelText : "取消",
		dialog : null,
		onsave : function(dialog) {
			cancelDialog(dialog);
		},
		oncancel : function(dialog) {
			cancelDialog(dialog);
		},
	};
	coverObj(opt, myOpt);
	if (opt.formModel) {
		opt.buttons = [ {
			html : "<i class='fa fa-save'></i>&nbsp; " + opt.saveText,
			"class" : "btn btn-primary",
			click : function() {
				opt.onsave(opt.dialog);
			}
		}, {
			html : "<i class='fa fa-times'></i>&nbsp; " + opt.cancelText,
			"class" : "btn btn-default",
			click : function() {
				opt.oncancel(opt.dialog);
			}
		} ];
	}
	return opt;
}
/* 模拟form表单提交 */
var od;
function forward(url, myOpt) {
	myOpt = isNull(myOpt, {});
	var opt = {
		target : "_blank",
		objs : [],
		param : {}
	};
	coverObj(opt, myOpt);
	var f = '<form name="forwardForm" action="' + url
			+ '" method="post" target="' + opt.target + '"  >';
	od = opt.objs;
	if ($(od).is("form")) {
		$("[name]", $(od)).each(function(i) {
			if (!!this.name) {
				opt.param[this.name] = this.value;
			}
		});
	} else {
		opt.objs.each(function(i) {
			if (!!this.name) {
				opt.param[this.name] = this.value;
			}
		});
	}
	if (opt.param != null) {
		for ( var o in opt.param) {
			var key = o;
			var val = opt.param[key];
			var obj = '<input type="hidden" value="' + val + '" name="' + key
					+ '">';
			f += obj;
		}
	}

	$("body").append(f);

	$(forwardForm).submit();
	$(forwardForm).remove();
}
/* 绑定form参数 */
function bindFormData(f, data, myOpt) {
	var opt = {
		date : {}
	// {"yyyy-MM-dd":["createTime","dateTime"]} or
	// {"yyyy-MM-dd":"createTime"}
	};
	coverObj(opt, myOpt);
	$("[name]", f).each(function() {
		var val = getAttr(data, this.name);
		if (typeof val != "undefined")
			this.value = isNull(val, "");
		if (this.nodeName == "SELECT") {
			this.setAttribute("defVal", val);
			this.value = isNull(val, "");
			$(this).change();
		}
	});
	for ( var pattern in opt.date) {
		var names = opt.date[pattern];
		if (names instanceof Array) {
			for ( var i in names) {
				var name = names[i];
				var time = getAttr(data, name);
				var date = fmtDate(time, pattern);
				f[name].value = date;
			}
		} else {
			var time = getAttr(data, names);
			var date = fmtDate(time, pattern);
			f[names].value = date;
		}
	}
	
}
/* 格式化日期 */
function fmtDate(time, pattern) {
	if (isNull(time))
		return "";
	pattern = isNull(pattern, "yyyy-MM-dd");
	var date = new Date(time);
	return date.format(pattern);
}
/* 千分符绑定与解绑 */
function commafyback(num) {
	var x = num.split(',');
	return x.join("");
}
function commafy(num) {
	if (isNaN(num))
		return num;
	num = num + "";
	var re = /(-?\d+)(\d{3})/;
	while (re.test(num)) {
		num = num.replace(re, "$1,$2");
	}
	return num;
}
/* 筛选input,span格式化千分符 */
function fmtNumber(parent) {
	parent = isNull(parent, "body");
	$("span.fmtNumber,input.fmtNumber", parent).each(function() {
		if (this.tagName == "SPAN")
			this.innerText = (commafy(this.innerText));
		else
			this.value = (commafy(this.value));
	});
	$("input.fmtNumber", parent).bind("change", function() {
		var val = commafyback($.trim(this.value));
		if (isNaN(val) || val == "")
			return;
		this.value = commafy(val);
	});
}
function backNumber(parent) {
	parent = isNull(parent, "body");
	$("input.fmtNumber", parent).each(function() {
		this.value = commafyback(this.value);
	});
}
/* dialog for confirm */
function nconfirm(content, myOpt, callback) {
	var opt = {
		confirmModel : true
	};
	if (typeof myOpt === "function") {
		callback = myOpt;
	} else {
		myOpt = isNull(myOpt, {});
		coverObj(opt, myOpt);
	}
	coverObj(opt, myOpt);
	nalert(content, opt, callback);
}
/* dialog for alert */
function nalert(content, myOpt, callback) {
	var dialogHtml = '', dialog = null;
	var opt = {
		title : "提示",
		minHeight : 170,
		confirmModel : false,
		resizable : false,
		autoOpen : true,
		formModel : false,
		buttons : [ {
			html : "<i class='fa fa-check'></i>&nbsp; 确定",
			"class" : "btn btn-primary",
			click : function() {
				if (!!callback)
					callback(true);
				dialog.dialog("close");
				dialog.remove();
			}
		} ]
	};
	if (typeof myOpt === "function") {
		callback = myOpt;
	} else {
		myOpt = isNull(myOpt, {});
		coverObj(opt, myOpt);
	}
	if (opt.confirmModel) {
		opt.buttons[1] = {
			html : "<i class='fa fa-times'></i>&nbsp; 取消",
			"class" : "btn btn-default",
			click : function() {
				if (!!callback)
					callback(false);
				dialog.dialog("close");
				dialog.remove();
			}
		};
	}

	dialogHtml += '<div class="dialog" style="overflow:hidden;min-width:230px;max-width:300px;word-break: normal;word-wrap: break-word;word-break:break-all;padding-top:18px;text-align:center;">';
	dialogHtml += content;
	dialogHtml += '<div>';
	dialog = $(dialogHtml);
	dialog.dialog(getDialogOpt(opt));
	return dialog;
}
function changeInputFile(inp, name, className) {
	inp = $(inp);
	var ninp = $("<input type='file' name='" + name
			+ "'  style='display:inline'>");
	ninp.addClass("changeFile");
	if (!isNull(className)) {
		ninp.addClass(className);
	}
	ninp.data("inp", inp);
	inp.replaceWith(ninp);
}
function backInupt() {
	$("input.changeFile").each(function() {
		var inp = $(this);
		var ninp = inp.data("inp");
		inp.replaceWith(ninp);
	});
}
function checkForm(f) {
	var check = true;
	var requiredTxt = "不能为空", intTxt = "只能为整数", floatTxt = "只能为数字且最多保留2位小数", maxNumTxt = "不能大于", minNumTxt = "不能小于", checked = "必选项";
	var title = "该字段";
	$(f)
			.find(".required")
			.each(function() {
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");
				var val = this.value;
				if (isNull(val)) {
					this.focus();
					nalert(txt + requiredTxt, function() {

					});
					check = false;
					return false;
				}
			})
			.end()
			.find(".int")
			.each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText")) {
					txt = _this.parents("td:first").prev("td").html();
				} else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");
				var val = this.value;
				if (_this.is(".fmtNumber"))
					val = commafyback(val);
				if (isNull(val)) {
					return true;
				}
				if (isNaN(val)) {
					nalert(txt + intTxt, function() {
						this.focus();
					});
					check = false;
					return false;
				} else {
					if (!/^\-?[0-9]+$/.test(val)) {
						nalert(txt + intTxt, function() {
							this.focus();
						});
						check = false;
						return false;
					}
				}
			})
			.end()
			.find(".float")
			.each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");

				var val = this.value;
				if (_this.is(".fmtNumber"))
					val = commafyback(val);

				if (isNull(val)) {
					return true;
				}
				if (isNaN(val)) {
					nalert(txt + floatTxt, function() {
						this.focus();
					});
					check = false;
					return false;
				} else {
					val = parseFloat(val);
					if (!/^\-?[0-9]+(\.[0-9][0-9]?)?$/.test(val)) {
						nalert(txt + floatTxt, function() {
							this.focus();
						});
						check = false;
						return false;
					}
				}
			})
			.end()
			.find("[max]")
			.each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");
				var val = this.value;
				if (_this.is(".fmtNumber"))
					val = commafyback(val);

				var maxNum = _this.attr("max");
				if (isNull(val)) {
					return true;
				}
				val = parseFloat(val);
				maxNum = parseFloat(maxNum);
				if (val > maxNum) {
					nalert(txt + maxNumTxt + maxNum, function() {
						this.focus();
					});
					check = false;
					return false;
				}
			})
			.end()
			.find("[min]")
			.each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");
				var val = this.value;
				if (_this.is(".fmtNumber"))
					val = commafyback(val);

				var min = _this.attr("min");
				if (isNull(val)) {
					return true;
				}
				val = parseFloat(val);
				min = parseFloat(min);
				if (val < min) {
					nalert(txt + minNumTxt + min, function() {
						this.focus();
					});
					check = false;
					return false;
				}
			})
			.end()
			.find(".email")
			.each(
					function() {
						if (!check)
							return false;
						var txt = title;
						var _this = $(this);
						if (_this.is(".tdText"))
							txt = _this.parents("td:first").prev("td").html();
						else if (_this.is("[tdText]"))
							txt = _this.attr("tdText");

						var val = this.value;
						if (isNull(val)) {
							return true;
						}

						if (!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
								.test(val)) {
							nalert(txt + "格式不正确", function() {
								this.focus();
							});
							check = false;
							return false;
						}
					})
			.end()
			.find(".regu")
			.each(
					function() {
						var regEx = new RegExp(
								"[ `~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]");
						if (!check)
							return false;
						var txt = title;
						var _this = $(this);
						if (_this.is(".tdText"))
							txt = _this.parents("td:first").prev("td").html();
						else if (_this.is("[tdText]"))
							txt = _this.attr("tdText");

						var val = this.value;
						if (isNull(val)) {
							return true;
						}

						if (regEx.test(val)) {
							nalert(txt + "格式不正确", function() {
								this.focus();
							});
							check = false;
							return false;
						}
					}).end().find(".mobile").each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");

				var val = this.value;
				if (isNull(val)) {
					return true;
				}

				if (!/^0?1[3|4|5|8][0-9]\d{8}$/.test(val)) {
					nalert(txt + "格式不正确", function() {
						this.focus();
					});
					check = false;
					return false;
				}
			}).end().find(".tel").each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");

				var val = this.value;
				if (isNull(val)) {
					return true;
				}

				if (!/^0[\d]{2,3}-[\d]{7,8}$/.test(val)) {
					nalert(txt + "格式不正确", function() {
						this.focus();
					});
					check = false;
					return false;
				}
			}).end().find(".idcard").each(function() {
				if (!check)
					return false;
				var txt = title;
				var _this = $(this);
				if (_this.is(".tdText"))
					txt = _this.parents("td:first").prev("td").html();
				else if (_this.is("[tdText]"))
					txt = _this.attr("tdText");

				var val = this.value;
				if (isNull(val)) {
					return true;
				}

				if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(val)) {
					nalert(txt + "格式不正确", function() {
						this.focus();
					});
					check = false;
					return false;
				}
			}).end().find(".checkonebox").each(function() {
				if (!check)
					return false;
				var checkIndex = $("input.checkone:checked", this).length;
				if (checkIndex <= 0) {
					nalert($(this).attr('tdText') + ":" + checked)
					check = false;
					return false;
				}
			})
	return check;
}
function autoBindRq() {
	$("input.rq").each(function() {
		var pattern = $(this).data("pattern");
		if (isNull(pattern)) {
			pattern = isNull($(this).attr("pattern"), "yyyy-MM-dd");
			$(this).data("pattern", pattern);
			$(this).removeAttr("pattern");
		}
	})

	$("body").on("click", "input.rq", function() {
		var pattern = $(this).data("pattern");
		if (isNull(pattern)) {
			pattern = isNull($(this).attr("pattern"), "yyyy-MM-dd");
			$(this).data("pattern", pattern);
			$(this).removeAttr("pattern");
		}
		var change = $(this).attr("onpicked");

		change = isNull(change, "");

		var inp = this;
		WdatePicker({
			el : inp,
			//readOnly : true,
			dateFmt : pattern,
			onpicked : function(dp) {
				var ndate = this.value;
				var minDate = $(this).attr("minDate");
				var maxDate = $(this).attr("maxDate");
				minDate = eval(isNull(minDate, null));
				maxDate = eval(isNull(maxDate, null));

				if (!isNull(minDate) && ndate < minDate) {
					nalert("日期不能小于" + minDate);
					this.value = "";
					return false;
				}
				if (!isNull(maxDate) && ndate > maxDate) {
					nalert("日期不能大于" + maxDate);
					this.value = "";
					return false;
				}

				eval(change)
			}
		})
	});
}
function initSortTable() {
	$('table.tablesorter').tablesorter({
		usNumberFormat : false,
		sortReset : true,
		sortRestart : true,
		textSorter : function(a, b, direction, columnIndex) {
			return a.localeCompare(b);
		}
	}).on(
			"click",
			"thead th",
			function() {
				$(this).addClass("th_sorter").siblings("th.th_sorter")
						.removeClass("th_sorter");
			}).bind("sortEnd", function(e, table) {
		var beginI = "${(page.pageNo-1)*page.maxResult}";
		if (isNaN(beginI) || beginI < 0) {
			beginI = 0;
		}
		beginI = parseInt(beginI);
		$("span.sortId", table).each(function(i) {
			this.innerHTML = ++beginI;
		});
	});
}

function nconfirm(content, myOpt, callback) {
	var opt = {
		confirmModel : true
	};
	if (typeof myOpt === "function") {
		callback = myOpt;
	} else {
		myOpt = isNull(myOpt, {});
		coverObj(opt, myOpt);
	}
	coverObj(opt, myOpt);
	nalert(content, opt, callback);
}
function nalert(content, myOpt, callback) {
	var dialogHtml = '', dialog = null;
	var opt = {
		title : "提示",
		confirmModel : false
	};
	if (typeof myOpt === "function") {
		callback = myOpt;
	} else {
		myOpt = isNull(myOpt, {});
		coverObj(opt, myOpt);
	}
	if(opt.confirmModel){
		$.confirm({
			title : opt.title,
			content : content+"",
			confirm : function() {
				if (!!callback)
					callback(true);
			},
			cancel: function(){
				if (!!callback)
					callback(false);
			}
		});
	}else{
		$.alert({
			confirmButton : opt.title,
			title : opt.title,
			content : content+"",
			confirm : function() {
				if (!!callback)
					callback(true);
			}
		});
	}
}
function openDialog(dialog) {
	$(dialog).toggleClass("div_hidden");
}
function resolveCmd() {
	$("cmd").each(function() {
		var cmd = eval("(function(){" + this.textContent + "})");
		var res = cmd();
		$(this).replaceWith(res);
	});
}

function zqToPage(pageNo){
	if(isNaN(pageNo))
		return false;
	var pageForm = $("form.pageForm");
	var inp_pageNo= $("input.pageNo",pageForm);
	if(inp_pageNo.length<=0){
		pageForm.append('<input class="pageNo" type="hidden" name="pageNo" value="'+pageNo+'">');
	}else{
		$("input.pageNo", pageForm).val(pageNo);
	}
	pageForm.submit();
}
