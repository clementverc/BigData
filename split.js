const csvSplitStream = require('csv-split-stream')
const fs = require('fs')
const path = './splitfiles'
const csv = '/home/clement/Bureau/BigData/data.csv'
var pm2 = require('pm2')

// verify if task folder exist
const fileExist = () => {
  return new Promise((resolve) => {
    if (! fs.existsSync(path)) {
      fs.mkdirSync(path);
      resolve('NOT EXIST')
    } else {
      resolve('EXIST')
    }
  })
}

const splitSVG = (csv) => {
  return new Promise((reoslve)=> {
    csvSplitStream.split(
      fs.createReadStream(csv),
      {
        lineLimit: 10000
      },
      (index) => fs.createWriteStream(`./splitfiles/data-${index}.csv`)
    ).then((response) => {
      console.log(response)
    })
  })
}

// EXECUTION
fileExist().then((response) => {
  //SVG SPLIT
  splitSVG(csv).then((resolve) => {
    console.log(response)

  })
})