# Backend

## Technologies Stack
* Postgres. [Install](https://www.postgresql.org/download/)
* Redis. [Install](https://redis.io/download)
* Mailhog. [Install](https://github.com/mailhog/MailHog)
* NodeJs. [Install](https://nodejs.org/en/download/)

## Setup
1. Install semua tech stack di atas.
2. Jalankan perintah
```bash
yarn install
```
3. Buat database di postgres sesuai dengan nama terserah, misalnya CMPLT
4. Copy `src/.env.example` menjadi `src/.env` dan `.env.example` menjadi `.env`, lalu isi semua variabelnya. File `.env` terluar merupakan file `.env` untuk production.
5. Jalankan perintah migrate
```bash
yarn migrate_latest
```
6. Jalankan perintah seed
```bash
yarn run_seed
```
7. Jalankan server development
```bash
yarn dev
```
