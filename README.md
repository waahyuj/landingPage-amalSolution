# landingPage-amalSolution

# Dokumentasi Pembuatan Website
1. Buat folder kosong baru

2. Buka Terminal dan pilih git bush, dan ketik:
   ```
   express --view=pug landingPage
   ```

3. Ubah direktori ke folder kosong yang telah dibuat, lalu ketik:
   ```
   npm i
   node -v
   npm -v
   ```

4. Install Expressjs menggunakan:
   ```
   npm install express
   ```
   Jika tidak bisa terinstall gunakan kode dibawah:
   ```
   npm install -g express -generator@4
   ```

5. Install Tailwind CSS menggunakan:
   ```
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

6. Pada file "postcss.config.js" tambahkan kode dibawah: 
   ```
   module.exports = {
      plugins: [
         require('tailwindcss'),
         require('autoprefixer'),
      ]
   }
   ```

7. Pada file "tailwind.config.js", hapus seluruh isi dari file tersebut kemudian ganti dengan code dibawah:
   ```
   content: [
    "./views/**/*.{pug, html}",
    "./node_modules/tw-elements/dist/js/**/*.js",
   ],

   
   plugins: [require("tw-elements/dist/plugin.cjs")]
   ```

8. Pada file "app.js", setelah baris code "cookieParser", tambahkan kode dibawah: 
   ```
   app.use(express.static(path.join(__dirname, 'public')));
   app.use(express.static("node_modules"));
   ```

9. Pada file "package.json", hapus seluruh isi dari file tersebut kemudian ganti dengan code dibawah: 
   ```
   "scripts": {
      "start": "node ./bin/www",
       "test": "postcss public/stylesheets/tailwind.css -o public/stylesheets/style.css && nodemon",
       "tailwind:css": "postcss public/stylesheets/tailwind.css -o public/stylesheets/style.css",
       "dev": "npm run tailwind:css && nodemon ./bin/www -e js,css"
   },
   ```

10. Pada file "layout.pug", setelah baris blok kode "content", tambahkan kode dibawah: 
   ```
   script(src='/tw-elements/dist/js/tw-elements.umd.min.js', type='text/javascript')
   ```

11. Untuk menjalankan website yang telah dibuat gunakan code
   ```
   npm i tw-elements
   nodemon --exec npm run dev -e pug
   ```

# Dokumentasi Pembuatan Database
1. Lakukan Instalasi Neo4j melalui website resmi atau melalui link diberikut:
   https://neo4j.com/download/
![Image1]([https://drive.google.com/file/d/1KBWl4vZNWBUngd64v_equk1HnqtHUWy0/view?usp=sharing](https://drive.google.com/file/d/1KBWl4vZNWBUngd64v_equk1HnqtHUWy0/view?usp=sharing)
3. Setelah berhasil melakukan instalasi, buka Neo4j di desktop
4. Buat sebuah folder project untuk menyimpan file database anda, pilih menu "+ New", kemudian pilih "Create project"
5. Buat sebuah local DBMS di dalam folder project, pilih menu "+ Add", kemudian pilih "Local DBMS"
6. Isi nama dan password database, kemudian tekan tombol "Create"
7. Pilih database yang telah dibuat, lalu jalankan database tersebut dengan menekan tombol "Start"
8. Jika muncul tulisan "Active" maka database telah berhasil berjalan
9. Tekan tombol "Open" untuk berpindah ke Neo4j Browser
10. Selanjutnya buat isi database menggunakan Cypher Query Language pada baris "neo4j$"

## Pembuatan isi database Cypher Query Language
Beberapa Cypher Query Language yang digunakan:
- Membuat Node:
   ```
   CREATE (l:Level {label: "club", createdAt: TIMESTAMP(), createdBy: "Wahyu"}) 
   ```
   ```
   CREATE (p:Player {name: "Kepa Arrizabalaga", salary: 150000, contract: date({ year: 2023, month: 7, day: 12 }), status: "Active", createdAt:TIMESTAMP(), createdBy: "Wahyu" })
   ```
   ```
   CREATE (a:Section {label: "section2", title: "", subTitle: "", cardIcon: "", cardTopic: "", cardDescription: "", createdAt:TIMESTAMP(), createdBy: "Wahyu" })
   ```

- Membuat Edge(penghubung antar Node):
   ```
   MATCH (l:Level {label: "club"} ) 
   MATCH (p:Player) 
   MERGE (l)-[:HAS_PLAYER]->(p);
   ```

- Menghapus Node:
   ```
   MATCH (a:Level {label: "level"})
   DELETE a
   ```
   atau
   ```
   MATCH (p:player {name: 'Kepa Arrizabalaga'})
   DETACH DELETE n
   ```

- Menghapus Edge:
   ```
   MATCH (p:player {name: 'Kepa Arrizabalaga'})-[r:HAS_PLAYER]->()
   DELETE r
   ```

- Mengupdate Node:
   ```
   MATCH (p:player {name: "Kepa Arrizabalaga"})
   SET p.name = "Kepo Arrizabalaga",
       p.salary = 200000,
       p.contract = date({ year: 2024, month: 7, day: 10 }),
       p.updatedAt = TIMESTAMP(),
       p.updatedBy = "Hubert"
   RETURN p;
   ```

- Mengupdate Edge:
   ```
   MATCH (p:player {name: 'Kepa Arrizabalaga'})-[r:HAS_PLAYER]->()
   SET r = "HAS_BACKUP",
   RETURN R;
   ```
   
   
   
