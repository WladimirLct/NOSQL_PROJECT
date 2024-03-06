import flask
import mongo_handler

app = flask.Flask(__name__)
db = mongo_handler.connect_to_mongo()

port = 5000

@app.route('/')
def index():
    return flask.render_template('index.html', cities=mongo_handler.get_cities(db))

@app.route('/getDates', methods=['GET'])
def get_dates():
    city_name = flask.request.args.get('city_name')
    return flask.jsonify(mongo_handler.get_dates(db, city_name))

@app.route('/get_all_latest_weather_data', methods=['GET'])
def get_weather_data():
    date = flask.request.args.get('date')
    city_name = flask.request.args.get('city_name')

    result = mongo_handler.get_weather_data(db, city_name, date)  
    return flask.jsonify(result)

@app.route('/weather_change_alert', methods=['GET'])
def weather_change_alert():
    city_name = flask.request.args.get('city_name')
    result = mongo_handler.weather_pattern_alerts(db, city_name, 15 ,5)
    return flask.jsonify(result)

@app.route('/get_seven_day_forecast', methods=['GET'])
def get_seven_day_forecast():
    city_name = flask.request.args.get('city_name')
    result = mongo_handler.get_seven_day_forecast(db, city_name)
    return flask.jsonify(result)

@app.route('/get_daily_weather_data', methods=['GET'])
def get_daily_weather_data():
    city_name = flask.request.args.get('city_name')
    data_name = flask.request.args.get('data_name')
    document_name = flask.request.args.get('document_name')
    date = flask.request.args.get('date')
    result = mongo_handler.get_daily_weather_data(db, city_name, data_name, document_name, date)
    return flask.jsonify(result)

@app.route('/get_bad_air_quality_cities', methods=['GET'])
def get_bad_air_quality_cities():
    date = flask.request.args.get('date')
    city_name = flask.request.args.get('city_name')
    result = mongo_handler.get_bad_air_quality_cities(db, date, city_name)
    return flask.jsonify(result)

@app.route('/get_last_and_next_day', methods=['GET'])
def get_last_and_next_day():
    date = flask.request.args.get('date')
    city_name = flask.request.args.get('city_name')
    data_name = flask.request.args.get('data_name')
    document_name = flask.request.args.get('document_name')
    result = mongo_handler.get_last_and_next_day(db, date, city_name,document_name,data_name)
    return flask.jsonify(result)

if __name__ == '__main__':
    app.run(port=port, debug=True)