
# อัพเดต 14 Apr.

### .env
env สามารถ config ได้ทุกอย่าง

```bash

##################### FRONT

NITRO_PORT=5000
# เฉพาะ localhost
NITRO_HOST='localhost'
# ถ้าอยากให้เครื่องอื่นเข้าถึงweb
# NITRO_HOST=0.0.0.0  


##################### BACK

###### API#
PORT=5000
BASE_URL = 'localhost'

###### DATABASE
DB_PASSWORD = '@Wow1TEi2T'
DB_HOST = 'localhost'
DB_USER = 'root'
DB_DATABASE = 'coconutknowledgehub'

##################### BOTH

API_BASE = '/coconut-api'

```

- API news Method GET ใช้ได้แล้ว เหลือ 
    - GET `Finished` (ตอนนี้ใช้ Mock Data ตอนนี้คอมไม่มี SQL)
    - GET by ID
    - POST
    - PUT (id)
    - DELETE (id)
    - ยังไม่ได้ Fetch data ที่หน้าบ้าน

- ใช้ `RUN.bat` จัดการ package และเริ่มการทำงาน Project ได้เลย
- 

# อัพเดต 13 apr.

เอา code จาก branch DakshineSUJEFF มาใส่แทน





