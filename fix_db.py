import pymysql
import json

conn = pymysql.connect(
    host='db',
    user='root',
    password='mysecretpassword',
    database='mendos_db',
    port=3306,
    charset='utf8mb4'
)

try:
    with conn.cursor() as cursor:
        cursor.execute("SELECT id, allergens FROM dishes")
        rows = cursor.fetchall()
        for row_id, allergens_json in rows:
            if not allergens_json:
                continue
            
            # allergens_json might be a string or a list already depending on driver
            if isinstance(allergens_json, str):
                allergens = json.loads(allergens_json)
            else:
                allergens = allergens_json
            
            new_allergens = []
            for a in allergens:
                # Fix common mangled patterns
                a = a.replace('LÃ¡cteos', 'Lácteos').replace('Lcteos', 'Lácteos')
                a = a.replace('CrustÃ¡ceos', 'Crustáceos')
                a = a.replace('SÃ©samo', 'Sésamo')
                new_allergens.append(a)
            
            cursor.execute("UPDATE dishes SET allergens = %s WHERE id = %s", (json.dumps(new_allergens, ensure_ascii=False), row_id))
    conn.commit()
finally:
    conn.close()
print("Allergens fixed!")
