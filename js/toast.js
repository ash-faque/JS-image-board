// toaster
const toast = (msg = '', delete_in = 0) => {
    let div = document.createElement('div');
    div.classList.add('toast')

    div.innerHTML = `<p class="msg">${msg.toString()}</p>
    <p class="close" onclick="this.parentElement.remove()"><span>X</span></p>`;

    toast_block.appendChild(div);

    if (delete_in > 0){
        setTimeout(() => {
            div.remove();
        }, (delete_in * 1000));
    } else {
        setTimeout(() => {
            div.remove();
        }, (5 * 1000));
    };
};

const clearErrors = () => {
    toast_block.innerHTML = '';
};