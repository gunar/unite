#!/usr/bin/node
// const argv = require('yargs').argv

const { spawn, spawnSync } = require('child_process')
const [ pathToNode, pathToFile, ...commands ] = process.argv
const blessed = require('blessed')

console.log(commands)

const screen = blessed.screen({
  smartCSR: true,
})

commands.forEach((command, index) => {
  const [cmd, ...args] = command.split(' ')
  const opts = {
    height: `${(100/commands.length)}%`,
    width: '100%',
    top: `${index*(100/commands.length)}%`,
    interactive: false,
    content: '',
    tags: true,
    title: cmd,
    border: { type: 'line' },
  }
  const log = blessed.log(opts)
  screen.append(log)
  const x = spawn('sh', ['-c', command])
  log.add(`${command}`)
  x.stdout.on('data', data => {
    log.add(data.toString())
    screen.render()
  })
  x.stderr.on('data', data => {
    log.add(data.toString())
    screen.render()
  })
  x.on('close', code => {
    log.log(`child process exited with code ${code}`);
    screen.render()
  })
})

screen.render()
