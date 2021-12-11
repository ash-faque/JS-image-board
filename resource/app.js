
let SITE =  location.protocol + '//' + location.host;

// console.log(SITE)
const loadBoards = () => {
    fetch(`resource/boards.json`)
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