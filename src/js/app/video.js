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

            var vid = ['2EC1EE594D2A5F8E9C33DC5901307461', '5DE2D95ADDDA73A49C33DC5901307461'];
            $.get('https://www.canon.com.cn/video/invoking/m/getMobile?vid=' + vid[0], (json) => {
                // 设置视频地址
                video.attr('src', json.value[0].copy);
                video[0].play();
            }, 'jsonp');
        });

        video.on('timeupdate', () => {
            // 视频结束前1秒执行
            if (video[0].duration > 0 && video[0].currentTime > video[0].duration - 1) {
                video[0].pause();
                $('audio')[0].play();
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
