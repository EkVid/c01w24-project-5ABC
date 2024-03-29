from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from userRoutes import user
from fileRoutes import files
from grantRoutes import grant
from applicationRoutes import application

load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.register_blueprint(user)
app.register_blueprint(files)
app.register_blueprint(grant)
app.register_blueprint(application)





