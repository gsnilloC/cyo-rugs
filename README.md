# CYO Rugs 🧶 | Create Your Own Rugs
https://www.cyorugs.com
### 💻 Created with
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Customer Purchase Flow
```mermaid
sequenceDiagram
    participant Customer
    participant Shop Page
    participant Backend
    participant Square
    participant Database
    participant SendGrid

    Customer->>Shop Page: 1. Select rug from inventory
    Shop Page->>Square: 2. Initiate checkout
    Note over Square: Create payment checkout session

    Square-->>Customer: 3. Display checkout form
    Customer->>Square: 4. Complete payment

    Square-->>Backend: 5. Payment webhook
    Note over Backend: Verify payment status

    Backend->>Database: 6. Update inventory
    Note over Database: - Decrease stock count<br>- Record sale

    Backend->>SendGrid: 7. Send order confirmation
    SendGrid-->>Customer: Receive confirmation email
    Note over Customer: Order details & tracking info
