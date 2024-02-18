from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import jwt
import bcrypt
import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)

client = MongoClient()
db = client['DB']
userCollection = db.Users
fileCollection = db.Files

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

@app.route("/register", methods=["POST"])
def register():
    contentType = request.headers.get('Content-Type')

    if contentType == 'application/json':
        json = request.json

        #Checks for duplicate users with the specified username
        duplicateTest = userCollection.find_one({"Username": json['Username']})
        if duplicateTest is not None:
            return {"message": "User already exists in the system"}, 409

        else:
            salt = bcrypt.gensalt()
            encodedPassword = json['Password'].encode('utf-8')
            hashedPassword = bcrypt.hashpw(encodedPassword, salt) #salts and hashes the password before storage

            userToAdd = {
                "Name": json['Name'],
                "Username": json['Username'],
                "Password": hashedPassword.decode('utf-8'),
                "Email": json['Email'],
                "ActiveSession": True
            }
            userCollection.insert_one(userToAdd)
            return {"message": "User successfully registered"}

    else:
        return {"message": "Unsupported Content Type"}, 400

@app.route("/login", methods=['POST'])
def login():
    contentType = request.headers.get("Content-Type")

    if(contentType == 'application/json'):
        json = request.json
        
        username = json['Username']
        password = json['Password']

        foundUser = userCollection.find_one({"Username": username})

        if foundUser is None: #Either the user is not registered, or they input the wrong username
            return {"message": "Invalid login information"}, 401
        else:
            storedPassword = foundUser['Password'].encode('utf-8')
            enteredPassword = password.encode('utf-8')

            result = bcrypt.checkpw(enteredPassword, storedPassword) #compares the passwords in the DB with the one entered

            if result:
                try:
                    token = jwt.encode({
                            'user': username,
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=3600)
                        },
                        app.config['SECRET_KEY'],
                        algorithm="HS256"
                    )
                except Exception as e:
                    return {
                        "Error": "Error generating the JWT TOKEN",
                        "Message": str(e)
                    }, 500
                    
                #tells the DB that the user has an active session. This prevents them from accessing the API routes if they have a valid Access Token but have logged out
                userCollection.update_one({"Username": username}, {"$set": { "ActiveSession": True}})

                userInfo = { #stores the data we need to return to the front end for the profile page
                        "Username": foundUser['Username'],
                        "Name": foundUser['Name'],
                        "Email": foundUser['Email']
                    }
                return {
                    "message": "User logged in sucessfully",
                    "token": token,
                    "UserInfo": userInfo
                }, 200
            
            else:
                return "Invalid login information", 401
    else:
        return {"message": "Unsupported Content Type"}, 400