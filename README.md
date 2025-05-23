# อัพเดต 17 May.

## TO-DO

- API news 
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id) `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - DELETE (id)

- API events
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id) `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - DELETE (id)

- API footers
    - GET `ไม่ได้ใช้แต่ใส่ไปนั่นแหละ`
    - GET by ID `Finished`
    - PUT (id) `Finished`

- API Achievements
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id) `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`


## Update List

- แก้ fetch Achievements
![หน้า About us](image.png)
- หน้าที่แก้
    - AboutUs
    - AboutUs/Achievements
    - AboutUs/Achievements/id



# อัพเดต 13 May.

## TO-DO

- แก้ไฟล์ components 
  - ตรง CHK เป็น cocon-key ทุกหน้าเรียบร้อย(ฝากเช็คดูอีกทีนะเพื่อตาลาย)



# อัพเดต 30 Apr.

## TO-DO

- API news 
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id)
    - DELETE (id)

- API events
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id)
    - DELETE (id)

- API footers
    - GET `ไม่ได้ใช้แต่ใส่ไปนั่นแหละ`
    - GET by ID `Finished`
    - PUT (id) `Finished`


## Update List

- เพิ่ม API `Footer` GET, GET by id, PUT
- Merge หน้า `Pest` ของ [เจมส์](https://github.com/JeerasakSampeng)

โดย [Poom](https://github.com/WasitpolKuekkong)



# อัพเดต 29 Apr.

## TO-DO

- API news 
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id)
    - DELETE (id)

- API events
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id)
    - DELETE (id)

## Update List

- เปลี่ยนดึง key ใช้โดยตรง ไปดึงจาก `.env`

    ตัวอย่าง
    ```bash
    /// จากหน้า backend/routes/news.js
    const API_KEY = 'Cocon541986';
    ```
    เป็น
    ```bash
    /// จากหน้า backend/routes/news.js
    const API_KEY = process.env.API_SECRET
    ```

- แก้ Components `HomeEvents` ให้ใช้ `Composables/useEvents.ts` ได้
- เพิ่ม API events
- เพิ่มกรีณีรองรับ import ไฟล์ไม่สำเร็จให้ดูง่ายขึ้นว่ามาดึงมาใช้ไม่ได้

โดย [Poom](https://github.com/WasitpolKuekkong)


# อัพเดต 24 Apr.

- แก้ให้ หน้า new โชว์ใน sever ได้ละ

โดย [Jeff]


# อัพเดต 20 Apr.

- อัพ multer ลง imdage-upload 
- แก้ post 5001 เป็น 5100
- แก้ให้ frontend เชื่อม .env ของ backend

โดย [Jeff]


# อัพเดต 18 Apr.

- API news 
    - GET `Finished`
    - GET by ID `Finished`
    - POST `ต้องใช้ API ของ upload เพื่ออัพโหลดรูป`
    - PUT (id)
    - DELETE (id)

-เพิ่ม Method POST ให้ news

โดย [Poom](https://github.com/WasitpolKuekkong)




# อัพเดต 16 Apr.

### .env
แก้ .env

```bash

##################### FRONT

NITRO_PORT=5000
# เฉพาะ localhost
NITRO_HOST='localhost'
# ถ้าอยากให้เครื่องอื่นเข้าถึงweb
# NITRO_HOST=0.0.0.0  
FE_BASE_URL = 'http://localhost:5000'
FE_PORT=5000
API_SECRET = 'Cocon541986'
##################### BACK

API_BASE = '/coconut-api'
DB_PASSWORD = '@Wow1TEi2T'
DB_HOST = 'localhost'
DB_USER = 'root'
DB_DATABASE = 'coconutknowledgehub'
BE_BASE_URL = 'http://localhost:5001'
BE_PORT=5001


```

- API news 
    - GET `Finished`
    - GET by ID `Finished`
    - POST
    - PUT (id)
    - DELETE (id)

- แยก Port หน้าบ้านเป็น `5000` หลังบ้าน `5001`
- Fetch ข้อมูลทุกหน้าของ `news`
- เพิ่ม Middleware ที่หลังบ้าน กัน Search แล้วไปเจอ
- เพิ่ม Composables จัดการ RestAPIs

โดย [Poom](https://github.com/WasitpolKuekkong)


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
    - GET `Finished` (ใช้ Mock Data ตอนนี้คอมไม่มี SQL)
    - GET by ID
    - POST
    - PUT (id)
    - DELETE (id)
    - ยังไม่ได้ Fetch data ที่หน้าบ้าน

- ใช้ `RUN.bat` จัดการ package และเริ่มการทำงาน Project ได้เลย
  

# อัพเดต 13 apr.

เอา code จาก branch DakshineSUJEFF มาใส่แทน





