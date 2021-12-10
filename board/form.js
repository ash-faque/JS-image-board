
const mask = document.getElementById('mask');
const post_result = document.querySelector('.post_result');


// post uploading fn
const post = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("board", CURRENT_BOARD);
    formData.append("image", post_form.image.files[0]);
    formData.append("description", post_form.description.value);
    formData.append("replyTo", REPLY_TO);
    formData.append("childOf", CHILD_OF);


    mask.style.display = 'flex';

    fetch(`${API}/post`, {
        method: "POST",
        body: formData
    }).then(r => {
        r.json().then(res => {
            switch(res.code){
                case "✅":
                    console.log(res.msg);

                    post_result.innerHTML = `${res.msg}`;
                    
                    setTimeout(closeForm, 3000);

                    break;
                case "💔":
                    console.error(res.msg);

                    post_result.innerHTML = `${res.msg}`;

                    break;
                default:
                    console.log(res);
                    break;
            };
        });
    }).catch(e => {  
        console.log(e)
    });

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

// close form
const closeForm = () => {
    mask.style.display = 'none';

    post_result.innerHTML = ``;

    REPLY_TO = null;
    CHILD_OF = null;

    post_form.reset();
    post_form.style.display = 'none';
};


// image selection previewer
const loadPreview = (e) => {
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
    output.onload = () => URL.revokeObjectURL(output.src);
};