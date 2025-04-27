// controllers/userController.js
const { db } = require('../config/firebase');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Usaremos UUID para IDs únicos

const usersCollection = db.collection('usuarios');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'; // Pega do .env ou usa um padrão

// Função auxiliar para gerar links HATEOAS
const generateHateoasLinks = (userId) => {
  return [
    { rel: 'self', href: `${API_BASE_URL}/usuarios/${userId}`, method: 'GET' },
    { rel: 'update', href: `${API_BASE_URL}/usuarios/${userId}`, method: 'PUT' },
    { rel: 'delete', href: `${API_BASE_URL}/usuarios/${userId}`, method: 'DELETE' },
  ];
};

// --- CREATE ---
exports.createUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    // Verificar se email já existe (opcional, mas recomendado)
    const emailExists = await usersCollection.where('email', '==', email).limit(1).get();
    if (!emailExists.empty) {
        return res.status(409).json({ message: 'Este email já está cadastrado.' });
    }

    // **IMPORTANTE: Hash da senha antes de salvar**
    const saltRounds = 10; // Fator de custo para o hash
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const userId = uuidv4(); // Gera um ID único
    const newUser = {
      id: userId, // Armazena o ID também no documento
      nome,
      email,
      senhaHash, // Salva o hash, não a senha original
      createdAt: new Date().toISOString(),
    };

    // Salva no Firestore usando o UUID como ID do documento
    await usersCollection.doc(userId).set(newUser);

    // Remove o hash da senha da resposta
    const userResponse = { ...newUser };
    delete userResponse.senhaHash;

    // Adiciona links HATEOAS
    userResponse._links = generateHateoasLinks(userId);

    // Retorna 201 Created com os dados do usuário (sem senha) e links
    res.status(201).json(userResponse);

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
  }
};

// --- READ ALL ---
exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await usersCollection.orderBy('nome').get(); // Ordena por nome

    if (snapshot.empty) {
      return res.status(200).json([]); // Retorna array vazio se não houver usuários
    }

    const users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      // **IMPORTANTE: Nunca retorne a senha ou o hash dela em listas**
      delete userData.senhaHash;

      // Adiciona links HATEOAS para cada usuário
      userData._links = generateHateoasLinks(doc.id);
      users.push(userData);
    });

    res.status(200).json(users);

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar usuários.' });
  }
};

// --- READ ONE ---
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const userData = userDoc.data();
    // **IMPORTANTE: Nunca retorne a senha ou o hash**
    delete userData.senhaHash;

    // Adiciona links HATEOAS
    userData._links = generateHateoasLinks(userId);

    res.status(200).json(userData);

  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
  }
};

// --- UPDATE ---
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { nome, email } = req.body; // Permitir apenas atualização de nome e email

    // Validação básica
    if (!nome && !email) {
      return res.status(400).json({ message: 'Forneça pelo menos um campo (nome ou email) para atualizar.' });
    }

    const userRef = usersCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o novo email já existe em outro usuário (opcional)
    if (email && email !== userDoc.data().email) {
        const emailExists = await usersCollection.where('email', '==', email).limit(1).get();
        if (!emailExists.empty && emailExists.docs[0].id !== userId) {
            return res.status(409).json({ message: 'Este email já está sendo usado por outro usuário.' });
        }
    }

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date().toISOString();

    await userRef.update(updateData);

    // Busca os dados atualizados para retornar (sem a senha)
    const updatedDoc = await userRef.get();
    const updatedUserData = updatedDoc.data();
    delete updatedUserData.senhaHash;

    // Adiciona links HATEOAS
    updatedUserData._links = generateHateoasLinks(userId);

    res.status(200).json(updatedUserData);

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
  }
};

// --- DELETE ---
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = usersCollection.doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await userRef.delete();

    // Retorna 204 No Content, sem corpo na resposta
    res.status(204).send();

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao deletar usuário.' });
  }
};