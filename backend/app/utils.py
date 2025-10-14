"""
Utility functions and helpers for the BotVerse API
"""

from bson import ObjectId
from fastapi import HTTPException
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


def format_mongo_document(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Transform MongoDB document by converting _id to id
    
    Args:
        doc: MongoDB document
        
    Returns:
        Formatted document with 'id' field instead of '_id'
    """
    if not doc:
        return None
    
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


def validate_object_id(id_string: str, field_name: str = "ID") -> ObjectId:
    """
    Validate and convert string to MongoDB ObjectId
    
    Args:
        id_string: String representation of ObjectId
        field_name: Name of the field for error messages
        
    Returns:
        ObjectId instance
        
    Raises:
        HTTPException: If ID is invalid
    """
    if not ObjectId.is_valid(id_string):
        logger.warning(f"Invalid {field_name}: {id_string}")
        raise HTTPException(
            status_code=400,
            detail=f"{field_name} inválido"
        )
    
    try:
        return ObjectId(id_string)
    except Exception as e:
        logger.error(f"Error converting {field_name} to ObjectId: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"{field_name} inválido"
        )


def create_success_response(message: str, data: Optional[Any] = None) -> Dict[str, Any]:
    """
    Create a standardized success response
    
    Args:
        message: Success message
        data: Optional data to include
        
    Returns:
        Formatted response dictionary
    """
    response = {
        "success": True,
        "message": message
    }
    
    if data is not None:
        response["data"] = data
    
    return response


def create_error_response(message: str, error_type: str = "error") -> Dict[str, Any]:
    """
    Create a standardized error response
    
    Args:
        message: Error message
        error_type: Type of error
        
    Returns:
        Formatted error dictionary
    """
    return {
        "success": False,
        "message": message,
        "type": error_type
    }
