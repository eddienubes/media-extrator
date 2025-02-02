import { generateApiTypes } from '../api-generators/openApiGenerator.js'
import path from 'node:path'

const v3Source =
  'https://developer.themoviedb.org/openapi/64542913e1f86100738e227f'
const destination = path.join(import.meta.dirname, 'tmdb-types', 'types.ts')

export const generateTmdbApiTypes = async (): Promise<void> => {
  await generateApiTypes(v3Source, destination)
}

void generateTmdbApiTypes()
