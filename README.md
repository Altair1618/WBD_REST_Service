# Milestone 2 WBD Kelompok 9 [REST SERVICE]

## Deskripsi Aplikasi
Aplikasi LearnIt! adalah sebuah aplikasi LMS yang sisusun untuk memenuhi Tugas Milestone 2 IF3110 Pengembangan Aplikasi Berbasis Web. Aplikasi dapat diakses dengan 3 tipe pengguna: Admin, Pengajar, Pelajar. Admin memiliki kemampuan untuk mengubah semua data. Pengajar bisa membuat, membaca, mengubah, dan menghapus mata kuliah, modul, dan materi. Pelajar dapat mendaftar suatu mata kuliah dan membaca modul serta materi. <br><br>
Aplikasi ini memiliki mode premium dimana pelajar harus melakukan langganan terlebih dahulu dan di-approve oleh Admin. Pengajar yang ingin membuat mata kuliah premium harus melakukan apply yang harus di-approve oleh Admin. Kelebihan dari mata kuliah premium adalah adanya sertifikat penyelesaian yang dapat dikirimkan oleh pengajar mata kuliah berkait. <br><br>
REST Service ini merupakan service yang mengurus backend dari SPA Client.

## Dibuat Oleh:
- [Moch. Sofyan Firdaus (13521083)](https://github.com/msfir)
- [Farhan Nabil Suryono (13521114)](https://github.com/Altair1618)

## Tech Stacks:
1. NodeJS 18
2. Express
3. MySQL Database
4. Prisma

## Cara Instalasi
1. Clone _repository_ ini beserta repository lainnya dalam satu folder yang sama
2. Buatlah sebuah file `.env` yang bersesuaian dengan penggunaan (contoh file tersebut dapat dilihat pada `.env.example`).

## Cara Menjalankan Server
1. Jalankan perintah `docker compose up -d` pada folder repository config
2. Aplikasi berjalan pada `http://localhost:5000`.
3. Hentikan aplikasi dengan perintah `docker compose down` pada folder repository config.

## Endpoints
<table>
  <thead>
    <tr>
      <td>
        Endpoint
      </td>
      <td>
        Method
      </td>
      <td>
        Deskripsi
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        /login
      </td>
      <td>
        POST
      </td>
      <td>
        API Login
      </td>
    </tr>
    <tr>
      <td>
        /register
      </td>
      <td>
        POST
      </td>
      <td>
        API Register
      </td>
    </tr>
    <tr>
      <td>
        /self
      </td>
      <td>
        GET
      </td>
      <td>
        Get Current User
      </td>
    </tr>
    <tr>
      <td>
        /approvals
      </td>
      <td>
        GET
      </td>
      <td>
        Get Unapproved Users
      </td>
    </tr>
    <tr>
      <td>
        /user/accept/:id
      </td>
      <td>
        PUT
      </td>
      <td>
        Accept User
      </td>
    </tr>
    <tr>
      <td>
        /user/reject/:id
      </td>
      <td>
        PUT
      </td>
      <td>
        Reject User
      </td>
    </tr>
    <tr>
      <td>
        /courses
      </td>
      <td>
        GET
      </td>
      <td>
        Mendapatkan semua mata kuliah
      </td>
    </tr>
    <tr>
      <td>
        /courses
      </td>
      <td>
        POST
      </td>
      <td>
        Membuat mata kuliah baru
      </td>
    </tr>
    <tr>
      <td>
        /courses/:id
      </td>
      <td>
        GET
      </td>
      <td>
        Mendapatkan mata kuliah dengan id tertentu
      </td>
    </tr>
    <tr>
      <td>
        /courses/:id/students
      </td>
      <td>
        GET
      </td>
      <td>
        Mendapatkan semua pelajar yang mengambil mata kuliah dengan id tertentu
      </td>
    </tr>
    <tr>
      <td>
        /courses/:id
      </td>
      <td>
        PUT
      </td>
      <td>
        Mengubah mata kuliah dengan id tertentu
      </td>
    </tr>
    <tr>
      <td>
        /courses/:id
      </td>
      <td>
        DELETE
      </td>
      <td>
        Menghapus mata kuliah dengan id tertentu
      </td>
    </tr>
    <tr>
      <td>
        /subscriptions
      </td>
      <td>
        GET
      </td>
      <td>
        Mendapatkan semua permintaan langganan yang belum di-approve
      </td>
    </tr>
    <tr>
      <td>
        /subscription/accept/:id
      </td>
      <td>
        PUT
      </td>
      <td>
        Menerima permintaan langganan dengan id tertentu
      </td>
    </tr>
    <tr>
      <td>
        /subscription/reject/:id
      </td>
      <td>
        PUT
      </td>
      <td>
        Menolak permintaan langganan dengan id tertentu
      </td>
    </tr>
    <tr>
      <td>
        /certificate
      </td>
      <td>
        GET
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>
        /certificate
      </td>
      <td>
        POST
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>
        /certificate
      </td>
      <td>
        PUT
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>
        /certificate
      </td>
      <td>
        DELETE
      </td>
      <td>
      </td>
    </tr>
    <tr>
      <td>
        /certificate/send
      </td>
      <td>
        POST
      </td>
      <td>
      </td>
    </tr>
  </tbody>
</table>

## Pembagian Tugas
### Setup
<table>
  <tbody>
    <tr>
      <td>Docker</td>
      <td>13521114</td>
    </tr>
    <tr>
      <td>Framework Pengerjaan</td>
      <td>13521114</td>
    </tr>
    <tr>
      <td>Database</td>
      <td>13521114</td>
    </tr>
  </tbody>
</table>

### Service
<table>
  <tbody>
    <tr>
      <td>API Auth</td>
      <td>13521114</td>
    </tr>
    <tr>
      <td>API CRUD Course</td>
      <td>13521114</td>
    </tr>
    <tr>
      <td>API User Approvals</td>
      <td>13521114</td>
    </tr>
    <tr>
      <td>API Subscription</td>
      <td>13521114</td>
    </tr>
    <tr>
      <td>API CRUD Certificate</td>
      <td>13521083</td>
    </tr>
  </tbody>
</table>