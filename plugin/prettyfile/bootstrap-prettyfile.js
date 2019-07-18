/*
 * jQuery and Bootsrap3 Plugin prettyFile
 *
 * version 2.0, Jan 20th, 2014
 * by episage, sujin2f
 * Git repository : https://github.com/episage/bootstrap-3-pretty-file-upload
 */
( function ($) {
    $.fn.extend({
        prettyFile: function (options) {
            var defaults = {
                text: "选择文件",
                title: "图片"
            };

            var options = $.extend(defaults, options);
            var plugin = this;

            function make_form($el, opt) {
                $el.wrap('<div style="float: left;width:81px;"></div>');

                $el.hide();
                if ($el.attr("file-type") == "word") {
                    $el.after('\
						<div class="input-append input-group">\
							<span class="input-group-btn">\
								<button class="btn" type="button">' + opt.text + '</button>\
							</span>\
							<input class="input-large form-control" readonly="readonly" type="text">\
							<label class="file-img-name"></label>\
							<input type="hidden" class="code" name="' + $el.attr("data-id") + '">\
						</div>\
					');
                }
                else {
                    $el.after('\
						<div class="input-append input-group">\
							<div class="file-action input-group">\
								<span class="input-group-btn">\
									<button class="btn" type="button">' + opt.text + '</button>\
								</span>\
								<input class="input-large form-control" readonly="readonly" style=\"border-right:1px #ddd solid;border-color: #ddd\" type="text">\
								<label class="file-img-name"></label>\
								<input type="hidden" class="code" name="' + $el.attr("data-id") + '">\
								</div>\
						</div>\
					');
                }
                return $el.parent();
            };

            function bind_change($wrap, multiple, option) {
                $wrap.find('input[type="file"]').change(function () {
                    // When original file input changes, get its value, show it in the fake input
                    var files = $(this)[0].files,
                        info = '';

                    if (files.length == 0)
                        return false;

                    if (!multiple || files.length == 1) {
                        var path = $(this).val().split('\\');
                        info = path[path.length - 1];
                    } else if (files.length > 1) {
                        // Display number of selected files instead of filenames
                        info = "已选择了" + files.length + ' 个文件';
                    }

                    $wrap.find('.input-append input.input-large').val(info);
                    //$wrap.find('.file-img-name').html(info);

                    //判断是否ajax上传文件
                    if ($(this).attr("data-ajax")) {
                        $('.ajax-file-form').remove();
                        var form = $("<form class='ajax-file-form' style='display: none'></form>").appendTo("body");
                        var file = $(this).appendTo(form);
                        var code = $('<input type="hidden" name="areaid">').val($wrap.find('input.code').val()).appendTo(form);
                        form.unbind("submit");
                        form.submit(function () {
                            var options = {
                                type: "post",
                                url: _uploadServerUrl||ctxPath +"/static/json/upload.json",
                                success: function (res) {
                                    file.val("").appendTo($wrap);
                                    if (res.errorCode == "0") {
                                        $wrap.find('input.code').val(res.items[0].url);
                                        if (option && option.change) {
                                            option.change(res, $wrap);
                                        }
                                    }
                                    else {
                                        if (option && option.change) {
                                            option.change(null, $wrap);
                                        }
                                    }
                                },
                                error: function () {
                                    file.val("").appendTo($wrap);
                                    if (option && option.change) {
                                        option.change(null, $wrap);
                                    }
                                }
                            }
                            $(this).ajaxSubmit(options);
                            return false
                        });
                        form.submit();
                    }
                });
            };
            function bind_button($wrap, opt) {
                $wrap.find('.input-append').click(function (e) {
                    e.preventDefault();
                    if (opt.click) {
                        if (!opt.click()) {
                            return false;
                        }
                    }
                    $wrap.find('input[type="file"]').click();
                });
                $wrap.find('.file-img-name').click(function (e) {
                    if (opt.show) {
                        opt.show(this, $wrap);
                    }
                    return false;
                });
            };

            return plugin.each(function () {
                $this = $(this);
                if ($this) {
                    var multiple = $this.attr('multiple');
                    $wrap = make_form($this, options);
                    bind_change($wrap, multiple, options);
                    bind_button($wrap, options);
                }
            });
        }
    });
}(jQuery));

