from bson import ObjectId
from flask import request, Blueprint, send_file

from db import *
from helpers import *


files = Blueprint('files' , __name__)

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
@files.route("/testUpload", methods=['POST'])
def testUpload():
    contentType = request.headers.get("Content-Type")
    if('multipart/form-data' in contentType):
        file = request.files['File']
        return uploadFile(file, file.filename), 200
    else:
        return '', 400


# testing only, should not be used in production; delete should be handled by delete GrantForm
@files.route("/testDelete", methods=['POST'])
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
@files.route("/getFile/<_id>", methods=['GET'])
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