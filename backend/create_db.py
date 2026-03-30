import pymysql
import sys

try:
    conn = pymysql.connect(host='localhost', user='root')
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS mendos_db")
    conn.commit()
    print("Database 'mendos_db' created or already exists.")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
finally:
    if 'conn' in locals() and conn:
        conn.close()
