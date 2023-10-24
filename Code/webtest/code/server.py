from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO, emit
from cpp_interface import CppInterface
import os


app = Flask(__name__, static_folder='build')
socketio = SocketIO(app, cors_allowed_origins="*")
cpp = CppInterface('./cppprogram/run')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@socketio.on('disconnect')
def handle_disconnect():
    global cpp
    # 终止C++进程
    if cpp:
        cpp.terminate_process()
    # 重新启动C++程序（如果需要）
    cpp = CppInterface('./cppprogram/run')

    
@socketio.on('initialize')
def handle_initialize(data):
    #print("[SERVER] Received initialization data:", data) 
    array = data['array']
    num = data['int1']
    dcat = data['int2']
    dnum = data['int3']

    pair1, pair2, node_vectors, node_upperBound, node_lowerBound, relation_vectors, ext_vectors = cpp.initialize(array, num, dcat, dnum)

    #print("[SERVER] Received data from C++:", pair1, pair2, node_vectors, relation_vectors, ext_vectors)
    emit('initialized', {'pair1': pair1, 'pair2': pair2, 'node_vectors': node_vectors, 'node_upperBound': node_upperBound, 'node_lowerBound': node_lowerBound,'relation_vectors': relation_vectors, 'ext_vectors': ext_vectors})

@socketio.on('send_integer')
def handle_integer(data):
    integer = data['integer']

    pair1, pair2, node_vectors, node_upperBound, node_lowerBound, relation_vectors, ext_vectors, leftpoints = cpp.send_integer(integer)

    #print("[SERVER] Received data from C++:", pair1, pair2, node_vectors, relation_vectors, ext_vectors)
    emit('send_integer', {'pair1': pair1, 'pair2': pair2, 'node_vectors': node_vectors, 'node_upperBound': node_upperBound, 'node_lowerBound': node_lowerBound, 'relation_vectors': relation_vectors, 'ext_vectors': ext_vectors, 'leftpoints': leftpoints})

if __name__ == '__main__':
    socketio.run(app)
