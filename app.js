
let SITE = `http://127.0.0.1:5500`;
    SITE = `https://cocolite.netlify.app`;

const loadBoards = () => {
    fetch(`boards.json`)
        .then(r => {
            r.json()
                .then(res => {

                    document.querySelector('main').innerHTML = ``;

                    Object.keys(res)
                        .forEach(board_name => {

                            let div = document.createElement('div');
                            
                            div.innerHTML = `<p>${res[board_name]}</p>
                                <a href="${SITE}/board/index.html?board=${board_name}">${board_name}</a>`;
                            
                            document.querySelector('main').appendChild(div);

                        });

                })
                .catch(e => console.error(e));
        })
        .catch(e => console.error(e));

};

loadBoards();



// service worker
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('⚙ Service worker: REGISTERED'))
        .catch(err => console.log('⚙ Service worker: FAILED TO REGISTER', err));
};