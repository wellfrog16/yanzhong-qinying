define([
    'jquery',
    'text!../views/video.html!strip',
    'jquery.hammer'],
($, htmlVideo) => {
    return (button, callback) => {
        $('body').append(htmlVideo);

        // 视频绑定
        var video = $('.sys-video video');
        button.hammer().on('tap', () => {
            $('.sys-video').show();
            $('audio')[0].pause();
            $('.block').css('z-index', '-1');

            video.attr('src', 'http://cdn.tron-m.com/yanzhong/qinying/index-high.mp4');
            video[0].play();
        });

        video.on('timeupdate', () => {
            // 视频结束前1秒执行
            if (video[0].duration > 0 && video[0].currentTime > video[0].duration - 1) {
                video[0].pause();
                $('audio')[0].play();
                $('.sys-music .toggle').removeClass('pause').addClass('play');
                callback();
            }
        });

        video.on('pause', () => {
            $('.sys-video').hide();
            $('.block').css('z-index', '9999');
            video[0].pause();
            $('audio')[0].play();
            callback();
        });
    };
});
