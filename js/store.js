

let API = "http://localhost:3000";
    API = "https://wzicaa.deta.dev";


const toast_block = document.getElementById('toasts');
const post_form = document.getElementById('post');
const boards = document.querySelector('.boards');
const content = document.querySelector('.content');
const mask = document.querySelector('.mask');


let CURRENT_BOARD = '';
let REPLY_TO = null;
let CHILD_OF = null;