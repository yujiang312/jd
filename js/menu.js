// es6语法定义类，类名要大写
class Menu {
    constructor(id) {
        this.box = document.querySelector(id);
        this.ul = this.box.querySelector('ul');
        this.lis = this.box.querySelectorAll('li');
        this.subMenuEles = this.box.querySelectorAll('.sub-menu');

        this.timer1 = null;
        this.timer2 = null;
        this.init();
    }

    init() {

        // 逻辑：先移除原先的，再增加新增的
        this.lis.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                let li = e.target;

                // 性能优化
                // 防抖设置，当鼠标快速滑动许多菜单时，只保留最后一个。也就是防抖下面的定时器代码。
                // 这样的话，鼠标快速滑动的菜单不会显示二级菜单，只会显示最后停留的菜单。
                if (this.timer1) {
                    clearTimeout(this.timer1);
                }

                // 定时器是为了用户体验,当鼠标已经处于菜单1时，
                // 这时移到菜单2，二级菜单会仍然显示菜单1的二级菜单，等到200ms后再显示菜单2的二级菜单
                this.timer1 = setTimeout(() => {

                    // 先把所有的二级菜单移除active类（不管之前有没有，现在先清空）
                    // 因为无法确定原先的是哪个，所以只能移除所有的
                    this.subMenuEles.forEach((item2) => {
                        item2.classList.remove("active");
                    })

                    // 此处的li指的是目前鼠标作用的li，现在事件发生的li,只是一个
                    // 此处的li.children[1]就是上一行的item2，因为item2只在forEach中定义，所以此处只能这样表示
                    li.children[1].classList.add('active')
                }, 200);


            })
        });

        this.lis.forEach(item => {
            item.addEventListener('mouseleave', (e) => {
                let li = e.target;

                if (this.timer2) {
                    clearTimeout(this.timer2);
                }

                this.timer2 = setTimeout(() => {
                    li.children[1].classList.remove('active');
                }, 200);

            })
        });
    }
}