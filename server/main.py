import flask
from flask import send_from_directory
import mongo_handler

app = flask.Flask(__name__)

port = 8080

db = mongo_handler.connect_to_mongo()

@app.route('/')
def index():
    # Send file from ../client/index.html
    return flask.render_template('index.html', cities=mongo_handler.get_cities(db))

@app.route('/dashboard.html', methods=['GET'])
def render_dashboard():	
    return flask.render_template('dashboard.html', cities=mongo_handler.get_cities(db))

@app.route('/get_all_latest_weather_data', methods=['GET'])
def get_all_latest_weather_data_all():
    city_name = flask.request.args.get('city_name')

    weather_data_requests = [
        ("temp_c", "temperatures"),
        ("feelslike_c", "temperatures"),
        ("wind_kph", "wind"),
        ("humidity", "precipitations"),
        ("uv", "basics"),
        ("pressure_mb", "temperatures"),
        ("precip_mm", "precipitations"),
        ("condition", "basics"),
        ("last_updated", "basics")
    ]

    weather_data_results = {}

    for data_name, document_name in weather_data_requests:
        result = mongo_handler.get_latest_weather_data(db, city_name, data_name, document_name)
        weather_data_results[data_name] = result
      
    return flask.jsonify(weather_data_results)

@app.route('/predict_temp_extremes_next_7_days', methods=['GET'])
def predict_temp_extremes_next_7_days():
    city_name = flask.request.args.get('city_name')
    start_date = flask.request.args.get('start_date')
    result = mongo_handler.predict_temp_extremes_next_7_days(db, city_name, start_date)
    return flask.jsonify(result)


@app.route('/get_daily_weather_data', methods=['GET'])
def get_daily_weather_data():
    city_name = flask.request.args.get('city_name')
    data_name = flask.request.args.get('data_name')
    document_name = flask.request.args.get('document_name')
    date = flask.request.args.get('date')
    result = mongo_handler.get_daily_weather_data(db, city_name, data_name, document_name, date)
    return flask.jsonify(result)


@app.route('/get_latest_weather_data', methods=['GET'])
def get_latest_weather_data():
    city_name = flask.request.args.get('city_name')
    data_name = flask.request.args.get('data_name')
    document_name = flask.request.args.get('document_name')
    result = mongo_handler.get_latest_weather_data(db, city_name, data_name, document_name)
    return flask.jsonify(result)


@app.route('/get_wind_strength', methods=['GET'])
def get_wind_strength():
    city_name = flask.request.args.get('city_name')
    date = flask.request.args.get('date')
    result = mongo_handler.get_wind_strength(db, city_name, date)
    return flask.jsonify(result)


@app.route('/get_temperature_extremes', methods=['GET'])
def get_temperature_extremes():
    city_name = flask.request.args.get('city_name')
    date = flask.request.args.get('date')
    result = mongo_handler.get_temperature_extremes(db, city_name, date)
    return flask.jsonify(result)


@app.route('/get_bad_air_quality_cities', methods=['GET'])
def get_bad_air_quality_cities():
    date = flask.request.args.get('date')
    result = mongo_handler.get_bad_air_quality_cities(db, date)
    return flask.jsonify(result)


if __name__ == '__main__':
    app.run(port=port, debug=True)