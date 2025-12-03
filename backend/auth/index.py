import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib
import hmac
import base64
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash

def create_jwt(user_id: int, email: str, role: str) -> str:
    secret = os.environ.get('JWT_SECRET', '')
    header = base64.urlsafe_b64encode(json.dumps({'alg': 'HS256', 'typ': 'JWT'}).encode()).decode().rstrip('=')
    
    exp = int((datetime.utcnow() + timedelta(days=7)).timestamp())
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': exp
    }
    payload_encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    
    signature_input = f"{header}.{payload_encoded}"
    signature = base64.urlsafe_b64encode(
        hmac.new(secret.encode(), signature_input.encode(), hashlib.sha256).digest()
    ).decode().rstrip('=')
    
    return f"{header}.{payload_encoded}.{signature}"

def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    try:
        secret = os.environ.get('JWT_SECRET', '')
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_encoded, payload_encoded, signature_provided = parts
        
        signature_input = f"{header_encoded}.{payload_encoded}"
        signature_expected = base64.urlsafe_b64encode(
            hmac.new(secret.encode(), signature_input.encode(), hashlib.sha256).digest()
        ).decode().rstrip('=')
        
        if signature_provided != signature_expected:
            return None
        
        padding = '=' * (4 - len(payload_encoded) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_encoded + padding).decode())
        
        if payload.get('exp', 0) < int(datetime.utcnow().timestamp()):
            return None
        
        return payload
    except Exception:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and registration API
    Args: event - HTTP request with method, body, headers
          context - execution context
    Returns: JWT token on success or error message
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            email = body.get('email')
            password = body.get('password')
            full_name = body.get('full_name')
            phone = body.get('phone', '')
            role = body.get('role', 'parent')
            
            if not all([email, password, full_name]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email, password and full_name are required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                conn.close()
                return {
                    'statusCode': 409,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User already exists'}),
                    'isBase64Encoded': False
                }
            
            password_hash = hash_password(password)
            cursor.execute(
                "INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (%s, %s, %s, %s, %s) RETURNING id, email, role, full_name",
                (email, password_hash, role, full_name, phone)
            )
            user = cursor.fetchone()
            conn.commit()
            
            if role == 'teacher':
                cursor.execute(
                    "INSERT INTO teachers (user_id, rate_per_student) VALUES (%s, 0)",
                    (user['id'],)
                )
                conn.commit()
            
            conn.close()
            
            token = create_jwt(user['id'], user['email'], user['role'])
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'role': user['role'],
                        'full_name': user['full_name']
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'login':
            email = body.get('email')
            password = body.get('password')
            
            if not all([email, password]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email and password are required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "SELECT id, email, password_hash, role, full_name FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()
            conn.close()
            
            if not user or not verify_password(password, user['password_hash']):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid credentials'}),
                    'isBase64Encoded': False
                }
            
            token = create_jwt(user['id'], user['email'], user['role'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'role': user['role'],
                        'full_name': user['full_name']
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'verify':
            token = body.get('token')
            if not token:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Token is required'}),
                    'isBase64Encoded': False
                }
            
            payload = verify_jwt(token)
            if not payload:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid or expired token'}),
                    'isBase64Encoded': False
                }
            
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'valid': True, 'user': payload}),
                'isBase64Encoded': False
            }
        
        else:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
