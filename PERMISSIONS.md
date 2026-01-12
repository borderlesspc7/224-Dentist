# Sistema de Permissões - Documentação

## 📋 Visão Geral

O sistema implementa um controle completo de permissões baseado em perfis de usuário, permitindo acesso granular a diferentes áreas e funcionalidades do sistema.

## 🎭 Tipos de Perfil

### 1. **Admin (Administrador)**
- Acesso completo a todas as funcionalidades
- Não precisa de permissões específicas configuradas
- Pode gerenciar outros usuários e suas permissões

### 2. **Partial (Acesso Parcial)**
- Acesso controlado através de permissões específicas
- Visualiza apenas menu e páginas autorizadas
- Ideal para usuários operacionais

## 🔐 Permissões Disponíveis

### Visão Geral
- `dashboard` - Dashboard principal
- `management` - Página de gerenciamento
- `reports` - Relatórios

### Cadastros
- `cadastros` - Página principal de cadastros
- `cadastro-usuario` - Cadastro de usuários
- `cadastro-servico` - Cadastro de serviços
- `cadastro-clientes` - Cadastro de clientes
- `cadastro-funcionario` - Cadastro de funcionários
- `cadastro-subcontratados` - Cadastro de subcontratados
- `cadastro-servicos-contratados` - Cadastro de serviços contratados
- `cadastro-financiamentos` - Cadastro de financiamentos
- `cadastro-veiculos` - Cadastro de veículos
- `cadastro-conta-bancaria` - Cadastro de contas bancárias
- `cadastro-cartao-credito` - Cadastro de cartões de crédito
- `cadastro-tipo-despesa` - Cadastro de tipos de despesa
- `cadastro-preco-servico` - Cadastro de preços de serviços

### Avisos
- `avisos` - Página principal de avisos
- `manutencao-veiculos` - Alerta de manutenção de veículos
- `termino-projeto` - Alerta de término de projeto
- `pagamento-subcontratados` - Alerta de pagamento de subcontratados
- `recebimento-cliente` - Alerta de recebimento de cliente
- `pagamento-servicos-contratados` - Alerta de pagamento de serviços contratados

### Usuários
- `users` - Gerenciamento de usuários

## 🚀 Como Usar

### Criando um Novo Usuário

1. Acesse **Admin → Users → Cadastro de Usuários**
2. Preencha os dados básicos (email, senha, nome)
3. Selecione o perfil:
   - **Admin**: Acesso total automático
   - **Partial**: Configure permissões específicas
4. Se escolher **Partial**, selecione as permissões desejadas
5. Salve o usuário

### Editando Permissões

1. Acesse **Admin → Users**
2. Clique em **Editar** no usuário desejado
3. Modifique o perfil ou permissões
4. Salve as alterações

## 💻 Uso no Código

### Hook usePermissions

```typescript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { checkPermission, isAdmin } = usePermissions();

  // Verificar uma permissão específica
  if (checkPermission(PERMISSIONS.DASHBOARD)) {
    // Usuário tem acesso ao dashboard
  }

  // Verificar se é admin
  if (isAdmin) {
    // Mostrar funcionalidades admin
  }

  return <div>...</div>;
}
```

### Protegendo Rotas

```typescript
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PERMISSIONS } from './config/permissions';

<Route 
  path="dashboard" 
  element={
    <ProtectedRoute required={PERMISSIONS.DASHBOARD}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Filtrando Elementos da UI

```typescript
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../config/permissions';

function Menu() {
  const { checkPermission } = usePermissions();

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard',
      permission: PERMISSIONS.DASHBOARD 
    },
    // ... outros itens
  ];

  const filteredItems = menuItems.filter(item => 
    checkPermission(item.permission)
  );

  return (
    <nav>
      {filteredItems.map(item => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

## 🔧 Arquitetura

### Arquivos Principais

1. **`src/config/permissions.ts`**
   - Define todas as permissões disponíveis
   - Funções de verificação de permissão
   - Agrupamento de permissões por categoria

2. **`src/hooks/usePermissions.ts`**
   - Hook React para facilitar verificações
   - Memoização para otimização

3. **`src/routes/ProtectedRoute.tsx`**
   - Componente para proteger rotas
   - Redirecionamento automático se sem permissão

4. **`src/routes/AdminRoutes.tsx`**
   - Todas as rotas internas protegidas
   - Cada rota verifica permissão específica

### Fluxo de Verificação

```
Usuário tenta acessar → ProtectedRoute verifica → hasPermission()
                                                          ↓
                                    Admin? → Sim → Permite acesso
                                      ↓ Não
                                    Partial? → Verifica allowedPaths
                                      ↓
                              Tem permissão? → Sim → Permite
                                      ↓ Não
                              Redireciona para /admin/dashboard
```

## 🎯 Benefícios

### Segurança
- ✅ Controle granular de acesso
- ✅ Proteção em nível de rota
- ✅ Validação tanto no frontend quanto deveria ter no backend

### Usabilidade
- ✅ Interface adapta-se ao perfil do usuário
- ✅ Menu mostra apenas opções disponíveis
- ✅ Usuários não veem o que não podem acessar

### Manutenibilidade
- ✅ Sistema centralizado de permissões
- ✅ Fácil adicionar novas permissões
- ✅ Hook reutilizável em qualquer componente

## 📝 Exemplos de Casos de Uso

### Caso 1: Operador de Cadastros
**Perfil**: Partial  
**Permissões**:
- `dashboard`
- `cadastros`
- `cadastro-clientes`
- `cadastro-funcionario`

**Resultado**: Vê apenas Dashboard e pode cadastrar clientes e funcionários.

### Caso 2: Financeiro
**Perfil**: Partial  
**Permissões**:
- `dashboard`
- `cadastro-conta-bancaria`
- `cadastro-cartao-credito`
- `cadastro-tipo-despesa`
- `reports`

**Resultado**: Vê Dashboard, Relatórios e pode gerenciar contas e despesas.

### Caso 3: Gestor de Projetos
**Perfil**: Partial  
**Permissões**:
- `dashboard`
- `management`
- `avisos`
- `termino-projeto`
- `cadastro-clientes`
- `reports`

**Resultado**: Acesso completo a gestão, avisos de projetos e relatórios.

## 🔄 Atualizações Futuras

### Melhorias Sugeridas

1. **Grupos de Permissões**
   - Criar templates de permissões (Financeiro, Operacional, etc.)
   - Facilitar atribuição em massa

2. **Auditoria**
   - Log de tentativas de acesso negadas
   - Histórico de mudanças de permissões

3. **Permissões Temporárias**
   - Conceder acesso por período limitado
   - Auto-revogação após data específica

4. **Permissões em Nível de Dados**
   - Controlar quais registros específicos o usuário pode ver/editar
   - Ex: Ver apenas clientes de determinada região

## 🐛 Troubleshooting

### Problema: Usuário não vê nenhum menu
**Solução**: Verifique se o usuário tem pelo menos uma permissão configurada. Usuários Partial sem permissões não verão nada.

### Problema: Admin não consegue acessar página
**Solução**: Verifique se o role está corretamente definido como "admin" no Firestore.

### Problema: Mudanças de permissão não aplicam imediatamente
**Solução**: Usuário precisa fazer logout e login novamente para carregar novas permissões.

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte esta documentação
2. Verifique os logs do console do navegador
3. Revise o código em `src/config/permissions.ts`

