export const TAMANHO_MINIMO_SENHA = 8;

/** Retorna a mensagem de erro, ou null se o usuário for válido. */
export function validarUsuario(usuario: string): string | null {
  if (!usuario.trim()) return 'Informe o usuário.';

  return null;
}

/** Retorna a mensagem de erro, ou null se o e-mail for válido. */
export function validarEmail(email: string): string | null {
  const valor = email.trim();

  if (!valor) return 'Informe o e-mail.';
  if (!valor.includes('@')) return 'O e-mail precisa conter @.';

  return null;
}

/** Retorna a mensagem de erro, ou null se a senha for válida. */
export function validarSenha(senha: string): string | null {
  if (!senha) return 'Informe a senha.';
  if (senha.length < TAMANHO_MINIMO_SENHA) {
    return `A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }

  return null;
}

/** Retorna a mensagem de erro, ou null se a confirmação bater com a senha. */
export function validarConfirmacao(
  senha: string,
  confirmarSenha: string
): string | null {
  if (!confirmarSenha) return 'Confirme a senha.';
  if (senha !== confirmarSenha) return 'As senhas não são iguais.';

  return null;
}