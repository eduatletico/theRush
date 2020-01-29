import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function TableDataAggregate({ history }) {
  const [tableHeader, setTableHeader] = useState()
  const [tableBody, setTableBody] = useState()


  useEffect(() => {
    async function loadRushing() {
      const response = await api.get('/aggregate')

      setTableHeader(renderTableHeader(response.data))
      setTableBody(renderTableData(response.data))
    }

    loadRushing()
  }, [])

  function renderTableHeader(rushing) {
    if (rushing.length > 0) {
      let header = Object.keys(rushing[0])
      return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
      })
    }
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
      <button className="btn" onClick={e => history.push('/')}>View All</button>
      <table id='rushing'>
        <tbody>
          <tr>{tableHeader}</tr>
          {tableBody}
        </tbody>
      </table>
    </div>
  )
}
