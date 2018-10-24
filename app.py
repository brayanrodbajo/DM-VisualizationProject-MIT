from flask import Flask, request, render_template, jsonify, redirect, session
from database import query_tiempo_espera_horas

app = Flask(__name__)


@app.route('/',  methods = ['GET'])
def play():
    tiempo_espera = query_tiempo_espera_horas()
    return render_template('tiempo_espera.html', dataset_tiempo_espera=tiempo_espera)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
