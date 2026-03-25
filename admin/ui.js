// Premium Admin UI Notifications and Modals
const AdminUI = {
    init: function() {
        if (!document.getElementById('admin-toast')) {
            const toastHtml = `
                <div id="admin-toast" class="admin-toast">
                    <i class="fa-solid fa-bell"></i>
                    <span id="toast-message">Mensagem</span>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', toastHtml);
        }

        if (!document.getElementById('admin-confirm-modal')) {
            const modalHtml = `
                <div id="admin-confirm-modal" class="modal">
                    <div class="modal-content confirm-modal-content">
                        <i id="confirm-icon" class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--accent-admin); margin-bottom: 1.5rem; display: block;"></i>
                        <h2 id="confirm-title" style="font-family:'Noto Serif'; font-size:1.8rem; color:var(--bg-admin); margin:0 0 1rem 0;">Atenção</h2>
                        <p id="confirm-message" style="color:var(--text-muted); font-size:1rem; margin:0 0 2rem 0; line-height:1.5;">Tem certeza que deseja continuar?</p>
                        <div style="display:flex; gap:1rem; justify-content:center;">
                            <button id="btn-confirm-cancel" class="btn-action-main" style="background:transparent; border:2px solid var(--bg-admin); color:var(--bg-admin); padding:1rem 2rem;">Cancelar</button>
                            <button id="btn-confirm-ok" class="btn-action-main" style="padding:1rem 2rem;">Confirmar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Confirm listeners
            document.getElementById('btn-confirm-cancel').addEventListener('click', () => {
                this.closeConfirm();
                if(this.onCancelCallback) this.onCancelCallback();
            });
            document.getElementById('btn-confirm-ok').addEventListener('click', () => {
                this.closeConfirm();
                if(this.onConfirmCallback) this.onConfirmCallback();
            });
        }

        if (!document.getElementById('admin-prompt-modal')) {
            const promptHtml = `
                <div id="admin-prompt-modal" class="modal">
                    <div class="modal-content confirm-modal-content" style="text-align: left; padding: 3rem 4rem;">
                        <h2 id="prompt-title" style="font-family:'Noto Serif'; font-size:2rem; color:var(--bg-admin); margin:0 0 1rem 0;">Atenção</h2>
                        <input type="text" id="prompt-input" class="form-input" style="width:100%; border:none; border-bottom: 2px solid #eef2eb; padding:1rem 0; font-size:1.1rem; outline:none; margin-bottom: 2rem; color: var(--bg-admin); font-weight:600;" placeholder="Digite aqui...">
                        <div style="display:flex; gap:1rem; justify-content:flex-end;">
                            <button id="btn-prompt-cancel" class="btn-action-main" style="background:transparent; border:2px solid var(--border-soft, #f0fde9); color:var(--text-muted); padding:1rem 2rem;">Cancelar</button>
                            <button id="btn-prompt-ok" class="btn-action-main" style="padding:1rem 2rem; background: var(--accent-admin);">Confirmar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', promptHtml);

            document.getElementById('btn-prompt-cancel').addEventListener('click', () => {
                this.closePrompt();
            });
            document.getElementById('btn-prompt-ok').addEventListener('click', () => {
                const val = document.getElementById('prompt-input').value;
                this.closePrompt();
                if(this.onPromptCallback) this.onPromptCallback(val);
            });
        }
    },

    notify: function(message, type = 'success') {
        this.init();
        const toast = document.getElementById('admin-toast');
        const msgEl = document.getElementById('toast-message');
        msgEl.innerText = message;
        
        toast.className = 'admin-toast show ' + type;
        
        // Hide after 3.5 seconds
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    },

    confirm: function(title, message, onConfirm, onCancel, icon = 'fa-circle-exclamation') {
        this.init();
        document.getElementById('confirm-title').innerText = title;
        document.getElementById('confirm-message').innerText = message;
        document.getElementById('confirm-icon').className = 'fa-solid ' + icon;
        
        this.onConfirmCallback = onConfirm;
        this.onCancelCallback = onCancel;
        
        document.getElementById('admin-confirm-modal').classList.add('active');
    },

    closeConfirm: function() {
        document.getElementById('admin-confirm-modal').classList.remove('active');
    },

    prompt: function(title, placeholder, onConfirm) {
        this.init();
        document.getElementById('prompt-title').innerText = title;
        document.getElementById('prompt-input').placeholder = placeholder || "Digite aqui...";
        document.getElementById('prompt-input').value = ""; // reset
        
        this.onPromptCallback = onConfirm;
        
        document.getElementById('admin-prompt-modal').classList.add('active');
        setTimeout(() => document.getElementById('prompt-input').focus(), 100);
    },

    closePrompt: function() {
        document.getElementById('admin-prompt-modal').classList.remove('active');
    }
};

// Add styles automatically
document.head.insertAdjacentHTML('beforeend', `
<style>
/* Toast Notification */
.admin-toast {
    visibility: hidden;
    min-width: 280px;
    background-color: var(--surface-admin);
    color: var(--bg-admin);
    text-align: left;
    border-radius: 1rem;
    padding: 1.2rem 2rem;
    position: fixed;
    z-index: 9999;
    right: 30px;
    top: 30px;
    font-size: 0.95rem;
    font-weight: 700;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 1rem;
    transform: translateY(-20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-left: 6px solid var(--accent-admin);
}
.admin-toast.success { border-left-color: #2e7d32; }
.admin-toast.error { border-left-color: #d32f2f; }
.admin-toast i { font-size: 1.2rem; color: var(--accent-admin); }
.admin-toast.success i { color: #2e7d32; }
.admin-toast.error i { color: #d32f2f; }
.admin-toast.show {
    visibility: visible;
    transform: translateY(0);
    opacity: 1;
}

/* Confirm Modal Adjustments */
.confirm-modal-content {
    text-align: center;
    width: 450px;
    padding: 4rem 3rem;
}
</style>
`);
