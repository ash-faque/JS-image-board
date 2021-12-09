// load boards
const loadBoards = () => {
    fetch("boards/index.json")
        .then(r => {
            r.json()
                .then(res => {
                    boards.innerHTML = ``;
                    Object.keys(res)
                        .forEach(list_name => {
                            let ul = document.createElement('ul');
                            ul.innerHTML = `<h3>${list_name}</h3>`;

                            res[list_name].forEach(board => {

                                let { N, D, C } = board;

                                ul.innerHTML += `<li onclick="toBoard('${N}')">
                                                    <h5>${N}</h5>
                                                    <span>${D}</span>
                                                </li>`;
                            });

                            boards.appendChild(ul);
                        });
                }).catch(e => console.error(e));
        }).catch(e => console.error(e));


    boards.style.display = 'block';
};

loadBoards();


// to load board index
const goHome = () => {
    REPLY_TO = null;
    CHILD_OF = null;
    content.style.display = 'none';
    loadBoards();
};