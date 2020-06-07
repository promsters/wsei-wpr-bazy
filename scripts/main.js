window.addEventListener('load',() => {
    const hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', () => {
        const menu = document.querySelector('ul.menu');

        if( menu.classList.contains('show') ) {
            menu.classList.remove('show');
            hamburger.querySelector('.open').classList.add('active');
            hamburger.querySelector('.close').classList.remove('active');
        } else {
            menu.classList.add('show');
            hamburger.querySelector('.open').classList.remove('active');
            hamburger.querySelector('.close').classList.add('active');
        }
    });
});