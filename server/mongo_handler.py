import pymongo
import dotenv
from datetime import datetime

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



def highest_temperature_by_city(city_name, target_date_str):
    collection = db["temperatures"]

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
            "$sort": {"temp_c": -1}  # Tri par ordre décroissant de la température
        },
        {
            "$limit": 1  # Limiter le résultat à une seule entrée (la plus haute température)
        },
        {
            "$project": {
                "_id": 0,
                "city_id": 1,
                "last_updated": 1,
                "temp_c": 1,
            }
        }
    ]

    result = collection.aggregate(pipeline)

    for data in result:
        return f"Highest temperature in {data['city_id']} on {data['last_updated'].strftime('%Y-%m-%d %H:%M:%S')} was {data['temp_c']} degrees Celsius."

    return f"No temperature data found for {city_name} on {target_date_str}."




def highest_wind_strength(city_name, target_date_str):
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

        return f"Wind scale in {city_name} on {data['last_updated'].strftime('%Y-%m-%d %H:%M:%S')} is {wind_scale} with a speed of {wind_speed_kmh:.2f} km/h."

    return f"No wind data found for {city_name} on {target_date_str}."

print(highest_wind_strength("TokyoJP","2024-02-14"))
    

# print(highest_temperature_by_city("ParisFR","2024-02-12"))

# print(bad_air_quality("2024-02-08"))

    
    

