from flask import Flask, request, render_template, jsonify, redirect, session
from database import query_tiempo_espera_horas, query_numero_pacientes, query_utilizacion_pacientes, query_costo_pacientes
import json

app = Flask(__name__)


@app.route('/',  methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    if request.method == 'POST':
        data = request.get_json()
        if data['req']=='te':
            return redirect('/tiempo_espera')
        elif data['req']=='np':
            return redirect('/numero_pacientes')
        elif data['req']=='up':
            return redirect('/utilizacion_pacientes')
        else:
            return redirect('/costo_pacientes')

@app.route('/tiempo_espera',  methods=['GET', 'POST'])
def tiempo_espera():
    if request.method == 'GET':
        tiempo_espera = query_tiempo_espera_horas()
        return render_template('tiempo_espera.html', dataset=tiempo_espera)
    if request.method == 'POST':
        data = request.get_json()
        tiempo_espera = query_tiempo_espera_horas(data['date_from'], data['date_to'])
        return json.dumps({'dataset':tiempo_espera})


@app.route('/numero_pacientes',  methods=['GET', 'POST'])
def numero_pacientes():
    if request.method == 'GET':
        numero_pacientes = query_numero_pacientes()
        return render_template('numero_pacientes.html', dataset=numero_pacientes)
    if request.method == 'POST':
        data = request.get_json()
        numero_pacientes = query_numero_pacientes(data['date_from'], data['date_to'])
        return json.dumps({'dataset':numero_pacientes})



@app.route('/utilizacion_pacientes',  methods=['GET', 'POST'])
def utilizacion_pacientes():
    if request.method == 'GET':
        utilizacion_pacientes = query_utilizacion_pacientes("hospitalizaciones")
        return render_template('utilizacion_pacientes.html', dataset=utilizacion_pacientes)
    if request.method == 'POST':
        data = request.get_json()
        if 'date_from' in data:
            utilizacion_pacientes = query_utilizacion_pacientes(data['servicio'], data['date_from'], data['date_to'])
        else:
            utilizacion_pacientes = query_utilizacion_pacientes(data['servicio'])
        return json.dumps({'dataset':utilizacion_pacientes})



@app.route('/costo_pacientes',  methods=['GET', 'POST'])
def costo_pacientes():
    if request.method == 'GET':
        costo_pacientes = query_costo_pacientes()
        return render_template('costo_pacientes.html', dataset=costo_pacientes)
    if request.method == 'POST':
        data = request.get_json()
        costo_pacientes = query_costo_pacientes(data['date_from'], data['date_to'])
        return json.dumps({'dataset':costo_pacientes})


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
