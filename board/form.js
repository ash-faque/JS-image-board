const post_result = document.getElementById('post_result');

let THUMB_DATA = '';

// post uploading fn
const post = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("board", CURRENT_BOARD);
    formData.append("image", post_form.image.files[0]);
    formData.append("description", post_form.description.value);
    formData.append("replyTo", REPLY_TO);
    formData.append("childOf", CHILD_OF);
    formData.append('thumbnail', THUMB_DATA);

    mask.style.display = 'flex';
    mask_text.innerHTML = `<p class="info">POSTING</p>`;

    fetch(`${API}/post`, {
        method: "POST",
        body: formData
    }).then(r => {
        r.json().then(res => {

            mask.style.display = 'none';
            mask_text.innerHTML = ``;

            switch(res.code){
                case "✅":
                    console.log(res.msg);
                    post_result.innerHTML = `<p class="success">${res.msg}</p>`;
                    post_form.reset();
                    toBoard();
                    break;
                case "💔":
                    console.error(res.msg);
                    post_result.innerHTML = `<p class="error">${res.msg}</p>`;
                    break;
                default:
                    console.log(res);
                    post_result.innerHTML = `<p class="error">${res}</p>`;
                    break;
            };

            post_result.scrollIntoView();

        });
    }).catch(e => {  
        console.log(e);
        mask.style.display = 'none';
        mask_text.innerHTML = ``;
        post_result.innerHTML = `<p class="error">${e}</p>`;
    });

};

// close form
const closeForm = () => {
    post_form.style.display = 'none';

    REPLY_TO = null;
    CHILD_OF = null;
};

// create new post opener
const createPost = (direct_parent, topmost_parent) => {
    REPLY_TO = direct_parent;
    CHILD_OF = topmost_parent;
    post_form.querySelector('h2').innerHTML = `[${CURRENT_BOARD}]&nbsp
                                                [${topmost_parent}]&nbsp
                                                [${direct_parent}]`;
    post_form.style.display = 'block';
    post_form.scrollIntoView();
};


// image selection previewer
const loadPreview = (e) => {
    THUMB_DATA = '';

    let output = document.getElementById('preview');
    try{
        output.src = URL.createObjectURL(e.target.files[0]);
    } catch(e){
        // toast(`ERROR: ${e}`)
        console.log(e)
    };
    output.onerror = (e) => {
        console.error(e)
        // toast(`ERROR: ${e}`)
        console.log(e)
    };
    output.onload = () => {
        URL.revokeObjectURL(output.src);
        createThumbData(output);
    };
};


// make thumbnail
const createThumbData = (original) => {
    let canvas = document.getElementById("thumbnail");

    let scale = 0.15;

    canvas.width = original.width * scale;
    canvas.height = original.height * scale;
  
    canvas.getContext("2d").drawImage(original, 0, 0, canvas.width, canvas.height);
  
    THUMB_DATA = canvas.toDataURL("image/png");

    console.log(THUMB_DATA);
};