import React, { useState, useEffect } from 'react'
import { DebounceInput } from 'react-debounce-input'
import api from './services/api'

export default function TableData() {
  const [filterName, setFilterName] = useState([])
  const [filterOrder, setFilterOrder] = useState([])
  const [rushing, setRushing] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [tableBody, setTableBody] = useState([])

  useEffect(() => {
    if (filterName === "") {
      setTableBody(renderTableData(rushing))
    } else {
      let rushFiltered = rushing.filter((player) => {
        return player.Player.toUpperCase().includes(filterName.toUpperCase())
      })

      setTableBody(renderTableData(rushFiltered))
    }
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

  function filterTableBody() {

  }

  function renderTableHeader(rushing) {
    let header = Object.keys(rushing[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  function renderTableData(rushing) {
    return rushing.map((player, index) => {
      return (
        <tr key={player.Player}>
          <td>{player.Player}</td>
          <td>{player.Team}</td>
          <td>{player.Pos}</td>
          <td>{player["Att/G"]}</td>
          <td>{player.Att}</td>
          <td>{player.Yds}</td>
          <td>{player.Avg}</td>
          <td>{player["Yds/G"]}</td>
          <td>{player.TD}</td>
          <td>{player.Lng}</td>
          <td>{player["1st"]}</td>
          <td>{player["1st%"]}</td>
          <td>{player["20+"]}</td>
          <td>{player["40+"]}</td>
          <td>{player.FUM}</td>
        </tr>
      )
    })
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
