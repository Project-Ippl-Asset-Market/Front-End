# Menggunakan image dasar Node.js versi 14
FROM node:20-alpine 

# Menentukan direktori kerja dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Menginstall dependencies yang dibutuhkan aplikasi
RUN npm install

# Menyalin semua file aplikasi ke dalam container
COPY . .

# Mengatur port yang digunakan oleh aplikasi
EXPOSE 5173

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "dev"]