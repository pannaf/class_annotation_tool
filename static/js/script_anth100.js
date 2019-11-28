console.log("loading filtering annotation app...")

// this is for the pool plane canvas
var width = 702+13*2,
    height = 520+13*2,
    resolution = 13,
    r = 15;

var key_presses = {};
key_presses[90] = false;
window.onkeyup = function(e) {
  key_presses[e.keyCode] = false;
}
window.onkeydown = function(e) {
  key_presses[e.keyCode] = true;
  console.log(key_presses);
}
//var submit = false;
var granularity_level = 'micro'
var label_templates_dict = {
  "macro": {
    "label" : ["squat","benchpress","deadlift","accessory","cleanandjerk","snatch","multilift","none"],
    "background_color" : ["#0091d5","#6ab187","#ea6a47","#e0e0e0","#C889DB","#FDC02F","#1b1e26","#373E4B"],
    "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-sand","w3-hover-purple","w3-hover-yellow","","w3-hover-black"],
    "text_color" : ["#000","#000","#000","#000","#000","#000","#FEDDDE","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
    "margin" : ["5px","5px","5px","5px 5px 5px 20px","5px","5px","5px 5px 5px 20px","5px 5px 5px 40px"],
    "button_text" : ["S","B","D","A","CJ","Sn","ML","<b>X</b>"],
    "prefix" : ["<li><div class='w3-container'>","","","","<div class='w3-container'>","","",""],
    "suffix" : ["","","","</div>","","","","</div></li>"],
    "label_color_map" : {
      "squat" : "#0091d5",
      "benchpress" : "#6ab187",
      "deadlift" : "#ea6a47",
      "accessory" : "#e0e0e0",
      "cleanandjerk" : "#C889DB",
      "snatch" : "#FDC02F",
      "multilift" : "#1b1e26",
      "none" : "#373E4B"
    }
  },
  "micro" : {
    "squat" : {
     "label" : ["overhead","front","back","accessory","zercher","none"],
     "background_color" : ["#0091d5","#6ab187","#ea6a47","#e0e0e0","#C889DB","#373E4B"],
     "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-sand","w3-hover-purple","w3-hover-black"],
     "text_color" : ["#000","#000","#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
     "margin" : ["5px","5px","5px","5px 5px 5px 20px","5px","5px 5px 5px 40px"],
     "button_text" : ["Overhead","Front","Back","A","Zercher","<b>X</b>"],
     "prefix" : ["<li><div class='w3-container'>","","","","<div class='w3-container'>",""],
     "suffix" : ["","","","</div>","","</div></li>"],
     "label_color_map" : {
       "overhead" : "#0091d5",
       "front" : "#6ab187",
       "back" : "#ea6a47",
       "accessory" : "#e0e0e0",
       "zercher" : "#C889DB",
       "none" : "#373E4B"
     }
    },
    "benchpress" : {
      "label" : ["regular","incline","decline","accessory","closegrip","widegrip","none"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#e0e0e0","#C889DB","#FDC02F","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-sand","w3-hover-purple","w3-hover-yellow","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px","5px","5px 5px 5px 20px","5px 5px 5px 40px"],
      "button_text" : ["Regular","Incline","Decline","A","Close","Wide","<b>X</b>"],
      "prefix" : ["<li><div class='w3-container'>","","","","<div class='w3-container'>","",""],
      "suffix" : ["","","","</div>","","","</div></li>"],
      "label_color_map" : {
        "regular" : "#0091d5",
        "incline" : "#6ab187",
        "decline" : "#ea6a47",
        "accessory" : "#e0e0e0",
        "closegrip" : "#C889DB",
        "widegrip" : "#FDC02F",
        "none" : "#373E4B"
      }
    },
    "deadlift" : {
      "label" : ["conventional","sumo","stiffleg","accessory","trapbar","none"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#e0e0e0","#C889DB","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-sand","w3-hover-purple","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px","5px","5px 5px 5px 40px"],
      "button_text" : ["Conventional","Sumo","Stiff leg","A","Trap bar","<b>X</b>"],
      "prefix" : ["<li><div class='w3-container'>","","","","<div class='w3-container'>",""],
      "suffix" : ["","","","</div>","","</div></li>"],
      "label_color_map" : {
        "conventional" : "#0091d5",
        "sumo" : "#6ab187",
        "stiffleg" : "#ea6a47",
        "accessory" : "#e0e0e0",
        "trapbar" : "#C889DB",
        "none" : "#373E4B"
      }
    },
    "cleanandjerk" : {
      "label" : ["powerclean","hangclean","floorclean","accessory","powerjerk","splitjerk","squatjerk","none"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#e0e0e0","#C889DB","#FDC02F","#1b1e26","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-sand","w3-hover-purple","w3-hover-yellow","","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000","#000","#000","#FEDDDE","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px","5px","5px","5px","5px 5px 5px 40px"],
      "button_text" : ["Power Cl","Hang Cl","Floor Cl","A","Power Je","Split Je","Squat Je","<b>X</b>"],
      "prefix" : ["<li><div class='w3-container'>","","","","<div class='w3-container'>","","",""],
      "suffix" : ["","","","</div>","","","","</div></li>"],
      "label_color_map" : {
        "powerclean" : "#0091d5",
        "hangclean" : "#6ab187",
        "floorclean" : "#ea6a47",
        "accessory" : "#e0e0e0",
        "powerjerk" : "#C889DB",
        "splitjerk" : "#FDC02F",
        "squatjerk" : "#1b1e26",
        "none" : "#373E4B"
      }
    },
    "snatch" : {
      "label" : ["power","floor","hang","accessory","muscle","balance","none"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#e0e0e0","#C889DB","#FDC02F","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-sand","w3-hover-purple","w3-hover-yellow","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px","5px","5px","5px 5px 5px 40px"],
      "button_text" : ["Power","Floor","Hang","A","Muscle","Balance","<b>X</b>"],
      "prefix" : ["<li><div class='w3-container'>","","","","<div class='w3-container'>","",""],
      "suffix" : ["","","","</div>","","","</div></li>"],
      "label_color_map" : {
        "power" : "#0091d5",
        "floor" : "#6ab187",
        "hang" : "#ea6a47",
        "accessory" : "#e0e0e0",
        "muscle" : "#C889DB",
        "balance" : "#FDC02F",
        "none" : "#373E4B"
      }
    },
    "ASampleAll_aj" : {
      "label" : ["yes","singleperson","fastfps","no"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","Alone","Fast","X"],
      "prefix" : ["<li><div class='w3-container'>","","",""],
      "suffix" : ["","","","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B",
        "single_person" : "#6ab187",
        "fast_fps" : "#ea6a47"
      }
    },
    "ASampleAll_jz" : {
      "label" : ["yes","singleperson","fastfps","no"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","Alone","Fast","X"],
      "prefix" : ["<li><div class='w3-container'>","","",""],
      "suffix" : ["","","","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B",
        "single_person" : "#6ab187",
        "fast_fps" : "#ea6a47"
      }
    },
    "ASampleAll_pf" : {
      "label" : ["yes","singleperson","fastfps","no"],
      "background_color" : ["#0091d5","#6ab187","#ea6a47","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-deep-orange","w3-hover-black"],
      "text_color" : ["#000","#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","Alone","Fast","X"],
      "prefix" : ["<li><div class='w3-container'>","","",""],
      "suffix" : ["","","","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B",
        "single_person" : "#6ab187",
        "fast_fps" : "#ea6a47"
      }
    },
    "candid100k" : {
      "label" : ["male","female","no"],
      "background_color" : ["#0091d5","#6ab187","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-green","w3-hover-black"],
      "text_color" : ["#000","#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px","5px 5px 5px 20px"],
      "button_text" : ["Male","Female","X"],
      "prefix" : ["<li><div class='w3-container'>","",""],
      "suffix" : ["","","</div>"],
      "label_color_map" : {
        "male" : "#0091d5",
        "female" : "#373E4B",
        "no" : "#ea6a47"
      }
    },
    "bwex_00000_05000" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    },
    "bwex_05000_10000" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    },
    "bwex_10000_15000" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    },
    "bwex_15000_20000" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    },
    "bwex_20000_25000" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    },
    "bwex_25000_30000" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    },
    "bwex_30000_35217" : {
      "label" : ["yes","no"],
      "background_color" : ["#0091d5","#373E4B"],
      "hover_color" : ["w3-hover-blue","w3-hover-black"],
      "text_color" : ["#000","#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
      "margin" : ["5px","5px 5px 5px 20px"],
      "button_text" : ["Yes!","X"],
      "prefix" : ["<li><div class='w3-container'>",""],
      "suffix" : ["","</div>"],
      "label_color_map" : {
        "yes" : "#0091d5",
        "no" : "#373E4B"
      }
    }
  }
}
var toggle_color = ['#373E4B','#FFF'];
var toggle_list = [];
var num_label_types = 0;
var label_template = {};
var load_file = 'squat';
update_label_template();


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
var json_data;
var video_index = 0;
var video_label_index = 0;
var max_video = 5;
var labels_to_update = [];
var update_flag = false;

var video_tag_list = [];
var video_tag_video_index = [];

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
  update_label_template();
  document.getElementById("videos").innerHTML = '<font color="' + label_templates_dict['macro']['label_color_map'][load_file] + '" size="20">Loading ' + load_file + ' ' + granularity_level + ' tag... please be patient</font>';
  $('#loadFile').selectpicker('hide');
  setTimeout(function() { $('#loadFile').selectpicker('show');},20);
  // reset some things
  load();
});

$('#granularity').on('hidden.bs.select', function (e) {
  //TODO: change this.
  if (update_flag) {
      push_labels_to_json();
  }
  granularity_level = e.target.value;
  update_label_template();
  document.getElementById("videos").innerHTML = '<font color="' + label_templates_dict['macro']['label_color_map'][load_file] + '" size="20">Loading ' + load_file + ' ' + granularity_level + ' tag... please be patient</font>';
  $('#granularity').selectpicker('hide');
  setTimeout(function() { $('#granularity').selectpicker('show');},20);
  // reset some things
  load();
//not sure if we need if we are no longer batch taggin...
  //$('#batchTag').selectpicker('hide');
  //setTimeout(function() { $('#batchTag').selectpicker('show');},20);
  //batch_tag(tag_label);
});

// TODO: load_file is some pretty horrible naming. fix that.
function update_label_template() {
  if (granularity_level == 'macro') {
    label_template = label_templates_dict[granularity_level];
  }
  else {
    label_template = label_templates_dict[granularity_level][load_file];
  }
  num_label_types = label_template["label"].length;
}

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
  // TODO: x and x_guts is some pretty terrible naming
  console.log('refreshing..');
  console.log(num_videos);
  toggle_list = zeros([num_videos,label_template['label'].length]);
  var x = "";
  for (var i = video_index; i < num_videos+video_index; i++) {
    var lift_type_labels = data[i]['gt_labels']['lift_type'];
    for (j=0;j<lift_type_labels.length;j++) {
      toggle_list[i-video_index][label_template['label'].indexOf(lift_type_labels[j])] = 1;
    }
    src = rootdir + 'videos/' +  data[i]['metadata']['folder'] + '/' + data[i]['metadata']['filename'] + '.' + data[i]['metadata']['extension'];
    var video_border_color = label_template['label_color_map'][data[i]['gt_labels']['lift_type']];
    console.log('video border color');
    console.log(video_border_color);
    var on_click = "onclick='this.paused ? this.play() : this.pause();'";
    video_tag = "<li><img id='myVideo" + i + "' height='300' style='padding:0px;border-width:10px 10px 10px 10px; border-style:solid;border-color:" + video_border_color + ";'" + on_click + " src='" + src + "'</li>";

    var progress_bar = "<div class='w3-light-grey' style='width:85%;margin-left:24px;margin-bottom:15px;'><div id='progress-bar" + i + "' class='w3-container' style='height:24px;width:1%;background-color:#2C303C;color:#fff'>0%</div></div>";
    var video_element_string = '"myVideo' + i + '"';
    var x_guts = '';
    //How do we go about grabbing the 'correct' background_colors??
    //I don't understand what suffix is doing...
    for (var ll=0; ll<num_label_types; ll++) {
      var cur_tag = label_template['label'][ll] + '_' + i;
      var cur_tag_string = '"' + cur_tag + '"'
      var cur_html = label_template['prefix'][ll] + "<button class='w3-button w3-circle " + label_template['hover_color'][ll] + "' id='" + cur_tag + "' onclick='update_video_label(";
      cur_html = cur_html + cur_tag_string + "," + video_element_string + ")' style='background-color:" + label_template['background_color'][ll] + ";color:" + label_template['text_color'][ll] + ";margin:" + label_template['margin'][ll] + ";border:4px solid" + toggle_color[toggle_list[i-video_index][ll]] + ";outline: none;'>"+ label_template['button_text'][ll] +"</button>" + label_template['suffix'][ll];
      x_guts = x_guts + cur_html;
    }
    x = x + "<div style='float:left;'><ul style='list-style-type: none;'>" + video_tag + x_guts + "</ul></div>\n";
  }
  console.log('depress toggle');
  console.log(toggle_list);
  document.getElementById("videos").innerHTML = x;
  for (var i = video_index; i < num_videos+video_index; i++) {
    var vid = document.getElementById("myVideo" + i);
    var progressbar = document.getElementById("progress-bar" + i);
    var video_elem = 'myVideo'+i;
    var playbackRate = 5;
    if (load_file=='ASampleAll_aj' || load_file=='ASampleAll_jz' || load_file=='ASampleAll_pf' || load_file == 'bwex_00000_05000' || load_file == 'bwex_05000_10000' || load_file == 'bwex_10000_15000' || load_file == 'bwex_15000_20000' || load_file == 'bwex_20000_25000' || load_file == 'bwex_25000_30000' || load_file == 'bwex_30000_35217') {
      playbackRate = 1;
      console.log('playbackRate'); console.log(playbackRate);
    } else {
      playbackRate = 5;
    }
    var loop = false;
    if (video_index > video_label_index) {
    //if (data[i]['gt_labels']['lift_type'] == 'none' || data[i]['gt_labels']['lift_type']==null) {
      loop = true;
      console.log('load_file');console.log(load_file);
      if (load_file=='ASampleAll_aj' || load_file=='ASampleAll_jz' || load_file=='ASampleAll_pf' || load_file == 'bwex_00000_05000' || load_file == 'bwex_05000_10000' || load_file == 'bwex_10000_15000' || load_file == 'bwex_15000_20000' || load_file == 'bwex_20000_25000' || load_file == 'bwex_25000_30000' || load_file == 'bwex_30000_35217') {
        playbackRate = 1;
        console.log('playbackRate'); console.log(playbackRate);
      } else {
        playbackRate = 5;
      }
    }
    enablePlay(vid,playbackRate,loop,i,progressbar);
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
      console.log(button_id);
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
  console.log('in push labels to list');
  update_flag = true;
}

function update_json_data(button_element) {
  console.log('in update json data');
  console.log(button_element);
  video_tag_list = [];
  video_tag_video_index = [];
  for (i=0;i<num_video;i++) {
    var tag_list = [];
    for (j=0;j<toggle_list[i].length;j++) {
      if (toggle_list[i][j] == 1) {
        tag_list.push(label_template['label'][j]);
      }
    }
    json_data[i+video_index]['gt_labels']['lift_type'] = tag_list;
    video_tag_video_index.push(video_index+i);
    video_tag_list.push(tag_list);
  }
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
    //data:{label_update:JSON.stringify(labels_to_update),rootdir:rootdir,load_data:load_file,video_id:video_label_index,granularity:granularity_level},
    data:{label_update:JSON.stringify(video_tag_list),label_update_index:JSON.stringify(video_tag_video_index),rootdir:rootdir,load_data:load_file,video_id:video_label_index,granularity:granularity_level,num_video_on_page:num_video},
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
function load() {
    console.log('loading function');
    $.ajaxSetup({ cache:false });
    console.log('did i cache this?');
    console.log('location: static/video_data/labels/' + load_file + '_' + granularity_level + '.json');
    $.getJSON('static/video_data/labels/' + load_file + '_' + granularity_level + '.json', function(data) {
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
