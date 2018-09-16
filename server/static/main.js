function load_content(){
    $("#log_list").addClass("loading");
    axios.get('http://localhost:5000/api/get').then(response => {
        console.log("Log file Loaded.");
        $("#log_list").removeClass("loading");
        $("#log_list").empty();
        let data = response.data.content.split("\n");
        let temp_log_item = "";

        for(let i = 0; i < data.length; i++){
            let log_item = data[i];
            if(log_item.length == 1){
                temp_log_item += log_item;
            }
            else{
                if(temp_log_item.length != 0){
                    $("#log_list").append('<div><div class="letter log-item">'+temp_log_item+'</div></div>');
                }
                $("#log_list").append('<div><div class="command_key log-item">'+data[i]+'</div></div>');
                temp_log_item = "";
            }
        }
        $('#log_list').scrollTop($('#log_list')[0].scrollHeight);
    });
}

$(document).ready(load_content());