import flask 
import mongo_handler

app = flask.Flask(__name__)

port = 8080

@app.route('/')
def index():
    # Send file from ../client/index.html
    db = mongo_handler.connect_to_mongo()
    get_collection = mongo_handler.get_collection(db, "cities")
    print(get_collection.find_one())
    return flask.send_file('../client/index.html')


if __name__ == '__main__':
    app.run(port=port, debug=True)