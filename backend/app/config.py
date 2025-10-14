"""
Database configuration and connection management

This module handles MongoDB connection and database configuration.
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "botverse")

# Validate configuration
if not MONGO_URI or not DB_NAME:
    logger.error("Missing MongoDB configuration. Please set MONGO_URI and DB_NAME in .env file")
    raise ValueError("MongoDB configuration is incomplete")

# Initialize MongoDB client
try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,  # 5 second timeout
        connectTimeoutMS=10000,  # 10 second timeout
    )
    
    # Test connection
    client.admin.command('ping')
    logger.info(f"✅ Connected to MongoDB database: {DB_NAME}")
    
    # Get database instance
    db = client[DB_NAME]
    
except ConnectionFailure as e:
    logger.error(f"❌ Failed to connect to MongoDB: {e}")
    raise
except Exception as e:
    logger.error(f"❌ Error initializing MongoDB client: {e}")
    raise


def get_database():
    """
    Get database instance
    
    Returns:
        Database instance
    """
    return db


def close_database_connection():
    """
    Close database connection
    """
    try:
        client.close()
        logger.info("Closed MongoDB connection")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")
