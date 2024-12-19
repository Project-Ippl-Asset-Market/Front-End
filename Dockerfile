# Menggunakan image dasar Node.js
FROM node:18

# Set direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json ke dalam container
COPY package.json package-lock.json ./

# Install semua dependensi
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Ekspos port sesuai konfigurasi aplikasi
EXPOSE 5173

# Jalankan aplikasi menggunakan Vite 
CMD ["npm", "run", "dev"]
