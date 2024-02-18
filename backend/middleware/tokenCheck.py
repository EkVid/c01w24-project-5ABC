import jwt
from pymongo import MongoClient
from flask import request, current_app, abort
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = ''

        if ("Authorization") in request.headers:
            token = request.headers["Authorization"].split(" ")[1]  #removes the bearer prefix from the auth header to grab the token

        if not token:
            return {
                "message": "Error: Authentication token required to access this route",
                "error": "unauthorized",
            }, 401
        
        try:
            decodedToken = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])

            #Check if the username passed in the auth token corresponds to a user in the DB

            user = MongoClient()['RapidAIDB'].Users.find_one({"Username": decodedToken["user"]})

            if(user is None): #if there is no user registered in the DB with the encoded username from the JWT
                return {
                    "message": "Access token is invalid",
                    "error": "Unauthorized"
                }, 401

            #checks to make sure that the user is logged in and working with a session. Prevents them from loggin out and using a still valid token again
            if user["ActiveSession"] is False:
                abort(403)

        except jwt.ExpiredSignatureError as e:
            return {
                "message": "Session token has expired", 
                "error": str(e)
            }, 403
        except Exception as e:
            return {
                "message": "An error occurred validating your request",
                "error": str(e)
            }, 500
      
        return f(*args, **kwargs)
    
    return decorated 