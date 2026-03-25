require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');

// Configuração Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// O projeto foi migrado para SUPABASE (Cloud). 
// As tabelas agora são gerenciadas remotamente em: https://vkzpvhclkgiuviyhkbjy.supabase.co


// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for development to allow external scripts/styles easily
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Files
// Frontpage and common assets
app.use(express.static(path.join(__dirname)));
// Admin specific static files (we'll protect the dashboard routes in logic)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Local DB for extended medical records (as Supabase schema doesn't have the columns yet)
const recordsDir = path.join(__dirname, 'data');
if (!fs.existsSync(recordsDir)) fs.mkdirSync(recordsDir);
const recordsFile = path.join(recordsDir, 'records.json');
if (!fs.existsSync(recordsFile)) fs.writeFileSync(recordsFile, '{}');

function getRecords() {
    return JSON.parse(fs.readFileSync(recordsFile, 'utf8'));
}
function saveRecords(data) {
    fs.writeFileSync(recordsFile, JSON.stringify(data, null, 2));
}

// Uploads directory config
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- Routes ---

// Lead Submission (Supabase)
app.post('/api/leads', async (req, res) => {
    const { nome, email, whatsapp, origem } = req.body;
    try {
        const { data, error } = await supabase.from('leads').insert([{ 
            nome, email, whatsapp, origem: origem || 'home' 
        }]);
        if (error) throw error;
        res.status(201).json({ message: 'Lead capturado no Supabase!' });
    } catch (err) {
        console.error('Erro Leads Supabase:', err);
        res.status(500).json({ error: 'Falha na conexão com banco em nuvem.' });
    }
});

// Visitor Pages Routes (optional, if we use real files, express.static handles them)
// But for "structured" backend we might want specific routes.
app.get('/blog', (req, res) => res.sendFile(path.join(__dirname, 'blog.html')));
app.get('/privacidade', (req, res) => res.sendFile(path.join(__dirname, 'privacy.html')));

// Admin Authentication & Access
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-erica-reis';

// Login Endpoint (Supabase Bridge)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const { data: user, error } = await supabase.from('admin_users').select('*').eq('username', username).single();
        if (error || !user) return res.status(401).json({ error: 'Usuário não encontrado na nuvem.' });
        
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Senha incorreta.' });
        
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '8h' });
        res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Login via Supabase realizado!', role: 'admin' });
    } catch (err) {
        res.status(500).json({ error: 'Falha crítica na autenticação na nuvem.' });
    }
});

// Middleware for Admin Protected Routes
const authenticateToken = (req, res, next) => {
    const token = req.cookies.auth_token;
    
    if (!token) {
        if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Sessão expirada.' });
        return res.status(401).redirect('/admin/login.html');
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Token inválido.' });
            return res.status(403).redirect('/admin/login.html');
        }
        req.user = user;
        next();
    });
};

// Admin Dashboard Access
app.get('/admin/dashboard', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Admin Lead Listing API (Supabase)
// Admin Lead Listing API (Supabase)
app.get('/api/admin/leads', authenticateToken, async (req, res) => {
    try {
        const { data: leads, error } = await supabase.from('leads').select('*').order('data_criacao', { ascending: false });
        if (error) throw error;
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar leads no banco em nuvem.' });
    }
});

// --- Gestão de Pacientes ---
app.post('/api/admin/patients', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase.from('patients').insert([req.body]);
        if (error) throw error;
        res.status(201).json({ message: 'Paciente cadastrado na nuvem!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar paciente no Supabase.' });
    }
});

app.get('/api/admin/patients', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase.from('patients').select('*').order('full_name');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar pacientes.' });
    }
});

app.get('/api/admin/patients/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase.from('patients').select('*').eq('id', req.params.id).single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar dados do paciente.' });
    }
});

app.put('/api/admin/patients/:id', authenticateToken, async (req, res) => {
    try {
        const payload = {
            full_name: req.body.full_name,
            birth_date: req.body.birth_date,
            cpf: req.body.cpf,
            status: req.body.status,
            type: req.body.type,
            phone: req.body.phone,
            email: req.body.email
        };
        // Remove undefined fields
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data, error } = await supabase.from('patients').update(payload).eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Paciente atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar paciente.', details: err.message });
    }
});

// Extended Medical Record endpoints (CRUD genérico)
app.get('/api/admin/patients/:id/record', authenticateToken, (req, res) => {
    const records = getRecords();
    res.json(records[req.params.id] || {});
});

app.put('/api/admin/patients/:id/record', authenticateToken, (req, res) => {
    const records = getRecords();
    records[req.params.id] = req.body;
    saveRecords(records);
    res.json({ message: 'Prontuário médico estendido salvo com sucesso.' });
});

app.delete('/api/admin/patients/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase.from('patients').delete().eq('id', req.params.id);
        if (error) throw error;
        
        // Remove extended record totally
        const records = getRecords();
        if(records[req.params.id]) {
            delete records[req.params.id];
            saveRecords(records);
        }

        res.json({ message: 'Paciente excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir paciente.', details: err.message });
    }
});

// Endpoint para Upload de Exames
app.post('/api/admin/patients/:id/upload', authenticateToken, upload.single('documento'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    
    // In a real scenario, you'd save this path/url to the patient's record in Supabase.
    // Assuming 'patients' has a jsonb field to store files. If not, this is a simplified stub.
    try {
        res.status(200).json({ message: 'Arquivo anexado com sucesso!', fileUrl: '/uploads/' + req.file.filename });
    } catch(err) {
        res.status(500).json({ error: 'Erro ao processar o arquivo anexado.' });
    }
});

// --- Métricas do Dashboard ---
app.get('/api/admin/metrics', authenticateToken, async (req, res) => {
    try {
        const { count: totalPatients, error: errP } = await supabase.from('patients').select('*', { count: 'exact', head: true });
        const { count: totalLeads, error: errL } = await supabase.from('leads').select('*', { count: 'exact', head: true });
        
        if (errP || errL) throw errP || errL;

        res.json({
            patientsCount: totalPatients || 0,
            leadsCount: totalLeads || 0,
            fidelityRate: '94%', // Placeholder para lógica futura de retornos
            approvalScore: '4.9/5'
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao calcular métricas.' });
    }
});

// --- Blog & Conteúdo ---
app.post('/api/admin/posts', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase.from('blog_posts').insert([req.body]);
        if (error) throw error;
        res.status(201).json({ message: 'Publicação salva no Supabase!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao publicar no blog.' });
    }
});

// Setup finalizado: Supabase ativo.
// Criando bridge de segurança para os prontuários...

// Start Server
app.listen(PORT, () => {
    console.log(`\n--- SERVIDOR ATIVO ---`);
    console.log(`Link do site: http://localhost:${PORT}`);
    console.log(`Link da área admin: http://localhost:${PORT}/admin/login.html`);
});
