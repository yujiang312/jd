class Slider {
    constructor(id) {
        this.box = document.querySelector(id);
        this.picBox = this.box.querySelector('ul');
        this.indexBox = this.box.querySelector('.index-box');

        // 当前索引，用于后序关联小圆点
        this.index = 1;

        // 容器的宽度即是一张图片的宽度
        this.sliderWidth = this.box.clientWidth;

        // 轮播图数量
        this.sliders = this.picBox.children.length;

        // 状态位：是否处于动画当中
        this.animated = false;

        this.auto = null;
        this.init();
    }

    init() {
        this.initPoint();
        this.copyPic();
        this.leftRight();
        this.play();
    }

    // 动态生成小圆点并设置样式
    initPoint() {
        const num = this.picBox.children.length;
        let frg = document.createDocumentFragment();
        for (let i = 0; i < num; i++) {
            let li = document.createElement('li');
            li.setAttribute('data-index', i + 1);
            if (i === 0) li.className = 'active';
            frg.appendChild(li);
        }
        this.indexBox.children[0].style.width = num * 10 * 2 + 'px';
        this.indexBox.children[0].appendChild(frg);

        this.indexBox.children[0].addEventListener('click', (e) => {

            // 当前点击的索引值,从1开始算起
            let pointIndex = e.target.getAttribute('data-index');
            console.log('pointIndex', pointIndex + ',this.index:' + this.index)

            let offset = (pointIndex - this.index) * this.sliderWidth;
            this.index = pointIndex;
            this.move(offset);
        })
    }

    // 轮播图流畅的小tip
    copyPic() {
        let first = this.picBox.firstElementChild.cloneNode(true);
        let last = this.picBox.lastElementChild.cloneNode(true);

        this.picBox.appendChild(first);
        this.picBox.insertBefore(last, this.picBox.firstElementChild);

        this.picBox.style.width = this.sliderWidth * this.picBox.children.length + 'px';
        this.picBox.style.left = -1 * this.sliderWidth + 'px';
    }

    leftRight() {

        this.box.querySelector('.left-box').addEventListener('click', () => {

            // 防抖功能，当点击一次之后，图片处于切换的动画过程中，如果再切换过程中仍然多次点击则忽视
            if (this.animated) {
                return;
            }

            // 边界设置，到最左边第一张图时，继续点击向左，则重置为最后一张图
            if (this.index - 1 < 1) {
                this.index = this.sliders;
            } else {
                this.index--;
            }
            console.log(this.index)
            this.move(-this.sliderWidth);
        })

        this.box.querySelector('.right-box').addEventListener('click', () => {

            if (this.animated) {
                return;
            }
            if (this.index + 1 > this.sliders) {
                this.index = 1;
            } else {
                this.index++;
            }

            this.move(this.sliderWidth);
        })
    }

    move(offset) {
        this.animate(offset);

        // 小圆点数量
        const num = this.indexBox.children[0].children.length;
        for (let i = 0; i < num; i++) {
            this.indexBox.children[0].children[i].className = '';
        }
        this.indexBox.children[0].children[this.index - 1].className = 'active';

    }

    // 控制切换动画效果
    // 定义右侧为正方向
    animate(offset) {

        this.animated = true;

        // 总共的运动时间为1000ms
        const time = 1000;

        // 运动一次的时间是100ms
        const rate = 100;

        // time/rate：运动次数
        // speed：运动一次的位移
        let speed = offset / (time / rate);

        // 目标坐标
        // parseFloat得到的是带单位的值，所以用parseFloat()得到数值来进行计算
        let goal = parseFloat(this.picBox.style.left) - offset;

        // 效果一
        // 图片直接切换，中间没有滑动的动画效果
        // this.picBox.style.left = goal + 'px';

        // 效果二
        // 制造图片滑动时的慢慢滑动的动画效果
        let animate = setInterval(() => {
            // 当运动到最后一段区间时，即可清空定时器，不需要下一轮的滑动了
            if (this.picBox.style.left === goal || Math.abs(Math.abs(parseFloat(this.picBox.style.left)) - Math.abs(goal)) < Math.abs(speed)) {
                this.picBox.style.left = goal;
                clearInterval(animate);
                this.animated = false;

                // 移到边界时使动画效果更好的tip
                if (parseFloat(this.picBox.style.left) === 0) {
                    this.picBox.style.left = -this.sliders * this.sliderWidth + 'px';
                } else if (parseFloat(this.picBox.style.left) == -(this.sliders + 1) * this.sliderWidth) {
                    this.picBox.style.left = -(this.sliderWidth) + 'px';
                }


            } else {
                this.picBox.style.left = parseFloat(this.picBox.style.left) - speed + 'px';
            }
        }, rate);

    }


    play() {

        // 实现轮播图自动播放
        this.auto = setInterval(() => {
            this.box.querySelector('.right-box').click();
        }, 2000);

        // 鼠标移入，停止自动播放
        this.box.addEventListener('mouseenter', () => {
            clearInterval(this.auto);
        })

        this.box.addEventListener('mouseleave', () => {
            this.auto = setInterval(() => {
                this.box.querySelector('.right-box').click();
            }, 2000);
        })

    }
}