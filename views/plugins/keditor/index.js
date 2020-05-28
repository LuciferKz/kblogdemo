
    var activeBtn = {};
    var activeSection = {};
    var richtextbox = {};

    var startContainer = null, endContainer = null, startOffset = 0, endOffset = 0;

    var getRange = function () {
        var selection = window.getSelection();
        if (selection.rangeCount) {
            return selection.getRangeAt(0);
        }
        return null;
    }

    var checkHasBlock = function (html) {
        var hasBlock = false
        return _.find(['h1', 'h2', 'h3', 'article', 'div'], function (name) {
            if (html.indexOf(name) > -1) {
                hasBlock = true
                return true
            }
            return false
        })
    }

    var intro = DataItem.productData.intro;

    var initDetails = function () {
        if (intro != '') {
            _.each(intro.split('\r'), function (html) {
                richtextbox.details.push({
                    html: html,
                    focus: false,
                    btn: { active: false },
                    file: null,
                })
            })
        }
    }

    var beforeHighlight = function () {
        reset();
        var range = getRange()
        if (!range) return
        highlightTool(range.endContainer);
    }

    richtextbox.toolbars = {
        align: {
            left: { cls: 'i-al', command: 'justifyLeft' },
            center: { cls: 'i-ac', command: 'justifyCenter' },
            right: { cls: 'i-ar', command: 'justifyRight' },
        },
        font: {
            bold: { cls: 'i-bold', command: 'bold' },
            italic: { cls: 'i-italic', command: 'italic' }
        },
        comStyle: {
            text: '正文',
            type: 'select',
            options: {
                H1: { cls: 'i-title1', text: '标题1', command: 'formatBlock', },
                H2: { cls: 'i-title2', text: '标题2', command: 'formatBlock' },
                H3: { cls: 'i-title3', text: '标题3', command: 'formatBlock' },
                ARTICLE: { cls: 'i-article', text: '正文', command: 'formatBlock' }
            }
        }
    }

    richtextbox.imgTools = {
        size: [
            { name: '大', cls: 'i-lg-img', command: 'lg' },
            { name: '中', cls: 'i-mid-img', command: 'mid' },
            { name: '小', cls: 'i-sm-img', command: 'sm' },
        ],
        file: [
            { name: '替换', cls: 'i-replace', command: 'replace' },
            { name: '删除', cls: 'i-del', command: 'delete' },
        ]
    }

    richtextbox.details = []

    initDetails()

    richtextbox.topBtn = { active: false }

    // 显示富文本块添加按钮
    richtextbox.showBtns = function ($event, btn, detail) {
        if ($event.clientY < 250) {
            btn.location = 'below'
        } else {
            btn.location = 'above'
        }
        if (activeBtn) activeBtn.active = false
        btn.active = !btn.active
        activeBtn = btn
    }
    // 添加富文本编辑块
    richtextbox.addSection = function (type, idx, btn) {
        activeBtn.active = false
        richtextbox.details.splice(idx + 1, 0, {
            html: '',
            focus: true,
            btn: { active: false },
            file: '',
        })
    }
    // 富文本块获得焦点
    richtextbox.focusSection = function (detail) {
        activeSection = detail
        var range = getRange()
        if (!range) return
        highlightTool(range.endContainer);

        if (!startContainer) return
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);

        startContainer = null, endContainer = null, startOffset = 0, endOffset = 0;
    }
    // 富文本块失去焦点，重置工具栏高亮
    richtextbox.blurSection = function (detail) {
        reset()
    }
    // 富文本快监听到鼠标按下，监测是图片块还是文本块
    richtextbox.selectSection = function ($event, detail) {
        var target = $event.target
        if (target.nodeName == 'IMG') {
            var offsetTop = getParentByClass(target, 'detail-section').offsetTop,
            maxClientTop = offsetTop - (696 - target.offsetHeight), // 最大图片可视scrollTop
            minClientTop = offsetTop - 50, // 最小图片可视scrollTop
            domRichtextContent = document.getElementById('richtext-content'),
            currentScrollTop = domRichtextContent.scrollTop;

            if (currentScrollTop < maxClientTop) {
                domRichtextContent.scrollTop = maxClientTop
            } else if (currentScrollTop > minClientTop) {
                domRichtextContent.scrollTop = minClientTop
            }
        }
        activeSection.showImgControl = false
        detail.showImgControl = true
        activeSection = detail
    }
    // 富文本快监听到鼠标松开
    richtextbox.checkSection = function ($event, detail) {
        if ($event.target.nodeName == 'IMG') {
            detail.showImgControl = true
            detail.file = $event.target.src
        } else {
            beforeHighlight()
        }
    }
    // 富文本框内按键移动光标时监测工具栏高亮
    richtextbox.checkSelection = function () {
        beforeHighlight()
    }
    // 执行文本编辑命令
    richtextbox.execu = function (command, key, attr) {
        if (!activeSection.html) return null
        if (key == 'comStyle') {
            richtextbox.toolbars.comStyle.text = richtextbox.toolbars.comStyle.options[attr].text
        }
        activeSection.focus = true
        activeSection = {}
        document.execCommand(command, false, attr)
    }
    // 执行图片编辑命令
    richtextbox.editImg = function (command, detail, idx) {
        if (command == 'lg') {
            detail.html = '<div><img alt="" src="' + detail.file + '" width="100%"/></div>'
            detail.size = '100%'
        } else if (command == 'mid') {
            detail.html = '<div style="text-align: center"><img alt="" src="' + detail.file + '" width="50%"/></div>'
            detail.size = '50%'
        } else if (command == 'sm') {
            detail.html = '<div style="text-align: center"><img alt="" src="' + detail.file + '" width="25%"/></div>'
            detail.size = '25%'
        } else if (command == 'replace') {
            $scope.uploadImage(detail)
        } else if (command == 'delete') {
            $scope.details.splice(idx, 1)
        }

        detail.showImgControl = false
    }
    // 保存修改结果
    richtextbox.saveDetail = function () {
        var details = [];
        _.each(richtextbox.details, function (d) {
            console.log(d)
            if (d.html != '') {
                if (checkHasBlock(d.html)) {
                    details.push(d.html)
                } else {
                    details.push('<div>' + d.html + '</div>')
                }
            }
        })
        $uibModalInstance.close(details.join('\r'));
    }
    // 工具栏鼠标按下的同时获取当前页面光标选中内容
    richtextbox.getRange = function () {
        var range = getRange();
        if (range) {
            startContainer = range.startContainer;
            endContainer = range.endContainer;
            startOffset = range.startOffset;
            endOffset = range.endOffset;
        }
    }
    // 有select属性的选项的工具
    richtextbox.selectTool = function (tools) {
        tools.show = !tools.show
        activeSection.focus = true
    }
    $scope.modelfile = null;
    // 上传图片操作
    richtextbox.uploadImage = function (detail) {
        if (detail.file) {
            uploadFile.upload(detail.file, 'sh-i/product-detail', function (picUrl) {
                console.log(picUrl)
                detail.html = '<div style="margin: 15px 0;"><img src="'+ picUrl +'" width="100%" /></div>'
            });
        }
    }

    richtextbox.topBtn = {};

    angular.extend($scope, richtextbox);

    var reset = function () {
        _.each(richtextbox.toolbars, function (tools, key) {
            if (key == 'comStyle') {
                tools.text = '正文'
            }
            _.each(tools, function (tool) {
                if (typeof tool == 'object') {
                    tool.active = false
                }
            })
        })
    }

    var getParentByNodeName = function (elm, nodeName) {
        var parentNode = elm.parentNode
        if (!parentNode) return null
        if (typeof nodeName == 'string' && parentNode.nodeName == nodeName) {
            return parentNode
        } else if (nodeName instanceof Array && ~nodeName.indexOf(parentNode.nodeName)) {
            return parentNode
        } else if (parentNode.nodeName == 'DIV') {
            return null
        } else {
            return getParentByNodeName(parentNode, nodeName)
        }
    }

    var getParentByClass = function (elm, cls) {
        if (elm.parentNode && elm.parentNode.classList.contains(cls)) {
            return elm.parentNode
        } else if (elm.parentNode.nodeName == 'BODY') {
            return null
        } else {
            return getParentByClass(elm.parentNode, cls)
        }
    }

    var highlightAlign = function (elm) {
        if (!elm) return null
        var textAlign = elm.style['textAlign']
        if (textAlign != '') {
            richtextbox.toolbars.align[textAlign].active = true
        }
    }
    // 高亮工具栏
    var highlightTool = function (elm) {
        if (getParentByNodeName(elm, 'B')) {
            richtextbox.toolbars.font.bold.active = true
        }
        if (getParentByNodeName(elm, 'I')) {
            richtextbox.toolbars.font.italic.active = true
        }

        var sectionNode = null;

        if (~['H1', 'H2', 'H3', 'ARTICLE', 'DIV'].indexOf(elm.nodeName)) {
            sectionNode = elm
        } else {
            sectionNode = getParentByNodeName(elm, ['H1', 'H2', 'H3', 'ARTICLE', 'DIV'])
        }

        if (sectionNode) {
            if (~['H1', 'H2', 'H3', 'ARTICLE'].indexOf(sectionNode.nodeName)) {
                richtextbox.toolbars.comStyle.text = richtextbox.toolbars.comStyle.options[sectionNode.nodeName].text;
            }

            highlightAlign(sectionNode)
        }
    }

    document.onmousedown = function (event) {
        $scope.toolbars.comStyle.show = false;

        if (activeBtn.active && !getParentByClass(event.target, 'richtext-add')) {
            activeBtn.active = false
        }
        if (activeSection.showImgControl && !getParentByClass(event.target, 'richtext-img-control')) {
            activeSection.showImgControl = false
        }
        $scope.$apply()
    }