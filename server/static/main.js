const thaiKey = ['ๅ', '+', '/', '๑', '-', '๒', 'ภ', '๓', 'ถ', '๔', 'ุ', 'ู', 'ึ', '฿', 'ค', '๕', 'ต', '๖', 'จ', '๗', 'ข', '๘', 'ช', '๙', 'ฃ', 'ฅ', 'ๆ', '๐', 'ไ', '"', 'ำ', 'ฎ', 'พ', 'ฑ', 'ะ', 'ธ', 'ั', 'ํ', 'ี', '๊', 'ร', 'ณ', 'น', 'ฯ', 'ย', 'ญ', 'บ', 'ฐ', 'ล', ',', 'ฟ', 'ฤ', 'ห', 'ฆ', 'ก', 'ฏ', 'ด', 'โ', 'เ', 'ฌ', '้', '็', '่', '๋', 'า', 'ษ', 'ส', 'ศ', 'ว', 'ซ', 'ง', '.', 'ผ', '(', 'ป', ')', 'แ', 'ฉ', 'อ', 'ฮ', 'ิ', 'ฺ', 'ื', '์', 'ท', '?', 'ม', 'ฒ', 'ใ', 'ฬ', 'ฝ', 'ฦ'];
const engKey = ['1', '!', '2', '@', '3', '#', '4', '$', '5', '%', '6', '^', '7', '&', '8', '*', '9', '(', '0', ')', '-', '_', '=', '+', '\\', '|', 'q', 'Q', 'w', 'W', 'e', 'E', 'r', 'R', 't', 'T', 'y', 'Y', 'u', 'U', 'i', 'I', 'o', 'O', 'p', 'P', '[', '{', ']', '}', 'a', 'A', 's', 'S', 'd', 'D', 'f', 'F', 'g', 'G', 'h', 'H', 'j', 'J', 'k', 'K', 'l', 'L', ';', ':', '\'', '"', 'z', 'Z', 'x', 'X', 'c', 'C', 'v', 'V', 'b', 'B', 'n', 'N', 'm', 'M', ',', '<', '.', '>', '/', '?'];

function convert_th(caller){

    let text = $(caller).prev().text();
    let newText = "";
    
    for (let i = 0; i < text.length; i++) {
        if (engKey.indexOf(text[i]) != -1) {
          newText += thaiKey[engKey.indexOf(text[i])];
        } else {
          newText += text[i];
        }
    }

    if(!$(caller).prev().hasClass("convert-th")){
        $(caller).before('<div class="convert-th letter log-item">'+newText+'</div>');
    }
}

const replace_list = {"period": ".", "backslash": "\\", "P_Divide": "/", "space": " ", "quotedbl": "\"", "comma": ",", "apostrophe": "'", "colon": ":", "semicolon": ";"};
let get_url = path => "https://keylogger-demo.herokuapp.com/" + path

function load_content(){
    $("#log_list").addClass("loading");
    axios.get(get_url('api/get')).then(response => {
        console.log("Log file Loaded.");
        $("#log_list").removeClass("loading");
        $("#log_list").empty();
        let data = response.data.content.split("\n");
        let temp_log_item = "";

        for(let i = 0; i < data.length; i++){
            let log_item = data[i];

            let reg = new RegExp(Object.keys(replace_list).join("|"),"gi");

            log_item = log_item.replace(reg, m => replace_list[m]);
            if(log_item.length == 1){
                temp_log_item += log_item;
            }
            else{
                if(temp_log_item.length != 0 || log_item.length == 0){
                    $("#log_list").append('<div><div class="letter log-item">'+temp_log_item+'</div><a onclick="convert_th(this)">convert to TH</a></div>');
                }
                if(log_item.length != 0){
                    $("#log_list").append('<div><div class="command_key log-item">'+data[i]+'</div></div>');
                }
                temp_log_item = "";
            }
        }
        $('#log_list').scrollTop($('#log_list')[0].scrollHeight);
        if(is_command_key_hide){
            is_command_key_hide = false;
            toggle_command_key()
        }
    });
}

function clear_content(){
    axios.get(get_url('api/clear')).then(response=> {
        if(response.status == 200){
            $("#log_list").empty();
        }
    })
}

let is_command_key_hide = false;
function toggle_command_key(){
    if(is_command_key_hide){
        $('#log_list').children("div:has(.command_key)").css("display", "block");
    }
    else{
        $('#log_list').children("div:has(.command_key)").css("display", "none");
    }
    is_command_key_hide = !is_command_key_hide;
}

$(document).ready(load_content());
setInterval(load_content, 5000);