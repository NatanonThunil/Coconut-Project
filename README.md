# อัพเดต 10 Aug.
## TO-DO

[สิ่งที่ต้องทำ](https://docs.google.com/spreadsheets/d/1NDhvBJG8o2P7wu1rH3hCp-lxJH54Xx8qc7zIhU5GLtk/edit?fbclid=IwY2xjawMEpXRleHRuA2FlbQIxMABicmlkETFrR05qd2ZpVjFvS1JDZlhvAR4jq867vR4WSRxRRc_JTi9aF1px4QyPiD9OHQQHxVuGbLEcnpR7GPCrvu0RQw_aem_OBtN9dfj11fhyJzG2bZGPA&gid=330990533#gid=330990533)
## Update List
- ``FAQs`` กลับมาใช้งานปกติ ทั้ง Front และ Back (API, Admin Page)
- เพิ่ม coconutApi 'แต่มันไม่ขึ้น api ให้เห็น error เลยไม่รู้ว่าผิดตรงไหน'
- เพิ่ม Experts มา

โดย [SuJeff] และ [Poom](https://github.com/WasitpolKuekkong)

# อัพเดต 5 Aug.

## TO-DO

- เพิ่ม API Employees มาแต่มันไม่แสดง(เพราะไรไม่รู้ไม่ขึ้น Errorให้ด้วย)

- Achievements
    - ไม่แสดงการ์ด 



- **ลบ ตัว app.use(express.static('public')) มันทำให้ sever แตกเลยลบไป ถึงไม่มี sever ก็รันได้ปกติรูปใน public ก็ขึ้นไม่มีปัญหา ** 



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





