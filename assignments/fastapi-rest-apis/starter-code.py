"""
Starter code for FastAPI REST API assignment
This template provides a basic structure to get you started.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import secrets

# Initialize FastAPI app
app = FastAPI(
    title="Task Management API",
    description="API for managing tasks with authentication",
    version="1.0.0"
)

# Security scheme
security = HTTPBearer()

# ============================================================================
# Models
# ============================================================================

class TaskCreate(BaseModel):
    """Model for creating a new task"""
    title: str = Field(..., min_length=1, max_length=100, description="Task title")
    description: Optional[str] = Field(None, max_length=500, description="Task description")
    priority: int = Field(default=1, ge=1, le=5, description="Priority level 1-5")

class Task(TaskCreate):
    """Model for task response"""
    id: int = Field(..., description="Unique task identifier")
    created_at: datetime = Field(..., description="Creation timestamp")
    completed: bool = Field(default=False, description="Task completion status")

class LoginRequest(BaseModel):
    """Model for login request"""
    username: str = Field(..., description="Username")
    password: str = Field(..., description="Password")

class LoginResponse(BaseModel):
    """Model for login response"""
    access_token: str = Field(..., description="Authentication token")
    token_type: str = Field(default="bearer", description="Token type")

# ============================================================================
# In-memory storage
# ============================================================================

tasks_db: List[dict] = []
tokens_db: dict = {}  # {token: username}
task_id_counter = 1

# Sample users for authentication
USERS = {
    "student": "password123",
    "teacher": "admin123"
}

# ============================================================================
# Utility Functions
# ============================================================================

def get_current_user(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """Verify token and return username"""
    token = credentials.credentials
    if token not in tokens_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return tokens_db[token]

# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/login", response_model=LoginResponse, tags=["Authentication"])
def login(request: LoginRequest):
    """Authenticate user and receive token"""
    if request.username not in USERS or USERS[request.username] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    token = secrets.token_urlsafe(32)
    tokens_db[token] = request.username
    return LoginResponse(access_token=token)

# ============================================================================
# Task Endpoints
# ============================================================================

@app.get("/tasks", response_model=List[Task], tags=["Tasks"])
def get_tasks(current_user: str = Depends(get_current_user)):
    """Get all tasks for the current user"""
    return tasks_db

@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task(task: TaskCreate, current_user: str = Depends(get_current_user)):
    """Create a new task"""
    global task_id_counter
    new_task = {
        "id": task_id_counter,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "completed": False,
        "created_at": datetime.now()
    }
    tasks_db.append(new_task)
    task_id_counter += 1
    return new_task

@app.get("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
def get_task(task_id: int, current_user: str = Depends(get_current_user)):
    """Get a specific task by ID"""
    for task in tasks_db:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=Task, tags=["Tasks"])
def update_task(task_id: int, task: TaskCreate, current_user: str = Depends(get_current_user)):
    """Update a specific task"""
    for i, existing_task in enumerate(tasks_db):
        if existing_task["id"] == task_id:
            tasks_db[i].update(task.dict(exclude_unset=True))
            return tasks_db[i]
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Tasks"])
def delete_task(task_id: int, current_user: str = Depends(get_current_user)):
    """Delete a specific task"""
    global tasks_db
    tasks_db = [task for task in tasks_db if task["id"] != task_id]

# ============================================================================
# Health Check
# ============================================================================

@app.get("/", tags=["Health"])
def root():
    """API health check"""
    return {"message": "Task API is running!", "status": "ok"}

# ============================================================================
# Run the app
# ============================================================================

# To run this app, use: uvicorn starter-code:app --reload
# Then visit http://localhost:8000 for the API and http://localhost:8000/docs for documentation
