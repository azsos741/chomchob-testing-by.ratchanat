# Database

สมมติสถานการณ์ว่า 
คุณได้รับมอบหมายให้ออกแบบ Database ของระบบขาย code item สำหรับเกมต่างๆ 
ซึ่งคอยให้บริการแก่ลูกค้าที่ต้องการเข้ามาซื้อ code ไปเติมในเกม

  **โดยมีรายละเอียดดังนี้**
  
  - item ที่ขายจะต้องมี ชื่อสินค้า, รายละเอียดสินค้า, ราคาขาย, วันที่เปิดขาย, วันที่เลิกขาย
  - เมื่อลูกค้าซื้อ Item แล้วจะได้รับเป็น code (โดย code อาจถูกบันทึกไว้ล่วงหน้า หรือ อาจถูกสร้างหลังจากซื้อ ก็ได้)
  - item สามารถจัดโปรโมชั่นลดราคาในช่วงเวลาที่กำหนดได้ เช่น ปกติ ราคา 150 บาท จัดโปรเดือนมกราคม ลดราคาเป็น 100 บาท

  **Bonus**

  - item อาจถูกขายแบบ Bundle เช่น ขาย สกินตัวละครพร้อมกันสองตัวในราคาพิเศษ  หรือขาย กล่องสุ่มไอเท็ม 5 กล่อง ในราคาถูกกว่าปกติ

  **Objective**

  - สร้าง database ในรูปแบบของ model จาก [sequelize.](https://github.com/sequelize/sequelize)
  - วาด Entity Relationship Diagram (ERD) ออกมาแล้วส่งมาเป็นภาพหรือ pdf จะใช้ tool อะไรก็ได้ หรือจะเขียนมือส่งมาก็ไม่เป็นไร
  - ช่วยส่งรายละเอียดอธิบายว่าทำไมถึงออกแบบ Database ออกมาแบบนี้ เพื่อให้เราเข้าใจกันมากขึ้น :heart:

  **ตัวอย่าง Sequelize Model**

  ```js
  // Store User
  const User = sequelize.define('User', {
    id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
  })

  User.associate = (models) => {
    User.hasMany(UserCard, { foreignKey: 'user_id' })
  }

  // Store User credit card 
  const UserCard = sequelize.define('UserCard', {
    id: Sequelize.INTEGER,
    user_id: Sequelize.INTEGER,
    mask_pan: Sequelize.STRING,
  })

  UserCard.associate = (models) => {
    UserCard.belongsTo(User, { foreignKey: 'user_id' })
  }
  ```

  **ตัวอย่าง Entity Relationship Diagram**

  ![ERD](../image/ERD.png)
