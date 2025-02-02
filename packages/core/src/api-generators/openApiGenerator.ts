import openApiTs, { astToString } from 'openapi-typescript'
import fs from 'node:fs/promises'

/**
 * Generates types from a swagger json source
 * @param source
 * @param destination
 */
export const generateApiTypes = async (
  source: string,
  destination: string,
): Promise<void> => {
  const ast = await openApiTs(new URL(source))

  const contents = astToString(ast)

  await fs.writeFile(destination, contents)
}
