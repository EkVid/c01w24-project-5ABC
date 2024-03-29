from bson import ObjectId
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from pydantic import ValidationError
from middleware import tokenCheck
from email.mime.text import MIMEText
from gridfs import GridFS
import smtplib
import os
import jwt
import bcrypt
import datetime
import json as JSON
import random
import base64
import re

from dataModels import (Application, Grant, ApplicationStatus)
from helpers import (getJSONData, getFileData, isListOfDict)

load_dotenv()
app = Flask(__name__)
CORS(app)

client = MongoClient()
db = client['DB']
fs = GridFS(db, "GridFS")

userCollection = db.Users
fileCollection = db.Files
grantCollection = db.Grants
grantAppCollection = db.GrantApplications

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


# User Login/Register Routes

@app.route("/signup", methods=["POST"])
def register():
    contentType = request.headers.get('Content-Type')

    if contentType == 'application/json':
        json = request.json

        #Checks for duplicate users with the specified email
        duplicateTest = userCollection.find_one({"Email": json['Email']})
        if duplicateTest is not None:
            return {"message": "Account already exists in the system, you can login directly without signing up."}, 409

        else:
            salt = bcrypt.gensalt()
            encodedPassword = json['Password'].encode('utf-8')
            hashedPassword = bcrypt.hashpw(encodedPassword, salt) #salts and hashes the password before storage

            # TODO: define constants for Usertype options in dataModels.py
            userToAdd = {
                "Email": json['Email'],
                "Password": hashedPassword.decode('utf-8'),
                "Usertype": json['Usertype'], # "Grantee" or "Grantor"
                "ActiveSession": False
            }
            userCollection.insert_one(userToAdd)
            return {"message": "User successfully registered"}

    else:
        return {"message": "An unexpected error occured, please try again."}, 400


@app.route("/login", methods=['POST'])
def login():
    contentType = request.headers.get("Content-Type")

    if(contentType == 'application/json'):
        json = request.json

        email = json['Email']
        password = json['Password']

        foundUser = userCollection.find_one({"Email": email})

        if foundUser is None: #Either the user is not registered, or they input the wrong email
            return {"message": "Login failed. Please double-check your email and password."}, 401
        else:
            storedPassword = foundUser['Password'].encode('utf-8')
            enteredPassword = password.encode('utf-8')

            result = bcrypt.checkpw(enteredPassword, storedPassword) #compares the passwords in the DB with the one entered

            if result:
                try:
                    token = jwt.encode({
                            'email': email,
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=36000)
                        },
                        app.config['SECRET_KEY'],
                        algorithm="HS256"
                    )
                except Exception as e:
                    return {
                        "Error": "Error generating the JWT TOKEN",
                        "Message": "An unexpected error occured, please try again."
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
                return "Login failed. Please double-check your email and password.", 401
    else:
        return {"message": "An unexpected error occured, please try again."}, 400


@app.route("/reset_password", methods=['POST'])
def resetPassword():
    contentType = request.headers.get("Content-Type")

    if(contentType == "application/json"):
        email = request.json['Email']
        newPassword = request.json['NewPassword']

        foundUser = userCollection.find_one({"Email": email})

        if foundUser is None:
            return {"message": "Email not found in the system"}, 404

        storedResetCode = foundUser['ResetCode']

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
        return {"message": "Unsupported Content Type"}, 400


@app.route("/forgot_password", methods=['POST'])
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
            code = str(resetCode["Code"])
            subject = "Reset Password"
            body = "Reset your password with the verification code: " + code
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

        return {"message": "Verification code successfully sent",
                "code": code}, 200

    else:
        return {"message": "Unsupported Content Type"}, 400


@app.route("/logout", methods=['POST'])
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


# File management routes

def uploadFile(file, fileName):
    fs.put(file, filename=fileName)
    fileID = fs.get_last_version(filename=fileName)._id
    return str(fileID)

def deleteFile(fileID):
    try:
        fs.delete(ObjectId(fileID))
        return True
    except Exception as e:
        return False


# testing only, should not be used in production; upload should be handled by create GrantForm
@app.route("/testUpload", methods=['POST'])
def testUpload():
    contentType = request.headers.get("Content-Type")
    if('multipart/form-data' in contentType):
        file = request.files['File']
        return uploadFile(file, file.filename), 200
    else:
        return '', 400


# testing only, should not be used in production; delete should be handled by delete GrantForm
@app.route("/testDelete", methods=['POST'])
def testDelete():
    contentType = request.headers.get("Content-Type")
    if(contentType == "application/json"):
        fileID = request.json['File_id']
        if (deleteFile(fileID)):
            return '', 200
        else:
            return '', 400
    else:
        return '', 400


# For Frontend Use
@app.route("/getFile/<_id>", methods=['GET'])
def getFile(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400

    try:
        file = fs.get(ObjectId(_id))
        return send_file(file, download_name=file.filename, as_attachment=True)

    except Exception as e:
        return {
            "Error": "File not found",
            "Message": str(e)
        }, 404


# Grant Form Routes

# Used in the tests only
@app.route("/deleteUser", methods=["DELETE"])
def deleteUser():
    email = request.json.get("Email", "")
    userCollection.delete_one({"Email": email})

    return {"message": "User deleted successfully"}, 200


@app.route("/createGrant", methods=["POST"])
@tokenCheck.token_required
def createGrant():
    grantDict = getJSONData(request)
    files = getFileData(request)
    if grantDict is None:
        return {"message": "Unsupported Content Type"}, 400
    try:
        Grant.model_validate(grantDict)
    except ValidationError as e:
        # Do not change e.errors(), the tests require an error list in this specific format
        return {"message": e.errors()}, 403

    # checking for files that need to be stored
    for question in grantDict["QuestionData"]:
        fileData = question.get("fileData", None)
        if fileData != None:
            question["fileData"]["fileLink"] = uploadFile(base64.b64decode(files[question["fileIdx"]]), question["fileData"]["fileName"])

    id = grantCollection.insert_one(grantDict).inserted_id
    # Do not change "_id": str(id), the tests require this to keep track of inserted data
    return {
        "message": "Grant successfully created",
        "_id": str(id)
    }, 200


# Used in frontend as well, not just tests
@app.route("/getGrant/<_id>", methods=["GET"])
@tokenCheck.token_required
def getGrant(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objID = ObjectId(_id)

    grant = grantCollection.find_one({"_id": objID}, {"_id": False})
    if not grant:
        return {"message": "Grant with the given ID not found"}, 404

    return grant, 200


@app.route("/getAllGrants", methods=["GET"])
@tokenCheck.token_required
def getAllGrants():
    grants = list(grantCollection.find({}))
    if not grants:
        return {"message": "No grants found"}, 404

    for grant in grants:
        grant["_id"] = str(grant["_id"])
    return {"grants": grants}, 200


"""Returns all grants created by the grantor with the email passed in the request. Note that this route uses JSON as
opposed to form data.
"""
@app.route("/getGrantorGrants", methods=["POST"])
@tokenCheck.token_required
def getGrantorGrants():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    email = request.json.get("grantorEmail", "")
    if not email:
        return {"message": "Invalid grantor email"}, 400

    grants = list(grantCollection.find({"grantorEmail": email}))
    if not grants:
        return {"message": "No grants found"}, 404

    for grant in grants:
        grant["_id"] = str(grant["_id"])
    return {"grants": grants}, 200


@app.route("/deleteGrant/<_id>", methods=["DELETE"])
@tokenCheck.token_required
def deleteGrant(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objID = ObjectId(_id)

    grant = grantCollection.find_one_and_delete({"_id": objID})
    if grant == None:
        return {"message": "Grant form with the given ID not found"}, 404

    for question in grant["QuestionData"]:
        fileData = question.get("fileData", None)
        if fileData != None:
            deleteFile(question["fileData"]["fileLink"])

    return {"message": "Grant form successfully deleted"}, 200


@app.route("/updateGrantStatus", methods=["POST"])
@tokenCheck.token_required
def updateGrantStatus():
    contentType = request.headers.get('Content-Type')
    if contentType == 'application/json':
        grantID = request.json["grantID"]   # TODO: use dict.get
        active = request.json["active"]
        id = ObjectId(grantID)

        res = grantCollection.update_one({"_id": id}, {"$set": { "Active": active}})
        if res.matched_count != 1:
            return {"message": "Grant with the given ID not found"}, 404
        else:
            return {"message": "Grant status successfully updated"}, 200
    else:
        return {"message": "Unsupported Content Type"}, 400


@app.route("/createApplication", methods=["POST"])
@tokenCheck.token_required
def createApplication():
    contentType = request.headers.get('Content-Type')
    if contentType == 'application/json':
        grantID = request.json["grantID"]

        if not ObjectId.is_valid(grantID):
            return {"message": "Invalid grant ID"}, 400

        objID = ObjectId(grantID)
        grant = grantCollection.find_one({"_id": objID}, {"_id": False})
        if not grant:
            return {"message": "Grant with the given ID not found"}, 404

        answers = request.json.get("answers", None)
        # answers = request.json["answers"]
        if answers is None or len(answers) != len(grant["QuestionData"]):
            return {"message": "Invalid grant application answer data"}, 400

        # checking for files that need to be stored
        for answer in answers:
            if "fileLink" in answer:
                answer["fileLink"] = uploadFile(base64.b64decode(answer["fileLink"]), answer["fileName"])

        application = request.json
        application["dateSubmitted"] = datetime.date.today().strftime("%Y-%m-%d")
        application["profileData"] = None
        application["status"] = ApplicationStatus.IN_REVIEW

        id = grantAppCollection.insert_one(application).inserted_id
        return {
            "message": "Grant application successfully created",
            "_id": str(id)
        }, 200
    else:
        return {"message": "Unsupported Content Type"}, 400


# Used in tests; do not remove
@app.route("/getApplication/<_id>", methods=["GET"])
@tokenCheck.token_required
def getApplication(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objID = ObjectId(_id)

    application = grantAppCollection.find_one({"_id": objID}, {"_id": False})
    if not application:
        return {"message": "Grant application with the given ID not found"}, 404

    return application, 200


"""Returns all applications submitted by the grantee with the email passed in the request. Note that this route uses
JSON as opposed to form data.
"""
@app.route("/getGranteeApplications", methods=["POST"])
@tokenCheck.token_required
def getGranteeApplications():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    email = request.json.get("email", "")
    if not email:
        return {"message": "Invalid email"}, 400

    applicationDatas = list(grantAppCollection.find({"email": email}, {"_id": False}))
    grantIDs = [ObjectId(application["grantID"]) for application in applicationDatas]
    grants = list(grantCollection.find({"_id": {"$in": grantIDs}}))

    # Assign grantIDs to link each application to its grant
    for grant in grants:
        grant["grantID"] = str(grant["_id"])
        del grant["_id"]

    applicationsWithGrants = []
    # Tradeoff for having only two DB calls
    for applicationData in applicationDatas:
        for grant in grants:
            if applicationData["grantID"] == grant["grantID"]:
                applicationsWithGrants.append({
                    "ApplicationData": applicationData,
                    "GrantData": grant
                })

    return {"applicationsWithGrants": applicationsWithGrants}, 200


"""Returns all applications for the grant with the given ID. Note that this route uses JSON as opposed to form data.

:param str _id: The grant ID.
"""
@app.route("/getAllGrantApplications/<_id>", methods=["GET"])
@tokenCheck.token_required
def getAllGrantApplications(_id):
    applications = list(grantAppCollection.find({"grantID": _id}))

    for application in applications:
        application["_id"] = str(application["_id"])

    return {"applications": applications}, 200



@app.route("/updateGrantWinners", methods=["PUT"])
@tokenCheck.token_required
def updateGrantWinners():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    json = request.json
    applicationID = ObjectId(json.get("applicationID", ""))
    application = grantAppCollection.find_one({"_id": applicationID})
    if application == None:
        return {"message": "Invalid application ID"}, 400
    
    grantCollection.update_one({"_id": ObjectId(application["grantID"])}, {"$push": {"WinnerIDs": str(applicationID)}})
    grantAppCollection.update_one({"_id": applicationID}, {"$set": {"status": ApplicationStatus.APPROVED}})

    return {"message": "Application winner successfully added"}, 200


@app.route("/updateGrantLosers", methods=["PUT"])
@tokenCheck.token_required
def updateGrantLosers():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    json = request.json
    applicationID = ObjectId(json.get("applicationID", ""))
    application = grantAppCollection.find_one({"_id": applicationID})
    if application == None:
        return {"message": "Invalid application ID"}, 400
    
    grantCollection.update_one({"_id": ObjectId(application["grantID"])}, {"$pull": {"WinnerIDs": str(applicationID)}})
    grantAppCollection.update_one({"_id": applicationID}, {"$set": {"status": ApplicationStatus.REJECTED}})

    return {"message": "Application loser successfully removed"}, 200


@app.route("/deleteApplication/<_id>", methods=["DELETE"])
@tokenCheck.token_required
def deleteApplication(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objID = ObjectId(_id)

    app = grantAppCollection.find_one_and_delete({"_id": objID})
    if app == None:
        return {"message": "Grant application with the given ID not found"}, 404

    for answer in app["answers"]:
        if "fileLink" in answer:
            deleteFile(answer["fileLink"])

    return {"message": "Application successfully deleted"}, 200


"""
Applicant-side Filter Routes
"""
@app.route("/getFilteredGrants", methods=["POST"])
@tokenCheck.token_required
def getFilteredGrants():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    filters = request.json
    query = []
    for key, value in filters.items():
        if key == "titleKeyword":
            pattern = re.compile(".*" + value + ".*", re.IGNORECASE)
            query.append({"Title": {"$regex": pattern}})
        elif key == "gender":
            query.append({"profileReqs.gender": value})
        elif key == "race":
            query.append({"profileReqs.race": value})
        elif key == "nationality":
            query.append({"profileReqs.nationality": value})
        elif key == "datePostedBefore":
            query.append({"PostedDate": {"$lt": value}})
        elif key == "datePostedAfter":
            query.append({"PostedDate": {"$gt": value}})
        elif key == "deadline":
            query.append({"Deadline": {"$lte": value}})
        elif key == "status":
            query.append({"Active": value})
        elif key == "email":
            query.append({"grantorEmail": value})
        elif key == "minAge":
            query.append({"profileReqs.minAge": {"$gte": value}})
        elif key == "maxAge":
            query.append({"profileReqs.maxAge": {"$lte": value}})
        elif key == "minAmount":
            query.append({"AmountPerApp": {"$gte": value}})
        elif key == "maxAmount":
            query.append({"AmountPerApp": {"$lte": value}})
        elif key == "veteran":
            query.append({"profileReqs.veteran": value})
        elif key == "maxWinners":
            query.append({"MaxWinners": {"$gte" :value}})

    if len(query) == 0:
        grants = list(grantCollection.find())
    else:
        grants = list(grantCollection.find({"$and": query}))

    for grant in grants:
        grant["grantID"] = str(grant["_id"])
        del grant["_id"]

    return grants, 200


@app.route("/getFilteredGranteeApplications", methods=["POST"])
@tokenCheck.token_required
def getFilteredGranteeApplications():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400
    json = request.json

    email = json.pop("Email", None)
    if not email:
        return {"message": "Invalid email"}, 400

    user = userCollection.find_one({"Email": email})
    if not user:
        return {"message": "Grantee with the given email does not exist"}, 400

    filters = json["Filters"]
    query = [{"email": email}]
    for key, value in filters.items():
        if key == "dateSubmitted":
            query.append({"dateSubmitted": value})
        elif key == "status":
            query.append({"status": value})
    # First filter applications based off filters available directly in application
    # object without having to search corresponding grant
    quickFilteredApps = list(grantAppCollection.find({"$and": query}))

    finalApps = []
    for app in quickFilteredApps:
        query = [{"_id": ObjectId(app["grantID"])}]
        for key, value in filters.items():
            if key == "titleKeyword":
                pattern = re.compile(".*" + value + ".*", re.IGNORECASE)
                query.append({"Title": {"$regex": pattern}})
            elif key == "deadline":
                query.append({"Deadline": value})
            elif key == "maxAmount":
                query.append({"AmountPerApp": {"$lte": value}})

        grant = grantCollection.find_one({"$and": query})
        if grant:
            grant["grantID"] = str(grant["_id"])
            del grant["_id"]
            app["_id"] = str(app["_id"])
            finalApps.append({
                    "ApplicationData": app,
                    "GrantData": grant
            })

    return finalApps, 200