from bson import ObjectId
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from pydantic import ValidationError
from middleware import tokenCheck
from email.mime.text import MIMEText
import smtplib
import os
import jwt
import bcrypt
import datetime
import json as JSON
import random

from dataModels import Form

load_dotenv()
app = Flask(__name__)
CORS(app)

client = MongoClient()
db = client['DB']
userCollection = db.Users
fileCollection = db.Files
grantFormCollection = db.GrantForms

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


@app.route("/register", methods=["POST"])
def register():
    contentType = request.headers.get('Content-Type')

    if contentType == 'application/json':
        json = request.json

        #Checks for duplicate users with the specified email
        duplicateTest = userCollection.find_one({"Email": json['Email']})
        if duplicateTest is not None:
            return {"message": "Email already exists in the system"}, 409

        else:
            salt = bcrypt.gensalt()
            encodedPassword = json['Password'].encode('utf-8')
            hashedPassword = bcrypt.hashpw(encodedPassword, salt) #salts and hashes the password before storage

            userToAdd = {
                "Email": json['Email'],
                "Password": hashedPassword.decode('utf-8'),
                "Usertype": json['Usertype'], # "Grantee" or "Grantor"
                "ActiveSession": False
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

        email = json['Email']
        password = json['Password']

        foundUser = userCollection.find_one({"Email": email})

        if foundUser is None: #Either the user is not registered, or they input the wrong email
            return {"message": "Invalid login information"}, 401
        else:
            storedPassword = foundUser['Password'].encode('utf-8')
            enteredPassword = password.encode('utf-8')

            result = bcrypt.checkpw(enteredPassword, storedPassword) #compares the passwords in the DB with the one entered

            if result:
                try:
                    token = jwt.encode({
                            'email': email,
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
                userCollection.update_one({"Email": email}, {"$set": { "ActiveSession": True}})

                userInfo = { #stores the data we need to return to the front end for the profile page
                        "Email": foundUser['Email'],
                        "Usertype" : foundUser['Usertype']
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


@app.route("/resetPassword", methods=['POST'])
def resetPassword():
    contentType = request.headers.get("Content-Type")

    if(contentType == "application/json"):
        verificationCode = request.json['ResetCode'].split("-")
        email = verificationCode[0]
        ResetCode = verificationCode[1]
        newPassword = request.json['NewPassword']

        foundUser = userCollection.find_one({"Email": email})

        if foundUser is None:
            return {"message": "Email not found in the system"}, 404
        
        storedResetCode = foundUser['ResetCode']

        if(storedResetCode['Code'] == int(ResetCode)):
            difference = abs(datetime.datetime.utcnow() - storedResetCode['IssueDate'])

            if(difference.seconds < 300): # reset code works within 300 seconds
                salt = bcrypt.gensalt()
                encodedPassword = newPassword.encode('utf-8')
                hashedPassword = bcrypt.hashpw(encodedPassword, salt)

                userCollection.update_one({"Email": email}, {"$set": {"Password": hashedPassword.decode('utf-8')}})

                userCollection.update_one({"Email": email}, {"$set": {"ResetCode": {}}})

                return {"message": "Password reset successful"}, 200
            else:
                return {"message": "Reset Code has expired"}, 401
        else:
            return {"message": "Reset Codes to not match"}, 401
    else:
        return {"message": "Unsupported Content Type"}, 400


@app.route("/emailResetCode", methods=['GET'])
def generateResetCode():
    contentType = request.headers.get("Content-Type")

    if(contentType == "application/json"):
        email = request.json['Email']

        foundUser = userCollection.find_one({"Email": email})

        if foundUser is None:
            return {"message": "Email not found in the system"}, 404
        
        #generates a reset code with uuid and stamps it with the current date time for expiration

        resetCode = {
            "Code": random.randint(100000, 999999),
            "IssueDate": datetime.datetime.utcnow()
            }

        userCollection.update_one({"Email": email}, {"$set": {"ResetCode": resetCode}})

        try:
            code = email + "-" + str(resetCode["Code"])
            subject = "Reset Password"
            body = "Please reset you password at http://localhost:3000/reset_password.\nVerification code (include email and code): " + code
            sender = "5abc.noreply@gmail.com"
            password = "gpjk gykf fejy eppg"

            msg = MIMEText(body)
            msg['Subject'] = subject
            msg['From'] = sender
            msg['To'] = email

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
                smtp_server.login(sender, password)
                smtp_server.sendmail(sender, email, msg.as_string())

        except Exception as e:
            return {
                "Error": "Email could not be sent.",
                "Message": str(e)
            }, 500

        return {"message": "Verification code successfully sent"}, 200

    else:
        return {"message": "Unsupported Content Type"}, 400


@app.route("/logout", methods=['GET'])
@tokenCheck.token_required
def logout():

    contentType = request.headers.get("Content-Type")

    if(contentType == "application/json"):
        json = request.json

        email = json['Email']

        foundUser = userCollection.find_one({"Email": email})

        if foundUser is None:
            return "Error: no user with that email found in the system"
        else:
            userCollection.update_one({"Email": email}, {"$set": {"ActiveSession": False}})

        return {"message": "Sucessfully logged the user out"}
    else:
        return {"message": "Unsupported Content Type"}, 400


@app.route("/createGrantForm", methods=["POST"])
@tokenCheck.token_required
def createGrantForm():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    json = request.json

    try:
        form = Form.model_validate_json(JSON.dumps(json))
        print(type(form.questionData[0].options.minNum))
    except ValidationError as e:
        # Do not change e.errors(), the unit tests require an error list in this specific format
        return {"message": e.errors()}, 400

    id = grantFormCollection.insert_one(json).inserted_id
    message = "Grant application successfully created with id: " + str(id)

    return {"message": message}, 200


@app.route("/getGrantForm/<_id>", methods=["GET"])
@tokenCheck.token_required
def getGrantForm(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objId = ObjectId(_id)

    form = grantFormCollection.find_one({"_id": objId}, {"_id": 0})
    if not form:
        return {"message": "Grant form with the given ID not found"}, 404

    return form, 200


@app.route("/updateGrantForm/<_id>", methods=["PUT"])
@tokenCheck.token_required
def updateGrantForm(_id):
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objId = ObjectId(_id)
    json = request.json

    newData = {key: val for (key, val) in json.items() if key != "_id"}     # Updating everything but the ID for now

    try:
        Form.model_validate_json(JSON.dumps(newData))
    except ValidationError as e:    # TODO: use the same error response with e.errors() as in /createGrantForm
        return {"message": str(e)}, 400

    res = grantFormCollection.update_one({"_id": objId}, {"$set": newData})
    if res.matched_count != 1:
        return {"message": "Grant form with the given ID not found"}, 404

    return {"message": "Grant form successfully updated"}, 200


@app.route("/deleteGrantForm/<_id>", methods=["DELETE"])
@tokenCheck.token_required
def deleteGrantForm(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objId = ObjectId(_id)

    res = grantFormCollection.delete_one({"_id": objId})
    if res.deleted_count != 1:
        return {"message": "Grant form with the given ID not found"}, 404

    return {"message": "Grant form successfully deleted"}, 200