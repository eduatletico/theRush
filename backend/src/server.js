const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')


const rushing = require('./rushing.json')


const app = express()

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  return res.json(rushing)
})
app.get('/files/:file', (req, res) => {
  return res.download(`temp/${req.params.file}`)
})
app.get('/download', (req, res) => {
  const { filter, order } = req.query
  let rushData = JSON.parse(JSON.stringify(rushing))

  switch (order) {
    case "Yds":
      rushData.sort((p1, p2) => parseInt(p2.Yds) - parseInt(p1.Yds));
      break;
    case "Lng":
      rushData.sort((p1, p2) => parseInt(p2.Lng) - parseInt(p1.Lng));
      break;
    case "TD":
      rushData.sort((p1, p2) => parseInt(p2.TD) - parseInt(p1.TD));
      break;
    default:
  }

  if (filter !== "") {
    rushData = rushData.filter((player) => {
      return player.Player.toUpperCase().includes(filter.toUpperCase())
    })
  }

  if (rushData.length > 0) {
    let csvData = []
    let header = Object.keys(rushData[0])
    csvData.push(header.join(','))

    rushData.map((rush, index) => {
      let newLine = []

      header.forEach((h) => {
        newLine.push(rush[h])
      })

      csvData.push(newLine.join(','))
    })

    csvData = csvData.join('\n')
    const path = 'temp'
    const nameFile = `rush_${Date.now()}.csv`
    fs.writeFile(`${path}/${nameFile}`, csvData, 'utf8', function (err) {
      if (err) {
        return res.json({ error: 'Some error occured' })
      } else {
        return res.json(`files/${nameFile}`)
      }
    })
  } else {
    return res.json({ error: 'Empty rushing table' })
  }
})
app.get('/aggregate', (req, res) => {
  const { filter } = req.body

  var filtered = {}
  var ret = []
  rushing.map((rush, indx) => {
    let yds = rush["Yds"] + ""
    let tds = rush["TD"] + ""
    let actualYds = filtered[rush.Team] ? filtered[rush.Team]["Yds"] : 0
    let actualTD = filtered[rush.Team] ? filtered[rush.Team]["TD"] : 0
    filtered[rush.Team] = {
      "Yds": actualYds + parseInt(yds.replace(",", "")),
      "TD": actualTD + parseInt(tds.replace(",", ""))
    }
  })

  for (let i in filtered) {
    ret.push({
      "Team": i,
      "Yds": filtered[i]["Yds"],
      "TD": filtered[i]["TD"]
    })
  }

  ret.sort((p1, p2) => parseInt(p2.Yds) - parseInt(p1.Yds));

  return res.json(ret)
})

app.listen(3333)
