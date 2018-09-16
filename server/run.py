import os
import json
from flask import Flask, request, Response, render_template

UPLOAD_DIR = os.path.abspath('./data')
LOG_FILENAME = "data.log"
ALLOWED_EXTENSIONS = set(['log'])

app = Flask(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.split('.', 1)[-1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/recive', methods=['POST'])
def recive():
    if 'file' not in request.files:
        content = json.dumps({
            'error': "can't upload files"
        })
        return Response(content, status=400, mimetype='application/json')

    file = request.files['file']

    if file.filename == '':
        content = json.dumps({
            'error': "No selected file."
        })
        return Response(content, status=400, mimetype='application/json')

    if file and allowed_file(file.filename):
        file.save(os.path.join(UPLOAD_DIR, "temp.log"))

        with open(os.path.join(UPLOAD_DIR, "data.log"), 'a') as outfile:
            with open(os.path.join(UPLOAD_DIR, "temp.log"), 'r') as infile:
                outfile.write(infile.read())

        content = json.dumps({
            'success': True
        })
        return Response(content, status=200, mimetype='application/json')

    content = json.dumps({
        'error': "can't upload files"
    })
    resp = Response(content, status=400, mimetype='application/json')
    return resp

@app.route('/api/get', methods=['GET', 'POST'])
def get():
    file = open(os.path.join(UPLOAD_DIR, LOG_FILENAME))
    content = json.dumps({
        "content": file.read()
    })
    return Response(content, status=200, mimetype='application/json')

@app.route('/api/clear', methods=['GET'])
def clear():
    file = open(os.path.join(UPLOAD_DIR, LOG_FILENAME), "w")
    content = json.dumps({
        "success": True
    })
    return Response(content, status=200, mimetype='application/json')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)