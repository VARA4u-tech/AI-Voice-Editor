from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from config import get_settings

security = HTTPBearer()

def verify_supabase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    settings = get_settings()
    token = credentials.credentials
    
    if not settings.supabase_jwt_secret:
        # If no JWT secret is configured in the backend, we might want to allow it for local dev 
        # or fail securely in production. We fail strictly for security.
        raise HTTPException(status_code=500, detail="Server misconfiguration: supabase_jwt_secret missing")

    try:
        # Verify the token using the Supabase JWT Secret
        decoded = jwt.decode(
            token, 
            settings.supabase_jwt_secret, 
            algorithms=["HS256"], 
            audience=["authenticated"]
        )
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Authentication token")
