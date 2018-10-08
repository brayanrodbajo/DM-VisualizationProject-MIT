from flask import Flask, request, render_template, jsonify, redirect, session


app = Flask(__name__)


@app.route('/',  methods = ['GET'])
def play():
    return render_template('tiempo_espera.html')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
