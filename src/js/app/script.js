// 剧本

define([
    'jquery',
    'utils/utils',
    '@/loader',
    'scrollreveal',
    'text!../../views/block.html!strip',
    'text!../../views/index.html!strip',
    'jquery.transit',
    'jquery.hammer'
],
($, utils, loader, scrollreveal, htmlBlock, htmlIndex) => {
    return () => {
        // 加载jquery插件
        utils.jqueryPlugins();
        utils.fixRem();
        // 如果是手机端，加载横屏提示
        if (!utils.isPC) { $('body').append(htmlBlock); }

        loader(() => {
            $('body').append(htmlIndex);

            // 临时逐帧动画
            let i = 0;
            setInterval(() => {
                let name = i * 4;
                let x = '';

                for (let j = 0; j < 5 - (name + '').length; j++) {
                    x += '0';
                }

                name = x + name;
                i++;

                if (i > 22) { i = 0; }

                $('.kv-animation').css('background-image', 'url("./assets/img/frame/kv_' + name + '.png")');
            }, 1000 / 6);

            // l
            const sr = scrollreveal({
                distance: '0px',
                duration: 1100,
                scale: 1
            });
            sr.reveal('.wrapper>div', { delay: 500 }, 1000);
            // sr.reveal('.kv-product', { delay: 500 });
            // sr.reveal('.kv-slogan', { delay: 1500 });
            // sr.reveal('.photo', { delay: 2500 });
            // sr.reveal('.text1', { delay: 3500 });
            // sr.reveal('.button-follow', { delay: 4500 });
            // sr.reveal('.button-buy', { delay: 4500 });
            // sr.reveal('.text2', { delay: 500 });
            // sr.reveal('.product', { delay: 500 });
            // sr.reveal('.product-group', { delay: 500 });
            // sr.reveal('.text3', { delay: 500 });

            // 点击关注事件
            $('.button-follow').hammer().on('tap', () => {
                $('.mask, .tools, .qr').show();
            });

            // 点击购买
            $('.button-buy').hammer().on('tap', () => {
                $('.mask, .tools, .copy').show();
            });

            // 复制成功
            $('.copy').hammer().on('tap', () => {
                $('.copy').hide();
                $('.copy-finish').show();
            });

            $('.mask').hammer().on('tap', () => {
                $('.mask, .tools, .qr, .copy, .copy-finish').hide();
            });

            // 飘落花瓣
            var snowflakeURl = [
                './assets/img/icon/icon_petal_1.png',
                './assets/img/icon/icon_petal_2.png',
                './assets/img/icon/icon_petal_3.png',
                './assets/img/icon/icon_petal_4.png',
                './assets/img/icon/icon_petal_5.png',
                './assets/img/icon/icon_petal_6.png',
                './assets/img/icon/icon_petal_7.png',
                './assets/img/icon/icon_petal_8.png'
            ];
            var container = $('.contaniner');
            var visualWidth = container.width();
            var visualHeight = container.height();
            // 获取content的宽高
            function snowflake() {
                // 雪花容器
                var $flakeContainer = $('#snowflake');
                // 随机六张图
                function getImagesName() {
                    return snowflakeURl[[Math.floor(Math.random() * 8)]];
                }
                // 创建一个雪花元素
                function createSnowBox() {
                    var url = getImagesName();
                    return $('<div class="snowbox" />').css({
                        'width': 25,
                        'height': 26,
                        'position': 'absolute',
                        'backgroundRepeat': 'no-repeat',
                        'zIndex': 100000,
                        'top': '-41px',
                        'backgroundImage': 'url(' + url + ')'
                    }).addClass('snowRoll');
                }
                // 开始飘花
                setInterval(function() {
                    // 运动的轨迹
                    var startPositionLeft = Math.random() * visualWidth - 100;
                    var startOpacity = 1;
                    var endPositionTop = visualHeight - 40;
                    var endPositionLeft = startPositionLeft - 100 + Math.random() * 500;
                    var duration = visualHeight * 10 + Math.random() * 5000;
                    // 随机透明度，不小于0.5
                    var randomStart = Math.random();
                    randomStart = randomStart < 0.5 ? startOpacity : randomStart;
                    // 创建一个雪花
                    var $flake = createSnowBox();
                    // 设计起点位置
                    $flake.css({
                        left: startPositionLeft,
                        opacity: randomStart
                    });
                    // 加入到容器
                    $flakeContainer.append($flake);
                    // 开始执行动画
                    $flake.transition({
                        top: endPositionTop,
                        left: endPositionLeft,
                        opacity: 0.7
                    }, duration, 'ease-out', function() {
                        $(this).remove(); // 结束后删除
                    });
                }, 500);
            }
            snowflake();
        });
    };
});
