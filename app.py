"""Field calibration app."""
from flask import Flask, request, render_template, jsonify, redirect, session, abort
import os
import json
import numpy as np
import random
import glob
import pdb

app = Flask(__name__)

app.config.update(dict(DEBUG=True))

#folder_path = 'static/imgs/20180128_SJSUvCAL/'

@app.route('/')
def index():
    """Call webpage."""
    #print(folder_path)
    #files = glob.glob(folder_path + '*png')
    #files.sort()
    #filenames = []
    #for f in files:
    #    filenames.append(f.replace(folder_path, ""))
    return render_template('index.html')

'''@app.route('/login', methods=['POST','GET'])
def do_admin_login():
    #flash("hello")
    if request.form['password'] == 'password' and request.form['username'] == 'admin':
        session['logged_in'] = True
    else:
        pass
    return index()'''

@app.route('/submit/')
def submit():
    """The save function."""
    print("annotations submitted")
    #input = int(request.args.get("input"))
    #pdb.set_trace()
    #print(request.args.get('label_update'))
    label_update = json.loads(request.args.get('label_update'))
    ## this should be /static/video_data/
    rootdir = str(request.args.get('rootdir'))
    ## this is the lift type
    load_data = str(request.args.get('load_data'))
    ## video index - this gets maintained
    video_id = int(request.args.get('video_id'))
    ## media_type
    media_type = str(request.args.get('media_type'))
    ## number of videos on page
    num_media_on_page = int(request.args.get('num_media_on_page'))
    ## current video index - the index in the textbox
    video_index_c = json.loads(request.args.get('label_update_index'))

    # read the JSON data
    json_filename = '.{}{}{}_{}.json'.format(rootdir, 'labels/', load_data, media_type)
    with open(json_filename, 'r') as fp:
        json_data = json.load(fp)

    for (id, label) in enumerate(label_update):
        # label_id = [str(li) for li in label_id]
        idx = video_index_c[id]
        # print(idx)
        # update the JSON data
        json_data['data'][idx]['gt_labels']['lift_type'] = label

    if len(video_index_c) > 0 and video_index_c[-1] > video_id:
        json_data['index'] = video_id + num_media_on_page

    # write the new JSON file
    with open(json_filename, 'w') as outfile:
        json.dump(json_data, outfile, sort_keys=True, indent=4, separators=(',', ': '))

    return jsonify({'return': 0})

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host='0.0.0.0', port=5000, passthrough_errors=False) #, threaded=True)
