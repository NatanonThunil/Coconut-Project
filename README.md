# โหลด Docker

[Docker Desktop](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module&_gl=1*euk4rm*_gcl_au*MTg2MjQyNTUzNy4xNzQxOTM4MDg3*_ga*MTk0NDE5MjUyMy4xNzQxOTM4MDg3*_ga_XJWPQMJYHQ*MTc0MjAxMzMyNi4zLjEuMTc0MjAxNTY1My41OS4wLjA.)

# รัน Docker Compose
รันครั้งแรก ให้มัน set enviroments ก่อน
 ```bash
 docker-compose up -d --build 
```
รันหลังจากครั้งแรก
```bash
 docker-compose up 
 ```

ตอนนี้ ใช้ DB เดียวกับที่มีในเครื่อง
อนาคตต้องทำให้มันรันใน image