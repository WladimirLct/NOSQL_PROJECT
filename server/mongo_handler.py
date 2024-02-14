import pymongo
import dotenv

def connect_to_mongo():
    dotenv.load_dotenv()
    mongo_url = dotenv.get_key(dotenv.find_dotenv(), "MONGO_URL")
    # Connect to the MongoDB server
    client = pymongo.MongoClient(mongo_url)
    # Create a database called "mydatabase"
    return client["nosql_project"]

def get_collection(db, collection_name):
    return db[collection_name]