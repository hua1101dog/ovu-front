/**
 * jQuery upload v1.2
 * http://www.ponxu.com
 *
 * @author xwz
 */
(function($) {
	var noop = function(){ return true; };
	var frameCount = 0;

	$.upload = function(options) {
		var uploadDefault = {
				url: '',
				fileName: 'file',
				dataType: 'json',
				params: {},
				accept:"image/jpg,image/jpeg,image/png,image/gif",
				onSend: noop,
				onSubmit: noop,
				onComplate: noop
		};

		var opts = $.extend(uploadDefault, options);
		if (opts.url == '') {
			return;
		}

		var canSend = opts.onSend();
		if (!canSend) {
			return;
		}

		var frameName = 'upload_frame_' + (frameCount++);
		var iframe = $('<iframe style="position:absolute;top:-9999px" />').attr('name', frameName);
		var form = $('<form method="post" style="display:none;" enctype="multipart/form-data" />').attr('name', 'form_' + frameName);
		form.attr("target", frameName).attr('action', opts.url);

		// form中增加数据域
		var formHtml='';
		if(opts.multiple){
            formHtml = '<input type="file" multiple="multiple" name="' + opts.fileName + '" onchange="onChooseFile(this)" accept="'+opts.accept+'">';
        }else{
            formHtml = '<input type="file" name="' + opts.fileName + '" onchange="onChooseFile(this)" accept="'+opts.accept+'">';
        }
		for (key in opts.params) {
			formHtml += '<input type="hidden" name="' + key + '" value="' + opts.params[key] + '">';
		}
		form.append(formHtml);

		iframe.appendTo("body");
		form.appendTo("body");

		form.submit(opts.onSubmit);

		// iframe 在提交完成之后
		iframe.load(function() {
			var contents = $(this).contents().get(0);
			var data = $(contents).find('body').text();
			if(data){
				if ('json' == opts.dataType) {
					try{
						data = window.eval('(' + data + ')');
					}catch(e){
						console.log(data)
						if(data ==""){
							data = "请重新登陆!";
						}
						data = {success:false,error:data}
					}
					opts.onComplate(data);
				}
			
			setTimeout(function() {
				iframe.remove();
				form.remove();
			}, 5000);
			}
			
			
		});
	
	

		// 文件框
		var fileInput = $('input[type=file][name=' + opts.fileName + ']', form);
		fileInput.click();
	};
})(jQuery);

// 选中文件, 提交表单(开始上传)
var onChooseFile = function(fileInputDOM) {
	$(fileInputDOM).parent().submit();
};
