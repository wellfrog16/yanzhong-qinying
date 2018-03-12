define([
    'jquery',
    'text!../views/music.html!strip',
    'jquery.hammer'],
($, htmlMusic) => {
    return (autoplay) => {
        $('body').append(htmlMusic);

        // 记录目前是否正在播放，全局
        window.flagPlay = autoplay;

        const el = $('.sys-music .toggle');
        const audio = $('#h5-bg');

        // 根据是否自动播放设置样式
        if (autoplay) {
            el.removeClass('pause').addClass('play');
        } else {
            el.removeClass('play').addClass('pause');
        }

        el.hammer().on('tap', () => {
            if (window.flagPlay) {
                pause();
            } else { play(); }
        });

        function play() {
            window.flagPlay = true;
            el.removeClass('pause').addClass('play');
            audio[0].play();
        }

        function pause() {
            window.flagPlay = false;
            el.removeClass('play').addClass('pause');
            audio[0].pause();
        }

        return audio;
    };
});
