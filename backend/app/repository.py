"""
Repository layer for database operations

This module implements the repository pattern to abstract database operations
and provide a clean interface for data access.
"""

from typing import List, Optional, Dict, Any
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.results import InsertOneResult, UpdateResult, DeleteResult
from app.utils import format_mongo_document, validate_object_id
import logging

logger = logging.getLogger(__name__)


class BaseRepository:
    """
    Base repository class with common CRUD operations
    """
    
    def __init__(self, collection: Collection):
        """
        Initialize repository with MongoDB collection
        
        Args:
            collection: MongoDB collection instance
        """
        self.collection = collection
    
    def create(self, data: Dict[str, Any]) -> str:
        """
        Create a new document
        
        Args:
            data: Document data
            
        Returns:
            ID of created document
        """
        try:
            result: InsertOneResult = self.collection.insert_one(data)
            logger.info(f"Created document in {self.collection.name}: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating document in {self.collection.name}: {e}")
            raise
    
    def find_all(self, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Find all documents matching query
        
        Args:
            query: MongoDB query filter
            
        Returns:
            List of formatted documents
        """
        try:
            query = query or {}
            documents = list(self.collection.find(query))
            return [format_mongo_document(doc) for doc in documents]
        except Exception as e:
            logger.error(f"Error finding documents in {self.collection.name}: {e}")
            raise
    
    def find_by_id(self, id_string: str) -> Optional[Dict[str, Any]]:
        """
        Find document by ID
        
        Args:
            id_string: Document ID
            
        Returns:
            Formatted document or None
        """
        try:
            obj_id = validate_object_id(id_string)
            document = self.collection.find_one({"_id": obj_id})
            return format_mongo_document(document) if document else None
        except Exception as e:
            logger.error(f"Error finding document by ID in {self.collection.name}: {e}")
            raise
    
    def update(self, id_string: str, updates: Dict[str, Any]) -> bool:
        """
        Update document by ID
        
        Args:
            id_string: Document ID
            updates: Fields to update
            
        Returns:
            True if updated, False if not found
        """
        try:
            obj_id = validate_object_id(id_string)
            result: UpdateResult = self.collection.update_one(
                {"_id": obj_id},
                {"$set": updates}
            )
            logger.info(f"Updated document in {self.collection.name}: {id_string}")
            return result.matched_count > 0
        except Exception as e:
            logger.error(f"Error updating document in {self.collection.name}: {e}")
            raise
    
    def delete(self, id_string: str) -> bool:
        """
        Delete document by ID
        
        Args:
            id_string: Document ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            obj_id = validate_object_id(id_string)
            result: DeleteResult = self.collection.delete_one({"_id": obj_id})
            logger.info(f"Deleted document from {self.collection.name}: {id_string}")
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting document from {self.collection.name}: {e}")
            raise
    
    def count(self, query: Optional[Dict[str, Any]] = None) -> int:
        """
        Count documents matching query
        
        Args:
            query: MongoDB query filter
            
        Returns:
            Count of matching documents
        """
        try:
            query = query or {}
            return self.collection.count_documents(query)
        except Exception as e:
            logger.error(f"Error counting documents in {self.collection.name}: {e}")
            raise


class ProjectRepository(BaseRepository):
    """
    Repository for project operations
    """
    
    def find_with_flows(self, project_id: str, flows_collection: Collection) -> Optional[Dict[str, Any]]:
        """
        Find project with its flows
        
        Args:
            project_id: Project ID
            flows_collection: Collection containing flows
            
        Returns:
            Project with flows array or None
        """
        try:
            project = self.find_by_id(project_id)
            if not project:
                return None
            
            # Get flows for this project
            flows = list(flows_collection.find({"project_id": project_id}))
            project["flows"] = [format_mongo_document(flow) for flow in flows]
            
            return project
        except Exception as e:
            logger.error(f"Error finding project with flows: {e}")
            raise


class FlowRepository(BaseRepository):
    """
    Repository for flow operations
    """
    
    def find_by_project(self, project_id: str) -> List[Dict[str, Any]]:
        """
        Find all flows for a specific project
        
        Args:
            project_id: Project ID
            
        Returns:
            List of flows
        """
        try:
            return self.find_all({"project_id": project_id})
        except Exception as e:
            logger.error(f"Error finding flows for project {project_id}: {e}")
            raise
    
    def delete_by_project(self, project_id: str) -> int:
        """
        Delete all flows for a specific project
        
        Args:
            project_id: Project ID
            
        Returns:
            Number of deleted flows
        """
        try:
            result: DeleteResult = self.collection.delete_many({"project_id": project_id})
            logger.info(f"Deleted {result.deleted_count} flows for project {project_id}")
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error deleting flows for project {project_id}: {e}")
            raise

