
# Classification Annotation Tool

The **Cl**assification **A**nnotation **T**ool can be used to annotate images or videos with classification labels. This tool allows you to label many media at once, so you save time not needing to individually scroll through each media item. In my experience, anywhere between 500-1500 media can be labeled in an hour.

Note: currently only works on images, as the video compatibility needs to be merged back in.

### To set up ###
0) Decide on your dataset name. The demo one is `demoIm`, which I'll use to illustrate how to set things up.

1) You need to add your images to a folder in `static/data/images`. I usually symlink these, so my images are still separate from the code. In this case though, I put example images in `static/data/images/demoIm` so you can see the tool in action.

2) You need to add your label template to `static/data/anno_templates/` to format the HTML around each image in the annotation tool. In my case, the template is in `demoIm_images.json`. This dataset has three possible class labels: "male", "female", or "no". For each label, we specify the color of the border, the button text, some other HTMl features, etc. The format for this is

```javascript
{"label_template" : {
    "label" : ["male",
               "female",
               "no"],
    "background_color" : ["#0091d5",
                          "#6ab187",
                          "#373E4B"],
    "hover_color" : ["w3-hover-blue",
                     "w3-hover-green",
                     "w3-hover-black"],
    "text_color" : ["#000",
                    "#000",
                    "#000000; box-shadow: 0px 0px 7px 7px rgba(1,0,0,0.24), 0px 0px 12px 12px rgba(1,0,0,0.19)"],
    "margin" : ["5px",
                "5px",
                "5px 5px 5px 20px"],
    "button_text" : ["Male",
                     "Female",
                     "X"],
    "prefix" : ["<li><div class='w3-container'>",
                "",
                ""],
    "suffix" : ["",
                "",
                "</div>"],
    "label_color_map" : {
        "male"   : "#0091d5",
        "female" : "#6ab187",
        "no"     : "#373E4B"
    }
 }
}
```

3) Finally, you need to generate the label file and place it in `static/data/labels/`. In the demo case, this is in the file `static/data/labels/demoIm_images.json`. The format is the following:

```javascript
{
    "data": [
        {
            "labels": [
                "female"
            ],
            "metadata": {
                "extension": "jpg",
                "filename": "17267929_1456014704450752_7028539110310543360_n",
                "folder": "demoIm"
            }
        },
        {
            "labels": [
                "female"
            ],
            "metadata": {
                "extension": "jpg",
                "filename": "17438286_1243109542454982_2617717322063806464_n",
                "folder": "demoIm"
            }
        }
    ],
    "index": 1
}
```

Some things to note:

* The values in `"labels"` should exist in your `label_template` list in the annotation template JSON.
* The value of `"folder"` needs to match the folder in `static/data/images` where your images live.
* The index corresponds to the first image the tool should load. So, if the last image you labeled was index 5, and you reload the tool (assuming you saved annotations), then it should start with index 6 (and the JSON `"index"` value should have been updated to 6).
* You should set the default label to whatever class you think is going to be more frequent.

### To run ###

`python -m app`

And then navigate to [http://0.0.0.0:5000/](http://0.0.0.0:5000/) in your browser. I've tested this on Chrome only. 

There are a couple of keyboard shortcuts that make it faster to navigate to the next (press `f`) and previous batch of images (press `d`). When you navigate, it saves the labels you just did. If you exit the page without saving by either navigating (with buttons on page or keys) or pressing submit (there's a button and the key `a` is a shortcut), your current page labels will not save.

### To make changes ###

1) Back end is in [app.py](app.py)
2) Front end is in [static/js/script_ims.js](static/js/script_ims.js)
3) Webpage is in [templates/index.html](templates/index.html)

Note that when `script_ims.js` is updated, you have to change the version number for it in `index.html`. If you know a fix for this, let me know! It's pretty annoying to update the version number every time.
