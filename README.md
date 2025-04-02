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
- เปลี่ยนไฟล์ Dir สำหรับเก็บรูปภาพ อยู่ที่ ```public/images/ ```
- แก้ API ของ news เปลี่ยนไปใช้รูปใน Public
- แก้ `.gitignore` ให้ไม่เอารูไปด้วย

โดย [Poom](https://github.com/WasitpolKuekkong)





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