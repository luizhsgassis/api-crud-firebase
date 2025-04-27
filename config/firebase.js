// config/firebase.js
const admin = require('firebase-admin');
require('dotenv').config(); // Carrega variáveis do .env

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Lê as credenciais do .env
    // databaseURL: 'https://<SEU-PROJETO-ID>.firebaseio.com' // Opcional, necessário para Realtime Database
  });
  console.log('Firebase Admin SDK inicializado com sucesso.');
} catch (error) {
  console.error('Erro ao inicializar Firebase Admin SDK:', error);
  process.exit(1); // Encerra a aplicação se não conseguir conectar ao Firebase
}

const db = admin.firestore(); // Instância do Firestore

module.exports = { admin, db }; // Exporta a instância do Firestore e o admin