from pymongo import MongoClient
from gridfs import GridFS

client = MongoClient()
db = client['DB']
fs = GridFS(db, "GridFS")

userCollection = db.Users
fileCollection = db.Files
grantCollection = db.Grants
grantAppCollection = db.GrantApplications