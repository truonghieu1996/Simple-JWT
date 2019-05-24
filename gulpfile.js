// CONFIGURATIONS
const dir = {
  dist: 'dist',
  setup: 'setup',
  server: 'server'
}

// DEPENDENCIES
const gulp = require('gulp')
const path = require('path')
const fs = require('fs-extra')
const {exec} = require('child_process')

// FUNCTIONS
const run = (cmd, dir) => {
  return new Promise((resolve, reject) => {
    exec(cmd, {cwd: dir}, (err, stdout, stderr) => {
      if (err) {
        console.log('\x1b[0m', err)
        reject(err)
      } else {
        console.log('\x1b[0m', stdout || stderr)
        resolve()
      }
    })
  })
}

const clean = () => {
  if (fs.existsSync(dir.dist)) {
    fs.removeSync(dir.dist)
  }
  return Promise.resolve()
}

const copySetup = () => {
  return new Promise((resolve, reject) => {
    gulp
      .src(path.join(dir.setup, '**/*'), { base: '.' })
      .pipe(gulp.dest(dir.dist))
      .on('finish', () => {
        resolve()
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

const copyServer = () => {
  return new Promise((resolve, reject) => {
    gulp
      .src(path.join(dir.server, '**'))
      .pipe(gulp.dest(dir.dist))
      .on('finish', () => {
        resolve()
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

const build = () => {
  return clean()
    .then(() => run('npm install', dir.setup))
    .then(() => run('npm install', dir.server))
    .then(() => copySetup())
    .then(() => copyServer())
    .then(() => {
      return Promise.resolve()
    })
    .catch((err) => {
      console.error(err)
      return Promise.reject(err)
    })
}

// TASKS
gulp.task('clean', clean)
gulp.task('build', build)
gulp.task('start', () => {
  return build()
    .then(() => {
      console.log('started')
      return Promise.resolve()
    })
})
gulp.task('init-db', () => {
  return run('npm install', dir.setup)
    .then(() => run('npm run init', dir.setup))
})
gulp.task('lint', () => {
  return run('npm run lint', dir.server)
})
