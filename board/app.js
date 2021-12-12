const post_form = document.getElementById('post');
const main = document.querySelector('main');

const mask = document.getElementById('mask');
const mask_text = document.getElementById('mask_text');

const del_btn = document.getElementById('del_btn');
const del_res = document.getElementById('del_res');

let SITE =  location.protocol + '//' + location.host;

let API = "http://localhost:3000";
    API = "https://wzicaa.deta.dev";

let MASTER_KEY = localStorage.getItem('MASTER_KEY');

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

let CURRENT_BOARD = params.board;
let THREAD = params.thread;
let TARGET = params.child;

let FOCUSED = false;

document.querySelector('h1').innerHTML = `${CURRENT_BOARD}`

if ((CURRENT_BOARD === '' ) || (CURRENT_BOARD === undefined)) location.href = `${SITE}`;

let REPLY_TO = null;
let CHILD_OF = null;

let POST_FETCH_LAST = '';



// to load board's contents
const toBoard = () => {


    mask.style.display = 'flex';
    mask_text.innerHTML = `<p class="info">LOADING</p>`;

    fetch(`${API}/feeds/${CURRENT_BOARD}`)
        .then(r => {
            
            mask.style.display = 'none';
            mask_text.innerHTML = '';

            r.json().then(res => {
                switch(res.code){
                    case "✅":
                        showBoardContent(res.msg);
                        break;
                    case "💔":
                        console.error(res.msg);
                        main.innerHTML = `<h3 class="msg" style="font-size: 100px; text-align: center;">📶</h3><br>
                                        <p class="error">${res.msg}</p>`;
                        break;
                    default:
                        console.log(res);
                        break;
                };
            });

        }).catch(e => {  
            console.log(e);

            mask.style.display = 'none';
            mask_text.innerHTML = '';

            main.innerHTML = `<h3 class="msg" style="font-size: 100px; text-align: center;">📶</h3><br>
                            <p class="error">${e.message}</p>`;
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
        main.innerHTML = `<p class="error msg">THERE IS NO THREADS HERE</p>`;
    } else {
        main.innerHTML = ``;
    };

    items.forEach(thread => {

        let {
            description,
            key,
            path,
            replyTo,
            childOf,
            thumbnail,
            childCount
        } = thread;

        let div = document.createElement('div');
        div.id = key;
        div.classList.add('post');
        
        div.setAttribute("tabindex", "-1");

        // POSTS
        div.innerHTML = `<div class="wrap">
                            <div class="inner_wrap focus">
                                <p class="text">
                                    ${(path ) ? `<img src="${thumbnail}"
                                        onclick="loadFullImage('${`${API}/image/${path}`}', this)">`: ``}
                                    ${description}
                                </p>
                            </div>
                            <div class="control">
                                <i onclick="deletePost('${key}', '${childOf}')">⚠</i>
                                <span onclick="createPost('${key}', '${key}')">REPLY</span>
                            </div>
                        </div>
                        <div class="childs">
                            <p onclick="loadComments('${key}', this.parentElement)"
                                class="comment_load_trigger" style="color: #404040;"> 
                                LOAD COMENTS${(childCount !== 'null') ? ` (${childCount})` : ''} 
                            </p>
                        </div>`;

        main.appendChild(div);

    });

    if ((THREAD !== 'null') && (THREAD !== undefined) && !FOCUSED){
        if (document.getElementById(THREAD)){
            document.getElementById(THREAD).querySelector('.comment_load_trigger').click();
        };
    };

};

// load full image
let loadFullImage = (src, img) => {
    img.src = src;
    img.onclick = '';
};


// delete post
const deletePost = (target, mother_post) => {

    if ((MASTER_KEY !== 'null') && (MASTER_KEY.length > 0)){

        mask.style.display = 'flex';
        mask_text.innerHTML = '<p class="info">DELETING</p>';
    
        fetch(`${API}/delete/${CURRENT_BOARD}/${target}/${MASTER_KEY}`)
            .then(r => {
    
                mask.style.display = 'none';
                mask_text.innerHTML = '';
    
                r.json()
                    .then(res => {
                        if (res.code == '✅'){
                            console.log(res.msg);
                            del_res.innerHTML = `<p class="success"
                                    onclick="this.remove()">${res.msg}</p>`;
                            toBoard();
                        } else {
                            console.error(res.msg)
                            del_res.innerHTML = `${res.msg}`;
                            del_res.innerHTML = `<p class="error"
                                    onclick="this.remove()">${res.msg}</p>`;
                        };
                    }).catch(e => {
                        console.log(e)
                        del_res.innerHTML = `<p class="error"
                                onclick="this.remove()">${e.msg}</p>`;
                    });
    
            }).catch(e => {
                console.log(e);
                mask.style.display = 'none';
                mask_text.innerHTML = '';
                del_res.innerHTML = `<p class="error"
                        onclick="this.remove()">${e.msg}</p>`;
            });
    
    } else {

        const shareData = {
            title: 'REPORT POST',
            text: 'REQUEST TO REMOVE',
            url: `http://wa.me/916282177960?text=COCO-R ${SITE}/board/index.html?board=${CURRENT_BOARD}&thread=${mother_post}&child=${target}`
        };
        
        navigator.share(shareData)
            .then(() => console.log('SHARED', shareData))
            .catch(err => console.log(err));

    };

    del_btn.style.display = 'none';

};


// commenets loader
const loadComments = (parent_post_id, comment_container) => {

    comment_container.innerHTML = `<p class="comment_load_trigger info"> LOADING COMMENTS </p>`;

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
                        comment_container.innerHTML = `<p class="comment_load_trigger error">ERROR LOADING COMMENTS<br>${res.msg}</p>`;
                        console.log(res.msg);
                        break;
                    default:
                        comment_container.innerHTML = `<p class="comment_load_trigger error">ERROR LOADING COMMENTS<br>${res}</p>`;
                        console.log(res);
                        break;
                };
            });
        }).catch(e => {  
            comment_container.innerHTML = `<p class="comment_load_trigger error">ERROR LOADING COMMENTS<br>${e}</p>`;
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

    if (count === 0) comment_container.innerHTML = `<span class="comment_load_trigger info"> NO COMMENTS </span>`;

    items.forEach(comment => {

        let {
            description,
            key,
            path,
            replyTo,
            childOf,
            thumbnail
        } = comment;

        let div = document.createElement('div');
        div.id = key;
        div.classList.add('child_post');
        
        div.setAttribute("tabindex", "-1");

        // COMMENTS
        div.innerHTML = `<div class="wrap">
                            <div class="inner_wrap focus">
                                <div class="links">
                                    <a href="#${childOf}">IN THREAD</a>
                                    <a href="#${replyTo}">AS REPLY TO</a>
                                </div>
                                <p class="text">
                                    ${(path ) ? `<img src="${thumbnail}"
                                        onclick="loadFullImage('${`${API}/image/${path}`}', this)">`: ``}
                                    ${description}
                                </p>
                            </div>
                            <div class="control">
                                <i onclick="deletePost('${key}', '${childOf}')">⚠</i>
                                <span onclick="createPost('${key}', '${(childOf !== 'null') ? childOf : key}')">REPLY</span>
                            </div>
                        </div>`;

        comment_container.appendChild(div);

    });
    
    if (document.getElementById(TARGET) && !FOCUSED){
        let target = document.getElementById(TARGET);
        target.scrollIntoView();
        FOCUSED = true;
        if ((THREAD !== 'null') && (THREAD !== undefined)){
            del_btn.setAttribute('onclick', `deletePost('${TARGET}', '${THREAD}')`);

            if ((MASTER_KEY !== 'null') && (MASTER_KEY.length > 0)) del_btn.style.display = 'block';
        };
    };

};


// set master key
const setMasterKey = () => {
    localStorage.setItem('MASTER_KEY', prompt('MASTER_KEY'));
    MASTER_KEY = localStorage.getItem('MASTER_KEY');
};