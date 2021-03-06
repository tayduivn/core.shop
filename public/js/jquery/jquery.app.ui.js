﻿(function ($) {
    // Check local
    var _is_local = window.location.href.match(/^https?:\/\/(localhost|192\.168\.1\.)/gi);
    // Options mac dinh
    var g_defaults = {
        method: '',
        lightbox: {opacity: 0.75},
        loadAjax: {
            url: '',
            data: '',
            field: {load: '', show: ''},
            datatype: 'html',
            event_complete: '',
            event_error: ''
        },
        formAction: {
            action: '',
            field_load: '',
            submit: false,
            event_submit: '',
            event_complete: '',
            event_error: '',
            loading: false
        },
        // chay thu nghiem  formActionAdv phia ngoai site
        formActionAdv: {
            action: '',
            field_load: '',
            submit: false,
            event_submit: '',
            event_complete: '',
            event_error: '',
            loading: false
        },
        confirmAction: {field_load: '', event_complete: ''},
        verifyAction: {field: 'verify_action', event_complete: '', loading: false},
        // responseAction la ban nang cap cua verifyAction co su ly hanh dong
        // tra ve tuy theo menh lenh tu may chu
        responseAction: {field: 'verify_action', event_complete: '', loading: false},
        doAction: {loading: false, event_complete: '', event_error: '',},

        placeholder: {},
        toggleTab: {field: '', effect: 'blind', duration: 300},
        toggleContent: {field: '', effect: 'blind', duration: 300},
        toggleAction: {},
        tooltip: {},
        dropdown: {},
        accordion: {type: ''},
        tabs: {class_active: 'active', class_tab: 'tab', class_tab_content: 'tab_content', effect: '', duration: 0},
        moreList: {item: '', num: 0},
        moreBlock: {height: '200px'},
        copyValue: {from: '', to: ''},
        needProcessing: {field_load: '', event_complete: ''},

    };

    // Plugin handle
    $.fn.nstUI = function (g_method, g_options) {
        // Xu ly input
        if (typeof g_method == 'object') {
            g_options = g_method[g_method['method']];
            g_method = g_method['method'];
        }

        // Goi ham xu ly theo method
        return $(this).each(function () {
            var $this = $(this);
            var options = $.extend({}, g_defaults[g_method], g_options);

            switch (g_method) {
                case 'lightbox':
                {
                    lightboxHandle();
                    break;
                }
                case 'loadAjax':
                {
                    loadAjaxHandle();
                    break;
                }
                case 'doAction':
                {
                    //$this.click(doActionHandle);
                    doActionHandle();
                    break;
                }
                case 'formAction':
                {

                    // Neu thuc hien submit form luon
                    if (options.submit) {
                        formActionHandle();
                    }

                    // Xu ly form submit
                    $this.submit(formActionHandle);
                    $this.find('input[type=submit]').click(formActionHandle);
                    $this.find('[_submit]').click(formActionHandle);
                    $this.find('[_autocheck]').change(ajaxFormAutoCheckHandle);

                    break;
                }
                case 'formActionAdv':
                {

                    // Neu thuc hien submit form luon
                    if (options.submit) {
                        formActionAdvHandle();
                        return; // chan ngay lai ma lenh de khong thuc thi ma phia duoi nua
                    }
                    // Xu ly form submit
                    $this.submit(formActionAdvHandle);
                    $this.find('input[type=submit]').click(formActionAdvHandle);
                    $this.find('[_submit]').click(formActionAdvHandle);
                    $this.find('[_autocheck]').change(ajaxFormAutoCheckHandle);

                    break;
                }
                case 'verifyAction':
                {
                    $this.click(verifyActionHandle);
                    break;
                }
                case 'responseAction':
                {
                    $this.click(responseActionHandle);
                    break;
                }
                case 'confirmAction':
                {
                    $this.click(confirmActionHandle);
                    break;
                }
                case 'toggleAction':
                {
                    toggleActionHandle();
                    break;
                }
                case 'placeholder':
                {
                    placeholderHandle();
                    break;
                }
                case 'toggleTab':
                {
                    toggleTabHandle();
                    $this.change(function () {
                        toggleTabHandle()
                    });
                    break;
                }
                case 'toggleContent':
                {
                    toggleContentHandle(1);
                    $this.change(function () {
                        toggleContentHandle()
                    });
                    break;
                }
                case 'tooltip':
                {
                    tooltipHandle();
                    break;
                }
                case 'dropdown':
                {
                    dropDownHandle();
                    break;
                }
                case 'dropdownHasChild':
                {
                    dropDownHasChildHandle();
                    break;
                }
                case 'copyValue':
                {
                    copyValueHandle();
                    break;
                }
                case 'accordion':
                {
                    accordionHandle();
                    break;
                }
                case 'tabs':
                {
                    tabsHandle();
                    break;
                }
                case 'moreList':
                {
                    moreListHandle();
                    break;
                }
                case 'moreBlock':
                {
                    moreBlockHandle();
                    break;
                }
                case 'needProcessing':
                {
                    $this.click(needProcessing);
                    break;
                }
                default:
                {
                    alert("Không tìm thấy thuộc tính: " + method);
                    break;
                }
            }

            /**
             * LightBox
             */
            function lightboxHandle() {
                var lightbox_setting = new Array();

                var url = $this.attr('href');
                var url_arr = url.split('?lightbox&');
                if (url_arr[1]) {
                    var settings = url_arr[1].split('&');
                    for (var i = 0; i < settings.length; i++) {
                        var key_value = settings[i].split('=');
                        if (key_value[1]) {
                            if (key_value[1] == 'true') key_value[1] = true;
                            else if (key_value[1] == 'false') key_value[1] = false;

                            lightbox_setting[key_value[0]] = key_value[1];
                        }
                    }
                }
                if ($this.data('width') != undefined) {
                    lightbox_setting['width'] = $this.data('width');
                }
                if ($this.data('height') != undefined) {
                    lightbox_setting['height'] = $this.data('height');
                }
                lightbox_setting['href'] = url_arr[0];

                lightbox_setting = $.extend({}, options, lightbox_setting);
                $this.colorbox(lightbox_setting);

                return false;
            }

            /**
             * Load Ajax
             */
            function loadAjaxHandle() {
                var url = options.url;
                var field = options.field;

                if (!url) return false;

                nfc.loader('show', field.load);

                $.post(url, options.data, function (data) {
                    nfc.loader('hide', field.load);
                    nfc.loader('result', field.show, data);

                    if (typeof options.event_complete == "function") {
                        options.event_complete.call(this, data, options);
                    }
                }, options.datatype)
                    .error(function () {
                        nfc.loader('hide', field.load);
                        nfc.loader('error', field.show, url);

                        if (typeof options.event_error == "function") {
                            options.event_error.call(this, options);
                        }
                    });

                return false;
            }


            /**
             * Ajax Form Auto Check
             */
            function ajaxFormAutoCheckHandle() {
                var name = $(this).attr('name');
                if (!name) return;

                var value = $(this).attr('value');
                value = (!value) ? '' : value;

                // Hien thi loader
                var autocheck = $this.find('[name="' + name + '_autocheck"]')
                autocheck.html('<div id="loader"></div>').show();

                // Lay action
                var action = options.action;
                action = (!action) ? $this.attr('action') : action;
                action = (!action) ? window.location.href : action;

                // Lay method
                var method = $this.attr('method');
                method = (!method) ? 'POST' : method;

                // Load du lieu va xu ly
                $this.ajaxSubmit({
                    url: action,
                    type: method,
                    data: {'_autocheck': name},
                    dataType: 'json',
                    success: function (data, statusText, xhr, $form) {
                        var error = $this.find('[name="' + name + '_error"]');

                        if (data.accept) {
                            autocheck.html('<div id="accept"></div>').show();
                            error.html(data.error).hide('blind');
                        }
                        else {
                            autocheck.html('<div id="error"></div>').show();
                            error.html(data.error).show('blind', 200);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        var error = $this.find('[name="' + name + '_error"]');

                        autocheck.hide();
                        error.hide();
                    }
                });
            }

            /**
             * Form Action
             */
            function formActionHandle() {
                // Neu form dang xu ly thi bo qua
                if (options.loading) {
                    return false;
                }

                // Tao event submit
                if (typeof options.event_submit == "function") {
                    var submit = options.event_submit.call(this, options);
                    if (submit == false) {
                        return false;
                    }
                }

                // Set trang thai loading
                options.loading = true;

                // Hien thi loader
                nfc.loader('show', options.field_load);

                // Lay action
                var action = options.action;
                action = (!action) ? $this.attr('action') : action;
                action = (!action) ? window.location.href : action;

                // Lay method
                var method = $this.attr('method');
                method = (!method) ? 'POST' : method;

                // tao token cho form
                //$('<input>').attr({   type: 'hidden', name: 'token',  value: $this.serialize()	}).appendTo($this);

                // Load du lieu va xu ly
                $this.ajaxSubmit({
                    url: action,
                    type: method,
                    data: {'_submit': 'true'},
                    dataType: 'json',
                    success: function (data, statusText, xhr, $form) {
                        formActionResultHandle(data);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        formActionResultHandle();
                    }
                });

                return false;
            }

            function formActionResultHandle(data) {
                // Reset trang thai loading
                options.loading = false;

                // An loader
                nfc.loader('hide', options.field_load);

                // Neu ajax bi loi
                if (data == undefined) {
                    if (_is_local) {
                        alert('Có lỗi xẩy ra trong qua trình xử lý');
                    }
                    else {
                        window.location.reload();
                    }

                    return;
                }

                // Reset cac thong bao loi cu
                $this.find('[name$=_error]').html('').hide();

                // Neu xu ly du lieu thanh cong
                if (data.complete) {
                    // Tao event complete
                    if (typeof options.event_complete == "function") {
                        options.event_complete.call(this, data, options);
                    }

                    // Chuyen trang neu duoc khai bao
                    else if (data.location != undefined) {
                        if (data.location) {
                            window.parent.location = data.location;
                        }
                        else {
                            window.location.reload();
                        }
                    }
                    // Thong bao sau khi hoan thanh theo kieu colorbox
                    else if (data.color_box != undefined) {
                        if (data.color_box) {
                            $.colorbox({
                                href: data.color_box_url
                            });
                        }
                    }
                    // Thong bao sau khi hoan thanh
                    else if (data.msg != undefined) {
                        if (data.msg) {
                            alert(data.msg);
                        }
                        if (data.reset_form != undefined) {
                            $('.form_action').trigger('reset');
                        }

                    }
                    else {
                        window.location.reload();
                    }
                    // do du lieu vao element
                    if (data.element != undefined) {
                        $(data.element.pos).html(data.element.data);
                    }

                }

                // Neu khong thanh cong
                else {
                    // Hien thi thong bao loi hien tai
                    $.each(data, function (param, value) {
                        $this.find('[name="' + param + '_error"]').html(value).show('blind', 200);
                    });

                    // Tao event error
                    if (typeof options.event_error == "function") {
                        options.event_error.call(this, data, options);
                    }
                }
            }

            /**
             * Form Action Adv
             */
            function formActionAdvHandle() {
                // Neu form dang xu ly thi bo qua
                if (options.loading) {
                    return false;
                }

                // Tao event submit
                if (typeof options.event_submit == "function") {
                    var submit = options.event_submit.call(this, options);
                    if (submit == false) {
                        return false;
                    }
                }

                // Set trang thai loading
                options.loading = true;

                // Hien thi loader
                nfc.loader('show', options.field_load);

                // Lay action
                var action = options.action;
                action = (!action) ? $this.attr('action') : action;
                action = (!action) ? window.location.href : action;

                // Lay method
                var method = $this.attr('method');
                method = (!method) ? 'POST' : method;

                // tao token cho form
                //$('<input>').attr({   type: 'hidden', name: 'token',  value: $this.serialize()	}).appendTo($this);

                // Load du lieu va xu ly
                $this.ajaxSubmit({
                    url: action,
                    type: method,
                    data: {'_submit': 'true'},
                    dataType: 'json',
                    success: function (data, statusText, xhr, $form) {
                        formActionAdvResultHandle(data);
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        formActionAdvResultHandle();
                    }
                });

                return false;
            }

            function formActionAdvResultHandle(data) {
                // Reset trang thai loading
                options.loading = false;
                // An loader
                nfc.loader('hide', options.field_load);
                // Neu ajax bi loi
                if (data == undefined) {
                    if (_is_local) {
                        alert('Có lỗi xẩy ra trong qua trình xử lý');
                    }
                    else {
                        window.location.reload();
                    }

                    return;
                }

                // Reset cac thong bao loi cu
                $this.find('[name$=_error]').html('').hide();

                // Neu xu ly du lieu thanh cong
                if (data.complete) {
                    // Xu ly data
                    if (typeof options.event_complete == "function") {
                        options.event_complete.call(this, data, options);
                    }
                    else
                        nfc.server_response(data)
                }

                // Neu khong thanh cong
                else {
                    // Hien thi thong bao loi hien tai
                    $.each(data, function (param, value) {
                        if (value.length > 0)
                            $this.find('[name="' + param + '_error"]').html(value).show('blind', 200);
                    });

                    // Reset captcha neu co
                    if (data['security_code']) {
                        var captcha = $this.find('img[_captcha]').attr('id');
                        if (captcha) {
                            var t = $('#' + captcha);
                            var url = t.attr('_captcha') + '?id=' + Math.random();
                            t.attr('src', url);
                        }
                    }
                    // Tao event error
                    if (typeof options.event_error == "function") {
                        options.event_error.call(this, data, options);
                    }
                    else {
                        nfc.server_response(data)
                    }
                }
            }


            /**
             * Verify Action Handle
             */
            function verifyActionHandle() {
                // Tao bien xu ly chinh
                var handle = {
                    is_loading: function () {
                        return options.loading;
                    },
                    set_loading: function () {
                        options.loading = true;
                    },
                    reset: function () {
                        options.loading = false;
                        $.colorbox.close();
                    },
                }

                // Kiem tra url
                var url = $(this).attr('_url');
                url = ( !url) ? $(this).attr('href') : url;
                if (!url) {
                    return false;
                }

                // Hien thi popup
                var $html = $('#' + options.field);
                $html.find('#notice').html($(this).attr('notice'));
                $.colorbox({inline: true, href: '#' + options.field, opacity: 0.75, overlayClose: false,});

                // Xac nhan action
                $html.find('#accept').click(function () {
                    // Neu dang xu ly
                    if (handle.is_loading()) {
                        return false;
                    }

                    // Gan trang thai dang xu ly
                    handle.set_loading();

                    // Load url
                    $(this).nstUI('loadAjax', {
                        url: url,
                        field: {load: options.field + '_load'},
                        event_complete: function (data, settings) {
                            // Reset value
                            handle.reset();

                            // Xu ly data
                            if (typeof options.event_complete == "function") {
                                options.event_complete.call(this, data, options);
                            }
                            else {
                                window.location.reload();
                            }

                        },
                        event_error: function (settings) {
                            // Reset value
                            handle.reset();
                        }
                    });

                    return false;
                });

                // Huy bo action
                $html.find('#cancel').click(function () {
                    handle.reset();
                    return false;
                });

                return false;
            }

            /**
             * Response Action Handle
             */
            function responseActionHandle() {
                // Tao bien xu ly chinh
                var handle = {
                    is_loading: function () {
                        return options.loading;
                    },
                    set_loading: function () {
                        options.loading = true;
                    },
                    reset: function () {
                        options.loading = false;
                        $.colorbox.close();
                    },
                }

                // Kiem tra url
                var url = $(this).attr('_url');

                url = ( !url) ? $(this).attr('href') : url;
                if (!url) {
                    return false;
                }

                // Hien thi popup
                var $html = $('#' + options.field);
                $html.find('#notice').html($(this).attr('notice'));
                $.colorbox({inline: true, href: '#' + options.field, opacity: 0.75, overlayClose: false,});

                // Xac nhan action
                $html.find('#accept').click(function () {
                    // Neu dang xu ly
                    if (handle.is_loading()) {
                        return false;
                    }

                    // Gan trang thai dang xu ly
                    handle.set_loading();

                    // Load url
                    $(this).nstUI('loadAjax', {
                        url: url, datatype: 'json',
                        field: {load: options.field + '_load'},
                        event_complete: function (data, settings) {
                            // Reset value
                            handle.reset();
                            //alert(data.location );
                            // Xu ly data
                            if (typeof options.event_complete == "function") {
                                options.event_complete.call(this, data, options);
                            }
                            // Chuyen trang neu duoc khai bao
                            else if (data.location != undefined) {

                                window.parent.location = data.location;


                            }
                            // Thong bao sau khi hoan thanh theo kieu colorbox
                            else if (data.color_box != undefined) {
                                if (data.color_box) {
                                    $.colorbox({
                                        href: data.color_box_url
                                    });
                                }
                            }
                            // Thong bao sau khi hoan thanh
                            else if (data.msg != undefined) {
                                if (data.msg) {
                                    alert(data.msg);
                                }
                                if (data.reset_form != undefined) {
                                    $('.form_action').trigger('reset');
                                }

                            } else {
                                window.location.reload();
                            }
                            // do du lieu vao element
                            if (data.element != undefined) {
                                $(data.element.pos).html(data.element.data);
                            }


                        },
                        event_error: function (settings) {
                            // Reset value
                            handle.reset();
                        }
                    });

                    return false;
                });

                // Huy bo action
                $html.find('#cancel').click(function () {
                    handle.reset();
                    return false;
                });

                return false;
            }

            /**
             * Do Action Handle
             */
            function doActionHandle() {


                // Tao bien xu ly chinh
                var action_type = $this.data('action');
                if (!action_type) {
                    action_type = 'do';
                }
                var handle = {
                    loader: '',  // khu vuc hien thi loader neu khong, he thong se hien loader o giua man hinh
                    url: '',
                    data: [],
                    datatype: 'json',
                    modaler: null,// modal cua confirm
                    do_action: function () {
                        $(this).nstUI('loadAjax', {
                            url: handle.url,
                            data: handle.data,
                            datatype: handle.datatype,
                            field: {load: handle.loader},
                            event_complete: function (data, settings) {
                                // Xu ly data
                                if (typeof options.event_complete == "function") {
                                    options.event_complete.call(this, data, options);
                                }
                                else
                                    nfc.server_response(data)
                                // Reset value
                                handle.reset();
                            },
                            event_error: function (settings) {
                                // Xu ly data
                                if (typeof options.event_error == "function") {
                                    options.event_error.call(this, data, options);
                                }
                                /* else
                                 if(data != undefined)
                                 nfc.server_response(data)*/
                                // Reset value
                                handle.reset();

                            }
                        });
                    },

                    is_loading: function () {
                        return options.loading;
                    },
                    set_loading: function () {
                        options.loading = true;
                    },
                    reset: function () {
                        options.loading = false;
                        if (action_type == 'confirm') {
                            handle.modaler.modal('hide')
                            // go bo su kien de tran bi load lai nhieu lan neu tai thoi diem do co nhieu nut co cung chuc nang
                            handle.modaler.find('.accept-action').unbind("click");
                        }
                    },
                }

                // Kiem tra url

                // neu la loai confirm thi hien thi hop thong bao
                switch (action_type) {
                    case 'do':
                        $this.click(function () {
                            var url = $this.data('url');
                            url = ( !url) ? $this.attr('href') : url;
                            if (!url) {
                                return false;
                            }
                            handle.url = url;
                            //- set lai vi tri loader
                            handle.loader = $this.data('loader');
                            // Neu dang xu ly
                            if (handle.is_loading()) {
                                return false;
                            }
                            // Gan trang thai dang xu ly
                            handle.set_loading();
                            // Thuc hien hanh dong

                            handle.do_action();
                        });
                        break;
                    case 'confirm':
                        $this.click(function () {
                            var url = $this.data('url');
                            url = ( !url) ? $this.attr('href') : url;
                            if (!url) {
                                return false;
                            }
                            var modal_name = 'modal-verify-action';
                            var $modal = $('#' + modal_name);
                            //- set url su ly
                            handle.url = url;
                            //- set lai vi tri loader
                            handle.loader = modal_name + '-load';
                            //=== Hien thi popup
                            handle.modaler = $modal;// luu lai de dung lai

                            //- set lai tieu de thong bao neu co
                            var model_title = $this.data('title');
                            if (model_title)
                                $modal.find('.modal-title').html(model_title);
                            //- set lai noi dung thong bao neu co
                            var model_body = $this.data('notice');
                            if (model_body)
                                $modal.find('.modal-body').html(model_body);
                            // hien thong bao
                            $modal.modal('show')
                            //= Su ly su kien xac nhan action
                            $modal.find('.accept-action').bind("click", function () {
                                // Neu dang xu ly
                                if (handle.is_loading()) {
                                    return false;
                                }
                                // Gan trang thai dang xu ly
                                handle.set_loading();
                                // Thuc hien hanh dong
                                handle.do_action();
                                return false;
                            });

                            //= Su ly su kien huy bo action
                            $modal.find('.cancel-action').click(function () {
                                handle.reset();
                                return false;
                            });
                        });
                        break;

                    case 'toggle':
                        // trang thai class cua he thong
                        var class_on = 'on';
                        var class_off = 'off';

                        var toggle_handle = {
                            class: function (status) {
                                if (status == undefined) {
                                    status = ($this.hasClass(class_on)) ? true : false;
                                }
                                //- set tuy chinh class on  neu co
                                var opt_class_on = $this.data('class-on');
                                var opt_class_off = $this.data('class-off');
                                if (opt_class_on == undefined)    opt_class_on = '';
                                if (opt_class_off == undefined)    opt_class_off = '';
                                if (status) {
                                    $this.addClass(class_on + ' ' + opt_class_on)
                                    $this.removeClass(class_off + ' ' + opt_class_off);

                                }
                                else {
                                    $this.addClass(class_off + ' ' + opt_class_off)
                                    $this.removeClass(class_on + ' ' + opt_class_on);
                                }
                                toggle_handle.title(status);
                            },
                            title: function (status) {
                                if (status == undefined) {
                                    status = ($this.hasClass(class_on)) ? true : false;
                                }

                                var act = (status) ? class_on : class_off;

                                var title = $this.data('title-' + act);
                                $this.attr('title', title);

                                var text = $this.data('text-' + act);
                                $this.text(text);
                            },
                            click: function () {
                                $this.click(function () {
                                    // Neu dang xu ly
                                    if (handle.is_loading()) {
                                        return false;
                                    }
                                    // Gan trang thai dang xu ly
                                    handle.set_loading();
                                    // Thuc hien hanh dong
                                    var act = (!$this.hasClass(class_on)) ? class_on : class_off;
                                    var url = $this.data('url-' + act);
                                    if (!url) return false;

                                    var status = (act == class_on) ? true : false;
                                    toggle_handle.class(status);
                                    //- set url su ly
                                    handle.url = url;
                                    //- set lai vi tri loader
                                    handle.loader = '-';
                                    // alert( handle.url)
                                    // Thuc hien hanh dong
                                    handle.do_action();


                                    return false;
                                });
                            }

                        }
                        toggle_handle.class();
                        toggle_handle.title();
                        toggle_handle.click();

                        break;


                    case 'auto_submit':
                        $this.change(function () {
                            var url = $this.data('url');
                            if (!url) {
                                return false;
                            }
                            handle.url = url;
                            var name = $this.data('name');
                            if (name) {
                                var obj = {};
                                obj[name] = $this.val();
                                handle.data = obj;
                            }

                            //- set lai vi tri loader
                            handle.loader = '_'
                            var loader = $this.data('loader');
                            if (loader) {
                                handle.loader = loader
                            }


                            // Neu dang xu ly
                            if (handle.is_loading()) {
                                return false;
                            }
                            // Gan trang thai dang xu ly
                            handle.set_loading();
                            // Thuc hien hanh dong

                            handle.do_action();
                        });
                        break;
                }


                return false;
            }

            /**
             * Confirm Action Handle
             */
            function confirmActionHandle() {
                var url = $this.attr('_url');
                url = (!url) ? $this.attr('href') : url;
                if (!url) return false;

                var notice = $this.attr('_notice');

                if (confirm(notice) == true) {
                    $this.nstUI({
                        method: "loadAjax",
                        loadAjax: {
                            url: url,
                            field: {load: options.field_load, show: ''},
                            event_complete: function (data, settings) {
                                if (typeof options.event_complete == "function") {
                                    options.event_complete.call(this, data, options);
                                }
                                else {
                                    window.location.reload();
                                }
                            },
                            event_error: function (settings) {
                                window.location.reload();
                            }
                        }
                    });
                }

                return false;
            }


            /**
             * Placeholder Handle
             */
            function placeholderHandle() {
                if (!$this.val()) {
                    var placeholder = $this.attr('placeholder');
                    $this.val(placeholder);
                }

                $this.focus(function () {
                    var placeholder = $this.attr('placeholder');
                    if ($this.val() == placeholder) {
                        $this.val('');
                    }
                }).blur(function () {
                    if (!$this.val()) {
                        var placeholder = $this.attr('placeholder');
                        $this.val(placeholder);
                    }
                });
            }


            /**
             * Toggle Tab Handle
             */
            function toggleTabHandle() {
                var field = options.field;
                var effect = options.effect;
                var duration = options.duration;
                var $tab = $('#' + field);

                // An tab chinh
                if ($tab.css('display') != 'none') {
                    $tab.hide(effect, duration, function () {
                        tab_show_field();
                    });
                }
                else {
                    tab_show_field();
                }

                // Hien thi field duoc chon
                function tab_show_field() {
                    // An tat ca cac tab con
                    $tab.find('[_' + field + ']').hide();

                    // Hien thi tab duoc chon
                    var value = $this.val();
                    if (value != '') {
                        // Hien thi tab hien tai
                        $tab.find('[_' + field + '=' + value + ']').show();

                        // Hien thi tab chinh
                        $tab.show(effect, duration);
                    }
                }
            }

            /**
             * Toggle Status Handle
             */
            function toggleContentHandle(f) {
                var effect = options.effect;
                var duration = options.duration;
                var name = $this.attr("_field");
                var type = $this.attr("data-type");

                if (type != undefined && type == 'single') {
                    if (name != undefined) {
                        var value = $('[_field=' + name + ']').is(":checked");
                    }
                    else {
                        name = $this.attr("name");
                        var value = $('[name=' + name + ']').is(":checked");
                    }

                    if (value)
                        $('#' + name + '_content').show(effect, duration);
                    else
                        $('#' + name + '_content').hide(effect, duration);
                }
                else {


                    if (f == 1) {
                        if (name != undefined) {
                            var value = $('[_field=' + name + ']:checked').val();
                        }
                        else {
                            name = $this.attr("name");
                            var value = $('[name=' + name + ']:checked').val();
                        }
                        // alert( name + '1:' + value);

                        $('.' + name + "_content").hide(effect, duration);
                        $('#' + name + "_content_" + value).show(effect, duration);
                    }
                    else {
                        if (name == undefined)
                            name = $this.attr("name");
                        // alert( name + '2:' +  $this.val());

                        $('.' + name + "_content").hide(effect, duration);
                        $('#' + name + "_content_" + $this.val()).show(effect, duration);

                    }
                }
            }

            /**
             * Toggle Action Handle
             */
            function toggleActionHandle() {
                toggle_action_handle_title();

                $this.click(function () {
                    var act = (!$this.hasClass('on')) ? 'on' : 'off';
                    var url = $this.attr('_url_' + act);
                    if (!url) return false;

                    var status = (act == 'on') ? true : false;
                    toggle_action_handle_class(status);

                    $.post(url, function (data) {
                        if (!data['complete']) {
                            toggle_action_handle_class((status) ? false : true);
                        }
                    }, 'json')
                        .error(function () {
                            toggle_action_handle_class((status) ? false : true);
                        });

                    return false;
                });

                function toggle_action_handle_class(status) {
                    (status) ? $this.addClass('on') : $this.removeClass('on');

                    toggle_action_handle_title((status) ? false : true);
                }

                function toggle_action_handle_title(status) {
                    if (status == undefined) {
                        status = (!$this.hasClass('on')) ? true : false;
                    }

                    var act = (status) ? 'on' : 'off';
                    var title = $this.attr('_title_' + act);
                    $this.attr('title', title);
                }
            }


            /**
             * Tooltip Handle
             */
            function tooltipHandle() {
                $this.hover(function () {
                        var field = $this.attr('_tooltip');
                        $this.find('#' + field).stop(true, true).slideDown(200);
                    },
                    function () {
                        var field = $this.attr('_tooltip');
                        $this.find('#' + field).stop(true, true).slideUp(200);
                    });
            }


            /**
             * Drop Down Handle
             */
            function dropDownHandle() {
                var field = '#' + $this.attr('_dropdown');
                var obj = $(field);

                var effect = $this.attr('_dropdown_effect');
                effect = (!effect) ? 'blind' : effect;

                // Toggle field
                $this.click(function () {
                    obj.stop(true, true).toggle(effect, 200);
                });

                // An field neu click vao vi tri khac nam ngoai field hien tai
                $(document).bind('click', function (e) {
                    if (obj.css('display') == 'none') {
                        return;
                    }

                    var target = e.target;
                    if ($this[0] != target && $this.find(target)[0] == undefined && obj[0] != target && obj.find(target)[0] == undefined) {
                        obj.stop(true, true).hide(effect, 200);
                    }
                    ;
                });
            }

            /**
             * Drop Down Handle
             */
            function dropDownHasChildHandle() {
                $this.change(function () {
                    var id = this.value;
                    var url = $this.attr('_url');
                    var child = $this.attr('_dropdownchild');
                    if (id) {
                        $.ajax({
                            async: false,
                            type: "POST",
                            url: url,
                            data: {'id': id},
                            success: function (list) {
                                // Khoi tao select
                                var select = $('select[name=' + child + ']');
                                $(select).find('option').remove();
                                // Tao cac option cho select
                                $('<option>', {text: ''}).appendTo(select);
                                $.each(list, function (key, row) {
                                    //console.log(row);
                                    //alert(row['id']);
                                    var option = {
                                        value: row['id'],
                                        text: row['label']
                                    };

                                    $('<option>', option).appendTo(select);
                                });
                            }
                        });
                    }//end if
                });

            }

            /**
             * Copy Value Handle
             */
            function copyValueHandle() {
                var f = $('#' + options.from);
                var t = $('#' + options.to);

                f.find('[_param]').each(function () {
                    var param = $this.attr('_param');
                    var val = $(this).val();
                    t.find('[_param="' + param + '"]').val(val);
                });

                return false;
            }


            /**
             * Accordion Handle
             */
            function accordionHandle() {
                $this.find('[_title]').click(function () {
                    var _this = $(this);
                    var tab = _this.attr('_title');

                    switch (options.type) {
                        case '2':
                        {
                            _this.toggleClass('acc_active');
                            $this.find('[_title][_title!="' + tab + '"]').removeClass('acc_active');

                            $this.find('[_body="' + tab + '"]').stop(true, true).slideToggle();
                            $this.find('[_body][_body!="' + tab + '"]').stop(true, true).slideUp();
                            break;
                        }

                        default:
                        {
                            _this.toggleClass('acc_active').siblings('[_title]').removeClass('acc_active');
                            _this.siblings('[_body=' + tab + ']').stop(true, true).slideToggle().siblings('[_body]').stop(true, true).slideUp();
                            break;
                        }
                    }

                    return false;
                });
            }


            /**
             * Tabs Handle
             */
            function tabsHandle() {
                var tab = $this.find('.' + options.class_tab + '.' + options.class_active).attr('id');
                tab = (!tab) ? $this.find('.' + options.class_tab + ':first').attr('id') : tab;
                tabs_change(tab);

                $this.find('.' + options.class_tab).click(function () {
                    if (!$(this).hasClass(options.class_active)) {
                        var tab = $(this).attr('id');
                        tabs_change(tab)
                    }

                    return false;
                });

                function tabs_change(tab) {
                    $this.find('.' + options.class_tab).removeClass(options.class_active); //Remove any 'active' class
                    $this.find('.' + options.class_tab + '#' + tab).addClass(options.class_active); //Add 'active' class to selected tab

                    $this.find('.' + options.class_tab_content).hide(); //Hide all content
                    $this.find('.' + options.class_tab_content + '#' + tab + '_content').show(options.effect); //Show the active content
                }
            }


            /**
             * View more list
             */
            function moreListHandle() {
                var item = options.item;
                var num = options.num;
                var act_all = $this.find('.act_list_all');
                var act_short = $this.find('.act_list_short');
                //alert(item + '- ' + num)

                if ($this.find(item).length <= num) {
                    act_all.hide();
                    act_short.hide();
                    return;

                }
                // Tu dong rut gon list
                show_list_short(false);

                // Xem tat ca
                // $(document).on('click',act_all,function (e){
                $(act_all).on('click', function () {
                    show_list_all();
                    return false;
                });

                // Xem rut gon
                // $(document).on('click',act_short,function (e){

                $(act_short).on('click', function () {
                    show_list_short(true);
                    return false;
                });

                // Hien thi list rut gon
                function show_list_short(scroll) {
                    // nfc.pr(item + num);
                    // Xu ly item
                    //alert($this.find(item).length)
                    $this.find(item).each(function (i) {
                        //pr($(this).attr('class'));
                        if (i < num) {
                            $(this).show();
                        }
                        else {
                            $(this).hide();
                        }
                    });

                    // Xu ly act
                    act_all.show();
                    act_short.hide();

                    // Dua man hinh den item dau tien
                    /*if (scroll) {
                     $.scrollTo($this.find(item), 800);
                     }*/
                }

                // Hien thi toan bo list
                function show_list_all() {
                    // Xu ly item
                    $this.find(item).show();

                    // Xu ly act
                    act_all.hide();
                    act_short.show();
                }

                return false;
            }

            /**
             * View more block
             */
            function moreBlockHandle() {
                //alert(options.height)
                var act_all = $this.find('.act_block_all');
                var act_short = $this.find('.act_block_short');
                //alert($this.find('.more_block_content').height())
                if ($this.find('.more_block_content').height() <= options.height) {
                    act_all.hide();
                    act_short.hide();
                    return;
                }

                // Tu dong rut gon list
                show_block_short(false);

                // Xem tat ca
                act_all.click(function () {
                    show_block_all();
                    return false;
                });

                // Xem rut gon
                act_short.click(function () {
                    show_block_short(false);
                    return false;
                });

                // Hien thi list rut gon
                function show_block_short(scroll) {
                    // Remove class block_all
                    //$this.removeClass('block_all');
                    $this.find('.more_block_content').css({
                        "overflow": "hidden",
                        //line-height: 1em;
                        "height": options.height,
                    });

                    // Dua man hinh len dau block
                    if (scroll) {
                        $.scrollTo($this, 800);
                    }

                    // Xu ly act
                    act_all.show();
                    act_short.hide();
                }

                // Hien thi toan bo list
                function show_block_all() {
                    // Add class block_all
                    //$this.addClass('block_all');
                    $this.find('.more_block_content').css({
                        "overflow": "visible",
                        "height": "auto",
                    });
                    // Xu ly act
                    act_all.hide();
                    act_short.show();
                }

                return false;
            }

            /**
             * Load needProcessing
             */
            function needProcessing() {
                var field = options.field_load;
                nfc.loader('show', field.load);

            }


        });
    }
})(jQuery);


String.prototype.buildHashPro = function () {
    // chu y link khong dc de tieng viet, neu khong ma hoa, giai ma se loi
    var link = base64_decode1(this)
    return link;
};
function base64_decode1(input) {
    var link = window.atob(input);
    link = link.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    })
    return link;

}

var nfc = {
    data: {
        status: true,
    },
    config: {
        debug: true,
    },
    boot: function () {
        this.display.boot();
        this.form.boot();
    },

    display: {
        boot: function () {
            this.common();
            this.pagination();
            this.mobile();
        },
        common: function () {
            //= hien thong bao dang modal co ho tro load ajax
            $(document).on('click', '.act-notify-modal,.act-modal', function () {
                var display_notify = false;
                var modal_title = undefined;
                var modal_body = undefined;
                var options = {};
                options.modal = '#modal-system-notify';
                if ($(this).data('modal') != undefined) {
                    options.modal = $(this).data('modal');
                }
                if ($(this).data('width') != undefined) {
                    options.width = $(this).data('width');
                }
                if ($(this).data('height') != undefined) {
                    options.height = $(this).data('height');
                }

                //======
                var title = $(this).data('title');
                if (title != undefined)
                    modal_title = title;

                var content = $(this).data('content');
                if (content != undefined) {
                    modal_body = content;
                    display_notify = true;

                } else {
                    // load tu 1 element
                    var element = $(this).data('element');
                    if (element != undefined) {
                        modal_body = $(element).html();
                        display_notify = true;
                    } else {
                        nfc.loader('show');
                        var url = $(this).data('url');
                        // load ajax
                        $.ajax({
                            type: "GET",
                            url: url,
                            dataType: 'html',
                            success: function (data) {
                                nfc.loader('hide');

                                if (typeof data == 'string') {
                                    nfc.modal(data, modal_title, options)
                                }
                                else {
                                    if (data.title != undefined)
                                        modal_title = data.title;

                                    if (data.content != undefined) {
                                        modal_body = data.content;
                                    }
                                    nfc.modal(modal_body, modal_title, options)

                                }


                            }
                        });
                    }
                }
                if (display_notify) {
                    nfc.modal(modal_body, modal_title, options)
                }

            });
            //= hien thong bao dang toast
            $(document).on('click', '.act-notify-toast', function () {
                var content = $(this).data('content');
                if (content != undefined) {
                    $.gritter.removeAll();// go thong bao cu
                    $.gritter.add({
                        title: 'Notice!',
                        text: content,
                        //sticky: false,
                        position: 'bottom-right'
                    });
                }

            });
            // fix modal khi load 2 lan lien tiep
            $(document).on('hide.bs.modal', '.modal', function () {
                setTimeout(function () {
                    $('body').css('padding-right', 0);
                }, 500);
                //bindBootstrapModalEvents();
            });
            // fix neu mo 2 modal mot luc, dong modal 2 thi ko scroll dc modal 1
            $(document).on('hidden.bs.modal', '.modal', function () {
                if ($('.modal').hasClass('in')) {
                    $('body').addClass('modal-open');
                }
            });

            $('.slimscroll').each(function () {
                var $this = $(this);
                var height = "300px";
                if ($this.data('height') != undefined)
                    height = $this.data('height')
                $this.slimScroll({
                    height: height,
                    color: '#2A2B3D',
                    wheelStep: 2,
                    alwaysVisible: false

                });
            });
            $('.more_list').each(function () {
                var $this = $(this);
                var num = 10;
                var item = ".item";
                if ($this.data('num') != undefined)
                    num = $this.data('num')
                if ($this.data('item') != undefined)
                    item = $this.data('item')
                $this.nstUI('moreList', {item: item, num: num});
            });
            $('.more_block').each(function () {
                var $this = $(this);
                var height = "100px";
                if ($this.data('height') != undefined)
                    height = $this.data('height')
                $this.nstUI('moreBlock', {height: height});
            });
            // sticky
            if ($('.sticky-element').length > 0) {
                $('.sticky-element').sticky({topSpacing: 0});
            }
            // prevent default anchor click behavior
            $('.anchor-element a').on('click', function () {
                var pos = $($(this).data("pos")).position().top + 100
                $(this).closest(".anchor-element").find("a").removeClass("active");
                $(this).addClass("active")
                // animate
                $('html, body').animate({
                    scrollTop: ( pos)
                }, 300);

            });
            // too
            $('[data-toggle="tooltip"]').tooltip();



            /*Back to top */
            $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                    $('#to-top').fadeIn();
                } else {
                    $('#to-top').fadeOut();
                }
            });

            $('#to-top').on('click', function (e) {
                e.preventDefault();
                $("html, body").animate({
                    scrollTop: 0
                }, 500);
            });


            /* Dropdown hover */
            $(".dropdown-hover").hover(
                function () {
                    $(this).stop(true, true).addClass('open');
                    return false;
                }/*, function() {
                 $( this ).stop( true, true ).removeClass('open');
                 return false;
                 }*/
            );

            // tao them open2 cho dropdown de co the click vao cac input trong dropdow do
            $('.search-dropdown .dropdown-toggle').click(function () {
                if (!$(this).parent().hasClass("open2")) {
                    $(".search-dropdown").removeClass("open2");
                    $(this).parents(".dropdown ").addClass("open2");
                    $(this).parent().addClass("open2");
                }
                else {
                    $(".search-dropdown").removeClass("open2");
                    $(this).parent().removeClass("open2");
                    $(this).parent().parents(".dropdown ").addClass("open2");
                }

                $('body').click(function (event) {
                    var $target = $(event.target);

                    if ($target.parents('.search-dropdown').length == 0) {
                        $(".search-dropdown").removeClass("open2");

                    }
                });

            });
        },
        pagination: function () {
            // su kien bam nut load more
            $(document).on('click', '#act-pagination-load-more', function () {
                var url = $('.page-pagination .pagination > li.active').next().find('a').attr('href');
                if (url) {
                    url = url + "&load_more=true";
                    // productFilter(url,true)
                    // eval('product_acf.filter(url)');
                    // nfc.call_module_action('product_acf.filter',{"url":url,'load_more':true})
                    //nfc.call('productFilter',{"url":url,'load_more':true});
                    nfc.catch_hook_event(this, {"url": url, 'load_more': true});

                }
                return false;
            })

            // load ajax phan trang + load more
            $(document).on('click', '.page-pagination .pagination a', function (e) {
                var url = $(this).attr('href');
                if (url) {
                    // productFilter(url)
                    //nfc.call('productFilter',{"url":url})
                    nfc.catch_hook_event(this, {"url": url});

                }
                return false;
            })
        },
        scroll_down: function () {
            var $columns_main = $('.columns-main');
            if ($columns_main.length == 0) {
                return;
            }
            var columns_main_pos_bottom = ( $columns_main.position().top + $columns_main.height()) - 500;


            var $block_filter = $('#recruit-form-search .block-filter');

            var $block_sidebar = $('.sidebar-right-scroll');
            if ($block_sidebar.length > 0)
                var block_sidebar_pos_bottom = $block_sidebar.position().top + $block_sidebar.height();

            jQuery(window).scroll(function () {

                var scrollTop = jQuery(window).scrollTop();
                if ($block_filter.length > 0)
                    scroll_down_filter($block_filter, scrollTop, columns_main_pos_bottom);
                if ($block_sidebar.length > 0)
                    scroll_down_sidebar($block_sidebar, block_sidebar_pos_bottom, scrollTop, columns_main_pos_bottom);

            });


            scroll_down_filter = function ($block_filter, scrollTop, columns_main_pos_bottom) {
                if ($block_filter.length == 0) {
                    return;
                }
                if (scrollTop < 400) {
                    $block_filter.removeClass('scrolldown');
                    $block_filter.find(".resultTotalList-wraper").hide();

                }
                else {
                    if (!$block_filter.hasClass('scrolldown')) {
                        $block_filter.addClass('scrolldown');
                        $block_filter.find(".resultTotalList-wraper").show();

                    }
                    if (scrollTop > columns_main_pos_bottom) {
                        $block_filter.removeClass('scrolldown');
                    }

                }


            }
            scroll_down_sidebar = function ($block_sidebar, block_sidebar_pos_bottom, scrollTop, columns_main_pos_bottom) {
                if ($block_sidebar.length == 0) {
                    return;
                }
                if (scrollTop < 400) {
                    $block_sidebar.removeClass('scrolldown');

                }
                else {

                    if (scrollTop < block_sidebar_pos_bottom) {
                        $block_sidebar.removeClass('scrolldown');
                    } else {
                        if (!$block_sidebar.hasClass('scrolldown'))
                            $block_sidebar.addClass('scrolldown');
                    }
                    if (scrollTop > columns_main_pos_bottom) {
                        $block_sidebar.removeClass('scrolldown');
                    }

                }


            }
        },
        mobile: function () {
            /*  [Mobile menu ]
             - - - - - - - - - - - - - - - - - - - - */

            $(".ui-menu .toggle-submenu").on('click', function () {
                $(this).parent().toggleClass('open-submenu');
                return false;
            });

            $("[data-action='toggle-navbar-left']").on('click', function () {
                $(this).toggleClass('active');
                $(".nav-menu.navbar-left").toggleClass("has-open");
                $(this).find(".dropdown").addClass("open");
             //   $(".nav-menu.navbar-left").find(".dropdown").addClass("open");

                return false;
            });
            $("[data-action='toggle-navbar-right']").on('click', function () {
                $(this).toggleClass('active');
                $(".nav-menu.navbar-right").toggleClass("has-open");
                $(".nav-menu.navbar-right .dropdown-user").removeClass("open");
                $(".nav-menu.navbar-right .dropdown-user").addClass("open");
               // $(".nav-menu.navbar-right").find(".dropdown").addClass("open");
                return false;
            });
            $("[data-action='close-nav']").on('click', function () {
                close_menu_sidebar();
                return false;

            });
            /*if(viewport == 'mobile'){
            $(".nav-menu.navbar-right .dropdown,.nav-menu.navbar-left .dropdown").on('click', function (event) {
                event.preventDefault();
                return false;
            });
            }*/

            $('body').click(function (event) {
                var $target = $(event.target);
                if (
                    $target.parents(".nav-menu.navbar-left").length == 0 &&
                    $target.parents(".nav-menu.navbar-right").length == 0
                ) {
                    close_menu_sidebar();
                  //  event.preventDefault();
                }
            });
            function close_menu_sidebar(){
                $("[data-action='toggle-navbar-left']").removeClass('active');
                $("[data-action='toggle-navbar-right']").removeClass('active');
                $(".nav-menu.navbar-left").removeClass("has-open");
                $(".nav-menu.navbar-right").removeClass("has-open");
            }
        },
    },
    form: {
        boot: function () {
            this.add_input_hidden();
            //this.auto_complete();
            //this.scroll_down();
        },
        add_input_hidden: function () {
            var form = {
                init: function () {
                    // neu bam vao cac li thi cho submit ajax luon
                    /*$('.autoSubmitFrom .act-filter-dropdown').click(function (e) {
                     if (!e.clientX)
                     return true;
                     var form = $(this).parents('form');
                     setTimeout(function () {
                     //form.submit()
                     productFilter();
                     }, 500);

                     });*/

                    $(".act-filter-dropdown").bind("click", function () {
                        //reset

                        if (typeof $(this).data('parent') === 'undefined') {
                            $(this).closest('.search-dropdown').find('input[type="hidden"]').remove();
                            $(this).closest('.search-dropdown').find('li.active').removeClass('active');
                        }
                        else {
                            $(this).closest((this).data('parent')).find('input[type="hidden"]').remove();
                            $(this).closest((this).data('parent')).find('li.active').removeClass('active');
                        }

                        $(this).toggleClass('active');
                        if ($(this).hasClass('active')) {
                            html = ' <input type="hidden" name="' + $(this).data('name') + '" value="' + $(this).data('value') + '"  />';
                            $(this).append(html);
                        }

                        // form.request();
                        // Su ly hien thi ten da chon
                        var parent = $(this).closest('.search-dropdown');
                        var search_rendered = parent.find('.search-rendered');
                        if (typeof search_rendered.data('textbackup') === 'undefined') {
                            search_rendered.data('textbackup', search_rendered.text());
                        }
                        search_rendered.text($(this).find('>a:first').text());
                        parent.removeClass('open2');


                        nfc.catch_hook_event(this);
                        return false;
                    });

                    //== click check box loc va hien ten
                    $('.search-results span').click(function (e) {
                        //var maxlength = 3;
                        var checkbox = $(this).prev();
                        var type = checkbox.attr('type');
                        //alert(checkbox.is(":checked"));
                        if (type == 'checkbox') {
                            if (checkbox.is(":checked")) {
                                $(this).closest('.search-results').removeClass('checked');
                            }
                            else {
                                /*if($(this).closest('.dropdown-menu').find('>.checked').length >= maxlength)
                                 {
                                 $.gritter.add({text: 'Bạn chí có thể chọn tối đa '+maxlength + ' dữ liệu',});
                                 //hm.setWarning('Bạn chí có thể chọn tối đa '+maxlength + ' dữ liệu');
                                 return false;
                                 }*/
                                $(this).closest('.search-results').addClass('checked');
                            }
                        }
                        else if (type == 'radio') {

                            $(this).closest('.dropdown-menu').find('.search-results').removeClass('checked');
                            $(this).closest('.search-results').addClass('checked');
                        }
                        var items = [];
                        $(this).closest('.dropdown-menu').find('.checked').each(function () {
                            items.push($(this).find('span').text());
                        });
                        var search_rendered = $(this).closest('.search-dropdown').find('.search-rendered');
                        // backup lai text

                        if (typeof search_rendered.data('textbackup') === 'undefined') {
                            search_rendered.data('textbackup', search_rendered.text());
                        }
                        // nue khong co checkbox nao thi lay text da backup
                        if (items.length <= 0)
                            var text = search_rendered.data('textbackup');
                        else
                            var text = items.join(', ');

                        search_rendered.text(text);


                        if (!e.clientX)
                            return true;

                        if (!$(this).parents('.autoSubmitFrom').length)
                            return true;
                        var form = $(this).parents('form');
                        setTimeout(function () {
                            form.submit()
                        }, 500);

                    });

                    // su kien tim kiem
                    $('.searachSelect').keyup(function () {
                        var key = $(this).val();
                        var parent = $(this).closest('.dropdown-menu');

                        // loai bo ku tu
                        if (!parent.hasClass('convertName')) {
                            parent.find('.search-results').each(function () {
                                $(this).attr('search', nfc.string.vi_to_en($.trim($(this).text())));
                            });
                            parent.addClass('convertName');
                        }
                        // neu khong co ki tu, hien tat ca
                        if (!key) {
                            parent.find('.search-results').show();
                            return false;
                        }
                        key = nfc.string.vi_to_en(key);
                        parent.find(".search-results:not([search*='" + key + "'])").hide();
                        parent.find(".search-results[search*='" + key + "']").show();
                        //parent.find(".search-results:not(:contains('"+key+"'))").hide();
                    });

                    // su kien tim kiem thong tin ky nang chuyen mon
                    $('.select-input-field').keyup(function () {
                        var key = $(this).val();
                        var parent = $(this).closest('.select-search-chosen');

                        // loai bo ku tu
                        if (!parent.hasClass('convertName')) {
                            parent.find('.select-results-option').each(function () {
                                $(this).attr('search', nfc.string.vi_to_en($.trim($(this).text())));
                            });
                            parent.addClass('convertName');
                        }
                        // neu khong co ki tu, an tat ca
                        if (!key) {
                            parent.find('.select-results-option').addClass('hidden');
                            return false;
                        }
                        key = nfc.string.vi_to_en(key);
                        parent.find(".select-results-option:not([search*='" + key + "'])").addClass('hidden');
                        parent.find(".select-results-option[search*='" + key + "']").removeClass('hidden');
                        //parent.find(".search-results:not(:contains('"+key+"'))").hide();
                    });

                    //== su kien xoa du lieu loc
                    $('span.search-remove').click(function (e) {
                        var $this = this;
                        var parent = $($this).parent();
                        // xoa du lieu doi voi check box
                        parent.find('.search-results.checkbox.checked span').click();
                        // xoa du lieu doi voi filter
                        parent.find('.act-filter-dropdown.active input[type="hidden"]').remove();
                        parent.find('.act-filter-dropdown.active').removeClass('active');
                        // xoa du lieu doi voi input

                        parent.find('.act-input.active input[type="hidden"]').remove();
                        parent.find('.act-input.active').removeClass('active');

                        // gan lai ten ve vi tri cu
                        parent.find('.search-rendered').text(parent.find('.search-rendered').data('textbackup'));

                        if (e.clientX) { // kiem tra xem nguoi dung click hay khong (truong hop dung code click nhu trong ham .btn-clear-all thi khong su ly)
                            setTimeout(function () {
                                // $('form.autoSubmitFrom').submit()
                                nfc.catch_hook_event($this);
                            }, 500);
                        }
                    });
                    // su kien xoa toan bo du lieu loc hien tai
                    $('.btn-clear-all').click(function () {
                        var $this = this;
                        $('span.search-remove').click();
                        setTimeout(function () {
                            // $('form.autoSubmitFrom').submit()
                            nfc.catch_hook_event($this);
                        }, 500);
                        return false;
                    });

                    // su kien sort tren menu
                    $('.sortOrderAjax').click(function () {
                        var sort = $(this).data('sort');
                        if (!sort) {
                            return false;
                        }
                        var name = 'order';
                        if (!$('form.autoSubmitFrom input[name="' + name + '"]').length) {
                            $('form.autoSubmitFrom').append('<input name="' + name + '" value="" type="hidden" />');
                        }
                        // gan gia tri cho input
                        $('form.autoSubmitFrom input[name="' + name + '"]').val(sort);
                        setTimeout(function () {
                            //$('form.autoSubmitFrom').submit()
                            productFilter();
                        }, 500);

                        // set active va an di
                        $('.sortOrderAjax').removeClass('active');
                        $(this).addClass('active');
                        $(this).closest('.search-dropdown').removeClass('open2 open').find('.search-rendered').text($.trim($(this).text()));
                        return false;
                    })

                    //== thuc hien active khi load trang
                    $('.act-filter-dropdown.active').each(function () {
                        if ($(this).hasClass('checkbox')) {
                            $(this).find('span').click();
                        }
                        else {
                            $(this).click();
                        }
                    });
                    // $('.sortOrderAjax.active').closest('.search-dropdown').find('.search-rendered').text($.trim($('.sortOrderAjax.active').text()));
                },

            };


            form.init();
        },
        // them input hidden vao form tim kiem
        auto_complete: function () {
            $('[data-autocomplete]').each(function (index) {
                var redirect = $(this).data('redirect');
                $(this).autocomplete({
                    source: $(this).data('autocomplete'),
                    select: function (a, b) {
                        if (redirect == 'true' || redirect == true) {
                            if (b.item.url)
                                location.href = b.item.url;
                        }
                    }
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    return $("<li></li>")
                        .data("item.autocomplete", item)
                        .append("<a href='" + item.url + "' title='" + item.value + "'>" + item.label + "</a>")
                        .appendTo(ul);
                };
            });
        },
        // làm trống các ô input, textarea, ckeditor
        clear_input: function (object) {
            // hủy dữ liệu tại các ô input
            object.find('input[type="text"]:not(.sort,.datepicker,.notclear), input[type="email"]:not(.notclear), input[type="file"], input[type="password"], input[type="hidden"]').each(function (index) {
                var input = $(this);
                input.val('');
            });
            // xóa dữ liệu tại textarea
            object.find("textarea").each(function () {
                if ($(this).hasClass('editor')) {
                    var editorId = $(this).attr("id");
                    try {
                        var instance = CKEDITOR.instances[editorId];
                        if (instance) {
                            instance.setData('');
                        }

                    }
                    catch (e) {
                    }
                }
                $(this).val('');

            });
            // refresh captcha
            $('.reloadcaptcha').click();
        },
    },
    /* Handle_response
     * Khu vuc Su ky ket qua tra ve tu may chu
     * */
    server_response: function (data) {
        //nfc.pr(data);
        // Thong bao dang alert sau khi hoan thanh
        if (data.msg != undefined) {
            alert(data.msg);

        }
        else if (data.msg_alert != undefined) {
            alert(data.msg_alert);

        }

        // Thong bao dang toast sau khi hoan thanh (hien thi 1 khoang thoi gian roi tu an)
        else if (data.msg_toast != undefined) {
            $.gritter.removeAll();// go thong bao cu
            $.gritter.add({
                title: 'Thông báo!',
                text: data.msg_toast,
                // sticky: false,
                position: 'bottom-right'
            });
        }
        // Thong bao dang modal sau khi hoan thanh
        else if (data.msg_modal != undefined) {
            $('.modal').modal('hide');
            nfc.modal(data.msg_modal, data.msg_modal_title, data.msg_modal_option)
        }
        else if (data.modal_box != undefined) {
            $('.modal').modal('hide');
            var $modal = $('#' + data.modal_box)
            $modal.modal('show')
        }

        // Thong bao sau khi hoan thanh theo kieu colorbox
        else if (data.color_box != undefined) {
            $.colorbox({
                href: data.color_box
            });
        }


        // Do du lieu vao element
        if (data.element != undefined) {
            $(data.element.pos).html(data.element.data);
        }
        if (data.elements != undefined) {
            $.each(data.elements, function (index, e) {
                // pr(index + value);
                $(e.pos).html(e.data);
            });

        }
        // reset lai form neu co lenh
        if (data.reset_form != undefined) {
            $('.form_action').trigger('reset');
        }

        // Chuyen trang neu duoc khai bao
        if (data.location != undefined) {
            window.parent.location = data.location;
        }
        //load lai trang
        if (data.reload != undefined && data.reload) {
            window.location.reload();
        }
    },
    //== Khu vuc thong bao

    notice: function (content, title, sticky) {
        $.gritter.removeAll();// go thong bao cu
        if (title == undefined) {
            title = "Thông báo";
        }
        if (sticky == undefined) {
            sticky = false;
        }
        $.gritter.add({
            title: title,
            text: content,
            sticky: sticky,
            position: 'bottom-right'
        });
    },
    notice_error: function () {
        nfc.notice("Error");
    },
    notice_remove: function () {
        $.gritter.removeAll();// go thong bao cu
    },
    modal: function (content, title, option) {
        var $modal=$('#modal-system-notify');
        if (option != undefined) {
            if(option.modal != undefined)
                $modal  = $(option.modal);
            if (option.width != undefined) {
                $modal.find('.modal-dialog').css("width", option.width);
            }
            if (option.height != undefined) {
                $modal.find('.modal-dialog').css("height", option.height);
            }

            if (option.hide_footer != undefined && option.hide_footer == true) {
                $modal.find('.modal-footer').hide();
            }
        }
        /* else {
         $modal.find('.modal-footer').show();
         }*/
        //- set lai tieu de thong bao neu co
        if (title != undefined )
            $modal.find('.modal-title').html(title);

        $modal.find('.modal-body').html(content);
        // hien thong bao
        $modal.modal('show')
    },

    /**
     * Loader handle
     */
    loader: function (action, field, data, option) {


        /*if (option != undefined) {

         if (option.loader != undefined) {
         $modal.find('.modal-dialog').css("width", option.width);
         }
         }*/
        if (field) {
            var key = field.substring(0, 1);
            if (key != "." || key != "#")
                field = "#" + field;
        }

        switch (action) {
            case 'show':
            {
                if (!field) {
                    $('body').append('<div class="load-overlay"><div class="load-container"><div class="loader">Loading...</div></div></div>');
                }
                else {
                    $(field).html('<div id="loader"></div>').hide().fadeIn('fast');
                }
                break;
            }
            case 'hide':
            {
                if (!field) {
                    $('body > .load-overlay').remove();
                }
                else {
                    $(field).fadeOut('fast');
                }
                break;
            }
            case 'result':
            {
                if (!field) return;
                $(field).html(data).show();
                break;
            }
            case 'error':
            {
                if (!field) return;
                $(field).html('Url not found: <b>' + data + '</b>').hide().fadeIn('fast');
                break;
            }
        }
    },
    string: {
        vi_to_en: function (slug) {
            //Đổi chữ hoa thành chữ thường
            slug = slug.toLowerCase();

            //Đổi ký tự có dấu thành không dấu
            slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
            slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
            slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
            slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
            slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
            slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
            slug = slug.replace(/đ/gi, 'd');
            //Xóa các ký tự đặt biệt
            slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
            //Đổi khoảng trắng thành ký tự gạch ngang
            slug = slug.replace(/ /gi, "-");
            //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
            //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
            slug = slug.replace(/\-\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-\-/gi, '-');
            slug = slug.replace(/\-\-\-/gi, '-');
            slug = slug.replace(/\-\-/gi, '-');
            //Xóa các ký tự gạch ngang ở đầu và cuối
            slug = '@' + slug + '@';
            slug = slug.replace(/\@\-|\-\@|\@/gi, '');
            return slug;
        },
    },
    //== Khu vuc su ly luu tru o Client
    //localStorage.clear();
    //localStorage.getItem('name')
    //localStorage.setItem('name', value);

    /**
     * Cookie handle
     */
    cookie: {
        set: function (name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }
            else {
                expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },

        get: function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
    },
    //== Khu vuc mahoa - bao mat
    encode_base64: function (input) {
        var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789";
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },
    buildHashPro: function (value) {
        var link = base64_decode1(value)
        return link;
    },
    addParameterToURL: function (url, param) {
        url += (url.split('?')[1] ? '&' : '?') + param;
        return url;
    },
    // Debug
    pr: function ($data) {
        console.log($data);
    },
    is_local: function () {
        return window.location.href.match(/^https?:\/\/(localhost|192\.168\.1\.)/gi);
    },
    call: function (func) {
        // alert(func)
        var args = new Array();
        for (var i = 1; i < arguments.length; i++)
            args.push(arguments[i]);
        fn = (typeof func == "function") ? func : window[func];  // Allow fn to be a function object or the name of a global function
        //-- different attempts
        if (typeof fn == "function")
            return fn.apply(this, args);
        // else  alert('Chua dinh nghia hook')
    },


    catch_hook_event: function (ele, params, hook_default) {
        // luu lai phan tu kich hoat su kien
        if (params == undefined)
            var params = {};
        params.ele = ele;

        if ($(ele).attr('event-hook') != undefined) {
            nfc.call($(ele).attr('event-hook'), params);
        }
        else {
            var event = $(ele).closest("*[event-hook]")
            if (event.length > 0) {
                //alert(event.attr('event-hook'));
                nfc.call(event.attr('event-hook'), params);
            } else {

                if (hook_default != undefined)
                    nfc.call(hook_default, params);
                else {
                    nfc.call('moduleCoreFilter', params);

                }
            }
        }
    },
    call_module_method: function (func, params) {
        // remove the first argument containing the function name
        // arguments.shift();
        // window[func].apply(null, arguments);
        var str = ''
        if (params == undefined)
            str = func + "()";
        else
            str = func + "(params)"
        //alert(str);
        eval(str);
    },
}

/* Core Module JS */

var module_core_nfc = {
    boot: function () {
        this.display.boot();
    },

    display: {
        boot: function () {
            this.common();
        },
        common: function () {
            $(document).ready(function () {

            });
        },

    },
    filter: function (option) {
        moduleCoreFilter(option)
    },
}
module_core_nfc.boot();
function moduleCoreFilter(option) {
    // nfc.pr(option);
    var form = $(option.ele).closest("form")
    //nfc.pr($(form).attr("id"));
    var $target_data = $(".ajax-content-list");
    var $target_total = $(".ajax-content-total");
    // nfc.loader("show");
    //$target_data.append('<span class="loader_block"></span>');
    $('body').append('<div class="loader_mini">Loading...</div>');
    //== su ly du lieu submit
    var url = '';
    var load_more = false;
    if (option != undefined) {
        if (option.url != undefined) {
            url = option.url;
        }
        if (option.load_more != undefined) {
            load_more = option.load_more;
        }
    }
    if (url == '')
        url = $(form).attr('action') + '?' + $(form).serialize();

    $.ajax({
        async: false,
        type: "GET",
        url: url,
        dataType: 'json',
       // data: {'id_new': id_new},
        success: function (rs) {
            history.pushState('data', '', url);
            //nfc.loader("hide");
            //$target_data.find('span.loader_block').remove()
            $('body > .loader_mini').remove();
            if (rs.status) {
                if (load_more) {
                    // xoa phan trang va nut load more
                    $target_data.find('.page-pagination').remove();
                    $target_data.append(rs.content);
                }
                else {
                    $target_data.html(rs.content);
                }
                if ($target_total.length > 0)
                    $target_total.html(rs.total);

                // kiem tra xem co nut next khong, neu co thi hien load more
                if ($target_data.find('.page-pagination .pagination > li:last').hasClass('active')) {
                    $target_data.find('#act-pagination-load-more').parent().hide();
                }

                return false;
            }
        }
    });
}