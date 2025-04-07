# อัพเดท 7 Apr. 2025
### ที่ต้องไปเพิ่มเอง 
คำสั่ง Query สำหรับ SQL
```bash
USE coconutknowledgehub;
SET SQL_SAFE_UPDATES = 0;
UPDATE `event`
SET `image` = NULL;
SET SQL_SAFE_UPDATES = 1;
ALTER TABLE `event`
MODIFY COLUMN `image` VARCHAR(255);

```

```bash
USE coconutknowledgehub;
CREATE TABLE footer (
  id INT AUTO_INCREMENT UNIQUE,
  text TEXT,
  text_en TEXT,
  PRIMARY KEY (id)
);


```
## รายระเอียด Update
- ลบ API ทีไม่ได้ใช้
- Backend หน้า `news` เสร็จ
- API ของ `Footer`เสร็จ

โดย [Poom](https://github.com/WasitpolKuekkong)





# อัพเดท 2 Apr. 2025
### ที่ต้องไปเพิ่มเอง 
คำสั่ง Query สำหรับ SQL
```bash
USE coconutknowledgehub;
SET SQL_SAFE_UPDATES = 0;
UPDATE `new`
SET `image` = NULL;
SET SQL_SAFE_UPDATES = 1;
ALTER TABLE `new`
MODIFY COLUMN `image` VARCHAR(255);

```


## รายระเอียด Update
- อัพเดต icon ตรง ```footer ```

โดย [jeff]





# อัพเดท 30 Mar. 2025
### ที่ต้องไปเพิ่มเอง 
คำสั่ง Query สำหรับ SQL
```bash
USE coconutknowledgehub;
SET SQL_SAFE_UPDATES = 0;
UPDATE `tag_line`
SET `image` = NULL;
SET SQL_SAFE_UPDATES = 1;
ALTER TABLE `tag_line`
MODIFY COLUMN `image` VARCHAR(255);

```

เพิ่มใน .env
```bash
LOADING_TIME_MOCK = 1000 /// 1 วิ
```
## รายระเอียด Update
- ```tag_line``` ใน SQL ให้เปลียน type ชอง image จาก ```MEDIUMBLOB``` เป็น ```VARCHAR(255)```
- เพิ่ม ```LOADING_TIME_MOCK``` ใน ```.env``` ไว้จำลองเวลาโหลด 
- เพิ่ม API ```upload``` ไว้สำหรับเพิ่มไฟล์รูปไปเก็บตำแหนงที่ต้องการ
- แก้ API ```id``` ของ ```headline``` เพิ่ม method ```GET``` และ ลบ index ของ headline
- แก้ Componets ```TagLine``` ให้แสดงผลตามปกติ และ ปรับขนาดให้ตรงตามที่ Crop ในหน้าหลังบ่าน
- แก้ ```Navbar``` สลับยืดหด (จาก Comments พรี่ๆ)
- แก้ ```Lottie``` ให้ทำงานปกติ
- ตกแต่ง ```Coconut Information```

โดย [Poom](https://github.com/WasitpolKuekkong)