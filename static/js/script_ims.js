console.log("loading filtering annotation app...")

// TODO: delete this
// this is for the pool plane canvas
//var width = 702+13*2,
//    height = 520+13*2,
//    resolution = 13,
//    r = 15;

var key_presses = {};
key_presses[90] = false;
window.onkeyup = function(e) {
  key_presses[e.keyCode] = false;
}
window.onkeydown = function(e) {
  key_presses[e.keyCode] = true;
  console.log(key_presses);
}

var rootdir = '/static/data/';
var default_tag = 'none';
var json_data;
var video_index = 0;
var video_label_index = 0;
var max_video = 5;
var labels_to_update = [];
var update_flag = false;

var video_tag_list = [];
var video_tag_video_index = [];

var toggle_color = ['#373E4B','#FFF'];
var toggle_list = [];
var num_label_types;
var label_template;

// the media_type can be images or videos
var media_type_picker = document.getElementById('media_type');
var media_type = media_type_picker.options[media_type_picker.selectedIndex].value;

// the default dataset to load is set in index.html in the select picker
var load_dataset_picker = document.getElementById('load_dataset');
var dataset_load = load_dataset_picker.options[load_dataset_picker.selectedIndex].value;

// number of media items to display at once
var num_media_picker = document.getElementById('num_media');
var num_media = parseInt(num_media_picker.options[num_media_picker.selectedIndex].value);

update_label_template();

$( "#nextBtn" ).click(function() {
  // TODO: don't let this exceed max videos.
  video_label_index = Math.max(video_index + num_media - 1,video_label_index);
  video_index = video_index + num_media;
  video_index = Math.min(video_index,max_video-num_media);
  document.getElementById("myVideoIndex").value = video_index;
  if (update_flag) {
    push_labels_to_json();
  }
  refresh_media(json_data,num_media,video_index);
});

$( "#prevBtn" ).click(function() {
    video_index = video_index - num_media;
    video_index = Math.max(video_index,0);
    document.getElementById("myVideoIndex").value = video_index;
    if (update_flag) {
      push_labels_to_json();
    }
    refresh_media(json_data,num_media,video_index);
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
        refresh_media(json_data,num_media,video_index);
    }
});

$('#num_media').on('hidden.bs.select', function (e) {
  num_media = Number(e.target.value);
  $('#num_media').selectpicker('hide');
  setTimeout(function() { $('#num_media').selectpicker('show');},20);
  if (update_flag) {
    push_labels_to_json();
  }
  refresh_media(json_data,num_media,video_index);
});

$('#load_dataset').on('hidden.bs.select', function (e) {
  // before loading new file.. better save any labels we already made..
  if (update_flag) {
      push_labels_to_json();
  }
  dataset_load = e.target.value;
  update_label_template();
  document.getElementById("videos").innerHTML = '<font color=white size="20">Loading ' + dataset_load + ' ' + media_type + '... please be patient</font>';
  $('#load_dataset').selectpicker('hide');
  setTimeout(function() { $('#load_dataset').selectpicker('show');},20);
  // reset some things
  load();
});

$('#media_type').on('hidden.bs.select', function (e) {
  //TODO: change this.
  if (update_flag) {
      push_labels_to_json();
  }
  media_type = e.target.value;
  update_label_template();
  document.getElementById("videos").innerHTML = '<font color="' + label_templates_dict['macro']['label_color_map'][dataset_load] + '" size="20">Loading ' + dataset_load + ' ' + granularity_level + ' tag... please be patient</font>';
  $('#granularity').selectpicker('hide');
  setTimeout(function() { $('#granularity').selectpicker('show');},20);
  // reset some things
  load();
//not sure if we need if we are no longer batch taggin...
  //$('#batchTag').selectpicker('hide');
  //setTimeout(function() { $('#batchTag').selectpicker('show');},20);
  //batch_tag(tag_label);
});

function batch_tag(tag) {
  for (var i = video_index; i < num_media+video_index; i++) {
    var tag_input = tag + '_' + i;
    push_labels_to_list(tag_input);
    update_json_data(tag_input);
  }
  push_labels_to_json();
  refresh_media(json_data,num_media,video_index);
}

function refresh_media(data,num_medias,video_index) {
  toggle_list = zeros([num_medias,label_template['label'].length]);
  var media_html = "";
  // go through all the media that need to be displayed on the page
  for (var i = video_index; i < Math.min(num_medias+video_index,max_video); i++) {
    var lift_type_labels = data[i]['labels'];
    // it could be that multiple labels are applied to a media element
    // go through each label and toggle it
    for (j=0;j<lift_type_labels.length;j++) {
      toggle_list[i-video_index][label_template['label'].indexOf(lift_type_labels[j])] = 1;
    }
    src = rootdir + 'images/' +  data[i]['metadata']['folder'] + '/' + data[i]['metadata']['filename'] + '.' + data[i]['metadata']['extension'];
    var video_border_color = label_template['label_color_map'][data[i]['labels']];
    //label_template['background_color'][toggle_list[row].indexOf(1)]
    var on_click = "onclick='this.paused ? this.play() : this.pause();'";
    video_tag = "<li><img id='myVideo" + i + "' height='300' style='padding:0px;border-width:10px 10px 10px 10px; border-style:solid;border-color:" + video_border_color + ";'" + on_click + " src='" + src + "'</li>";

    var progress_bar = "<div class='w3-light-grey' style='width:85%;margin-left:24px;margin-bottom:15px;'><div id='progress-bar" + i + "' class='w3-container' style='height:24px;width:1%;background-color:#2C303C;color:#fff'>0%</div></div>";
    var video_element_string = '"myVideo' + i + '"';
    var media_html_i = '';
    for (var ll=0; ll<num_label_types; ll++) {
      var cur_tag = label_template['label'][ll] + '_' + i;
      var cur_tag_string = '"' + cur_tag + '"'
      var cur_html = label_template['prefix'][ll] + "<button class='w3-button w3-circle " + label_template['hover_color'][ll] + "' id='" + cur_tag + "' onclick='update_video_label(";
      cur_html = cur_html + cur_tag_string + "," + video_element_string + ")' style='background-color:" + label_template['background_color'][ll] + ";color:" + label_template['text_color'][ll] + ";margin:" + label_template['margin'][ll] + ";border:4px solid" + toggle_color[toggle_list[i-video_index][ll]] + ";outline: none;'>"+ label_template['button_text'][ll] +"</button>" + label_template['suffix'][ll];
      media_html_i = media_html_i + cur_html;
    }
    media_html = media_html + "<div style='float:left;'><ul style='list-style-type: none;'>" + video_tag + media_html_i + "</ul></div>\n";
  }
  document.getElementById("videos").innerHTML = media_html;
  for (var i = video_index; i < num_medias+video_index; i++) {
    var vid = document.getElementById("myVideo" + i);
    var progressbar = document.getElementById("progress-bar" + i);
    var video_elem = 'myVideo'+i;
    var playbackRate = 5;
    if (dataset_load=='ASampleAll_aj' || dataset_load=='ASampleAll_jz' || dataset_load=='ASampleAll_pf' || dataset_load == 'bwex_00000_05000' || dataset_load == 'bwex_05000_10000' || dataset_load == 'bwex_10000_15000' || dataset_load == 'bwex_15000_20000' || dataset_load == 'bwex_20000_25000' || dataset_load == 'bwex_25000_30000' || dataset_load == 'bwex_30000_35217') {
      playbackRate = 1;
    } else {
      playbackRate = 5;
    }
    var loop = false;
    if (video_index > video_label_index) {
    //if (data[i]['labels'] == 'none' || data[i]['labels']==null) {
      loop = true;
      if (dataset_load=='ASampleAll_aj' || dataset_load=='ASampleAll_jz' || dataset_load=='ASampleAll_pf' || dataset_load == 'bwex_00000_05000' || dataset_load == 'bwex_05000_10000' || dataset_load == 'bwex_10000_15000' || dataset_load == 'bwex_15000_20000' || dataset_load == 'bwex_20000_25000' || dataset_load == 'bwex_25000_30000' || dataset_load == 'bwex_30000_35217') {
        playbackRate = 1;
      } else {
        playbackRate = 5;
      }
    }
    if (media_type == 'video') {
        enablePlay(vid,playbackRate,loop,i,progressbar);
    }
  }
}

function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

function update_video_label(clicked_id,vid_elem) {
  var row = Number(clicked_id.split('_')[1]) - video_index;
  var column = label_template['label'].indexOf(clicked_id.split('_')[0]);
  var vi = 0;
  if (key_presses[90] == false) {
    for (i=0;i<toggle_list[row].length;i++) {
      toggle_list[row][i] = 0;
      vi = video_index + row;
      var button_id = label_template['label'][i] + '_' + vi;
      document.getElementById(button_id).style.border = '4px solid rgb(55, 62, 75)';
    }
  }
  toggle_list[row][column] = 1 - toggle_list[row][column];
  var button_element = document.getElementById(clicked_id);
  var video_elem = document.getElementById(vid_elem);
  var row_sum = 0;
  for (i=0;i<toggle_list[row].length;i++) { row_sum += toggle_list[row][i]}
  if (row_sum==1) {
    video_elem.style.borderColor = label_template['background_color'][toggle_list[row].indexOf(1)];
  } else {
    video_elem.style.borderColor = '#000';
  }
  //add a border if the button is toggled on, otherwise remove the border if toggle off
  if (button_element.style.border == '4px solid rgb(55, 62, 75)') {
    button_element.style.border = '4px solid rgb(255, 255, 255)';
  } else {
    button_element.style.border = '4px solid rgb(55, 62, 75)';
  }
  //video_elem.style.borderColor = label_template['label_color_map'][clicked_id.split('_')[0]];
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
  update_flag = true;
}

function update_json_data(button_element) {
  video_tag_list = [];
  video_tag_video_index = [];
  for (i=0;i<num_media;i++) {
    var tag_list = [];
    for (j=0;j<toggle_list[i].length;j++) {
      if (toggle_list[i][j] == 1) {
        tag_list.push(label_template['label'][j]);
      }
    }
    json_data[i+video_index]['labels'] = tag_list;
    video_tag_video_index.push(video_index+i);
    video_tag_list.push(tag_list);
  }
}

function push_labels_to_json() {
  $.ajax({
    type: "GET",
    url: $SCRIPT_ROOT + "/submit/",
    contentType: "application/json; charset=utf-8",
    //data:{label_update:JSON.stringify(labels_to_update),rootdir:rootdir,load_data:dataset_load,video_id:video_label_index,granularity:granularity_level},
    data:{label_update:JSON.stringify(video_tag_list),label_update_index:JSON.stringify(video_tag_video_index),rootdir:rootdir,load_data:dataset_load,video_id:video_label_index,media_type:media_type,num_media_on_page:num_media},
    success: function(data) {
        //alert(labels_to_update);
        labels_to_update = [];
        update_flag = false;
        //alert(data.result);
        //if (submit) { submit = false; }
        //d3.select('#my_image').attr("xlink:href","static/imgs/output/"+data.name)
    }
  });
}

// Just load the JSON data once, when the request is made for that tag's videos.
function load() {
    $.ajaxSetup({ cache:false });
    $.getJSON('static/data/labels/' + dataset_load + '_' + media_type + '.json', function(data) {
        json_data = data['data'];
        max_video = json_data.length;
        //video_index = Math.min(document.getElementById("myVideoIndex").value,max_video-num_media-1);
        //video_index = Math.max(0,video_index);
        video_index = data['index'];
        video_label_index = data['index'];
        document.getElementById("myVideoIndex").value = video_index;
        refresh_media(json_data,num_media,video_index);
    });
}

// refer to static/data/anno_templates for label templates. the templates are just the html formatting for the display
function update_label_template() {
    $.ajaxSetup({ cache:false });
    $.getJSON('static/data/anno_templates/' + dataset_load + '_' + media_type + '.json', function(data) {
        label_template = data['label_template'];
        num_label_types = label_template['label'].length;
    });
}

/* key press short cuts:
    f: forward to next batch of images/videos
    d: backward to previous batch of images/videos
    a: save annotations
*/

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
    // 70 is f: go forward num_media clips (effectively the same as pressing next..
    // why don't you combine those?!)
    if (key==70) { // f
      push_labels_to_json();
      video_label_index = Math.max(video_index + num_media - 1,video_label_index);
      video_index = video_index + num_media;
      video_index = Math.min(video_index,max_video-num_media);
      document.getElementById("myVideoIndex").value = video_index;
      refresh_media(json_data,num_media,video_index);
    }
    // 68 is d: go backward num_media clips (effectively the same as pressing prev..
    // why don't you combine those?!)
    else if (key==68) { // d
      push_labels_to_json();
      video_index = video_index - num_media;
      video_index = Math.max(video_index,0);
      document.getElementById("myVideoIndex").value = video_index;
      refresh_media(json_data,num_media,video_index);
    } else if (key==65) { // a: i believe this is for submit
      if (update_flag) { push_labels_to_json(); }
    }
});
