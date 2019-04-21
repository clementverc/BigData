const csvSplitStream = require('csv-split-stream')
const fs = require('fs')

const path = './splitfiles'
const csv = '/home/clement/Bureau/BigData/data.csv'

const fileExist = () => {
  return new Promise((resolve) => {
    if (! fs.existsSync(path)) {
      fs.mkdirSync(path)
      resolve('NOT EXIST')
    } else {
      resolve('EXIST')
    }
  })
}

const splitSVG = (csv) => {
  return new Promise((resolve) => {
    csvSplitStream.split(
      fs.createReadStream(csv),
      {
        lineLimit: 10000
      },
      (index) => fs.createWriteStream(`./splitfiles/${index}.csv`)
    ).then((response) => {
      console.log(response)
    })
  })
}

fileExist().then((response) => {
  splitSVG(csv).then((resolve) => {
    console.log(response)
  })
})
