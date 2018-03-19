// 加载

define([
    'jquery',
    'createjs',
    'utils/utils',
    'utils/frameplayer',
    'text!../views/loading.html!strip',
    'jquery.browser'],
($, createjs, utils, frameplayer, htmlLoading) => {
    return (callback) => {
        // 如果小于ie9，则取消loading（createjs不支持）;
        if ($.browser.msie && $.browser.version < 9) {
            return callback();
        }

        // img标签方式加载图片
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。
        loader.maintainScriptOrder = true;

        var source = [
            { 'src': 'main/landscape.png' },
            { 'src': 'loading/bg.jpg' },
            { 'src': 'loading/bg.png' },
            { 'src': 'loading/middle.png' },
            { 'src': 'loading/text.png' }
        ];

        loader.on('complete', onComplete);
        loader.loadManifest(source, true, 'assets/img/');

        function onComplete() {
            $('body').append(htmlLoading);
            mainload();
        }

        function mainload() {
            var loader = new createjs.LoadQueue(false);

            // 关键！----设置并发数
            loader.setMaxConnections(5);
            // 关键！---一定要将其设置为 true, 否则不起作用。
            loader.maintainScriptOrder = true;

            var source = [
                { 'src': 'h5/bg.jpg' },
                { 'src': 'h5/btn-buy.png' },
                { 'src': 'h5/btn-follow.png' },
                { 'src': 'h5/copy-finish.png' },
                { 'src': 'h5/copy.png' },
                { 'src': 'h5/flower.png' },
                { 'src': 'h5/gou.png' },
                { 'src': 'h5/KV-product.png' },
                { 'src': 'h5/KV-slogan.png' },
                { 'src': 'h5/photo.png' },
                { 'src': 'h5/product-group.png' },
                { 'src': 'h5/product.png' },
                { 'src': 'h5/qiang.png' },
                { 'src': 'h5/qr.png' },
                { 'src': 'h5/text-1.png' },
                { 'src': 'h5/text-2.png' },
                { 'src': 'h5/text-3.png' },
                { 'src': 'h5/xian.png' },

                { 'src': 'icon/icon_petal_1.png' },
                { 'src': 'icon/icon_petal_2.png' },
                { 'src': 'icon/icon_petal_3.png' },
                { 'src': 'icon/icon_petal_4.png' },
                { 'src': 'icon/icon_petal_5.png' },
                { 'src': 'icon/icon_petal_6.png' },
                { 'src': 'icon/icon_petal_7.png' },
                { 'src': 'icon/icon_petal_8.png' }
            ];

            loader.on('progress', onProgress);
            loader.on('complete', onComplete);
            loader.loadManifest(source, true, 'assets/img/');

            function onComplete() {
                $('.loading').fadeOut();
                utils.tryFun(callback);

                // console.log('资源加载完成');
            }

            function onProgress() {
                // console.log(loader.progress);
                $('.loading span').text((loader.progress * 100 | 0) + ' %');
                $('.loading .progress').css('width', (loader.progress * 100 | 0) + '%');
            }
        }
    };
});
