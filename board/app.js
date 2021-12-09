const post_form = document.getElementById('post');
const main = document.querySelector('main');

let SITE = `http://127.0.0.1:5500`;
    SITE = `https://cocolite.netlify.app`;

let API = "http://localhost:3000";
    API = "https://wzicaa.deta.dev";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let CURRENT_BOARD = params.board;
document.querySelector('h1').innerHTML = `${CURRENT_BOARD}`

if ((CURRENT_BOARD === '' ) || (CURRENT_BOARD === undefined)) location.href = `${SITE}`;

let REPLY_TO = null;
let CHILD_OF = null;





// to load board's contents
const toBoard = () => {

    main.innerHTML = `<p class="error loading">LOADING</p>`;

    fetch(`${API}/feeds/${CURRENT_BOARD}`)
        .then(r => {
            
            r.json().then(res => {
                switch(res.code){
                    case "✅":
                        showBoardContent(res.msg);
                        break;
                    case "💔":
                        console.error(res.msg);
                        main.innerHTML = `<p class="error">${res.msg}</p>`;
                        break;
                    default:
                        console.log(res);
                        break;
                };
            });

        }).catch(e => {  
            main.innerHTML = `<p class="error">${e}</p>`;
            console.log(e)
        });
};

toBoard();


// loaded content renderer
const showBoardContent = (result) => {

    let {
        count,
        items,
        last
    } = result;

    if (count === 0){
        main.innerHTML = `<p class="error">THERE IS NO THREADS HERE</p>`;
    } else {
        main.innerHTML = ``;
    };

    items.forEach(thread => {

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
        div.innerHTML = `<div class="wrap">
                            <div class="inner_wrap">
                                ${path ? `<img src="${`${API}/image/${path}`}">`: ``}
                                <p class="text">${description}</p>
                            </div>
                            <span onclick="createPost('${key}', '${(childOf !== 'null') ? childOf : key}')">
                            REPLY</span>
                        </div>
                        <div class="childs">
                            <span onclick="loadComments('${key}', this.parentElement)">
                            LOAD COMENTS</span>
                        </div>`;

        main.appendChild(div);

    });

};








// commenets loader
const loadComments = (parent_post_id, comment_container) => {

    comment_container.innerHTML = `<span> LOADING COMMENTS </span>`;

    fetch(`${API}/comments/${CURRENT_BOARD}/${parent_post_id}`)
        .then(r => {
            comment_container.innerHTML = ``;

            r.json().then(res => {
                switch(res.code){
                    case "✅":
                        renderComments(comment_container, res.msg);
                        // console.log(res.msg);
                        break;
                    case "💔":
                        comment_container.innerHTML = `<p class="error">ERROR LOADING COMMENTS<br>${res.msg}</p>`;
                        console.log(res.msg);
                        break;
                    default:
                        comment_container.innerHTML = `<p class="error">ERROR LOADING COMMENTS<br>${res}</p>`;
                        console.log(res);
                        break;
                };
            });
        }).catch(e => {  
            comment_container.innerHTML = `<p class="error">ERROR LOADING COMMENTS<br>${e}</p>`;
            console.log(e);
        });
};



// comments renderer
const renderComments = (comment_container, result) => {


    let {
        count,
        items,
        last
    } = result;

    if (count === 0) comment_container.innerHTML = `<p> NO COMMENTS </p>`;

    items.forEach(comment => {

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
        div.innerHTML = `<div class="comment_wrap">
                            <div class="links">
                                <a href="#${childOf}">${childOf}</a>
                                <a href="#${replyTo}">${replyTo}</a>
                            </div>
                            ${path ? `<img src="${`${API}/image/${path}`}">`: ``}
                            <p>${description}</p>
                        </div>
                        <span onclick="createPost('${key}', '${(childOf !== 'null') ? childOf : key}')">
                        REPLY</span>`;

        comment_container.appendChild(div);

    });

};