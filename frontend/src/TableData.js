import React, { useState, useEffect } from 'react'
import { DebounceInput } from 'react-debounce-input'
import api from './services/api'

export default function TableData() {
  const [filterName, setFilterName] = useState('')
  const [filterOrder, setFilterOrder] = useState('')
  const [rushing, setRushing] = useState([])
  const [tableHeader, setTableHeader] = useState()
  const [tableBody, setTableBody] = useState()

  useEffect(() => {
    let rushFiltered = JSON.parse(JSON.stringify(rushing))

    switch (filterOrder) {
      case "Yds":
        rushFiltered.sort((p1, p2) => parseInt(p2.Yds) - parseInt(p1.Yds));
        break;
      case "Lng":
        rushFiltered.sort((p1, p2) => parseInt(p2.Lng) - parseInt(p1.Lng));
        break;
      case "TD":
        rushFiltered.sort((p1, p2) => parseInt(p2.TD) - parseInt(p1.TD));
        break;
      default:
    }

    if (filterName !== "") {
      rushFiltered = rushFiltered.filter((player) => {
        return player.Player.toUpperCase().includes(filterName.toUpperCase())
      })
    }

    setTableBody(renderTableData(rushFiltered))

  // eslint-disable-next-line
  }, [filterName, filterOrder])

  useEffect(() => {
    async function loadRushing() {
      const response = await api.get('/')

      setRushing(response.data)
      setTableHeader(renderTableHeader(response.data))
      setTableBody(renderTableData(response.data))
    }

    loadRushing()
  }, [])

  async function handleDownloadButton() {
    const response = await api.get('/download', {
      params: {
        "filter": filterName,
        "order": filterOrder
      }
    })

    if (response.data.error) {
      alert(response.data.error)
    } else {
      window.open(`${api.defaults.baseURL}/${response.data}`, '_self')
    }
  }

  function renderTableHeader(rushing) {
    let header = Object.keys(rushing[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  function renderTableData(rushing) {
    if (rushing.length > 0) {
      let header = Object.keys(rushing[0])
      return rushing.map((player, index) => {
        return (
          <tr key={Math.random()}>
            {header.map((h) => <td key={Math.random()}>{player[h]}</td>)}
          </tr>
        )
      })
    }
  }

  return (
    <div>
      <div className="search-players-bar">
        <div className="search-players-input-wrapper">
          <DebounceInput
						value={filterName}
        		minLength={1}
        		debounceTimeout={300}
        		placeholder="Filter by Player's name"
        		onChange={event => setFilterName(event.target.value)}
        	/>
        </div>
        <div className="sort-players-select-wrapper">
          <select
            value={filterOrder || ""}
            onChange={event => setFilterOrder(event.target.value)}
            multiple={false}
          >
            <option value="">( Filter by - Original Order )</option>
            <option value="Yds">Yds - Total Rushing Yards</option>
            <option value="Lng">Lng - Longest Rush</option>
            <option value="TD">TD - Total Rushing Touchdowns</option>
          </select>
        </div>
        <div className="download-csv-wrapper">
          <button className="btn" onClick={handleDownloadButton}>Download CSV</button>
        </div>
      </div>
      <table id='rushing'>
        <tbody>
          <tr>{tableHeader}</tr>
          {tableBody}
        </tbody>
      </table>
    </div>
  )
}
