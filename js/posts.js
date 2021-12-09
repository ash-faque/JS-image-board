// to load board's contents
const toBoard = (board) => {
    mask.style.display = 'flex'; 

    fetch(`${API}/feeds/${board}`)
        .then(r => {
            mask.style.display = 'none'; 

            r.json().then(res => {
                switch(res.code){
                    case "✅":
                        showBoardContent(board, res.msg);
                        toast(`${board} LOADED`, 2);
                        break;
                    case "💔":
                        console.error(res.msg);
                        toast(`ERROR: ${res.msg}`);
                        break;
                    default:
                        console.log(res);
                        toast(`UNDETECTED RESPOSE ${res}`);
                        break;
                };
            });
        }).catch(e => {  
            mask.style.display = 'none';   
            toast(`ERROR: ${e}`)
            console.log(e)
        });
};

// loaded content renderer
const showBoardContent = (board_name, content_array) => {

    CURRENT_BOARD = board_name;

    boards.style.display = 'none';

    content.innerHTML = `<h3>${board_name}</h3>`;

    content_array.items.forEach(thread => {

        let {
            description,
            key,
            path,
            replyTo,
            childOf
        } = thread;

        let div = document.createElement('div');
        div.id = key;
        div.classList.add('post');
        
        div.setAttribute("tabindex", "-1");

        // POSTS
        div.innerHTML = `<div class="container">
                            <div class="links">
                                <a href="#${childOf}">${childOf}</a>
                                <a href="#${replyTo}">${replyTo}</a>
                            </div>
                            ${path ? `<img src="${`${API}/image/${path}`}">`: ``}
                            <p>${description}<p>
                            <span onclick="createThread('${key}', '${(childOf !== 'null') ? childOf : key}')">
                            REPLY</span>
                        </div>
                        <div class="childs">
                            <span onclick="loadComments('${board_name}', '${key}', this.parentElement)">
                            LOAD COMENTS</span>
                        </div>`;

        content.appendChild(div);

    });

    content.style.display = 'block';
};



// commenets loader
const loadComments = (board, parent_post_id, comment_container) => {

    comment_container.innerHTML = `<p> 💬 LOADING COMMENTS </p>`;

    fetch(`${API}/comments/${board}/${parent_post_id}`)
        .then(r => {
            comment_container.innerHTML = ``;

            r.json().then(res => {
                switch(res.code){
                    case "✅":
                        renderComments(comment_container, res.msg);
                        console.log(res.msg);
                        break;
                    case "💔":
                        comment_container.innerHTML = `ERROR LOADING COMMENTS<br>${res.msg}`;
                        console.log(res.msg);
                        break;
                    default:
                        comment_container.innerHTML = `ERROR LOADING COMMENTS<br>${res}`;
                        console.log(res);
                        break;
                };
            });
        }).catch(e => {  
            comment_container.innerHTML = `ERROR LOADING COMMENTS<br>${e}`;
            console.log(e);
        });
};

// comments renderer
const renderComments = (container, content_array) => {

    if (content_array.items.length === 0){
        container.innerHTML = `<p> 😐 NO COMMENTS </p>`;
    };

    content_array.items.forEach(comment => {

        let {
            description,
            key,
            path,
            replyTo,
            childOf
        } = comment;

        let div = document.createElement('div');
        div.id = key;
        div.classList.add('child_post');
        
        div.setAttribute("tabindex", "-1");

        // COMMENTS
        div.innerHTML = `<div class="container">
                            <div class="links">
                                <a href="#${childOf}">${childOf}</a>
                                <a href="#${replyTo}">${replyTo}</a>
                            </div>
                            ${path ? `<img src="${`${API}/image/${path}`}">`: ``}
                            <p>${description}<p>
                        </div>
                        <span onclick="createThread('${key}', '${(childOf !== 'null') ? childOf : key}')">
                        REPLY TO ${key}</span>`;

        container.appendChild(div);

    });

};