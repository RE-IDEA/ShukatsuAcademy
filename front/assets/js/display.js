document.addEventListener('DOMContentLoaded', function () {
    var elements = document.querySelectorAll('.wow'); // .wowクラスを持つ要素を選択

    elements.forEach(function (element) {
        element.addEventListener('animationend', function () {
            element.style.visibility = 'visible';
            element.style.opacity = '1'; // アニメーション終了後に要素を表示
        });
    });
});
