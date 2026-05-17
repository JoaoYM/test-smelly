const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); 
  });

  // Refatoração 1: Eager Test dividido em dois
  test('deve criar um usuário atribuindo um ID definido', () => {
    // Arrange (Setup feito no beforeEach)
    
    // Act
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Assert
    expect(usuarioCriado.id).toBeDefined();
  });

  test('deve buscar um usuário existente pelo ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  // Refatoração 2: Lógica Condicional removida (dividido em dois testes)
  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
  });

  // Refatoração 3: Teste Frágil corrigido (verifica presença de dados, não formatação exata)
  test('deve gerar um relatório contendo os dados dos usuários cadastrados', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('ativo');
    expect(relatorio).toMatch(/--- Relatório de Usuários ---/);
  });
  
  // Refatoração 4: Erro do Try/Catch corrigido com toThrow
  test('deve lançar um erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const acaoCriarMenorDeIdade = () => {
      userService.createUser('Menor', 'menor@email.com', 17);
    };

    // Act & Assert
    expect(acaoCriarMenorDeIdade).toThrow('O usuário deve ser maior de idade.');
  });

  // Refatoração 5: Teste Ignorado agora implementado
  test('deve gerar relatório com apenas o cabeçalho quando não há usuários', () => {
    // Arrange (O beforeEach já limpou a base)
    
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
    expect(relatorio).not.toContain('ID:');
  });
});