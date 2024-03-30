# File containing grantor and grant application related routes

from bson import ObjectId
from flask import Blueprint, request
from middleware import tokenCheck
import datetime
import base64
import re

from dataModels import *
from helpers import *
from db import *
from routes.fileRoutes import *


application = Blueprint('application' , __name__)

@application.route("/createApplication", methods=["POST"])
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
@application.route("/getApplication/<_id>", methods=["GET"])
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
@application.route("/getGranteeApplications", methods=["POST"])
@tokenCheck.token_required
def getGranteeApplications():
    if request.headers.get("Content-Type") != "application/json":
        return {"message": "Unsupported Content Type"}, 400

    email = request.json.get("email", "")
    if not email:
        return {"message": "Invalid email"}, 400

    applicationDatas = list(grantAppCollection.find({"email": email}))
    grantIDs = [ObjectId(application["grantID"]) for application in applicationDatas]
    grants = list(grantCollection.find({"_id": {"$in": grantIDs}}))

    # Assign grantIDs to link each application to its grant
    for grant in grants:
        grant["grantID"] = str(grant["_id"])
        del grant["_id"]
      
    applicationsWithGrants = []
    # Tradeoff for having only two DB calls
    for applicationData in applicationDatas:
        applicationData["applicationID"] = str(applicationData["_id"])
        del applicationData["_id"]

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
@application.route("/getAllGrantApplications/<_id>", methods=["GET"])
@tokenCheck.token_required
def getAllGrantApplications(_id):
    applications = list(grantAppCollection.find({"grantID": _id}))

    for application in applications:
        application["_id"] = str(application["_id"])

    return {"applications": applications}, 200


@application.route("/deleteApplication/<_id>", methods=["DELETE"])
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


@application.route("/getFilteredGranteeApplications", methods=["POST"])
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