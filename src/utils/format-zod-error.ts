import { ZodError } from "zod";

/**
 * Transforma um ZodError em um array simples de strings.
 * Ideal para retornos de Server Actions.
 */
export function formatZodErrors(error: ZodError): string[] {
  // O flatten extrai as mensagens de erro mapeadas por campo
  const formattedErrors = error.flatten();

  // Pegamos apenas os valores (arrays de strings) e achatamos tudo em um único array
  // Adicionamos também o formErrors (erros globais do formulário)
  const fieldErrors = Object.values(formattedErrors.fieldErrors).flat();
  const globalErrors = formattedErrors.formErrors;

  return [...globalErrors, ...fieldErrors] as string[];
}
