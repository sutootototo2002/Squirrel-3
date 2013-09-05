/**
 * @file SQ.core
 * @version 1.0.0
 */
/*global
 $: false,
 Zepto: false,
 jQuery: false
 */
var SQ = SQ || {};
SQ.core = {
    /**
     * 命名空间方法
     * @method
     * @name SQ.core.namespace
     * @param {string} nameSpaceString 命名空间字符串
     * @example
     * SQ.core.namespace("SQ.modules.module2");
     */
    namespace : function (nameSpaceString) {
        var parts = nameSpaceString.split(".");
        var parent = SQ;
        var i;
        if (parts[0] === "SQ") {
            parts = parts.slice(1);
        } else {
            return false;
        }
        for (i = 0; i < parts.length; i += 1) {
            if (typeof parent[parts[i]]) {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    },
    /** 
     * 判断对象类型
     * @example
     * SQ.core.isString(str);
     */
    isString : function (str) {
        return Object.prototype.toString.call(str) === "[object String]";
    },
    isArray : function (arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    },
    isNumber : function (num) {
        return Object.prototype.toString.call(num) === "[object Number]";
    },
    isBoolean : function (bool) {
        return Object.prototype.toString.call(bool) === "[object Boolean]";
    },
    isNull : function (nullObj) {
        return Object.prototype.toString.call(nullObj) === "[object Null]";
    },
    isUndefined : function (undefinedObj) {
        return Object.prototype.toString.call(undefinedObj) === "[object Undefined]";
    },
    isFunction : function (fun) {
        return Object.prototype.toString.call(fun) === "[object Function]";
    },
    isObject : function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    },
    /**
     * isJSON
     * 判断是否为 JSON 对象
     * @param string
     * @returns {boolean}
     * @see qatrix.js
     */
    // 暂时无法使用
    /*isJSON : function (string) {
        var rvalidchars = /^[\],:{}\s]*$/;
        var rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
        var rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;
        var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
        return typeof string === 'string' && $.trim(string) !== '' ?
            rvalidchars.test(string
                .replace(rvalidescape, '@')
                .replace(rvalidtokens, ']')
                .replace(rvalidbraces, '')) :
            false;
    }*/
    extend : function (Child, Parent) {
        var F = function () {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.uber = Parent.prototype;
    }
};
/**
 * @file SQ.dom
 * @version 1.0.0
 */
/*global
 $: false,
 SQ: true,
 Zepto: true
 */
SQ.dom = {
    /**
     * 存储常用的 jQuery Dom 元素
     * 在具体的业务中也可以将页面 jQuery Dom 存入 $el 对象，例如：SQ.dom.$el.demo = $(".demo");。
     */
    $el : (function () {
        var me = this;
        var i;
        me.$el = {};
        var element = {
            $win : window,
            $doc : document,
            $body : "body"
        };
        for (i in element) {
            if (element.hasOwnProperty(i)) {
                me.$el[i] = $(element[i]);
            }
        }
        return me.$el;
    }())
};
/**
 * @file SQ.store
 * @version 1.0.0
 */
/*global
 $: false,
 SQ: true,
 Zepto: true
 */
SQ.store = {
    /**
     * Cookie 操作
     * @example
     * Sq.cookie.set("name", "value");  // 设置
     * Sq.cookie.get("name");           // 读取
     * Sq.cookie.del("name");           // 删除
     */
    cookie : {
        _getValue: function (offset) {
            var ck = document.cookie;
            var endstr = ck.indexOf(";", offset) === -1 ? ck.length : ck.indexOf(";", offset);
            return decodeURIComponent(ck.substring(offset, endstr));
        },
        get: function (name) {
            var me = this;
            var ck = document.cookie;
            var arg = name + "=";
            var argLen = arg.length;
            var cookieLen = ck.length;
            var i = 0;
            while (i < cookieLen) {
                var j = i + argLen;
                if (ck.substring(i, j) === arg) {
                    return me._getValue(j);
                }
                i = ck.indexOf(" ", i) + 1;
                if (i === 0) {
                    break;
                }
            }
            return null;
        },
        set: function (name, value) {
            var expdate = new Date();
            var year = expdate.getFullYear();
            var month = expdate.getMonth();
            var date = expdate.getDate() + 1;
            var argv = arguments;
            var argc = arguments.length;
            //获取更多实参，依次为：有效期、路径、域、加密安全设置
            var expires = (argc > 2) ? argv[2] : null;
            var path = (argc > 3) ? argv[3] : null;
            var domain = (argc > 4) ? argv[4] : null;
            var secure = (argc > 5) ? argv[5] : false;

            if (!!expires) {
                switch (expires) {
                case "day":
                    expdate.setYear(year);
                    expdate.setMonth(month);
                    expdate.setDate(date);
                    expdate.setHours(8);    // 补 8 小时时差
                    expdate.setMinutes(0);
                    expdate.setSeconds(0);
                    break;
                case "week":
                    var week = 7 * 24 * 3600 * 1000;
                    expdate.setTime(expdate.getTime() + week);
                    break;
                default:
                    expdate.setTime(expdate.getTime() + (expires * 1000 + 8 * 3600 * 1000));
                    break;
                }
            }

            document.cookie = name + "=" + encodeURIComponent(value) + ((expires === null) ? "" : ("; expires=" + expdate.toGMTString())) +
             ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) +
             ((secure === true) ? "; secure" : "");
        },
        del: function (name) {
            var me = this;
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = me.get(name);
            document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
        }
    }
};
/**
 * @file SQ.ua
 * 获取设备 ua 信息，判断系统版本、浏览器名称及版本
 * @version 1.0.0
 */
/*global
 $: false,
 SQ: true,
 Zepto: true
 */
SQ.ua = (function () {
    var info = {};
    var ua = navigator.userAgent;
    var m;

    info.os = {};
    info.browser = {};

    /**
     * operating system. android, ios, linux, windows
     * @type string
     */
    if ((/Android/i).test(ua)) {
        info.os.name = "android";
        info.os.version = ua.match(/(Android)\s([\d.]+)/)[2];
    } else if ((/Adr/i).test(ua)) {
        // UC 浏览器极速模式下，Android 系统的 UA 为 "Adr"
        info.os.name = "android";
        info.os.version = ua.match(/(Adr)\s([\d.]+)/)[2];
    } else if ((/iPod/i).test(ua)) {
        info.os.name = "ios";
        info.os.version = ua.match(/OS\s([\d_]+)/)[1].replace(/_/g, ".");
        info.device = "ipod";
    } else if ((/iPhone/i).test(ua)) {
        info.os.name = "ios";
        info.os.version = ua.match(/(iPhone\sOS)\s([\d_]+)/)[2].replace(/_/g, ".");
        info.device = "iphone";
    } else if ((/iPad/i).test(ua)) {
        info.os.name = "ios";
        info.os.version = ua.match(/OS\s([\d_]+)/)[1].replace(/_/g, ".");
        info.device = "ipad";
    }

    // 浏览器判断
    m = ua.match(/AppleWebKit\/([\d.]*)/);
    if (m && m[1]) {
        info.browser.core = "webkit";
        info.browser.version = m[1];

        if ((/Chrome/i).test(ua)) {
            info.browser.shell = "chrome";
        } else if ((/Safari/i).test(ua)) {
            info.browser.shell = "safari";
        } else if ((/Opera/i).test(ua)) {
            info.browser.shell = "opera";
        }
    }

    if ((/UCBrowser/i).test(ua)) {
        // UCWeb 9.0 UA 信息中包含 UCBrowser 字段
        m = ua.match(/(UCBrowser)\/([\d.]+)/);
        info.browser.shell = "ucweb";
        info.browser.version = m[2];
    } else if ((/UCWEB/i).test(ua)) {
        // UCWeb 7.9 UA 信息中包含 UCWEB 字段
        m = ua.match(/(UCWEB)([\d.]+)/);
        info.browser.shell = "ucweb";
        info.browser.version = m[2];
    } else if ((/UC/i).test(ua)) {
        // UCWeb 8.x UA 信息中包含 UC 字段
        // 确认 8.6、8.7 
        info.browser.shell = "ucweb";
        info.browser.version = "8.x";
    }

    if (info.browser.shell === "ucweb") {
        // UC 浏览器急速模式
        // 目前只有 Android 平台国内版 UCWeb 9.0 可以判断是否为急速模式，UA 中包含 UCWEB/2.0 字段即为急速模式。
        if ((/UCWEB\/2\.0/i).test(ua)) {
            info.browser.module = "swift";
        }
    }

    if (info.browser.version) {
        info.browser.version = parseFloat(info.browser.version, 10);
    }

    return info;
}());
/**
 * @file SQ.util
 * 常用函数
 * @version 1.0.0
 */
/*global
 $: false,
 SQ: true,
 Zepto: true
 */
SQ.util = {
    /**
     * 随机数输出
     * @method
     * @name SQ.generate
     * @example
     * Sq.generate.uniqueId();
     * Sq.generate.randomInt(0, 9);
     * Sq.generate.randomArr([1,2,3]);
     */
    generate : {
        // 生成唯一标识符
        uniqueId: function () {

        },
        randomInt: function (min, max) {
            if (typeof min === "number" && typeof max === "number" && min < max) {
                return parseInt(Math.random() * (max - min + 1) + min, 10);
            }
            return false;
        },
        randomArr: function (arr) {
            return arr.sort(function () {
                return Math.random() - 0.5;
            });
        }
    },
    goTop : function (e) {
        e.preventDefault();
        window.scrollTo(0, 0);
    },
    goBack : function (e) {
        e.preventDefault();
        history.back();
    }
};
/**
 * @file Squirrel Button
 * @version 0.1.1
 */

/*global
 $: false,
 SQ: true
 */

/**
 * @changelog
 * 0.1.1  + 新增 menu 交互模式
 * 0.0.1  + 新建
 */

(function ($, window) {
    /**
     * @name Button
     * @classdesc 选项卡交互组件
     * @constructor
     * @param {object} config 组件配置（下面的参数为配置项，配置会写入属性）
     * @param {string} config.EVE_EVENT_TYPE        触发事件，click 或 mouseover
     * @param {string} config.DOM_TRIGGER_TARGET    被绑定事件的 Dom 元素
     * @param {string} config.MODE                  交互模式
     */
    function Button(config) {
        var me = this;
        var i;

        me.config = {
            TXT_LOADING_TIP : "正在加载请稍后..."     // 正在加载提示
        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }

        me.$triggerTarget = $(me.config.DOM_TRIGGER_TARGET);        // 目标元素

        if (me._verify()) {
            me._init();
        }
    }
    Button.prototype =  {
        construtor: Button,
        version: "0.1.1",
        //state: "init",

        // 验证参数是否合法
        _verify : function () {
            return true;
        },
        _init : function (e) {
            var me = this;
            // menu 模式
            if (me.config.MODE === "menu") {
                me.$triggerTarget.on(me.config.EVE_EVENT_TYPE, function (e) {
                    me.menu();
                });
            }
        },
        // 改变按钮状态
        setState : function (state) {
            var me = this;
            //me.state = state;
            if (state === "active") {
               me.$triggerTarget.addClass("active");
            }
            if (state === "init") {
                me.$triggerTarget.removeClass("active");
            }
           
        },
        // 按钮菜单效果
        menu : function () {
            var me = this;
            var $menuBtns = $(".J_buttonMenu");
            var $menu = me.$triggerTarget.find(".menu");
            var $menus = $menuBtns.find(".menu");
            var $doc = $(document);
            
            function _resetAll() {
                $menus.hide();
                $menuBtns.removeClass("active");
            }
            function _showMenu() {
                _resetAll();
                $menu.show();
                me.setState("active");
                $doc.on("click", function (e) {
                    var $target = $(e.target);
                    if (!$target.hasClass("sq-btn") && $target.parents(".sq-btn").length === 0) {
                        _hideMenu();
                    }
                });
            }
            function _hideMenu() {
                $menu.hide();
                me.setState("init");
                $doc.off("click");
            }

            if (!me.$triggerTarget.hasClass("active")) {
                _showMenu();
            } else {
                _hideMenu();
            }
        },
        // 按钮开关效果
        toggle : function () {
            var me = this;

        }
    };
    SQ.Button = Button;
    
    // 初始化菜单类型按钮
    $(".J_buttonMenu").each(function () {
        var $me = $(this);
        var button = new SQ.Button({
            EVE_EVENT_TYPE : "click",
            DOM_TRIGGER_TARGET : $me,
            MODE : "menu",
            CSS_STYLE : ""
        });
    });
}($, window));
/**
 * @file SQ.Dialog 对话框组件
 * @version 0.9.3
 */

/*global
 $: false,
 SQ: true,
 Zepto: true
 */

/**
 * @changelog
 * 0.9.3  * 更改 _bind 中的绑定方式，修正异步加载的 DOM 无法绑定 dialog 事件问题。
 * 0.9.2  * 将 _bind 中的 .live 改为 .on 绑定，添加 TXT_CLOSE_VAL 默认值为 x
 * 0.9.1  * 核心删除了 SQ.dom.getHeight 方法，所以改用 .height() 方法。
 * 0.9.0  + 新增 resize 回调函数
 *        * 拆分 show 方法，新增 _initDialogStyle、_initDialogEvent 方法，
 *        * 新增 _reset 方法，当窗口发生变化时将会重新计算对话框样式，
 *        * 修复遮罩在窗口发生变化时无法铺满全屏的问题。
 * 0.8.3  * 修复 LOCK 状态下大多浏览器无法响应点击事件问题（针对 UCweb 9 有优化）。 
 * 0.8.2  + 新增 CSS_STYLE 对话框样式名称设置。
 * 0.8.1  + lock 方法新增屏蔽鼠标滚轮操作，
 *        + 新增定时关闭方法，设置 NUM_CLOSE_TIME 参数即可触发，
 *        + 新增 ok、cancel 回调函数，
 *        * 修改了 close 函数的实现逻辑，去除 DESTROY 参数，现在 close 方法都是销毁操作。
 * 0.6.1  + FULLSCREEN_OFFSET 新增设置 auto 参数，当设置 auto 时 dialog 会在响应居中，但需要设置高宽才能生效。
 * 0.6.0  + 新增 FULLSCREEN_OFFSET 设置，新增 _getDialog 内部函数，优化对话框坐标、高度、宽度计算。
 * 0.5.1  * 修复获取窗口高度时，UC浏览器返回值会出现多种情况，导致高度计算出现偏差。
 * 0.5.0  + 新增对话框组件。
 */

(function ($, window) {
    /**
     * @name Dialog
     * @classdesc 对话框组件，依赖 jQuery 或 Zepto 库。
     * @constructor
     * @param {object} config 组件配置（下面的参数为配置项，配置会写入属性）
     * @param {string} config.EVE_EVENT_TYPE 绑定事件设置
     * @param {string} config.DOM_TRIGGER_TARGET 被绑定事件的 Dom 元素
     * @param {string} config.TXT_CLOSE_VAL 关闭按钮显示文字
     * @param {string} config.TXT_OK_VAL 确定按钮显示文字，默认值："确定"
     * @param {string} config.TXT_CANCEL_VAL 取消按钮显示文字，默认值："取消"
     * @param {string} config.CSS_STYLE 对话框样式名称
     * @param {string} config.CSS_MASK_BACKGROUND 遮罩背景色，默认值："#000000"
     * @param {string} config.CSS_MASK_OPACITY 遮罩透明度，默认值：0.5
     * @param {string} config.CSS_POSITION 对话框定位方式，默认值："absolute"
     * @param {number} config.CSS_TOP 对话框 top 属性值，默认值："auto"
     * @param {number} config.CSS_LEFT 对话框 left 属性值，默认值："auto"
     * @param {number} config.CSS_WIDTH 对话框 width 属性值，默认值："auto"
     * @param {number} config.CSS_HEIGHT 对话框 height 属性值，默认值："auto"
     * @param {number} config.CSS_MIN_WIDTH 对话框 min-width 属性值
     * @param {number} config.CSS_MIN_HEIGHT 对话框 min-height 属性值
     * @param {array} config.FULLSCREEN_OFFSET 全屏偏移距离设置，即弹出层距上下左右的距离
     *                                         例如：[20,10]表示上下距离 20 像素，左右距离 10 像素
     * @param {number} config.NUM_CLOSE_TIME 对话框自动关闭时间，单位：毫秒
     * @param {string} config.VERTICAL 对话框垂直位置，可选值："middle"，
     *                                 必须设置 CSS_HEIGHT 或 CSS_MIN_HEIGHT 才能生效
     * @param {string} config.HORIZONTAL 对话框水平位置，可选值："center"，
     *                                 必须设置 CSS_WIDTH 或 CSS_MIN_WIDTH 才能生效
     * @param {string} config.ANIMATE 动画类，默认值：undefined
     * @param {boole} config.MASK 遮罩设定，默认为 false，设为 true 将显示遮罩效果
     * @param {boole} config.LOCK 锁定操作，默认为 false，设为 true 将屏蔽触摸操作，默认值：false
     * @param {number} config.NUM_CLOSE_TIME 自动关闭对话框时间，单位：毫秒
     * @param {function} config.show 打开对话框回调函数
     * @param {function} config.ok 点击确定按钮回调函数
     * @param {function} config.cancel 点击取消按钮回调函数
     * @param {function} config.close 关闭对话框回调函数
     * @param {function} config.reszie resize 回调函数
     */
    function Dialog(config) {
        var me = this;
        var i;

        me.config = {
            CSS_MASK_BACKGROUND : "#000000",
            CSS_MASK_OPACITY : 0.5,
            CSS_POSITION : "absolute",
            CSS_TOP : 0,
            CSS_LEFT : 0,
            CSS_WIDTH : "auto",             // 内容宽度
            CSS_HEIGHT : "auto",            // 内容高度
            CSS_MIN_WIDTH : "auto",          // 最小宽度限制
            CSS_MIN_HEIGHT : "auto",         // 最小高度限制
            TXT_OK_VAL : "确定",
            TXT_CANCEL_VAL : "取消",
            TXT_CLOSE_VAL : "×",
            ANIMATE : undefined,
            LOCK : false,
            MASK : false
        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }

        me.$triggerTarget = $(me.config.DOM_TRIGGER_TARGET); // 触发元素

        me.showFun = me.config.show;
        me.closeFun = me.config.close;
        me.okFun = me.config.ok;
        me.cancelFun = me.config.cancel;
        me.resizeFun = me.config.resize;

        if (me._verify()) {
            me._init();
        }
    }
    Dialog.prototype =  {
        construtor: Dialog,
        version: "0.9.3",
        timer : undefined,
        resizeTimer : false,    // resize 
        closed : true,

        /** 验证参数是否合法 */
        _verify : function () {
            return true;
        },

        /** 初始化 */
        _init : function () {
            var me = this;
            // 获取宽度设置
            if (typeof me.config.CSS_WIDTH === "number") {
                me.dialogWidth = me.config.CSS_WIDTH;
            } else if (typeof me.config.CSS_MIN_WIDTH === "number") {
                me.dialogWidth = me.config.CSS_MIN_WIDTH;
            } else {
                me.dialogWidth = undefined;
            }
            // 获取高度设置
            if (typeof me.config.CSS_HEIGHT === "number") {
                me.dialogHeight = me.config.CSS_HEIGHT;
            } else if (typeof me.config.CSS_MIN_HEIGHT === "number") {
                me.dialogHeight = me.config.CSS_MIN_HEIGHT;
            } else {
                me.dialogHeight = undefined;
            }

            me._bind(me.$triggerTarget, me.config.EVE_EVENT_TYPE);
        },

        /**
         * 事件绑定方法。
         * @param {object} $el jQuert 或 Zepto 元素包装集。
         * @param {string} EVE_EVENT_TYPE 事件类型，"scroll" 或 "click"。
         */
        _bind : function ($el, EVE_EVENT_TYPE) {
            var me = this;
            SQ.dom.$el.$doc.on(EVE_EVENT_TYPE, me.config.DOM_TRIGGER_TARGET, function (e) {
                e.preventDefault();
                me._trigger(e);
            });
        },
        /**
         * 解除事件绑定方法。
         * @param {object} $el jQuert 或 Zepto 元素包装集。
         * @param {string} EVE_EVENT_TYPE 事件类型，"scroll" 或 "click"。
         */
        _unBind : function ($el, EVE_EVENT_TYPE) {
            $el.off(EVE_EVENT_TYPE);
        },
        /**
         * 触发事件方法，在满足绑定事件条件时或满足指定触发条件的情况下调用触发方法，
         * 该方法用于集中处理触发事件，判定是否需要加载数据或者更新 UI 显示。
         * @param {string} EVE_EVENT_TYPE 事件类型，"scroll" 或 "click"。
         */
        _trigger : function (e) {
            var me = this;
            me.show(e);
        },

        // 重置位置与尺寸
        _reset : function () {
            var me = this;

            $(window).resize(function () {
                if (!me.closed && !me.resizeTimer) {
                    me.resizeTimer = true;
                    setTimeout(function () {
                        if (!me.$dialogWindow) {
                            // 自动关闭窗口时会丢失 me.$dialogWindow
                            return;
                        }
                        me._initDialogStyle();
                        me.$dialogWindow.css({
                            "top" : me.top,
                            "left" : me.left,
                            "width" : me.width,
                            "height" : me.height
                        });
                        me.resizeTimer = false;
                        me.resizeFun && me.resizeFun();
                    }, 200);
                }
            });
        },

        // 获取 dialog Dom
        _getDialog : function () {
            var me = this;

            if (me.$dialogWindow) {
                return me.$dialogWindow;
            }
            // 初始化 dialogWindow
            var $dialogWindow = $("<div class='sq-dialog'></div>");
            var $dialogContent = $("<div class='content'></div>");
            var $okBtn = $("<div class='ok'>" + me.config.TXT_OK_VAL + "</div>");
            var $cancelBtn = $("<div class='cancel'>" + me.config.TXT_CANCEL_VAL + "</div>");
            var $close = $("<div class='close-btn'>" + me.config.TXT_CLOSE_VAL + "</div>");
            $dialogWindow.append($close).append($dialogContent).append($okBtn).append($cancelBtn);
            $dialogWindow.addClass(me.config.CSS_STYLE);
            // 保存关键 Dom
            //me.$dialogWindow = $dialogWindow;
            me.$dialogContent = $dialogContent;
            me.$okBtn = $okBtn;
            me.$cancelBtn = $cancelBtn;
            me.$close = $close;

            return $dialogWindow;
        },

        _initDialogStyle : function () {
            var me = this;
            var scroll = SQ.dom.$el.$body.scrollTop();
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;

            // 设置 top
            if (me.dialogHeight) {
                if (me.config.VERTICAL === "middle") {
                    me.top = (winHeight - me.dialogHeight) / 2 + scroll;
                }
            } else {
                me.top = me.config.CSS_TOP || 0;
            }
            // 设置 left
            if (me.dialogWidth) {
                if (me.config.HORIZONTAL === "center") {
                    me.left = (winWidth - me.dialogWidth) / 2;
                }
            } else {
                me.left = me.config.CSS_LEFT || 0;
            }
            // 高宽设置
            me.width = me.config.CSS_WIDTH;
            me.height = me.config.CSS_HEIGHT;
            // 设置 offset
            if (me.config.FULLSCREEN_OFFSET) {
                var offset = me.config.FULLSCREEN_OFFSET;
                var tb = offset[0]; // 上下偏移距离
                var lr = offset[1]; // 左右偏移距离
                if (typeof tb === "number") {
                    me.height = winHeight - tb * 2;
                    me.top = (winHeight - me.height) / 2 + scroll;
                } else if (tb === "auto") {
                    me.top = (winHeight - me.dialogHeight) / 2 + scroll;
                }
                if (typeof lr === "number") {
                    me.width = winWidth - lr * 2;
                    me.left = lr;
                } else if (tb === "auto") {
                    me.left = (winWidth - me.dialogWidth) / 2;
                }
            }
        },

        _initDialogEvent : function () {
            var me = this;
            // 锁定操作
            if (me.config.LOCK) {
                // 优化 Android 下 UCweb 浏览器触摸操作，减少滑动误操作
                if (SQ.ua.os.name === "android" && SQ.ua.browser.shell === "ucweb" && SQ.ua.browser.version >= 9) {
                    me.$dialogWindow.on("touchstart", function (e) {
                        e.preventDefault();
                    });
                } else {
                    me.$dialogWindow.on("touchmove", function (e) {
                        e.preventDefault();
                    });
                }
                me.$dialogWindow.on("mousewheel", function (e) {
                    e.preventDefault();
                });
            }
            me.$okBtn.on("click", function () {
                me.ok();
            });
            me.$cancelBtn.on("click", function () {
                me.cancel();
            });
            me.$close.on("click", function () {
                me.close();
            });

            if (me.config.NUM_CLOSE_TIME) {
                me.time(me.config.NUM_CLOSE_TIME);
            }

            me._reset();
        },

        /** 显示对话框 */
        show : function (e) {
            var me = this;
            if (!me.closed) {
                return;
            }
            me.closed = false;
            if (me.config.MASK) {
                me.mask();
            }
            me.$dialogWindow = me._getDialog();
            me._initDialogStyle();
            // 添加动画
            if (me.config.ANIMATE) {
                me.$dialogWindow.addClass("animated " + me.config.ANIMATE);
            }
            // 设置对话框样式
            me.$dialogWindow.css({
                "position" : me.config.CSS_POSITION,
                "top" : me.top,
                "left" : me.left,
                "min-width" : me.config.CSS_MIN_WIDTH,
                "min-height" : me.config.CSS_MIN_HEIGHT,
                "width" : me.width,
                "height" : me.height,
                "z-index" : 102
            }).appendTo(SQ.dom.$el.$body);
            // 绑定对话框事件
            me._initDialogEvent();
            // 执行回调函数
            me.showFun && me.showFun(e);
        },

        /** 关闭对话框 */
        close : function (e) {
            var me = this;
            me.$dialogWindow.remove();
            me.$dialogContent.empty();
            me.$dialogWindow = null;
            if (me.config.MASK) {
                me.$mask.hide();
            }
            me.closed = true;
            me.closeFun && me.closeFun(e);
        },

        /**
         * 定时关闭
         * @param {Number} 单位为秒, 无参数则停止计时器
         */
        time : function (second) {
            var me = this;
            if (!me.closed) {
                me.timer = setTimeout(function () {
                    me.close();
                }, second);
            }
        },

        /** 显示遮罩 */
        mask : function () {
            var me = this;
            var h = SQ.dom.$el.$body.height();

            if (me.$mask) {
                me.$mask.css({
                    "width" : "100%",
                    "height" : h
                });
                me.$mask.show();
            } else {
                var $mask = $("<div class='mask'></div>");
                $mask.css({
                    "position" : "absolute",
                    "top" : 0,
                    "left" : 0,
                    //"bottom" : 0,
                    "right" : 0,
                    "width" : "100%",
                    "height" : h,
                    "background" : me.config.CSS_MASK_BACKGROUND,
                    "opacity" : me.config.CSS_MASK_OPACITY,
                    "z-index" : 101
                }).appendTo(SQ.dom.$el.$body);

                if (me.config.LOCK) {
                    $mask.on("touchstart", function (e) {
                        e.preventDefault();
                    });
                    $mask.on("mousewheel", function (e) {
                        e.preventDefault();
                    });
                }
                me.$mask = $mask;
            }
        },

        unlock : function () {
            var me = this;
        },

        ok : function (e) {
            var me = this;
            me.close();
            me.okFun && me.okFun(e);
        },

        cancel : function (e) {
            var me = this;
            me.close();
            me.cancelFun && me.cancelFun(e);
        }
    };
    SQ.Dialog = Dialog;
}($, window));
/**
 * @file Squirrel LazyLoad
 * @version 0.5.1
 */

/*global
 $: false,
 SQ: true
 */

/**
 * @changelog
 * 0.5.1  * 完成图片模式的延迟加载功能
 * 0.0.1  + 新建
 */

(function ($, window) {
    /**
     * @name LazyLoad
     * @classdesc 内容延迟加载
     * @constructor
     * @param {object} config 组件配置（下面的参数为配置项，配置会写入属性）
     * @param {string} config.DOM_LAZY_ITEMS        需要添加延迟加载的元素
     * @param {string} config.MODE                  延迟加载模式：image（图片模式）
     * @param {string} config.NUM_THRESHOLD         灵敏度，数值越大越灵敏，延迟性越小。
     * @param {function} config.refresh             刷新延迟加载元素列表
     * @example var imglazyload = new SQ.LazyLoad({
                DOM_LAZY_ITEMS : ".J_lazyload",
                NUM_THRESHOLD : 200
            });
     */
    function LazyLoad(config) {
        var me = this;
        var i;

        me.config = {
            "MODE": "image", 
            "NUM_THRESHOLD": 200
        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }
        if (me._verify()) {
            me.init();
        }
        me.refresh = function () {
            me.$lazyItems = $(me.config.DOM_LAZY_ITEMS);
        };
    }
    LazyLoad.prototype =  {
        construtor: LazyLoad,
        version: "0.5.1",
        scrollTimer: 0,     // 滑动计时器
        scrollDelay: 200,   // 滑动阀值

        /** 验证参数是否合法 */
        _verify : function () {
            return true;
        },
        init : function () {
            var me = this;
            me.$lazyItems = $(me.config.DOM_LAZY_ITEMS); // 触发元素
            me.lazyItemClassName = me.config.DOM_LAZY_ITEMS.slice(1);
            me._trigger();
        },
        _trigger : function () {
            var me = this;
            var $win = $(window);
            $win.on("scroll", function () {
                // 添加 scroll 事件相应伐值，优化其性能
                if (!me.scrollTimer) {
                    me.scrollTimer = setTimeout(function () {
                        if (me.config.MODE === "image") {
                            me._loadImg();
                        }
                        me.scrollTimer = 0;
                    }, me.scrollDelay);
                }
            });
        },
        /** 判断是否在显示区域 */
        _isInDisplayArea : function (item) {
            var me = this;
            var $item = $(item);
            var win = window;
            var winH = win.innerHeight;
            var winOffsetTop = win.pageYOffset; // window Y 轴偏移量
            var itemOffsetTop = $item.offset().top;
            // itemOffsetTop >= winOffsetTop 只加载可视区域下方的内容
            // winOffsetTop + winH + me.config.NUM_THRESHOLD 加载可视区域下方一屏内的内容
            return itemOffsetTop >= winOffsetTop && itemOffsetTop <= winOffsetTop + winH + me.config.NUM_THRESHOLD;
        },
        _loadImg : function () {
            var me = this;
            function replaceSrc($item, src) {
                $item.attr("src", src).removeAttr("data-img").removeClass(me.lazyItemClassName);
                me.refresh();
            }
            me.$lazyItems.each(function (index, item) {
                var $item = $(item);
                var src = $item.attr("data-img");
                var hasLazyTag = $item.hasClass(me.lazyItemClassName);
                if (!item || !src || !hasLazyTag) {
                    return;
                }
                if (me._isInDisplayArea(item)) {
                    replaceSrc($item, src);
                }
            });
        }
    };
    SQ.LazyLoad = LazyLoad;
}($, window));
/**
 * @file SQ.LoadMore 加载更多组件
 * @version 1.1.6
 */

/*global
 $: false,
 SQ: true,
 Zepto: true
 */

/**
 * @changelog
 * 1.1.6  * 去除 unbind，解决与 lazyload 插件冲突。
 * 1.1.5  + 新增 _changeBind 函数，用来改变交绑定互事件；
 *        * 精简 _bind、_unbind 函数，对整体逻辑做小的优化。
 * 1.1.3  + 新增 loadError 回调函数。
 * 1.1.2  + 新增 NUM_SUCCESS_CODE、NUM_NO_MORE_CODE 配置项。
 *        * 修复当最大滑动加载页数正好为最后一页时，noMore 事件没有解除滑动事件绑定，导致 scrollEnd 继续执行。
 * 1.1.1  * 修改 config 常量的书写方式。
 * 1.1.0  + 新增 DATATYPE 属性，用于定义 json 数据中 data 字段的数据类型；
 *          新增回调函数 render、loading、loaded、scrollEnd；
 *        - 删除了 scrollEnd 事件中 addClass("click-state") 操作，改为在 scrollEnd 回调函数中执行。
 * 1.0.6  - 精简注释；修改 _refresh 名称为 _reset。
 * 1.0.5  * 修复 _verify 方法因为找不到 DOM 元素而保存导致 js 无法继续执行的问题。
 * 1.0.4  + 添加 _refresh 方法，用于计算并存储文档高度和触发高度，该方法会在完成 XHR 加载后刷新，
 *          减少 _getHeight 取值，优化性能。
 * 1.0.3  + 添加 scroll 事件相应伐值，优化其性能。
 * 1.0.2  + 添加 _verify 方法，用于验证参数是否合法。
 * 1.0.1  + 配置内置的 config 设置。
*/

(function ($, window) {
    /**
     * @name LoadMore
     * @classdesc 应用列表加载更多组件，支持点击加载和滑动加载两种方式，支持由滑动加载自动转为点击加载，依赖 jQuery 或 Zepto 库。
     * @constructor
     * @param {object} config 组件配置（下面的参数为配置项，配置会写入属性）
     * @param {string} config.EVE_EVENT_TYPE 绑定事件设置
     * @param {string} config.API API 接口
     * @param {string} config.DOM_TRIGGER_TARGET 被绑定事件的 Dom 元素
     * @param {string} config.DOM_AJAX_BOX 数据展示 Dom 元素
     * @param {string} config.DOM_STATE_BOX 状态展示 Dom 元素
     * @param {string} config.CSS_INIT_STYLE 初始状态展示样式
     * @param {string} config.NUM_LOAD_POSITION 滑动加载位置，默认值：0.5
     * @param {number} config.NUM_START_PAGE_INDEX 起始页面序号，默认值：0
     * @param {number} config.NUM_SCROLL_MAX_PAGE 最大滑动加载页数，默认值：3
     * @param {number} config.NUM_SUCCESS_CODE AJAX 成功返回码，默认值：200
     * @param {number} config.NUM_NO_MORE_CODE 无下页数据返回码，默认值：900
     * @param {string} config.TXT_LOADING_TIP 正在加载提示，默认值："正在加载请稍后..."
     * @param {string} config.TXT_INIT_TIP 初始提示文字，默认值："滑动加载更多内容"
     * @param {string} config.TXT_CLICK_TIP 触发点击交互提示文字，默认值："点击加载更多"
     * @param {string} config.TXT_LOADED_ERROR Ajax 加载错误或超时提示，默认值："加载错误，请重试"
     * @param {string} config.TXT_UNKNOWN_ERROR 通过 Ajax 接收到的数据无法识别，默认值："未知错误，请重试"
     * @param {string} config.DATA_TYPE 设置 data 字段中的数据类型，值为 html 或 json
     *                                  当 DATA_TYPE 设为 html 时，会进行简单处理，具体见 _render 方法
     * @param {function} config.loading 加载阶段回调函数
     * @param {function} config.loaded 加载完成回调函数
     * @param {function} config.loadError 加载失败回调函数
     * @param {function} config.scrollEnd 滑动加载事件完成回调函数
     * @param {function} config.render 渲染阶段回调函数
     * @example var appList = new SQ.LoadMore({
            EVE_EVENT_TYPE : "scroll",
            DOM_TRIGGER_TARGET : window,
            DOM_AJAX_BOX : ".J_ajaxWrap",
            DOM_STATE_BOX : ".J_scrollLoadMore",
            CSS_INIT_STYLE : "loadMore-btn",
            NUM_SCROLL_MAX_PAGE : 3,
            DATA_TYPE : "json",
            render : function (data) {
                // data 为 AJAX 返回数据，通常为 JSON 格式
            },
            scrollEnd : function () {
                // 添加点击模式样式
                var me = this;
                me.$stateBox.addClass("loadMore-clickState");
            }
        });
     * @requires jQuery or Zepto
     */
    function LoadMore(config) {
        var me = this;
        var i;

        me.config = {
            API : "",                                 // API 接口
            NUM_START_PAGE_INDEX : 0,                 // 起始页面序号
            NUM_LOAD_POSITION : 0.5,                  // 滑动加载位置（0.5 表示页面滑动到 50% 的位置开始加载，该值会递增）
            NUM_SCROLL_MAX_PAGE : 3,                  // 
            TXT_LOADING_TIP : "正在加载请稍后...",     // 正在加载提示
            TXT_INIT_TIP : "滑动加载更多内容",         // 初始提示文字
            TXT_CLICK_TIP : "点击加载更多",            // 触发点击交互提示文字
            TXT_LOADED_ERROR : "加载失败，请点击重试",     // Ajax 加载错误或超时提示
            TXT_UNKNOWN_ERROR : "未知错误，请重试",    // 通过 Ajax 接收到的数据无法识别
            NUM_SUCCESS_CODE : 200,
            NUM_NO_MORE_CODE : 900,
            DATA_TYPE : "json"
        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }

        me.$triggerTarget = $(me.config.DOM_TRIGGER_TARGET); // 触发元素
        me.$ajaxBox = $(me.config.DOM_AJAX_BOX);             // 数据展示元素
        me.$stateBox = $(me.config.DOM_STATE_BOX);           // 状态展示元素
        me.api = me.$stateBox.attr("data-api") || me.config.API;
        me.page = me.config.NUM_START_PAGE_INDEX;
        me.maxPage = me.config.NUM_SCROLL_MAX_PAGE + me.page;
        me.scrollTimer = 0;                                 // 滑动事件计时器
        me.scrollDelay = 200;                               // 滑动事件触发伐值

        me.render = me.config.render;
        me.loading = me.config.loading;
        me.loaded = me.config.loaded;
        me.loadError = me.config.loadError;
        me.scrollEnd = me.config.scrollEnd;

        if (me._verify()) {
            me._init();
        }
    }
    LoadMore.prototype =  {
        construtor: LoadMore,
        version: "1.1.6",

        /** 验证参数是否合法 */
        _verify : function () {
            var me = this;
            var i;
            // Dom 验证
            // 触发元素、数据展示元素、状态展示元素必须都存在
            if (me.$triggerTarget.length === 0) {
                return false;
            }

            if (me.$ajaxBox.length === 0) {
                return false;
            }

            if (me.$stateBox.length === 0) {
                return false;
            }
            // API 验证
            if (!me.api) {
                return false;
            }
            // 类型验证
            for (i in me.config) {
                if (me.config.hasOwnProperty(i)) {
                    switch (i) {
                    case "NUM_LOAD_POSITION":
                        if (typeof me.config[i] !== "number") {
                            throw new Error("NUM_LOAD_POSITION 不是预期的数字类型");
                        }
                        break;
                    case "NUM_START_PAGE_INDEX":
                        if (typeof me.config[i] !== "number") {
                            throw new Error("NUM_START_PAGE_INDEX 不是预期的数字类型");
                        }
                        break;
                    case "NUM_SCROLL_MAX_PAGE":
                        if (typeof me.config[i] !== "number") {
                            throw new Error("NUM_SCROLL_MAX_PAGE 不是预期的数字类型");
                        }
                        break;
                    case "TXT_LOADING_TIP":
                        if (typeof me.config[i] !== "string") {
                            throw new Error("TXT_LOADING_TIP 不是预期的字符串类型");
                        }
                        break;
                    case "TXT_INIT_TIP":
                        if (typeof me.config[i] !== "string") {
                            throw new Error("TXT_INIT_TIP 不是预期的字符串类型");
                        }
                        break;
                    case "TXT_CLICK_TIP":
                        if (typeof me.config[i] !== "string") {
                            throw new Error("TXT_CLICK_TIP 不是预期的字符串类型");
                        }
                        break;
                    case "TXT_LOADED_ERROR":
                        if (typeof me.config[i] !== "string") {
                            throw new Error("TXT_LOADED_ERROR 不是预期的字符串类型");
                        }
                        break;
                    case "TXT_UNKNOWN_ERROR":
                        if (typeof me.config[i] !== "string") {
                            throw new Error("TXT_UNKNOWN_ERROR 不是预期的字符串类型");
                        }
                        break;
                    }
                }
            }
            return true;
        },

        /** 初始化方法，当判定必要元素存在时就执行事件绑定操作。*/
        _init : function () {
            var me = this;
            me._currentState = "none";  // 设置当前状态
            me.$stateBox.addClass(me.config.CSS_INIT_STYLE).text(me.config.TXT_INIT_TIP);
            me._reset();
            me._bind(me.config.EVE_EVENT_TYPE);
            me.currentEventType = me.config.EVE_EVENT_TYPE; // 临时存储事件类型，以供 _changeState 判断使用。
        },

        /** 重新计算页面高度，触发高度。*/
        _reset : function () {
            var me = this;
            var contentHeight = me._getHeight($("body"));
            var winHeight = window.innerHeight;
            me.triggerHeight = (contentHeight - winHeight) * (me.config.NUM_LOAD_POSITION);
            if (me.config.NUM_LOAD_POSITION < 0.8) {
                me.config.NUM_LOAD_POSITION += 0.15555;
            }
        },
        /** 
         * 获取页面高度方法。
         * @param {object} $el jQuert 或 Zepto 元素包装集。
         */
        _getHeight : function ($el) {
            if ($el.get) {
                $el = $el.get(0);
            }
            if (!$el) {
                return 0;
            }
            if ($el.getBoundingClientRect) {
                return $el.getBoundingClientRect().height;
            }
            return Math.max($el.clientHeight, $el.offsetHeight, $el.scrollHeight);
        },
        /**
         * 事件绑定方法。
         * @param {object} $el jQuert 或 Zepto 元素包装集。
         * @param {string} EVE_EVENT_TYPE 事件类型，"scroll" 或 "click"。
         */
        _bind : function (eventType) {
            var me = this;
            me.$triggerTarget.bind(eventType, function () {
                me._trigger(eventType);
            });
        },
        /**
         * 解除事件绑定方法。
         * @param {object} $el jQuert 或 Zepto 元素包装集。
         * @param {string} EVE_EVENT_TYPE 事件类型，"scroll" 或 "click"。
         */
        _unbind : function () {
            var me = this;
            me.$triggerTarget.unbind();
            //me.unbind(me.$triggerTarget, me.config.EVE_EVENT_TYPE);
        },
        _changeBind : function (eventType) {
            var me = this;
            //me._unbind(); //解除绑定  // 与 lazyload 插件冲突
            me.currentEventType = eventType;
            if (eventType === "click") {
                me.$triggerTarget = me.$stateBox;   //变更触发目标，并将加载触发方式更改为 click
                me._bind(eventType);   //重新绑定
            }
            if (eventType === "scroll") {
                me.$triggerTarget = $(me.config.DOM_TRIGGER_TARGET);
                me._bind(eventType);
            }
        },
        /**
         * 触发事件方法，在满足绑定事件条件时或满足指定触发条件的情况下调用触发方法，
         * 该方法用于集中处理触发事件，判定是否需要加载数据或者更新 UI 显示。
         * @param {string} EVE_EVENT_TYPE 事件类型，"scroll" 或 "click"。
         */
        _trigger : function (eventType) {
            var me = this;
            var connector = me.api.indexOf("?") === -1 ? "?" : "&";
            var isLoading = me.$stateBox.hasClass("J_loading");
            var isNoMore = me.$stateBox.hasClass("J_noMore");

            if (isLoading && isNoMore) {
                return;
            }

            if (eventType === "scroll") {
                if (me.page < me.maxPage && !me.scrollTimer) {
                    // 添加 scroll 事件相应伐值，优化其性能
                    me.scrollTimer = setTimeout(function () {
                        if (me.$triggerTarget.scrollTop() >= me.triggerHeight && !isLoading && !isNoMore) {
                            me._loadData(me.api + connector + "page=" + me.page);
                        }
                        me.scrollTimer = 0;
                    }, me.scrollDelay);
                }
                if (me.page === me.maxPage) {
                    me._changeState("scrollEnd");
                }
            }

            if (eventType === "click") {
                me._loadData(me.api + connector + "page=" + me.page);
            }
        },
        /**
         * 状态变更方法，该方法用于记录程序运行状态，并针对不同状态做出 UI 更新及事件重新绑定等操作。
         * @param {string} state 运行状态，值包括：loading、loaded、scrollEnd、noMore、TXT_LOADED_ERROR、TXT_UNKNOWN_ERROR。
         */
        _changeState : function (state) {
            var me = this;
            // 当预执行状态与程序当前运行状态相同时，退出状态变更方法，以避免多次重复操作。
            if (me._currentState === state) {
                return;
            }
            me._currentState = state;

            // 状态判断
            switch (state) {
            case "loading":         //正在加载阶段，添加 J_loading 标识，更新提示文字
                me.$stateBox.addClass("J_loading").show().text(me.config.TXT_LOADING_TIP);
                me.loading && me.loading();
                break;
            case "loaded":          //加载完成
                me.$stateBox.removeClass("J_loading");
                
                if (me.currentState === "loadError") {
                    me._changeBind("scroll");
                    me.currentState = undefined;
                }
                
                if (me.currentEventType === "scroll") {
                    me.$stateBox.hide().text("");
                }

                if (me.currentEventType === "click") {
                    me.$stateBox.text(me.config.TXT_CLICK_TIP);
                }

                me.page += 1;
                me.loaded && me.loaded();
                break;
            case "scrollEnd":       //滑动加载次数已达到上限
                me._changeBind("click");
                me.$stateBox.show().text(me.config.TXT_CLICK_TIP);
                me.scrollEnd && me.scrollEnd();
                break;
            case "noMore":          // 无下页数据
                //me._unbind();     // 与 lazyload 插件冲突
                me.$stateBox.addClass("J_noMore").hide();
                break;
            case "loadError":     // 加载错误提示
                me.currentState = "loadError";
                me._changeBind("click");
                me.$stateBox.removeClass("J_loading").text(me.config.TXT_LOADED_ERROR);
                me.loadError && me.loadError();
                break;
            case "unknowError":    // 服务器返回数据无法识别
                me.$stateBox.removeClass("J_loading").text(me.config.TXT_UNKNOWN_ERROR);
                break;
            }
        },
        /**
         * 数据加载方法，用于发起 AJAX 请求加载数据。
         * @param {string} api 请求数据的 API 接口。
         */
        _loadData : function (api) {
            var me = this;
            me._changeState("loading");

            $.ajax({
                type: "POST",
                url: api,
                timeout: 5000,
                success: function (data) {
                    me._render(data);
                },
                error: function () {
                    me._changeState("loadError");
                }
            });
        },
        /**
         * 数据渲染方法，用于将请求的数据渲染到页面中。
         * @param {object} data 服务器返回的数据。
         */
        _render : function (data) {
            var me = this;
            if (!data) {
                me._changeState("loadError");
                return;
            }
            if (me.config.DATA_TYPE === "html") {
                var jsonData = typeof data === "string" ? $.parseJSON(data) : data;
                var code = parseInt(jsonData.code, 10);

                switch (code) {
                case me.config.NUM_SUCCESS_CODE:   //成功加载
                    me.$ajaxBox.append(jsonData.data);
                    me._changeState("loaded");
                    break;
                case me.config.NUM_NO_MORE_CODE:   //无下页数据
                    me.$ajaxBox.append(jsonData.data);
                    me._changeState("noMore");
                    break;
                default:
                    me._changeState("unknowError");
                }
                me._reset();
            }
            me.render && me.render(data);
        }
    };
    SQ.LoadMore = LoadMore;
}($, window));
/**
 * @file Squirrel Suggest
 * @version 0.5.7
 */

/*global
 $: false,
 SQ: true,
 Zepto: true,
 toString: true
 */

/**
 * @changelog
 * 0.5.7  * 修复多次发送请求时，老请求因为响应慢覆盖新请求问题。
 * 0.5.6  * 修改组件名称为 Suggest
 * 0.5.5  * 完成搜索联想词基本功能
 * 0.0.1  + 新建
 */

(function ($, window) {
    /**
     * @name Suggest
     * @classdesc 搜索联想词交互组件
     * @constructor
     * @param {object} config 组件配置（下面的参数为配置项，配置会写入属性）
     * @param {string} config.DOM_INPUT             需要绑定联想词交互的输入框
     * @param {string} config.DOM_CLEAR_BTN         清空按钮
     * @param {string} config.DOM_SUGGEST_PANEL     联想词展示面板
     * @param {string} config.API_URL               联想词接口
     * @param {function} config.beforeStart         检测输入框前的回调函数
     * @param {function} config.start               开始检测输入框时回调函数
     * @param {function} config.show                显示联想词面板时回调函数
     * @param {function} config.clear               清除时回调函数
     * @example var appList = new SQ.Suggest({
            DOM_INPUT : ".J_searchInput",
            DOM_CLEAR_BTN : ".J_clearInput",
            DOM_SUGGEST_PANEL : ".suggest-panel",
            API_URL : config.search_API,
            beforeStart : function () {

            },
            start : function () {
            
            },
            show : function (ds) {
                // ds 为 XHR 返回数据
            },
            clear : function () {

            }
        });
     */
    function Suggest(config) {
        var me = this;
        var i;

        me.config = {
            "NUM_TIMER_DELAY" : 300,
            "NUM_XHR_TIMEER" : 5000,
            "NUM_SUCCESS_CODE" : 200,
            "suggestion" : true
        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }

        //me.$triggerTarget = $(me.config.DOM_TRIGGER_TARGET); // 触发元素
        me.$clearBtn = $(me.config.DOM_CLEAR_BTN);
        me.$input = $(me.config.DOM_INPUT);
        me.$suggestPanel = $(me.config.DOM_SUGGEST_PANEL);
        me.beforeStartFun = me.config.beforeStart;
        me.startFun = me.config.start;
        me.clearFun = me.config.clear;
        me.showFun = me.config.show;

        if (me._verify()) {
            me._init();
        }
    }
    Suggest.prototype =  {
        construtor: Suggest,
        version: "0.5.7",
        lastKeyword: "",        // 为 300ms（检测时长） 前的关键词
        lastSendKeyword : "",   // 上一次符合搜索条件的关键词
        canSendRequest : true,  // 是否可以进行下次联想请求
        /** 验证参数是否合法 */
        _verify : function () {
            return true;
        },
        _init : function (e) {
            var me = this;
            me.$input.on("focus", function () {
                me.start();
            });
            me.$input.on("blur", function () {
                me.stop();
            });
            me.$clearBtn.on("click", function () {
                me.clear();
            });
            me.beforeStartFun && me.beforeStartFun(e);
        },
        /** 过滤输入内容 */
        _filter : function (originalKeyword) {
            return originalKeyword.replace(/\s+/g, "").replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
        },
        /** 初始化提示层容器 */
        _initSuggest : function () {
            var me = this;
            me.$suggestPanel.empty();
        },
        /** 请求数据 */
        _requestData : function (keyword) {
            var me = this;
            var api = me.config.API_URL;
            var XHR;
            //console.log("request -> " + "keyword: " + keyword, "lastSendKeyword: " + me.lastSendKeyword);
            if (SQ.core.isObject(XHR)) {
                XHR.abort();
            }
            XHR = $.ajax({
                type : "POST",
                url : api,
                dataType : "json",
                data : {"keyword": keyword},
                timeout : me.config.NUM_XHR_TIMEER,
                success : function (data) {
                    me.showSuggest(data);
                    me.lastSendKeyword = keyword;
                },
                error : function () {
                    me.canSendRequest = false;
                    setTimeout(function () {
                        me.canSendRequest = true;
                    }, 500);
                }
            });
        },
        _compare : function (keyword) {
            var me = this;
            var cLen = keyword.length;
            var lsLen = me.lastSendKeyword.length;
            //console.log("keyword: " + keyword, "lastSendKeyword: " + me.lastSendKeyword);

            if (me.lastKeyword === keyword) {
                // console.log("same " + "me.lastKeyword = " + me.lastKeyword + " | " + "keyword = " + keyword + " | " + "me.lastSendKeyword =" + me.lastSendKeyword);
                return false;
            }

            if (lsLen > 0 && cLen < lsLen) {
                me.canSendRequest = true;
            }

            if (!me.canSendRequest) {
                // canSendRequest 为能否发送请求的判断条件
                // 有几种情况会改变 canSendRequest 的值：
                // true 情况
                // 1、当前输入关键词少于上次发送请求关键词时，canSendRequest 为 true
                // 2、请求服务器成功返回并有联想结果时，canSendRequest 为 true
                // 3、调用 clear() 函数时，canSendRequest 为 true
                // 4、请求服务器失败，500ms 后 canSendRequest 为 true
                // false 情况
                // 1、请求服务器成功，但返回的 code 与 NUM_SUCCESS_CODE 不一致，canSendRequest 为 false
                // 2、请求服务器失败，canSendRequest 为 false
                return false;
            }
            if (me.lastSendKeyword === keyword) {
                //console.log("关键词相同")
                return false;
            }
            return true;
        },
        /** 启动计时器，开始监听用户输入 */
        start : function () {
            var me = this;
            me.inputListener = setInterval(function () {
                var originalKeyword = me.$input.val();
                var keyword = me._filter(originalKeyword);

                if (keyword.length > 0) {
                    if (me.$clearBtn.css("display") === "none") {
                        me.$clearBtn.show();
                    }
                    if (me._compare(keyword)) {
                        me._requestData(keyword);
                        me.startFun && me.startFun();
                    }
                    me.lastKeyword = keyword;
                } else {
                    me.clear();
                }
            }, me.config.NUM_TIMER_DELAY);
        },
        /** 停止计时器 */
        stop : function () {
            var me = this;
            clearInterval(me.inputListener);
        },
        /** 显示提示层 */
        showSuggest : function (data) {
            var me = this;
            var ds = typeof data === "object" ? data : JSON.parse(data);
            if (ds.code !== me.config.NUM_SUCCESS_CODE) {
                me.canSendRequest = false;
                return;
            }
            me.canSendRequest = true;
            me._initSuggest();
            me.showFun && me.showFun(ds);
        },
        /** 隐藏提示层 */
        hideSuggest : function () {
            var me = this;
            me.$suggestPanel.hide();
        },
        /** 清除输入内容 */
        clear : function () {
            var me = this;
            me.$input.val("");
            me.hideSuggest();
            me.$clearBtn.hide();
            me.canSendRequest = true;
            me.lastSendKeyword = "";
            me.clearFun && me.clearFun();
        }
    };
    SQ.Suggest = Suggest;
}($, window));
/**
 * @file Squirrel Tabs
 * @version 0.6.0
 */

/*global
 $: false,
 SQ: true,
 Zepto: true,
 toString: true
 */

/**
 * @changelog
 * 0.6.0  * 重写 Tabs 插件，使 Tabs 插件能够在同一页面多次实例化
 * 0.5.6  * 修改组件名称为 Tabs
 * 0.5.1  * 完成选项卡基本功能
 * 0.0.1  + 新建
 */

(function ($, window) {
    /**
     * @name Tabs
     * @classdesc 选项卡交互组件
     * @constructor
     * @param {object} config 组件配置（下面的参数为配置项，配置会写入属性）
     * @param {string} config.EVE_EVENT_TYPE                        触发事件，click 或 mouseover
     * @param {string} config.DOM_TRIGGER_TARGET                    被绑定事件的 Dom 元素
     * @param {string} config.DOM_TABS                              标签 Dom 元素
     * @param {string} config.DOM_PANELS                            面板 Dom 元素
     * @param {string} config.API_URL                               API 接口① 字符串形式
     * @param {array}  config.API_URL                               API 接口② 数组形式，数组中各项对应各个选项卡
     * @param {string} config.CSS_LOADING_TIP                       loading 提示样式
     * @param {string} config.TXT_LOADING_TIP                       loading 提示文字
     * @param {number} config.NUM_ACTIVE                            初始高亮选项卡序号，0 - n
     * @param {number} config.NUM_XHR_TIMEER                        XHR 超时时间
     * @param {boolean} config.CLEAR_PANEL                          切换选项卡时是否自动清理面板数据
     * @param {function} config.trigger($tabs, $panels, tabIndex)   触发选项卡切换回调函数
     * @param {function} config.show($tabs, $panels, tabIndex)      显示选项卡时回调函数
     * @param {function} config.beforeLoad($activePanels)           异步加载前回调函数，当设定了该回调函数时，必须返回
     *                                                              true 才能继续执行，异步加载事件，可中断异步加载事件。
     *                                                              参数：$activePanels 是当前激活的面板
     * @param {function} config.loaded(data, $activePanels)         异步加载成功回调函数，参数：data 是异步加载返回数据
     *                                                              参数：$activePanels 是当前激活的面板
     * @example var tabs = new SQ.Tabs({
            EVE_EVENT_TYPE : "mouseover",
            DOM_TRIGGER_TARGET : ".J_tabs",
            DOM_TABS : ".tabs>li",
            DOM_PANELS : ".panels",
            API_URL : ["../data/content1.json", "../data/content2.json", "../data/content3.json"],
            CSS_LOADING_TIP : "tab-loading-tip",
            NUM_ACTIVE : 0,
            trigger : function () {
            
            },
            show : function () {

            },
            beforeLoad : function () {

            },
            loaded : function (data) {

            }
        });
     */
    function Tabs(config) {
        var me = this;
        var i;

        me.config = {
            NUM_ACTIVE : 0,
            NUM_XHR_TIMEER : 5000,
            TXT_LOADING_TIP : "正在加载请稍后...",     // 正在加载提示
            CLEAR_PANEL : false
        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }

        me.$triggerTarget = $(me.config.DOM_TRIGGER_TARGET);        // 目标元素
        me.tabsLen = me.$triggerTarget.length;   
        me.triggerFun = me.config.trigger;
        me.showFun = me.config.show;
        me.beforeLoadFun = me.config.beforeLoad;
        me.loadFun = me.config.loaded;

        me.$triggerTarget.each(function () {
            var $tabMould = $(this);
            var $tabs = $tabMould.find(me.config.DOM_TABS);
            var $panels = $tabMould.find(me.config.DOM_PANELS);
            if (me._verify()) {
                me._init($tabMould, $tabs, $panels);
            }
        });
    }
    Tabs.prototype =  {
        construtor: Tabs,
        version: "0.6.0",
        needLoadContent : false,    // 选项卡内容是否需要异步加载

        // 验证参数是否合法
        _verify : function () {
            return true;
        },
        _init : function ($tabMould, $tabs, $panels) {
            var me = this;
            var i = 0;
            // 为选项卡添加序号
            $tabs.each(function () {
                $(this).attr("data-tabIndex", i);
                i++;
            });
            // 初始化高亮
            if (me.config.NUM_ACTIVE !== undefined) {
                me.show($tabs, $panels, me.config.NUM_ACTIVE);
            }
            // 判断是否需要生成异步加载提示语
            if (me.config.API_URL && (SQ.core.isString(me.config.API_URL) || SQ.core.isArray(me.config.API_URL))) {
                me.$loadingTip = $('<div class="dpl-tabs-loadingTip"></div>');
                if (me.config.CSS_LOADING_TIP) {
                    me.$loadingTip.addClass(me.config.CSS_LOADING_TIP);
                } else {
                    me.$loadingTip.css({
                        "height" : 60,
                        "text-align" : "center",
                        "line-height" : "60px"
                    });
                }
                me.$loadingTip.text(me.config.TXT_LOADING_TIP);
                me.needLoadContent = true;
            }
            // 绑定事件
            $tabs.on(me.config.EVE_EVENT_TYPE, function () {
                var $tab = $(this);
                me._trigger($tabMould, $tabs, $panels, $tab);
            });
        },
        /**
         * 触发事件方法，在满足绑定事件条件时或满足指定触发条件的情况下调用触发方法，
         * 该方法用于集中处理触发事件，判定是否需要加载数据或者更新 UI 显示。
         */
        _trigger : function ($tabMould, $tabs, $panels, $tab) {
            var me = this;
            var tabIndex = $tab.attr("data-tabIndex");
            var isCurrentActive = $tab.hasClass("active");

            if (isCurrentActive) {
                return;
            }

            me.show($tabs, $panels, tabIndex);
            me.triggerFun && me.triggerFun($tabs, $panels, tabIndex);
        },
        _cleanPanel : function ($activePanels) {
            $activePanels.empty();
        },
        // 显示目标选项卡，可以在外部调用该方法
        show : function ($tabs, $panels, tabIndex) {
            var me = this;
            var $activeTab = $tabs.eq(tabIndex);
            var $activePanels = $panels.eq(tabIndex);
            $tabs.removeClass("active");
            $panels.removeClass("active");
            $activeTab.addClass("active");
            $activePanels.addClass("active");
            
            me.showFun && me.showFun($tabs, $panels, tabIndex);

            if (me.config.API_URL) {
                me._load($activePanels, tabIndex);
            }
        },
        _load : function ($activePanels, tabIndex) {
            var me = this;
            var api = me.config.API_URL;
            var $currentLoadTip = $activePanels.find(".dpl-tabs-loadingTip");
            var hasLoadingTip = $currentLoadTip.length > 0 ? true : false;
            var hasLoaded = $activePanels.hasClass("hasLoaded");
            
            if (hasLoaded) {
                return;
            }
            // 如果设置了 beforeLoadFun 回调函数，则 beforeLoadFun 必须返回 true 才能继续向下执行，
            // 用于人为中断 _load 事件。
            if (me.beforeLoadFun) {
                if (!me.beforeLoadFun()) {
                    return;
                }
            }

            if (SQ.core.isArray(me.config.API_URL) && me.config.API_URL[tabIndex]) {
                api = me.config.API_URL[tabIndex];
            }
            if (me.xhr) {
                me.xhr.abort();
            }
            if (me.config.CLEAR_PANEL) {
                me._cleanPanel($activePanels);
            }
            if (hasLoadingTip) {
                $currentLoadTip.show();
            } else {
                $activePanels.append(me.$loadingTip);
                $currentLoadTip = $activePanels.find(".dpl-tabs-loadingTip");
                $currentLoadTip.show();
            }

            me.xhr = $.ajax({
                type : "POST",
                url : api,
                dataType : "json",
                timeout : me.config.NUM_XHR_TIMEER,
                success : function (data) {
                    $currentLoadTip.hide();
                    $activePanels.addClass("hasLoaded");    // 为已经加载过的面板添加 .hasLoaded 标记
                    me.loadFun && me.loadFun(data, $activePanels);
                },
                error : function () {
                    me._showReloadTips($activePanels, tabIndex);
                }
            });
        },
        _showReloadTips : function ($activePanels, tabIndex) {
            var me = this;
            var $tip = $activePanels.find(".dpl-tabs-loadingTip");
            $tip.show().empty();
            var reloadHTML = '<div class="reload">' +
                    '<p style="padding:5px 0;">抱歉，加载失败，请重试</p>' +
                    '<div class="sq-btn f-grey J_reload">重新加载</div>' +
                '</div>';
            $tip.append(reloadHTML);
            $activePanels.on("click", ".J_reload", function () {
                me._load($activePanels, tabIndex);
            });
        }
    };
    SQ.Tabs = Tabs;
}($, window));
/**
 * @file SQ.TouchSlip 触摸滑动组件
 * @data 2013.7.10
 * @version 1.0.0
 */

/*global
 $: false,
 SQ: true,
 Zepto: true
 */

(function (window, document) {
    _fun = {
        ios: function () { // 作用：判断是否为苹果的IOS设备
            var regularResult = navigator.userAgent.match(/.*OS\s([\d_]+)/),
                isiOS = !!regularResult;
            if (!this._versionValue && isiOS) {
                this._versionValue = regularResult[1].replace(/_/g, '.');
            }
            this.ios = function () {
                return isiOS;
            };
            return isiOS;
        },
        version: function () { // 作用：返回IOS的版本号
            return this._versionValue;
        },
        clone: function (object) { // 作用：用于原型继承
            function f() {}
            f.prototype = object;
            return new f();
        }
    };

    var slipjs = {
        _refreshCommon: function (wide_high, parent_wide_high) { // 作用：当尺寸改变时，需要重新取得相关的值
            var me = this;
            me.wide_high = wide_high || me.core[me.offset] - me.up_range;
            me.parent_wide_high      = parent_wide_high      || me.core.parentNode[me.offset];
            me._getCoreWidthSubtractShellWidth();
        },
        _initCommon: function (core, param) { // 作用：初始化
            var me = this;
            me.core = core;
            me.startFun    = param.startFun;
            me.moveFun     = param.moveFun;
            me.touchEndFun = param.touchEndFun;
            me.endFun      = param.endFun;
            me.DIRECTION   = param.DIRECTION;
            me.up_range    = param.up_range   || 0;
            me.down_range  = param.down_range  || 0;
            if (me.DIRECTION === 'x') {
                me.offset = 'offsetWidth';
                me._pos   = me.__posX;
            } else {
                me.offset = 'offsetHeight';
                me._pos   = me.__posY;
            }
            me.wide_high       = param.wide_high || me.core[me.offset] - me.up_range;
            me.parent_wide_high   = param.parent_wide_high || me.core.parentNode[me.offset];
            me._getCoreWidthSubtractShellWidth();

            me._bind("touchstart");
            me._bind("touchmove");
            me._bind("touchend");
            me._bind("webkitTransitionEnd");

            me.xy = 0;
            me.y = 0;
            me._pos(-me.up_range);
        },
        _getCoreWidthSubtractShellWidth: function () { // 作用：取得滑动对象和它父级元素的宽度或者高度的差
            var me = this;
            me.width_cut_coreWidth = me.parent_wide_high - me.wide_high;
            me.coreWidth_cut_width = me.wide_high - me.parent_wide_high;
        },
        handleEvent: function (e) { // 作用：简化addEventListener的事件绑定
            switch (e.type) {
            case "touchstart":
                this._start(e);
                break;
            case "touchmove":
                this._move(e);
                break;
            case "touchend":
            case "touchcancel":
                this._end(e);
                break;
            case "webkitTransitionEnd":
                this._transitionEnd(e);
                break;
            }
        },
        _bind: function (type, boole) { // 作用：事件绑定
            this.core.addEventListener(type, this, !!boole);
        },
        _unBind: function (type, boole) { // 作用：事件移除
            this.core.removeEventListener(type, this, !!boole);
        },
        __posX: function (x) { // 作用：当设置滑动的方向为“X”时用于设置滑动元素的坐标
            this.xy = x;
            this.core.style['webkitTransform'] = 'translate3d(' + x + 'px, 0px, 0px)';
            //this.core.style['webkitTransform'] = 'translate('+x+'px, 0px) scale(1) translateZ(0px)';
        },
        __posY: function (x) { // 作用：当设置滑动的方向为“Y”时用于设置滑动元素的坐标
            this.xy = x;
            this.core.style['webkitTransform'] = 'translate3d(0px, ' + x + 'px, 0px)';
            //this.core.style['webkitTransform'] = 'translate(0px, '+x+'px) scale(1) translateZ(0px)';
        },
        _posTime: function (x, time) { // 作用：缓慢移动
            this.core.style.webkitTransitionDuration = time + 'ms';
            this._pos(x);
        }
    };

    var SlipPage = _fun.clone(slipjs);
    //function SlipPage() {}
    //SQ.util.extend(SlipPage, slipjs);

    SlipPage._init = function (core, param) { // 作用：初始化
        var me           = this;
        me._initCommon(core, param);
        me.NUM_PAGES           = param.NUM_PAGES;
        me.page          = 0;
        me.AUTO_TIMER   = param.AUTO_TIMER;
        me.lastPageFun   = param.lastPageFun;
        me.firstPageFun  = param.firstPageFun;
        param.AUTO_TIMER && me._autoChange();
        param.no_follow ? (me._move = me._moveNoMove, me.next_time = 500) : me.next_time = 300;
    };
    SlipPage._start = function(e) { // 触摸开始
        var me = this,
            e = e.touches[0];
        me._abrupt_x     = 0;
        me._abrupt_x_abs = 0;
        me._start_x = me._start_x_clone = e.pageX;
        me._start_y = e.pageY;
        me._movestart = undefined;
        me.AUTO_TIMER && me._stop();
        me.startFun && me.startFun(e);
    };
    SlipPage._move = function(evt) { // 触摸中,跟随移动
        var me = this;
        me._moveShare(evt);
        if(!me._movestart){
            var e = evt.touches[0];
            evt.preventDefault();
            me.offset_x = (me.xy > 0 || me.xy < me.width_cut_coreWidth) ? me._dis_x/2 + me.xy : me._dis_x + me.xy;
            me._start_x  = e.pageX;
            if (me._abrupt_x_abs < 6) {
                me._abrupt_x += me._dis_x;
                me._abrupt_x_abs = Math.abs(me._abrupt_x);
                return;
            }
            me._pos(me.offset_x);
            me.moveFun && me.moveFun(e);
        }
    };
    SlipPage._moveNoMove = function(evt) { // 触摸中,不跟随移动，只记录必要的值
        var me = this;
        me._moveShare(evt);
        if(!me._movestart){
            evt.preventDefault();
            me.moveFun && me.moveFun(e);
        }
    };
    SlipPage._moveShare = function(evt) { // 不跟随移动和跟随移动的公共操作
        var me = this,
        e = evt.touches[0];
        me._dis_x = e.pageX - me._start_x;
        me._dis_y = e.pageY - me._start_y;	
        typeof me._movestart == "undefined" && (me._movestart = !!(me._movestart || Math.abs(me._dis_x) < Math.abs(me._dis_y)));
    };
    SlipPage._end = function(e) { // 触摸结束
        if (!this._movestart) {
            var me = this;
            me._end_x = e.changedTouches[0].pageX;
            me._range = me._end_x - me._start_x_clone;
            if(me._range > 35){
                me.page != 0 ? me.page -= 1 : (me.firstPageFun && me.firstPageFun(e));
            }else if(Math.abs(me._range) > 35){
                me.page != me.NUM_PAGES - 1 ? me.page += 1 : (me.lastPageFun && me.lastPageFun(e));
            }
            me.toPage(me.page, me.next_time);
            me.touchEndFun && me.touchEndFun(e);
        }
    };
    SlipPage._transitionEnd = function(e) { // 动画结束
        var me = this;
        e.stopPropagation();
        me.core.style.webkitTransitionDuration = '0';
        me._stop_ing && me._autoChange(), me._stop_ing = false;
        me.endFun && me.endFun();
    };
    SlipPage.toPage = function(num, time) { // 可在外部调用的函数，指定轮换到第几张，只要传入：“轮换到第几张”和“时间”两个参数。
        this._posTime(-this.parent_wide_high * num, time || 0);
        this.page = num;
    };
    SlipPage._stop = function() { // 作用：停止自动轮换
        clearInterval(this._autoChangeSet);
        this._stop_ing = true;
    };
    SlipPage._autoChange = function() { // 作用：自动轮换
        var me = this;
        me._autoChangeSet = setInterval(function() {
            me.page != me.NUM_PAGES - 1 ? me.page += 1 : me.page = 0;
            me.toPage(me.page, me.next_time);
        },me.AUTO_TIMER);
    };
    SlipPage.refresh = function(wide_high, parent_wide_high) { // 可在外部调用，作用：当尺寸改变时（如手机横竖屏时），需要重新取得相关的值。这时候就可以调用该函数
        this._refreshCommon(wide_high, parent_wide_high);
    };
            
    var SlipPx = _fun.clone(slipjs);
    //function SlipPx() {}
    //SQ.util.extend(SlipPx, slipjs);

    SlipPx._init = function(core,param) { // 作用：初始化
        var me  = this;
        me._initCommon(core,param);
        me.perfect     = param.perfect;
        me.SHOW_SCROLL_BAR = param.SHOW_SCROLL_BAR;
        if(me.DIRECTION == 'x'){
            me.page_x          = "pageX";
            me.page_y          = "pageY";
            me.width_or_height = "width";
            me._real           = me._realX;
            me._posBar         = me.__posBarX;
        }else{
            me.page_x          = "pageY";
            me.page_y          = "pageX";
            me.width_or_height = "height";
            me._real           = me._realY;
            me._posBar         = me.__posBarY;
        }
        if(me.perfect){
            me._transitionEnd = function(){};
            me._stop          = me._stopPerfect;
            me._slipBar       = me._slipBarPerfect;
            me._posTime       = me._posTimePerfect;
            me._bar_upRange   = me.up_range;
            me.no_bar         = false;
            me._slipBarTime   = function(){};
        }else{
            me.no_bar   = param.no_bar;
            me.core.style.webkitTransitionTimingFunction = "cubic-bezier(0.33, 0.66, 0.66, 1)";
        }
        if(me.SHOW_SCROLL_BAR){
            me._hideBar = function(){};
            me._showBar = function(){};
        }
        if(_fun.ios()){
            me.radius = 11;
        }else{
            me.radius = 0;
        }
        if(!me.no_bar){
            me._insertSlipBar(param);
            if(me.coreWidth_cut_width <= 0){
                me._bar_shell_opacity = 0;
                me._showBarStorage    = me._showBar;
                me._showBar           = function(){};	
            }
        }else{
            me._hideBar = function(){};
            me._showBar = function(){};
        }
    };
    SlipPx._start = function(e) { // 触摸开始
        var me = this,
            e = e.touches[0];
            me._animating = false;
        me._steps = [];
        me._abrupt_x     = 0;
        me._abrupt_x_abs = 0;
        me._start_x = me._start_x_clone = e[me.page_x];
        me._start_y = e[me.page_y];
        me._start_time = e.timeStamp || Date.now();
        me._movestart = undefined;
        !me.perfect && me._need_stop && me._stop();
        me.core.style.webkitTransitionDuration = '0';
        me.startFun && me.startFun(e);
    };
    SlipPx._move = function(evt) { // 触摸中
        var me = this,                   
            e = evt.touches[0],
            _e_page = e[me.page_x],
            _e_page_other = e[me.page_y],
            that_x = me.xy;
        me._dis_x = _e_page - me._start_x;
        me._dis_y = _e_page_other - me._start_y;
        (me.DIRECTION == 'x' && typeof me._movestart == "undefined") && (me._movestart = !!(me._movestart || (Math.abs(me._dis_x) < Math.abs(me._dis_y))));
        
        if(!me._movestart){
            evt.preventDefault();
            me._move_time = e.timeStamp || Date.now();
            me.offset_x = (that_x > 0 || that_x < me.width_cut_coreWidth - me.up_range) ? me._dis_x/2 + that_x : me._dis_x + that_x;    
            me._start_x = _e_page;
            me._start_y = _e_page_other;
            me._showBar();
            if (me._abrupt_x_abs < 6 ) {
                me._abrupt_x += me._dis_x;
                me._abrupt_x_abs = Math.abs(me._abrupt_x);
                return;
            }
            me._pos(me.offset_x);
            me.no_bar || me._slipBar();
            if (me._move_time - me._start_time > 300) {
                me._start_time    = me._move_time;
                me._start_x_clone = _e_page;
            }
            me.moveFun && me.moveFun(e);
        }
    };
    SlipPx._end = function(e) { // 触摸结束
        if (!this._movestart) {
            var me = this,
                e = e.changedTouches[0],
                duration = (e.timeStamp || Date.now()) - me._start_time,
                fast_dist_x = e[me.page_x] - me._start_x_clone;
            me._need_stop = true;
            if(duration < 300 && Math.abs(fast_dist_x) > 10) {
                if (me.xy > -me.up_range || me.xy < me.width_cut_coreWidth) {
                    me._rebound();
                }else{
                    var _momentum = me._momentum(fast_dist_x, duration, -me.xy - me.up_range, me.coreWidth_cut_width + (me.xy), me.parent_wide_high);
                    me._posTime(me.xy + _momentum.dist, _momentum.time);
                    me.no_bar || me._slipBarTime(_momentum.time);
                }
            }else{
                me._rebound();
            }
            me.touchEndFun && me.touchEndFun(e);
        }
    };
    SlipPx._transitionEnd = function(e) { // 滑动结束
        var me = this;
        if (e.target != me.core) return;
        me._rebound();
        me._need_stop = false;
    };
    SlipPx._rebound = function(time) { // 作用：滑动对象超出时复位
        var me = this,
            _reset = (me.coreWidth_cut_width <= 0) ? 0 : (me.xy >= -me.up_range ? -me.up_range : me.xy <= me.width_cut_coreWidth - me.up_range ? me.width_cut_coreWidth - me.up_range : me.xy);
        if (_reset == me.xy) {
            me.endFun && me.endFun();
            me._hideBar();
            return;
        }
        me._posTime(_reset, time || 400);
        me.no_bar || me._slipBarTime(time);
    };
    SlipPx._insertSlipBar = function(param) { // 插入滚动条
        var me = this;
        me._bar       = document.createElement('div');
        me._bar_shell = document.createElement('div');
        if(me.DIRECTION == 'x'){
            var _bar_css = 'height: 5px; position: absolute;z-index: 10; pointer-events: none;';
            var _bar_shell_css      = 'opacity: '+me._bar_shell_opacity+'; left:2px; bottom: 2px; right: 2px; height: 5px; position: absolute; z-index: 10; pointer-events: none;';
        }else{
            var _bar_css = 'width: 5px; position: absolute;z-index: 10; pointer-events: none;';
            var _bar_shell_css      = 'opacity: '+me._bar_shell_opacity+'; top:2px; bottom: 2px; right: 2px; width: 5px; position: absolute; z-index: 10; pointer-events: none; ';
        }
        var _default_bar_css = ' background-color: rgba(0, 0, 0, 0.5); border-radius: '+me.radius+'px; -webkit-transition: cubic-bezier(0.33, 0.66, 0.66, 1);' ;
        var _bar_css = _bar_css + _default_bar_css + param.bar_css;
        
        me._bar.style.cssText       = _bar_css;
        me._bar_shell.style.cssText = _bar_shell_css
        me._countAboutBar();
        me._countBarSize();
        me._setBarSize();
        me._countWidthCutBarSize();
        me._bar_shell.appendChild(me._bar);
        me.core.parentNode.appendChild(me._bar_shell);
        setTimeout(function(){me._hideBar();}, 500);
    };
    SlipPx._posBar = function(pos) {};
    SlipPx.__posBarX = function(pos) { // 作用：当设置滑动的方向为“X”时用于设置滚动条的坐标 
        var me = this;
        me._bar.style['webkitTransform'] = 'translate3d('+pos+'px, 0px, 0px)';
        //me._bar.style['webkitTransform'] = 'translate('+pos+'px, 0px)  translateZ(0px)';
    };
    SlipPx.__posBarY = function(pos) { // 作用：当设置滑动的方向为“Y”时用于设置滚动条的坐标 
        var me = this;
        //me._bar.style['webkitTransform'] = 'translate(0px, '+pos+'px)  translateZ(0px)';
        me._bar.style['webkitTransform'] = 'translate3d(0px, '+pos+'px, 0px)';
    };
    SlipPx._slipBar = function() { // 流畅模式下滚动条的滑动
        var me = this;
        var pos = me._about_bar * (me.xy + me.up_range);
        if (pos <= 0) {
            pos = 0;
        }else if(pos >= me._width_cut_barSize){
            pos = Math.round(me._width_cut_barSize);
        } 
        me._posBar(pos);
        me._showBar();
    };
    SlipPx._slipBarPerfect = function() { // 完美模式下滚动条的滑动
        var me = this;
        var pos = me._about_bar * (me.xy + me._bar_upRange);
        me._bar.style[me.width_or_height] = me._bar_size + 'px';
        if (pos < 0) {
            var size = me._bar_size + pos * 3;
            me._bar.style[me.width_or_height] = Math.round(Math.max(size, 5)) + 'px';
            pos = 0;
        }else if(pos >= me._width_cut_barSize){
            var size = me._bar_size - (pos - me._width_cut_barSize) * 3;
            if(size < 5) {size = 5;}
            me._bar.style[me.width_or_height] = Math.round(size) + 'px';
            pos = Math.round(me._width_cut_barSize + me._bar_size - size);
        }
        me._posBar(pos);
    };
    SlipPx._slipBarTime = function(time) { // 作用：指定时间滑动滚动条
        this._bar.style.webkitTransitionDuration = ''+time+'ms';
        this._slipBar();
    };
    SlipPx._stop = function() { // 流畅模式下的动画停止
        var me = this,
            _real_x = me._real();
        me._pos(_real_x);
        if(!me.no_bar){
            me._bar.style.webkitTransitionDuration = '0';
            me._posBar(me._about_bar * _real_x);
        }	
    };
    SlipPx._stopPerfect = function() { // 完美模式下的动画停止
        clearTimeout(this._aniTime);
        this._animating = false;
    };
    SlipPx._realX = function() { // 作用：取得滑动X坐标
        var _real_xy = getComputedStyle(this.core, null)['webkitTransform'].replace(/[^0-9-.,]/g, '').split(',');
        return _real_xy[4] * 1;
    };
    SlipPx._realY = function() { // 作用：取得滑动Y坐标
        var _real_xy = getComputedStyle(this.core, null)['webkitTransform'].replace(/[^0-9-.,]/g, '').split(',');
        return _real_xy[5] * 1;
    };
    SlipPx._countBarSize = function() { // 作用：根据比例计算滚动条的高度
        this._bar_size = Math.round(Math.max(this.parent_wide_high * this.parent_wide_high / this.wide_high, 5));
    };
    SlipPx._setBarSize = function() { // 作用：设置滚动条的高度
        this._bar.style[this.width_or_height] = this._bar_size + 'px';
    };
    SlipPx._countAboutBar = function() { // 作用：计算一个关于滚动条的的数值
        this._about_bar = ((this.parent_wide_high-4) - (this.parent_wide_high-4) * this.parent_wide_high / this.wide_high)/this.width_cut_coreWidth;
    };
    SlipPx._countWidthCutBarSize = function() { // 作用：计算一个关于滚动条的的数值
        this._width_cut_barSize = (this.parent_wide_high-4) - this._bar_size;
    };
    SlipPx.refresh = function(wide_high, parent_wide_high) {// 可在外部调用，作用：当尺寸改变时（如手机横竖屏时），需要重新取得相关的值。这时候就可以调用该函数
        var me = this;
        me._refreshCommon(wide_high, parent_wide_high);
        if(!me.no_bar){
            if(me.coreWidth_cut_width <= 0) {
                me._bar_shell_opacity   = 0;
                me._showBar       = function(){};	
            }else{
                me._showBar = me._showBarStorage || me._showBar;
                me._countAboutBar();
                me._countBarSize();
                me._setBarSize();
                me._countWidthCutBarSize();
            }
        }
        me._rebound(0);
    };
    SlipPx._posTimePerfect = function (x, time) { // 作用：完美模式下的改变坐标函数
        var me = this,
            step = x,
            i, l;
        me._steps.push({ x: x, time: time || 0 });
        me._startAni();
    };
    SlipPx._startAni = function () {// 作用：完美模式下的改变坐标函数
        var me = this,
            startX = me.xy,
            startTime = Date.now(),
            step, easeOut,
            animate;
        if (me._animating) return;
        if (!me._steps.length) {
            me._rebound();	
            return;
        }
        step = me._steps.shift();
        if (step.x == startX) step.time = 0;
        me._animating = true;
        animate = function () {
            var now = Date.now(),
                newX;
            if (now >= startTime + step.time) {
                me._pos(step.x);
                me._animating = false;
                me._startAni();
                return;
            }
            now = (now - startTime) / step.time - 1;
            easeOut = Math.sqrt(1 - now * now);
            newX = (step.x - startX) * easeOut + startX;
            me._pos(newX);
            if (me._animating) {
                me._slipBar();
                me._aniTime = setTimeout(animate, 1);
            }
        };
        animate();
    };
    SlipPx._momentum = function (dist, time, maxDistUpper, maxDistLower, size) { // 作用：计算惯性
        var deceleration = 0.001,
            speed = Math.abs(dist) / time,
            newDist = (speed * speed) / (2 * deceleration),
            newTime = 0, outsideDist = 0;
        if (dist > 0 && newDist > maxDistUpper) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistUpper = maxDistUpper + outsideDist;
            speed = speed * maxDistUpper / newDist;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistLower = maxDistLower + outsideDist;
            speed = speed * maxDistLower / newDist;
            newDist = maxDistLower;
        }
        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;
        return { dist: newDist, time: newTime };
    };
    SlipPx._showBar = function() {// 作用：显示滚动条
        var me = this;
        me._bar_shell.style.webkitTransitionDelay = "0ms";
        me._bar_shell.style.webkitTransitionDuration = '0ms';
        me._bar_shell.style.opacity = "1";
    };
    SlipPx._hideBar = function() {// 作用：隐藏滚动条
        var me = this;
        me._bar_shell.style.opacity = "0";
        me._bar_shell.style.webkitTransitionDelay  = "300ms";
        me._bar_shell.style.webkitTransitionDuration = '300ms';
    };

    function TouchSlip(config) {
        var me = this;
        var i;

        me.config = {

        };

        for (i in config) {
            if (config.hasOwnProperty(i)) {
                me.config[i] = config[i];
            }
        }

        me.triggerTarget = $(me.config.DOM_TRIGGER_TARGET)[0];

        if (_fun.ios() && (parseInt(_fun.version()) >= 5 && config.DIRECTION === 'x') && config.wit) {
            me.triggerTarget.parentNode.style.cssText += "overflow:scroll; -webkit-overflow-scrolling:touch;";
            return;
        }
        
        switch (me.config.MODE) {
        case "page":
            config.DIRECTION = "x";
            if (!this.SlipPage) {
                this.SlipPage = true;
                SlipPage._init(me.triggerTarget, config);
                return SlipPage;
            } else {
                var page = _fun.clone(SlipPage);
                page._init(me.triggerTarget, config);
                return page;
            }
            break;
        case "px":
            if (!this.SlipPx) {
                this.SlipPx = true;
                SlipPx._init(me.triggerTarget, config);
                return SlipPx;
            } else {
                var Px = _fun.clone(SlipPx);
                Px._init(me.triggerTarget, config);
                return Px;
            }
            break;
        }
        
    }
    SQ.TouchSlip = TouchSlip;	
})(window, document);