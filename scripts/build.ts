import * as esbuild from 'esbuild'
import path from 'path'
import { readdir, copyFile } from 'fs/promises'
import { mkdirSync, rmSync } from 'fs'

const srcPath = path.resolve(__dirname, '..', 'src')
const entryPoint = path.resolve(srcPath, 'index.ts')
const distPath = path.resolve(__dirname, '..', 'build')

async function getFolderFiles(folder: string): Promise<string[]> {
  const files = await readdir(folder, { recursive: true, encoding: 'utf-8', withFileTypes: true })
  const paths: string[] = []
  for (const file of files) {
    if (file.name.match(/.*(test|spec).(js|jsx|ts|tsx)$/gm)) {
      continue
    }
    const pathFull = path.resolve(file.path, file.name)
    if (file.isDirectory()) {
      const subPaths = await getFolderFiles(pathFull)
      paths.push(...subPaths)
    } else {
      paths.push(pathFull)
    }
  }
  return paths
}

async function copyFileToDist(src: string) {
  const dest = src.replace(srcPath, distPath)
  console.log('Copying', src, 'to', dest)
  await copyFile(src, dest)
}

async function main() {
  const exts = ['.ts', '.mts', '.js', '.mjs']
  const files = await getFolderFiles(srcPath)
  console.log('Found', files.length, 'files')
  const entryPoints = files
    .filter((file) => {
      if (file.includes('node_modules')) {
        return false
      }
      const fileExt = path.extname(file)
      if (fileExt.length === 0) {
        return false
      }
      if (exts.includes(fileExt)) {
        return true
      } else {
        copyFileToDist(file).catch((err) => {
          console.error(err)
          process.exit(1)
        })
        return false
      }
    })
    .map((file) => path.resolve(srcPath, file))
  console.log('Found', entryPoints.length, 'entry points')
  console.log('Removing old build...')
  rmSync(distPath, { recursive: true, force: true })
  mkdirSync(distPath)

  console.log('Building...')
  const build = await esbuild.build({
    entryPoints: [entryPoint],
    outdir: distPath,
    bundle: true,
    platform: 'node',
    target: 'node20',
    minify: true,
    color: true,
    charset: 'utf8',
    format: 'cjs',
    allowOverwrite: true,
    tsconfig: path.resolve(__dirname, '..', 'tsconfig.json'),
  })
  build.errors.forEach((err) => {
    console.error(err)
  })
  build.warnings.forEach((warn) => {
    console.warn(warn)
  })
  build.outputFiles?.forEach((file) => {
    console.log('Generated', file.path)
  })
  console.log('Build complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
