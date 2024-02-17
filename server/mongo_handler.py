import pymongo
import dotenv
from datetime import datetime,timedelta


def connect_to_mongo():
    dotenv.load_dotenv()
    mongo_url = dotenv.get_key(dotenv.find_dotenv(), "MONGO_URL")
    # Connect to the MongoDB server
    client = pymongo.MongoClient(mongo_url)
    # Create a database called "mydatabase"
    return client["nosql_project"]

# def get_collection(db, collection_name):
#     return db[collection_name]


db = connect_to_mongo()
# print(get_collection(db, "forecast_precipitations").find_one())


def bad_air_quality(date): 
    collection = db["air_quality"]

    # Convertir la date en objet datetime sans tenir compte de l'heure
    target_date_obj = datetime.strptime(date, '%Y-%m-%d').date()

    # Date de début (minuit) et fin (23:59:59) pour le jour spécifié
    start_datetime = datetime.combine(target_date_obj, datetime.min.time())
    end_datetime = datetime.combine(target_date_obj, datetime.max.time())
    

    # Filtre pour les villes avec des valeurs de qualité d'air supérieures aux seuils
    pipeline = [
        {
        "$match": { 
            'last_updated': {'$gte': start_datetime, '$lte': end_datetime},
            "$or": [
            {"co": {"$gt": 4000}},
            {"no2": {"$gt": 25}},
            {"o3": {"$gt": 100}},
            {"so2": {"$gt": 40}},
            ]
        }
        },
        {
        "$project": {
            "_id": 0,
            "city_id": 1,
            "last_updated": 1
        }
        }
    ]

    villes = []
    for ville in collection.aggregate(pipeline):
        # Ajouter le nom de la ville et l'heure à la liste
        villes.append(f"{ville['city_id']} - {ville['last_updated'].strftime('%H:%M:%S')}")
    return villes



def extremums_temperature_by_city(city_name, target_date_str, document_name="temperatures"):
    collection = db[document_name]
    if document_name == "forecast_temperatures":
        date = "time"
    else:
        date = "last_updated"

    # Convertir la date en objet datetime sans tenir compte de l'heure
    target_date_obj = datetime.strptime(target_date_str, '%Y-%m-%d').date()

    # Date de début (minuit) et fin (23:59:59) pour le jour spécifié
    start_datetime = datetime.combine(target_date_obj, datetime.min.time())
    end_datetime = datetime.combine(target_date_obj, datetime.max.time())

    # Filtre pour la ville spécifiée et la plage horaire
    pipeline = [
        {
            "$match": {
                'city_id': city_name,
                date: {'$gte': start_datetime, '$lte': end_datetime},
            }
        },
        {
            "$sort": {"temp_c": -1}  # Tri par ordre décroissant de la température
        },
        {
            "$group": {
                "_id": "$city_id",
                "max_temp": {"$first": "$temp_c"},
                "min_temp": {"$last": "$temp_c"}
            }
        },
        {
            "$project": {
                "_id": 0,
                "city_id": "$_id",
                "max_temp": 1,
                "min_temp": 1
            }
        }
    ]

    result = collection.aggregate(pipeline)

    for data in result:
        return data["city_id"], data["max_temp"], data["min_temp"]

    return f"No temperature data found for {city_name} on {target_date_str}."


def wind_strength(city_name, target_date_str):
    collection = db["wind"]

    # Convertir la date en objet datetime sans tenir compte de l'heure
    target_date_obj = datetime.strptime(target_date_str, '%Y-%m-%d').date()

    # Date de début (minuit) et fin (23:59:59) pour le jour spécifié
    start_datetime = datetime.combine(target_date_obj, datetime.min.time())
    end_datetime = datetime.combine(target_date_obj, datetime.max.time())

    # Filtre pour la ville spécifiée et la plage horaire
    pipeline = [
        {
            "$match": {
                'city_id': city_name,
                'last_updated': {'$gte': start_datetime, '$lte': end_datetime},
            }
        },
        {
            "$sort": {"wind_kph": -1}  # Tri par ordre décroissant de la vitesse du vent
        },
        {
            "$limit": 1  # Limiter le résultat à une seule entrée (la plus grande vitesse du vent)
        },
        {
            "$project": {
                "_id": 0,
                "last_updated": 1,
                "wind_kph": 1,
            }
        }
    ]

    result = collection.aggregate(pipeline)

    beaufort_scale = {
        (0, 1): "Calme",
        (1, 5): "Très légère brise",
        (5, 11): "Légère brise",
        (11, 19): "Petite brise",
        (19, 28): "Jolie brise",
        (29, 38): "Bonne brise",
        (38, 49): "Vent frais",
        (49, 61): "Grand frais",
        (61, 74): "Coup de vent",
        (74, 88): "Fort coup de vent",
        (88, 102): "Tempête",
        (102, 117): "Violente tempête",
        (117, float('inf')): "Ouragan"
    }

    for data in result:
        wind_speed_kmh = data['wind_kph']
        wind_scale = next(scale for (lower, upper), scale in beaufort_scale.items() if lower <= wind_speed_kmh <= upper)

        return f"City : {city_name}, date : {data['last_updated'].strftime('%Y-%m-%d %H:%M:%S')}, speed : {wind_speed_kmh:.2f} km/h,  Beaufort scale : {wind_scale}"

    return f"No wind data found for {city_name} on {target_date_str}."


def get_latest_weather_data(city_name, data_name, document_name):
    collection = db[document_name]

    # Filter for the specified city
    query = {'city_id': city_name}

    # Sort by date in descending order to get the latest data
    result = collection.find_one(query, sort=[('last_updated', pymongo.DESCENDING)])

    # Check if the result is not None
    if result:
        value = result.get(data_name)
        last_updated = result.get('last_updated').strftime('%Y-%m-%d %H:%M:%S')
        return city_name, last_updated, value
    else:
        return city_name, None, None
    
    
    
def get_daily_weather_data(city_name, data_name, document_name, input_date):
    collection = db[document_name]

    # Convert the input date string to a datetime object
    input_datetime = datetime.strptime(input_date, '%Y-%m-%d')

    # Define the start and end of the specified day
    start_of_day = input_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = input_datetime.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Filter for the specified city and within the specified day
    query = {
        'city_id': city_name,
        'last_updated': {'$gte': start_of_day, '$lte': end_of_day}
    }

    # Sort by date in ascending order to get data for the entire day
    results = collection.find(query, sort=[('last_updated', pymongo.ASCENDING)])

    data_list = []

    for result in results:
        data = [
            result['city_id'],
            result['last_updated'].strftime('%Y-%m-%d %H:%M:%S'),
            result[data_name]
        ]
        data_list.append(data)

    return data_list

def temp_extremum_7_next_day(city_name, first_day):
    date = first_day
    result = []
    for i in range(7):
        result.append(extremums_temperature_by_city(city_name, date,"forecast_temperatures"))
         # add 1 to the last 2 digit of first_day
        date = datetime.strptime(date, '%Y-%m-%d') + timedelta(days=1)
        date = date.strftime('%Y-%m-%d')
    return result
    
    
    
    


print(temp_extremum_7_next_day("ParisFR",datetime.now().strftime('%Y-%m-%d')))
    

# print(get_daily_weather_data("ParisFR","temp_c",'temperatures',"2024-02-16"))

# print(get_latest_weather_data("ParisFR","cloud",'basics'))

# print(wind_strength("TokyoJP","2024-02-14"))

# print(extremums_temperature_by_city("ParisFR","2024-02-17"))

# print(bad_air_quality("2024-02-08"))

    
    

