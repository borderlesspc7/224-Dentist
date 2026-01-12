# 🚀 Guia Rápido - Sistema de Permissões

## Para Administradores do Sistema

### Criar Novo Usuário

```
1. Menu: Admin → Cadastro de Usuários
2. Preencher: Email, Senha, Nome
3. Selecionar Role:
   👑 Admin = Acesso Total
   👤 Partial = Escolher permissões
4. Se Partial: Marcar permissões desejadas
5. Salvar
```

### Perfis Comuns Sugeridos

**📊 Gerente Geral**
```
Role: Admin
Permissões: Todas (automático)
```

**💼 Gerente de Projetos**
```
Role: Partial
Permissões:
- dashboard
- management  
- reports
- cadastro-clientes
- avisos
- termino-projeto
```

**💰 Financeiro**
```
Role: Partial
Permissões:
- dashboard
- reports
- cadastro-conta-bancaria
- cadastro-cartao-credito
- cadastro-tipo-despesa
- cadastro-financiamentos
```

**👥 RH / Recursos Humanos**
```
Role: Partial
Permissões:
- dashboard
- cadastro-funcionario
- cadastro-veiculos
- manutencao-veiculos
```

**📝 Operacional / Cadastros**
```
Role: Partial
Permissões:
- dashboard
- cadastros
- cadastro-clientes
- cadastro-servico
- cadastro-funcionario
```

**🔔 Atendimento / Suporte**
```
Role: Partial
Permissões:
- dashboard
- avisos
- recebimento-cliente
```

## Para Desenvolvedores

### Uso Básico

```typescript
// 1. Importar
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';

// 2. Usar no componente
function MeuComponente() {
  const { checkPermission, isAdmin } = usePermissions();
  
  // Verificar permissão
  if (checkPermission(PERMISSIONS.DASHBOARD)) {
    return <Dashboard />;
  }
  
  return <SemAcesso />;
}
```

### Proteger Rota

```typescript
<Route 
  path="exemplo" 
  element={
    <ProtectedRoute required={PERMISSIONS.EXEMPLO}>
      <MinhaPage />
    </ProtectedRoute>
  } 
/>
```

### Adicionar Nova Permissão

```typescript
// 1. Em permissions.ts - Adicionar constante
export const PERMISSIONS = {
  MINHA_PERMISSAO: "minha-permissao",
  // ...
} as const;

// 2. Adicionar label
export const PERMISSION_LABELS: Record<Permission, string> = {
  [PERMISSIONS.MINHA_PERMISSAO]: "Minha Funcionalidade",
  // ...
};

// 3. Adicionar ao grupo
export const PERMISSION_GROUPS = [
  {
    id: "grupo",
    name: "Meu Grupo",
    permissions: [
      PERMISSIONS.MINHA_PERMISSAO,
    ],
  },
];
```

## Todas as Permissões Disponíveis

### 📊 Visão Geral
| Código | Descrição |
|--------|-----------|
| `dashboard` | Dashboard |
| `management` | Gerenciamento |
| `reports` | Relatórios |

### 📝 Cadastros
| Código | Descrição |
|--------|-----------|
| `cadastros` | Página de Cadastros |
| `cadastro-usuario` | Cadastro de Usuários |
| `cadastro-servico` | Cadastro de Serviços |
| `cadastro-clientes` | Cadastro de Clientes |
| `cadastro-funcionario` | Cadastro de Funcionários |
| `cadastro-subcontratados` | Cadastro de Subcontratados |
| `cadastro-servicos-contratados` | Cadastro de Serviços Contratados |
| `cadastro-financiamentos` | Cadastro de Financiamentos |
| `cadastro-veiculos` | Cadastro de Veículos |
| `cadastro-conta-bancaria` | Cadastro de Contas Bancárias |
| `cadastro-cartao-credito` | Cadastro de Cartões de Crédito |
| `cadastro-tipo-despesa` | Cadastro de Tipos de Despesa |
| `cadastro-preco-servico` | Cadastro de Preços de Serviços |

### 🔔 Avisos
| Código | Descrição |
|--------|-----------|
| `avisos` | Página de Avisos |
| `manutencao-veiculos` | Alerta de Manutenção de Veículos |
| `termino-projeto` | Alerta de Término de Projeto |
| `pagamento-subcontratados` | Alerta de Pagamento de Subcontratados |
| `recebimento-cliente` | Alerta de Recebimento de Cliente |
| `pagamento-servicos-contratados` | Alerta de Pagamento de Serviços |

### 👥 Usuários
| Código | Descrição |
|--------|-----------|
| `users` | Gerenciamento de Usuários |

## Checklist de Implementação

### ✅ Já Implementado
- [x] Sistema centralizado de permissões
- [x] Hook React para verificação
- [x] Proteção de todas as rotas
- [x] Filtro de menu/sidebar
- [x] Filtro de cards de cadastro
- [x] Filtro de cards de gerenciamento
- [x] Página de registro atualizada
- [x] Componente visual de permissões
- [x] Documentação completa

### ⚠️ Pendente (Recomendado)
- [ ] Firestore Security Rules
- [ ] Cloud Functions de validação
- [ ] Templates de permissões
- [ ] Auditoria e logs
- [ ] Permissões temporárias

## Comandos Úteis

### Verificar Lints
```bash
npm run lint
```

### Rodar Aplicação
```bash
npm run dev
```

### Build de Produção
```bash
npm run build
```

## Links Úteis

- **Documentação Completa**: `PERMISSIONS.md`
- **Detalhes de Implementação**: `IMPLEMENTACAO_PERMISSOES.md`
- **Código Principal**: `src/config/permissions.ts`
- **Hook**: `src/hooks/usePermissions.ts`

## Suporte Rápido

**Usuário não vê menu?**
→ Adicionar permissão `dashboard`

**Admin não acessa página?**
→ Verificar role no Firestore = "admin"

**Mudanças não aplicam?**
→ Fazer logout e login

**Erro ao criar usuário?**
→ Verificar se email já existe

---

**⚡ Versão Rápida** - Para documentação completa, veja `PERMISSIONS.md`

