import pymongo
import dotenv
from datetime import datetime, timedelta

# Connects to MongoDB and returns the database object
def connect_to_mongo():
    dotenv.load_dotenv()
    mongo_url = dotenv.get_key(dotenv.find_dotenv(), "MONGO_URL")
    client = pymongo.MongoClient(mongo_url)
    return client["nosql_project"]



# Filters and aggregates data based on given criteria in the MongoDB collection
def aggregate_data(collection, pipeline):
    return list(collection.aggregate(pipeline))



# Helper functions to create pipelines for MongoDB aggregation
def create_air_quality_pipeline(start_datetime, end_datetime):
    return [
        {"$match": {
            'last_updated': {'$gte': start_datetime, '$lte': end_datetime},
            "$or": [{"co": {"$gt": 4000}}, {"no2": {"$gt": 25}}, {"o3": {"$gt": 100}}, {"so2": {"$gt": 40}}]}},
        {"$project": {"_id": 0, "city_id": 1, "last_updated": 1}}
    ]


def create_temperature_pipeline(city_name, date_field, start_datetime, end_datetime):
    return [
        {"$match": {'city_id': city_name, date_field: {'$gte': start_datetime, '$lte': end_datetime}}},
        {"$sort": {"temp_c": -1}},
        {"$group": {"_id": "$city_id", "max_temp": {"$first": "$temp_c"}, "min_temp": {"$last": "$temp_c"}}},
        {"$project": {"_id": 0, "city_id": "$_id", "max_temp": 1, "min_temp": 1}}
    ]


def create_wind_pipeline(city_name, start_datetime, end_datetime):
    return [
        {"$match": {'city_id': city_name, 'last_updated': {'$gte': start_datetime, '$lte': end_datetime}}},
        {"$sort": {"wind_kph": -1}},
        {"$limit": 1},
        {"$project": {"_id": 0, "last_updated": 1, "wind_kph": 1}}
    ]


def get_cities(db):
    city_name_id_list = list(db["cities"].find({}, {"_id": 1, "country": 1}, sort=[("population", pymongo.DESCENDING)]))
    return city_name_id_list

# Gets air quality data for cities with poor air quality on a specific date
def get_bad_air_quality_cities(db, date):
    collection = db["air_quality"]
    start_datetime, end_datetime = get_day_start_end(date)

    pipeline = create_air_quality_pipeline(start_datetime, end_datetime)
    return format_city_dates(aggregate_data(collection, pipeline))


# Gets the highest and lowest temperatures for a specified city and date
def get_temperature_extremes(db, city_name, date, document_name="temperatures"):
    collection = db[document_name]
    date_field = "time" if document_name == "forecast_temperatures" else "last_updated"
    start_datetime, end_datetime = get_day_start_end(date)

    pipeline = create_temperature_pipeline(city_name, date_field, start_datetime, end_datetime)
    result = aggregate_data(collection, pipeline)
    return format_temperature_data(result, city_name, date)


# Gets the wind strength for a specified city and date
def get_wind_strength(db, city_name, date):
    collection = db["wind"]
    start_datetime, end_datetime = get_day_start_end(date)

    pipeline = create_wind_pipeline(city_name, start_datetime, end_datetime)
    result = aggregate_data(collection, pipeline)
    return format_wind_data(result, city_name)


# Gets the latest weather data for a specified city
def get_latest_weather_data(db, city_name, data_name, document_name):
    collection = db[document_name]
    result = collection.find_one({'city_id': city_name}, sort=[('last_updated', pymongo.DESCENDING)])
    return format_latest_data(result, city_name, data_name)


# Gets daily weather data for a specified city and date
def get_daily_weather_data(db, city_name, data_name, document_name, date):
    collection = db[document_name]
    start_of_day, end_of_day = get_full_day_range(date)

    query = {'city_id': city_name, 'last_updated': {'$gte': start_of_day, '$lte': end_of_day}}
    results = collection.find(query, sort=[('last_updated', pymongo.ASCENDING)])
    return format_daily_data(results, data_name)

def get_seven_day_forecast(db, city_name):
    collection = db["forecast_day"];
    query = {'city_id': city_name}
    keep = {'_id': 0, 'city_id': 1, 'info': 1, 'condition': 1, 'date': 1}
    results = collection.find(query, keep, sort=[('date', pymongo.ASCENDING)])
    return [r for r in results]


# Predicts temperature extremes for the next 7 days
def predict_temp_extremes_next_7_days(db, city_name, start_date):
    date = datetime.strptime(start_date, '%Y-%m-%d')
    predictions = []

    for _ in range(7):
        next_date = date.strftime('%Y-%m-%d')
        predictions.append(get_temperature_extremes(db, city_name, next_date, "forecast_temperatures"))
        date += timedelta(days=1)
    return predictions


# Helper functions for data formatting and calculations
def get_day_start_end(date_str):
    target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    return datetime.combine(target_date, datetime.min.time()), datetime.combine(target_date, datetime.max.time())


def get_full_day_range(date_str):
    date = datetime.strptime(date_str, '%Y-%m-%d')
    return date.replace(hour=0, minute=0, second=0, microsecond=0), date.replace(hour=23, minute=59, second=59, microsecond=999999)


def format_city_dates(data):
    return [f"{d['city_id']} - {d['last_updated'].strftime('%H:%M:%S')}" for d in data]


def format_temperature_data(data, city_name, date):
    if data and len(data) > 0:
        return data[0]["city_id"], data[0]["max_temp"], data[0]["min_temp"]
    else:
        return f"No temperature data found for {city_name} on {date}."

def format_wind_data(data, city_name):
    beaufort_scale = define_beafort_scale()
    for d in data:
        wind_speed = d['wind_kph']
        date = d['last_updated'].strftime('%Y-%m-%d %H:%M:%S')
        scale = next(scale for (lower, upper), scale in beaufort_scale.items() if lower <= wind_speed <= upper)
        return f"{date} City: {city_name}, Speed: {wind_speed:.2f} km/h, Beaufort scale: {scale}"
    return f"No wind data found for {city_name}."


def define_beafort_scale():
    return {
        (0, 1): "Calm",
        (1, 5): "Light air",
        (5, 11): "Light breeze",
        (11, 19): "Gentle breeze",
        (19, 28): "Moderate breeze",
        (29, 38): "Fresh breeze",
        (38, 49): "Strong breeze",
        (49, 61): "High wind, near gale",
        (61, 74): "Gale",
        (74, 88): "Strong gale",
        (88, 102): "Storm",
        (102, 117): "Violent storm",
        (117, float('inf')): "Hurricane"
    }


def format_latest_data(result, city_name, data_name):
    if result:
        value = result.get(data_name)
        last_updated = result.get('last_updated').strftime('%Y-%m-%d %H:%M:%S')
        return city_name, last_updated, value
    return city_name, None, None


def format_daily_data(results, data_name):
    return [[r['city_id'], r['last_updated'].strftime('%Y-%m-%d %H:%M:%S'), r[data_name]] for r in results]


def create_weather_pattern_alerts_pipeline(city_id, n, temp_change_threshold):
    current_datetime = datetime.utcnow()
    print(f"Current datetime: {current_datetime}")
    return [
        {'$match': {'city_id': city_id, 'time': {'$gte': current_datetime}}},
        {'$limit': n},
        {'$group': {
            '_id': '$city_id',
            'latest_temp': {'$first': '$temp_c'},
            'earliest_temp': {'$last': '$temp_c'},
            'latest_date': {'$first': '$time'},
            'earliest_date': {'$last': '$time'}
        }},
        {'$project': {
            'temp_change': {'$abs': {'$subtract': ['$latest_temp', '$earliest_temp']}},
            'latest_date': 1,
            'earliest_date': 1,
            'latest_temp': 1,
            'earliest_temp': 1
        }},
        {'$match': {'temp_change': {'$gte': temp_change_threshold}}}
    ]

def weather_pattern_alerts(db, city_id, n=24, temp_change_threshold=10):
    pipeline = create_weather_pattern_alerts_pipeline(city_id, n, temp_change_threshold)
    result = aggregate_data(db['forecast_temperatures'], pipeline)
    if result:
        print(f"Temperature change in {city_id} exceeds {temp_change_threshold}°C for the next {n} hours.")
        print(f"Earliest temperature: {result[0]['latest_temp']}°C on {result[0]['latest_date']}")
        print(f"Latest temperature: {result[0]['earliest_temp']}°C on {result[0]['earliest_date']}")
    else:
        print(f"No significant temperature change in {city_id} for the next {n} hours.")
    return result


def create_wind_speed_pipeline(start_datetime, end_datetime, wind_speed_threshold):
    return [
        {"$match": {
            'last_updated': {'$gte': start_datetime, '$lte': end_datetime},
            "wind_kph": {"$gt": wind_speed_threshold}
        }},
        {"$project": {"_id": 0, "city_id": 1, "last_updated": 1, "wind_kph": 1, "wind_mph": 1, "wind_degree": 1, "wind_dir": 1, "gust_kph": 1, "gust_mph": 1}}
    ]

def get_high_wind_speed_cities(db, date, wind_speed_threshold):
    collection = db["wind"]
    start_datetime, end_datetime = get_day_start_end(date)

    pipeline = create_wind_speed_pipeline(start_datetime, end_datetime, wind_speed_threshold)
    result = aggregate_data(collection, pipeline)

    data = []
    for entry in result:
        data.append({
            "city": entry['city_id'],
            "last_updated": entry['last_updated'],
            "wind_kph": entry['wind_kph']
        })

    return data