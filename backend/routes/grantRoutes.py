# File containing grantor and grant creation related routes

from bson import ObjectId
from flask import Blueprint, request
from pydantic import ValidationError
from middleware import tokenCheck
import base64
import re

from dataModels import *
from helpers import *
from db import *
from routes.fileRoutes import *


grant = Blueprint('grant' , __name__)

@grant.route("/createGrant", methods=["POST"])
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
@grant.route("/getGrant/<_id>", methods=["GET"])
@tokenCheck.token_required
def getGrant(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objID = ObjectId(_id)

    grant = grantCollection.find_one({"_id": objID}, {"_id": False})
    if not grant:
        return {"message": "Grant with the given ID not found"}, 404

    return grant, 200


@grant.route("/getAllGrants", methods=["GET"])
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
@grant.route("/getGrantorGrants", methods=["POST"])
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


@grant.route("/deleteGrant/<_id>", methods=["DELETE"])
# @tokenCheck.token_required
def deleteGrant(_id):
    if not ObjectId.is_valid(_id):
        return {"message": "Invalid ID"}, 400
    objID = ObjectId(_id)

    grant = grantCollection.find_one_and_delete({"_id": objID})
    if grant == None:
        return {"message": "Grant form with the given ID not found"}, 404
    
    grantAppCollection.delete_many({"grantID":str(grant["_id"])})

    for question in grant["QuestionData"]:
        fileData = question.get("fileData", None)
        if fileData != None:
            deleteFile(question["fileData"]["fileLink"])

    return {"message": "Grant form successfully deleted"}, 200


@grant.route("/updateGrantStatus", methods=["POST"])
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


@grant.route("/updateGrantWinners", methods=["PUT"])
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
    grantCollection.update_one({"_id": ObjectId(application["grantID"])}, {"$inc": {"NumWinners": 1}})
    grant = grantCollection.find_one({"_id": ObjectId(application["grantID"])})
    if grant["NumWinners"] >= grant["MaxWinners"]:
        grantCollection.update_one({"_id": ObjectId(application["grantID"])}, {"$set": {"Active": False}})

    grantAppCollection.update_one({"_id": applicationID}, {"$set": {"status": ApplicationStatus.APPROVED}})

    return {"message": "Application winner successfully added"}, 200


@grant.route("/updateGrantLosers", methods=["PUT"])
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
    grantCollection.update_one({"_id": ObjectId(application["grantID"])}, {"$inc": {"NumWinners": -1}})
    grantAppCollection.update_one({"_id": applicationID}, {"$set": {"status": ApplicationStatus.REJECTED}})

    return {"message": "Application loser successfully removed"}, 200


"""
Applicant-side Filter Routes
"""
@grant.route("/getFilteredGrants", methods=["POST"])
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
        grant["_id"] = str(grant["_id"])

    return grants, 200
