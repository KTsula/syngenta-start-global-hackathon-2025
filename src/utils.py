import yaml
from dotenv import load_dotenv
import os

load_dotenv()

SENTINEL_INSTANCEID = os.getenv("INSTANCEID")
SENTINEL_CLIENTID = os.getenv("CLIENTID")
SENTINEL_CLIENTSECRET = os.getenv("CLIENTSECRET")

CROPS_PATH = os.getenv("CROPS_PATH")


