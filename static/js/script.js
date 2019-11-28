console.log("loading filtering annotation app...")

// this is for the pool plane canvas
var width = 702+13*2,
    height = 520+13*2,
    resolution = 13,
    r = 15;
//var submit = false;

var label_list = ['squat','benchpress','deadlift','accessory','cleanandjerk','snatch','multilift','none'];
var num_label_types = label_list.length;
//var background_colors = ['#0091d5','#6ab187','#ea6a47','#D3D3D3','#C889DB','#FDC02F','#FF007F','#2C303C'];
var background_colors = ['#0091d5','#6ab187','#ea6a47','#e0e0e0','#C889DB','#FDC02F','#1b1e26','#373E4B']; // '#6b6d70','#1b1e26'];
var hover_colors = ['w3-hover-blue','w3-hover-green','w3-hover-deep-orange','w3-hover-sand','w3-hover-purple','w3-hover-yellow','','w3-hover-black'];
var margin = ['5px','5px','5px','5px 5px 5px 20px','5px','5px','5px 5px 5px 20px','5px 5px 5px 40px'];
var button_text = ['S','B','D','A','CJ','Sn','ML','<b>X</b>'];
var prefix = ["<li><div class='w3-container'>",'','','',"<div class='w3-container'>",'','',''];
var suffix = ['','','','</div>','','','','</div></li>'];
var text_color = ['#000','#000','#000','#000','#000','#000','#FEDDDE','#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)'];
var label_color_association = {};
label_color_association[null] = '#000';
for (var lca=0;lca<num_label_types;lca++) {
  label_color_association[label_list[lca]] = background_colors[lca];
}
console.log(label_color_association);


// this is for the image view
// input file index
var input_index = 0;
// input folder path
var game_folder = ''
var folder_path = '';
var annotation_path = '';
var total_file_num = 67 //parseInt($("#total_num").text());
//console.log(getCount(folder_path));

// current index of the marker in image plane
var img_index = 0;

var img_labels = [];
var ground_labels =[];

//new
//TODO: don't need load_data anymore
var rootdir = '/static/video_data/';
var num_video = 5;
var default_tag = 'none';
var load_file = '';
var json_data;
var video_index = 0;
var video_label_index = 0;
var max_video = 5;
var labels_to_update = [];
var update_flag = false;

$( "#nextBtn" ).click(function() {
  // TODO: don't let this exceed max videos.
  video_label_index = Math.max(video_index + num_video - 1,video_label_index);
  console.log('Next button clicked');
  video_index = video_index + num_video;
  video_index = Math.min(video_index,max_video-num_video);
  console.log('Next video index: ' + video_index);
  document.getElementById("myVideoIndex").value = video_index;
  console.log('Update flag: ' + update_flag);
  if (update_flag) {
    console.log('push labels to json..');
    console.log(labels_to_update);
    push_labels_to_json();
  }
  refresh_videos(json_data,num_video,video_index);
});

/*function sleep(miliseconds) {
                var currentTime = new Date().getTime();
                while (currentTime + miliseconds >= new Date().getTime()) {
                }
            }*/

function convertHex(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgb('+r+','+g+','+b+')';
    return result;
}

/*window.onbeforeunload = confirmExit;
function confirmExit() {
    return "Have you saved your labels?";
}*/

$( "#prevBtn" ).click(function() {
    video_index = video_index - num_video;
    video_index = Math.max(video_index,0);
    document.getElementById("myVideoIndex").value = video_index;
    if (update_flag) {
      push_labels_to_json();
    }
    refresh_videos(json_data,num_video,video_index);
});

$( "#submitBtn" ).click(function() {
    push_labels_to_json();
});


$("#myVideoIndex").keyup(function(event) {
    if (event.keyCode === 13) {
        video_index = document.getElementById("myVideoIndex").value % max_video;
        document.getElementById("myVideoIndex").value = video_index;
        if (update_flag) {
          push_labels_to_json();
        }
        refresh_videos(json_data,num_video,video_index);
    }
});

$('#numVideos').on('hidden.bs.select', function (e) {
  num_video = Number(e.target.value);
  $('#numVideos').selectpicker('hide');
  setTimeout(function() { $('#numVideos').selectpicker('show');},20);
  if (update_flag) {
    push_labels_to_json();
  }
  refresh_videos(json_data,num_video,video_index);
});

$('#loadFile').on('hidden.bs.select', function (e) {
  //TODO: change this.... WHAT?! change it to what? ...
  // before loading new file.. better update any labels we made.. 
  if (update_flag) {
      push_labels_to_json();
    }
  load_file = e.target.value;
  document.getElementById("videos").innerHTML = '<font color="' + label_color_association[load_file] + '" size="20">Loading ' + load_file + ' tag... please be patient</font>';
  $('#loadFile').selectpicker('hide');
  setTimeout(function() { $('#loadFile').selectpicker('show');},20);
  // reset some things
  load(load_file);
});

$('#batchTag').on('hidden.bs.select', function (e) {
  //TODO: change this.

  var tag_label = e.target.value;
  $('#batchTag').selectpicker('hide');
  setTimeout(function() { $('#batchTag').selectpicker('show');},20);
  batch_tag(tag_label);
});

function batch_tag(tag) {
  console.log('in batch tag');
  for (var i = video_index; i < num_video+video_index; i++) {
    var tag_input = tag + '_' + i;
    push_labels_to_list(tag_input);
    update_json_data(tag_input);
  }
  push_labels_to_json();
  refresh_videos(json_data,num_video,video_index);
}

function refresh_videos(data,num_videos,video_index) {
  var x = "";
  for (var i = video_index; i < num_videos+video_index; i++) {
    src = rootdir + 'videos/' +  load_file + '/' + data[i]['metadata']['filename'] + '.' + data[i]['metadata']['extension'];
    var video_border_color = label_color_association[data[i]['gt_labels']['lift_type']];
    var on_click = "onclick='this.paused ? this.play() : this.pause();'";
    video_tag = "<li><video id='myVideo" + i + "' height='300' style='padding:0px;border-width:10px 10px 10px 10px; border-style:solid;border-color:" + video_border_color + ";'" + on_click + "><source src='" + src + "' type='video/mp4'></video></li>";

    var progress_bar = "<div class='w3-light-grey' style='width:85%;margin-left:24px;margin-bottom:15px;'><div id='progress-bar" + i + "' class='w3-container' style='height:24px;width:1%;background-color:#2C303C;color:#fff'>0%</div></div>"
    var video_element_string = '"myVideo' + i + '"';
    var x_guts = '';
    for (var ll=0; ll<num_label_types; ll++) {
      var cur_tag = label_list[ll] + '_' + i;
      var cur_tag_string = '"' + cur_tag + '"'
      var cur_html = prefix[ll] + "<button class='w3-button w3-circle " + hover_colors[ll] + "' id='" + cur_tag + "' onclick='update_video_label(" + cur_tag_string + "," + video_element_string + ")' style='background-color:" + background_colors[ll] + ";color:" + text_color[ll] + ";margin:" + margin[ll] + ";'>"+ button_text[ll] +"</button>" + suffix[ll];
      x_guts = x_guts + cur_html;
    }
    x = x + "<div style='float:left;'><ul style='list-style-type: none;'>" + progress_bar + video_tag + x_guts + "</ul></div>\n";
  }
  document.getElementById("videos").innerHTML = x;
  for (var i = video_index; i < num_videos+video_index; i++) {
    var vid = document.getElementById("myVideo" + i);
    var progressbar = document.getElementById("progress-bar" + i);
    var video_elem = 'myVideo'+i;
    var playbackRate = 5;
    var loop = false;
    if (video_index > video_label_index) {
    //if (data[i]['gt_labels']['lift_type'] == 'none' || data[i]['gt_labels']['lift_type']==null) {
      loop = true;
      playbackRate = 5;
    }
    enablePlay(vid,playbackRate,loop,i,progressbar);
  }
}

function update_video_label(clicked_id,vid_elem) {
  console.log('in update video label');
  console.log('clicked id: ' + clicked_id.split('_')[0]);
  console.log('video string: ' + vid_elem);
  var video_elem = document.getElementById(vid_elem);
  console.log('video element:');
  console.log(video_elem);
  console.log('button element');
  console.log(document.getElementById(clicked_id));
  video_elem.style.borderColor = label_color_association[clicked_id.split('_')[0]];
  if (video_elem.currentTime > 0 && !video_elem.paused && !video_elem.ended && video_elem.readyState > 2) {
    video_elem.pause();
  }
  push_labels_to_list(clicked_id);
  update_json_data(clicked_id);
}

function enablePlay(vid,playbackRate,loop,id,prog_bar) {
  vid.addEventListener('timeupdate', function() { updateProgressBar(vid,id,prog_bar); })
  vid.playbackRate = playbackRate;
  vid.loop = loop;
  vid.muted = true;
  vid.play();
}

function updateProgressBar(myvid,id,prog_bar) {
  var percentage = Math.floor((100 / myvid.duration) * myvid.currentTime);
  //prog_bar.value = percentage;
  prog_bar.style.width = percentage + '%';
  // update text for browsers that don't support the progress element
  prog_bar.innerHTML = percentage + '%';
}

function push_labels_to_list(button_element) {
  console.log('in push labels to list');
  update_flag = true;
  labels_to_update.push(button_element);
}

function update_json_data(button_element) {
  console.log('in update json data');
  console.log(button_element);
  var temp = button_element.split('_');
  var tag_label = temp[0];
  var video_id = parseInt(temp[1],10);
  json_data[video_id]['gt_labels']['lift_type'] = tag_label;
  console.log(json_data[video_id]['gt_labels']['lift_type']);
}

function push_labels_to_json() {
  console.log('push_labels_to_json');
  console.log(labels_to_update);
  console.log(rootdir);
  console.log(load_file);
  $.ajax({
    type: "GET",
    url: $SCRIPT_ROOT + "/submit/",
    contentType: "application/json; charset=utf-8",
    data:{label_update:JSON.stringify(labels_to_update),rootdir:rootdir,load_data:load_file,video_id:video_label_index},
    success: function(data) {
        //alert(labels_to_update);
        console.log(rootdir);
        console.log(load_file);
        labels_to_update = [];
        update_flag = false;
        //alert(data.result);
        //if (submit) { submit = false; }
        //d3.select('#my_image').attr("xlink:href","static/imgs/output/"+data.name)
    }
  });
}

// Just load the JSON data once, when the request is made for that tag's videos.
function load(input_data) {
    console.log('loading function');
    $.ajaxSetup({ cache:false });
    console.log('did i cache this?');
    console.log('location: static/video_data/labels/' + input_data + '_v3.json');
    $.getJSON('static/video_data/labels/' + input_data + '_v3.json', function(data) {
        console.log('am i ever reaching here?');
        json_data = data['data'];
        console.log(json_data);
        max_video = json_data.length;
        //video_index = Math.min(document.getElementById("myVideoIndex").value,max_video-num_video-1);
        //video_index = Math.max(0,video_index);
        video_index = data['index'];
        video_label_index = data['index'];
        document.getElementById("myVideoIndex").value = video_index;
        console.log('Why dont i refresh here??? hmm... heather?????');
        refresh_videos(json_data,num_video,video_index);
    });
}

var addEvent = document.addEventListener ? function(target,type,action){
    if(target){
        target.addEventListener(type,action,false);
    }
} : function(target,type,action){
    if(target){
        target.attachEvent('on' + type,action,false);
    }
}

addEvent(document,'keydown',function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    // 70 is f: go forward num_video clips (effectively the same as pressing next..
    // why don't you combine those?!)
    if (key==70) { // f
      video_label_index = Math.max(video_index + num_video - 1,video_label_index);
      push_labels_to_json();
      // TODO: don't let this exceed max videos.
      video_index = video_index + num_video;
      video_index = Math.min(video_index,max_video-num_video);
      document.getElementById("myVideoIndex").value = video_index;
      refresh_videos(json_data,num_video,video_index);
    }
    // 68 is d: go backward num_video clips (effectively the same as pressing prev..
    // why don't you combine those?!)
    else if (key==68) { // d
      push_labels_to_json();
      video_index = video_index - num_video;
      video_index = Math.max(video_index,0);
      document.getElementById("myVideoIndex").value = video_index;
      refresh_videos(json_data,num_video,video_index);
    } else if (key==74) { // j
      batch_tag('squat');
    } else if (key==75) { // k
      batch_tag('bench');
    } else if (key==76) { // l
      batch_tag('deadlift');
    } else if (key==186) { // ;
      batch_tag('accessory');
    } else if (key==78) { // n
      batch_tag('cleanandjerk');
    } else if (key==77) { // m
      batch_tag('snatch');
    } else if (key==188) { // <
      batch_tag('none');
    } else if (key==65) { // a: i believe this is for submit
      if (update_flag) { push_labels_to_json(); }
    }
});
