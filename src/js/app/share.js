define(['jquery'], ($) => {
    const share = ({title, desc, imgUrl}) => {
        // const host = 'http://test.tron-m.com/webcase/';

        $.ajax({
            type: 'post',
            url: 'http://www.tron-m.com/tron-api/jssdk/share.do',
            data: { url: window.location.href, m: 'getWxConfig' },
            dataType: 'json',
            success: args => {
                args = args.result;

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: args.appId, // 必填，公众号的唯一标识
                    timestamp: args.timestamp, // 必填，生成签名的时间戳
                    nonceStr: args.nonceStr, // 必填，生成签名的随机串
                    signature: args.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function() {
                    const url = document.location.href;

                    wx.onMenuShareTimeline({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQQ({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareWeibo({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQZone({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function success() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function cancel() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });

                wx.error(res => console.log('wx has error:' + res));
            }
        });
    };

    return share;
});
